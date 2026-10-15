const { getAdminClient } = require('../../config/supabase');
const { TABLES, STATUS, cols } = require('../../config/schema');
const { unwrap, assertUuid } = require('../../utils/db');
const ApiError = require('../../utils/ApiError');
const { loadPublicProfiles, profileExists } = require('../common/profiles');
const notificationsService = require('../notifications/service');

// Request types that have a dedicated, persisted workflow elsewhere must not be duplicated here.
const DEDICATED_REQUEST_TYPES = {
    mentorship: 'Use the mentorship request endpoint on the startup instead',
    interest: 'Use the sponsor interest endpoint on the startup instead'
};

class MessagesService {
    get db() {
        return getAdminClient();
    }

    // ---------- conversations ----------

    async findConversationBetween(userA, userB) {
        for (const [founder, participant] of [[userA, userB], [userB, userA]]) {
            const rows = unwrap(
                await this.db.from(TABLES.conversations).select(cols('conversations'))
                    .eq('founder_id', founder).eq('participant_id', participant)
                    .order('created_at', { ascending: true }).limit(1),
                'Find conversation'
            );
            if (rows && rows.length > 0) return rows[0];
        }
        return null;
    }

    async getConversationForParticipant(userId, conversationId) {
        assertUuid(conversationId, 'conversation id');
        const rows = unwrap(
            await this.db.from(TABLES.conversations).select(cols('conversations')).eq('id', conversationId).limit(1),
            'Load conversation'
        );
        const conversation = rows && rows[0];
        if (!conversation) throw new ApiError(404, 'Conversation not found');
        if (conversation.founder_id !== userId && conversation.participant_id !== userId) {
            throw new ApiError(403, 'You are not a participant in this conversation');
        }
        return conversation;
    }

    async getOrCreateConversation(initiatorId, otherId, startupId = null) {
        const existing = await this.findConversationBetween(initiatorId, otherId);
        if (existing) return { conversation: existing, created: false };

        const row = { founder_id: initiatorId, participant_id: otherId };
        if (startupId) row.startup_id = startupId;
        const created = unwrap(
            await this.db.from(TABLES.conversations).insert(row).select(cols('conversations')).single(),
            'Create conversation'
        );
        return { conversation: created, created: true };
    }

    async getConversations(userId) {
        const asFounder = unwrap(
            await this.db.from(TABLES.conversations).select(cols('conversations')).eq('founder_id', userId), 'Load conversations'
        ) || [];
        const asParticipant = unwrap(
            await this.db.from(TABLES.conversations).select(cols('conversations')).eq('participant_id', userId), 'Load conversations'
        ) || [];
        const conversations = [...asFounder, ...asParticipant];
        if (conversations.length === 0) return [];

        const convIds = conversations.map((c) => c.id);
        const messages = unwrap(
            await this.db.from(TABLES.messages).select(cols('messages')).in('conversation_id', convIds).order('created_at', { ascending: true }),
            'Load messages'
        ) || [];

        const byConversation = new Map();
        messages.forEach((m) => {
            if (!byConversation.has(m.conversation_id)) byConversation.set(m.conversation_id, []);
            byConversation.get(m.conversation_id).push(m);
        });

        const partnerIds = conversations.map((c) => (c.founder_id === userId ? c.participant_id : c.founder_id));
        const profiles = await loadPublicProfiles(partnerIds);

        return conversations.map((c) => {
            const partnerId = c.founder_id === userId ? c.participant_id : c.founder_id;
            const partner = profiles.get(partnerId);
            const msgs = byConversation.get(c.id) || [];
            const last = msgs[msgs.length - 1] || null;
            return {
                id: c.id,
                startup_id: c.startup_id || null,
                recipient: {
                    id: partnerId,
                    name: partner?.full_name || partner?.username || null,
                    username: partner?.username || null,
                    avatar_url: partner?.avatar_url || null,
                    role: partner?.role || null
                },
                last_message: last ? last.message : '',
                last_message_at: last ? last.created_at : c.created_at,
                unread_count: msgs.filter((m) => m.sender_id !== userId && !m.is_read).length
            };
        }).sort((a, b) => new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0));
    }

    // ---------- messages ----------

    async getMessageHistory(userId, conversationId) {
        await this.getConversationForParticipant(userId, conversationId);
        return unwrap(
            await this.db.from(TABLES.messages).select(cols('messages'))
                .eq('conversation_id', conversationId).order('created_at', { ascending: true }),
            'Load message history'
        ) || [];
    }

    async sendMessage(senderId, { conversation_id, receiver_id, message }) {
        let conversation;
        if (conversation_id) {
            conversation = await this.getConversationForParticipant(senderId, conversation_id);
        } else {
            assertUuid(receiver_id, 'receiver id');
            if (receiver_id === senderId) throw new ApiError(400, 'You cannot message yourself');
            // Messaging requires an accepted request (which creates the conversation); there is no bypass.
            conversation = await this.findConversationBetween(senderId, receiver_id);
            if (!conversation) throw new ApiError(403, 'No conversation exists yet. Send a message request first.');
        }

        return unwrap(
            await this.db.from(TABLES.messages)
                .insert({ conversation_id: conversation.id, sender_id: senderId, message, is_read: false })
                .select(cols('messages')).single(),
            'Send message'
        );
    }

    async markAsRead(userId, conversationId) {
        await this.getConversationForParticipant(userId, conversationId);
        unwrap(
            await this.db.from(TABLES.messages).update({ is_read: true })
                .eq('conversation_id', conversationId).neq('sender_id', userId).eq('is_read', false),
            'Mark messages read'
        );
        return { success: true };
    }

    // ---------- message requests ----------

    async createRequest(senderId, { receiver_id, request_type, startup_id, initial_message }) {
        const type = String(request_type).toLowerCase();
        if (DEDICATED_REQUEST_TYPES[type]) throw new ApiError(400, DEDICATED_REQUEST_TYPES[type]);
        if (receiver_id === senderId) throw new ApiError(400, 'You cannot send a request to yourself');
        if (!(await profileExists(receiver_id))) throw new ApiError(404, 'Recipient not found');

        if (await this.findConversationBetween(senderId, receiver_id)) {
            throw new ApiError(409, 'A conversation with this user already exists');
        }

        const pending = unwrap(
            await this.db.from(TABLES.messageRequests).select('id')
                .eq('sender_id', senderId).eq('receiver_id', receiver_id).eq('status', STATUS.PENDING).limit(1),
            'Check existing request'
        );
        if (pending && pending.length > 0) throw new ApiError(409, 'You already have a pending request to this user');

        const row = { sender_id: senderId, receiver_id, request_type: type, status: STATUS.PENDING };
        if (startup_id) row.startup_id = startup_id;
        if (initial_message) row.initial_message = initial_message;

        const request = unwrap(
            await this.db.from(TABLES.messageRequests).insert(row).select(cols('messageRequests')).single(),
            'Create message request'
        );
        await notificationsService.notify(receiver_id, senderId, 'message_request', 'sent you a message request');
        return request;
    }

    async decorateRequests(requests) {
        const profiles = await loadPublicProfiles(requests.flatMap((r) => [r.sender_id, r.receiver_id]));
        return requests.map((r) => {
            const sender = profiles.get(r.sender_id);
            return {
                ...r,
                type: r.request_type,
                sender_name: sender?.full_name || sender?.username || null,
                sender_avatar: sender?.avatar_url || null,
                sender_role: sender?.role || null
            };
        });
    }

    /** Incoming pending requests for the user (the inbox). */
    async getIncomingRequests(userId) {
        const rows = unwrap(
            await this.db.from(TABLES.messageRequests).select(cols('messageRequests'))
                .eq('receiver_id', userId).eq('status', STATUS.PENDING).order('created_at', { ascending: false }),
            'Load message requests'
        ) || [];
        return this.decorateRequests(rows);
    }

    /** All requests the user sent or received, optionally filtered by status. */
    async getRequests(userId, status) {
        const run = async (column) => {
            let q = this.db.from(TABLES.messageRequests).select(cols('messageRequests')).eq(column, userId);
            if (status) q = q.eq('status', status);
            return unwrap(await q.order('created_at', { ascending: false }), 'Load message requests') || [];
        };
        const merged = [...(await run('receiver_id')), ...(await run('sender_id'))]
            .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        return this.decorateRequests(merged);
    }

    async respondToRequest(userId, requestId, action) {
        assertUuid(requestId, 'request id');
        const nextStatus = action === 'accept' || action === STATUS.ACCEPTED ? STATUS.ACCEPTED
            : action === 'reject' || action === 'decline' || action === 'declined' || action === STATUS.REJECTED ? STATUS.REJECTED
                : null;
        if (!nextStatus) throw new ApiError(400, 'Action must be accept or reject');

        const found = unwrap(
            await this.db.from(TABLES.messageRequests).select(cols('messageRequests')).eq('id', requestId).limit(1),
            'Load message request'
        );
        const request = found && found[0];
        if (!request) throw new ApiError(404, 'Message request not found');
        if (request.receiver_id !== userId) throw new ApiError(403, 'Only the recipient can respond to this request');
        if (request.status !== STATUS.PENDING) throw new ApiError(409, `This request was already ${request.status}`);

        // Conditional transition: only one concurrent response can move the row out of "pending",
        // so repeated clicks can never create a second conversation or a duplicate initial message.
        const transitioned = unwrap(
            await this.db.from(TABLES.messageRequests).update({ status: nextStatus })
                .eq('id', requestId).eq('status', STATUS.PENDING).select(cols('messageRequests')),
            'Update message request'
        );
        if (!transitioned || transitioned.length === 0) throw new ApiError(409, 'This request was already handled');
        const updated = transitioned[0];

        if (nextStatus === STATUS.REJECTED) {
            await notificationsService.notify(request.sender_id, userId, 'request_rejected', 'declined your message request');
            return { request: updated, conversation: null };
        }

        const { conversation } = await this.getOrCreateConversation(request.sender_id, userId, request.startup_id || null);
        if (request.initial_message) {
            unwrap(
                await this.db.from(TABLES.messages).insert({
                    conversation_id: conversation.id,
                    sender_id: request.sender_id,
                    message: request.initial_message,
                    is_read: false
                }),
                'Store initial message'
            );
        }
        await notificationsService.notify(request.sender_id, userId, 'request_accepted', 'accepted your message request');

        const [summary] = (await this.getConversations(userId)).filter((c) => c.id === conversation.id);
        return { request: updated, conversation: summary || { id: conversation.id } };
    }
}

module.exports = new MessagesService();
