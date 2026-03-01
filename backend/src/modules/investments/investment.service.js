const db = require('../../config/db');

/**
 * Investment Module Logic 💼
 * Tracks investor interest, negotiations, and funding status.
 */
class InvestmentService {
    async expressInterest(investorId, projectId, notes) {
        // Enforce basic ecosystem rule: Multiple interests allowed per project
        const [interest] = await db('investments').insert({
            investor_id: investorId,
            project_id: projectId,
            status: 'interested',
            notes,
            created_at: new Date()
        }).returning('*');

        console.log(`[INVESTMENT]: Investor ${investorId} expressed interest in Project ${projectId}`);
        return interest;
    }

    async getInterestsByInvestor(investorId) {
        return db('investments')
            .join('projects', 'projects.id', 'investments.project_id')
            .where({ investor_id: investorId })
            .select('investments.*', 'projects.title', 'projects.domain');
    }
}

module.exports = new InvestmentService();
