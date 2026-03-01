const db = require('../../config/db');

/**
 * Messaging Repository layer
 */
class MessageRepository {
    async createMessage(data) {
        const [msg] = await db('messages').insert({
            conversation_id: data.conversationId,
            sender_id: data.senderId,
            content: data.content,
            created_at: new Date()
        }).returning('*');
        return msg;
    }

    async getByConversation(conversationId) {
        return db('messages')
            .where({ conversation_id: conversationId })
            .orderBy('created_at', 'asc');
    }

    async getConversations(userId) {
        // Complex query to get user conversations and previews
        return db('conversations')
            .where({ user_one: userId })
            .orWhere({ user_two: userId })
            .orderBy('updated_at', 'desc');
    }
}

module.exports = new MessageRepository();
