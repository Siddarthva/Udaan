const { supabase } = require('../../config/supabase');
const ApiError = require('../../utils/ApiError');

class MessagesService {
    async getConversations(userId) {
        const { data: convs, error } = await supabase
            .from('conversations')
            .select('*, messages(*)')
            .or(`founder_id.eq.${userId},participant_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error) {
            throw new ApiError(500, error.message || 'Failed to fetch conversations');
        }

        const partnerIds = [...new Set((convs || []).map(c => c.founder_id === userId ? c.participant_id : c.founder_id).filter(Boolean))];
        let profilesMap = {};
        if (partnerIds.length > 0) {
            const { data: profs } = await supabase
                .from('profiles')
                .select('*')
                .in('id', partnerIds);
            (profs || []).forEach(p => { profilesMap[p.id] = p; });
        }

        return (convs || []).map(c => {
            const partnerId = c.founder_id === userId ? c.participant_id : c.founder_id;
            const recipient = profilesMap[partnerId];
            const lastMsg = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
            const unreadCount = (c.messages || []).filter(m => m.sender_id !== userId && !m.is_read).length;
            return {
                id: c.id,
                recipient: {
                    id: recipient?.id || partnerId,
                    name: recipient?.full_name || 'User',
                    avatar_url: recipient?.profile_picture || null,
                    role: recipient?.role
                },
                last_message: lastMsg ? lastMsg.content : '',
                last_message_at: c.updated_at || c.created_at,
                unread_count: unreadCount
            };
        });
    }

    async getMessageRequests(userId) {
        const { data: requests, error } = await supabase
            .from('message_requests')
            .select('*, sender:sender_id(*)')
            .eq('receiver_id', userId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) {
            throw new ApiError(500, error.message || 'Failed to fetch message requests');
        }

        return (requests || []).map(r => ({
            ...r,
            sender_name: r.sender?.full_name || 'User',
            sender_avatar: r.sender?.profile_picture || null,
            sender_role: r.sender?.role || 'Innovator'
        }));
    }

    async updateRequestStatus(userId, requestId, payload) {
        let action = typeof payload === 'string' ? payload : (payload.action || payload.status);
        if (action === 'accept') action = 'accepted';
        if (action === 'reject') action = 'declined';

        if (!['accepted', 'declined'].includes(action)) {
            throw new ApiError(400, 'Invalid status action. Must be accept or reject');
        }

        const { data: request, error: reqErr } = await supabase
            .from('message_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (reqErr || !request) {
            throw new ApiError(404, 'Message request not found');
        }

        const targetReceiver = request.receiver_id || request.recipient_id;
        if (targetReceiver !== userId) {
            throw new ApiError(403, 'Forbidden: You are not the receiver of this request');
        }

        if (request.status === 'accepted') {
            throw new ApiError(409, 'Conflict: Message request has already been accepted');
        }

        if (request.status === 'declined' || request.status === 'rejected') {
            throw new ApiError(409, 'Conflict: Message request has already been rejected');
        }

        const { data: updatedReq, error: updateErr } = await supabase
            .from('message_requests')
            .update({ status: action })
            .eq('id', requestId)
            .select('*')
            .single();

        if (updateErr) {
            throw new ApiError(500, updateErr.message || 'Failed to update request status');
        }

        let conversationObj = null;

        if (action === 'accepted') {
            // Establish Conversation in Supabase using founder_id & participant_id
            let { data: conv } = await supabase
                .from('conversations')
                .select('*')
                .or(`and(founder_id.eq.${request.sender_id},participant_id.eq.${userId}),and(founder_id.eq.${userId},participant_id.eq.${request.sender_id})`)
                .maybeSingle();

            if (!conv) {
                const { data: newConv } = await supabase
                    .from('conversations')
                    .insert([{ founder_id: request.sender_id, participant_id: userId, startup_id: request.startup_id || null, type: request.request_type || 'direct', created_at: new Date() }])
                    .select('*')
                    .single();
                conv = newConv;
            }

            if (request.initial_message && conv) {
                await supabase
                    .from('messages')
                    .insert([{
                        conversation_id: conv.id,
                        sender_id: request.sender_id,
                        content: request.initial_message,
                        is_read: false
                    }]);
            }

            // Handle team invite acceptance
            if ((request.request_type === 'team_invite' || request.type === 'team_invite') && request.startup_id) {
                const { data: existingMember } = await supabase
                    .from('startup_members')
                    .select('*')
                    .eq('startup_id', request.startup_id)
                    .eq('user_id', userId)
                    .maybeSingle();

                if (!existingMember) {
                    await supabase
                        .from('startup_members')
                        .insert([{
                            startup_id: request.startup_id,
                            user_id: userId,
                            role: 'Member'
                        }]);
                }
            }

            const { data: senderProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', request.sender_id)
                .single();

            conversationObj = {
                id: conv.id,
                recipient: {
                    id: request.sender_id,
                    name: senderProfile?.full_name || 'User',
                    avatar_url: senderProfile?.profile_picture || null,
                    role: senderProfile?.role || 'Innovator'
                },
                last_message: request.initial_message || '',
                last_message_at: conv.created_at,
                unread_count: 0
            };
        }

        return { request: updatedReq, conversation: conversationObj };
    }

    async getMessageHistory(userId, conversationId) {
        const { data: msgs, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) {
            throw new ApiError(500, error.message || 'Failed to fetch message history');
        }

        return msgs || [];
    }

    async sendMessage(senderId, { receiver_id, recipient_id, conversation_id, content }) {
        const targetReceiver = receiver_id || recipient_id;
        if (!content || (!targetReceiver && !conversation_id)) {
            throw new ApiError(400, 'Message content and receiver or conversation ID required');
        }

        let convId = conversation_id;

        if (!convId && targetReceiver) {
            const { data: existing } = await supabase
                .from('conversations')
                .select('*')
                .or(`and(founder_id.eq.${senderId},participant_id.eq.${targetReceiver}),and(founder_id.eq.${targetReceiver},participant_id.eq.${senderId})`)
                .maybeSingle();

            if (existing) {
                convId = existing.id;
            } else {
                const { data: newConv } = await supabase
                    .from('conversations')
                    .insert([{ founder_id: senderId, participant_id: targetReceiver, type: 'direct', created_at: new Date() }])
                    .select('*')
                    .single();
                convId = newConv.id;
            }
        }

        const { data: msg, error } = await supabase
            .from('messages')
            .insert([{ conversation_id: convId, sender_id: senderId, content, is_read: false, created_at: new Date() }])
            .select('*')
            .single();

        if (error) {
            throw new ApiError(500, error.message || 'Failed to send message');
        }

        return msg;
    }

    async markAsRead(userId, conversationId) {
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', conversationId)
            .neq('sender_id', userId);

        if (error) {
            throw new ApiError(500, error.message || 'Failed to mark messages as read');
        }

        return { success: true };
    }
}

module.exports = new MessagesService();
