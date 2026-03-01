const db = require('../../config/db');

/**
 * Mentorship Module Logic 🧠
 * Handles mentor-team relationships, sessions, and impact.
 */
class MentorshipService {
    async requestMentorship(mentorId, projectId, message) {
        // Enforce basic ecosystem rule: Mentor relationship request
        const [request] = await db('mentorship_requests').insert({
            mentor_id: mentorId,
            project_id: projectId,
            message,
            status: 'pending',
            created_at: new Date()
        }).returning('*');

        console.log(`[MENTORSHIP]: Mentorship requested for Project ${projectId} with Mentor ${mentorId}`);
        return request;
    }

    async getByProject(projectId) {
        return db('mentorship_requests')
            .join('users', 'users.id', 'mentorship_requests.mentor_id')
            .where({ project_id: projectId })
            .select('mentorship_requests.*', 'users.name', 'users.avatar_url');
    }
}

module.exports = new MentorshipService();
