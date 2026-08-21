const { supabase } = require('../../config/supabase');
const ApiError = require('../../utils/ApiError');

class RequestsService {
    async createRequest(senderId, { receiver_id, recipient_id, type, startup_id, request_type, initial_message }) {
        const targetReceiverId = receiver_id || recipient_id;
        const targetType = type || request_type;
        if (!targetReceiverId || !targetType) {
            throw new ApiError(400, 'Receiver ID and request type are required');
        }

        const { data: request, error } = await supabase
            .from('message_requests')
            .insert([{
                sender_id: senderId,
                receiver_id: targetReceiverId,
                request_type: targetType,
                startup_id: startup_id || null,
                initial_message: initial_message || '',
                status: 'pending'
            }])
            .select('*')
            .single();

        if (error) {
            throw new ApiError(500, error.message || 'Failed to create message request');
        }

        // Generate notification
        let notifMessage = 'sent you a message request';
        let notifType = 'message_request';

        if (targetType === 'interest') notifType = 'investment_request';
        else if (targetType === 'mentorship') notifType = 'mentorship_request';
        else if (targetType === 'team_invite') notifType = 'team_invitation';

        await supabase
            .from('notifications')
            .insert([{
                user_id: targetReceiverId,
                actor_id: senderId,
                type: notifType,
                message: notifMessage,
                read: false
            }]);

        return request;
    }

    async getRequests(userId, statusFilter) {
        let query = supabase
            .from('message_requests')
            .select('*, sender:sender_id(*), startup:startup_id(*)')
            .or(`receiver_id.eq.${userId},sender_id.eq.${userId}`);

        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }

        const { data: requests, error } = await query.order('created_at', { ascending: false });

        if (error) {
            throw new ApiError(500, error.message || 'Failed to fetch requests');
        }

        return (requests || []).map(r => ({
            ...r,
            sender_name: r.sender?.full_name || 'User',
            sender_avatar: r.sender?.profile_picture || null,
            sender_role: r.sender?.role || 'Innovator',
            startup_title: r.startup?.startup_name || r.startup?.title || null
        }));
    }

    async acceptRequest(userId, requestId) {
        const { data: request, error: reqErr } = await supabase
            .from('message_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (reqErr || !request) throw new ApiError(404, 'Request not found');
        if (request.receiver_id !== userId) throw new ApiError(403, 'Forbidden action');

        const { data: updatedReq, error: updateErr } = await supabase
            .from('message_requests')
            .update({ status: 'accepted' })
            .eq('id', requestId)
            .select('*')
            .single();

        if (updateErr) throw new ApiError(500, updateErr.message || 'Failed to accept request');

        // 1. Establish Conversation using founder_id & participant_id
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

        // 2. Add Initial Message
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

        // 3. Handle Team Invite Addition
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

        // 4. Notify Sender
        await supabase
            .from('notifications')
            .insert([{
                user_id: request.sender_id,
                actor_id: userId,
                type: 'request_accepted',
                message: 'accepted your request',
                read: false
            }]);

        return { request: updatedReq, conversation_id: conv?.id };
    }

    async rejectRequest(userId, requestId) {
        const { data: request, error: reqErr } = await supabase
            .from('message_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (reqErr || !request) throw new ApiError(404, 'Request not found');
        if (request.receiver_id !== userId) throw new ApiError(403, 'Forbidden action');

        const { data: updatedReq, error: updateErr } = await supabase
            .from('message_requests')
            .update({ status: 'rejected' })
            .eq('id', requestId)
            .select('*')
            .single();

        if (updateErr) throw new ApiError(500, updateErr.message || 'Failed to reject request');

        await supabase
            .from('notifications')
            .insert([{
                user_id: request.sender_id,
                actor_id: userId,
                type: 'request_rejected',
                message: 'declined your request',
                read: false
            }]);

        return { request: updatedReq };
    }
}

module.exports = new RequestsService();
