/**
 * Platform Architectural Config
 * Defines Domain Lifecycle States, Role Capabilities, and Global Constants
 */

export const DOMAINS = {
    PROJECTS: 'Projects',
    FUNDING: 'Funding',
    PORTFOLIO: 'Portfolio',
    INTELLIGENCE: 'Intelligence',
    COLLABORATION: 'Collaboration',
    GOVERNANCE: 'Governance'
};

export const LIFECYCLES = {
    PROJECT: {
        DRAFT: 'Draft',
        UNDER_REVIEW: 'Under Review',
        ACTIVE: 'Active',
        FUNDED: 'Funded',
        SCALING: 'Scaling',
        COMPLETED: 'Completed',
        ARCHIVED: 'Archived'
    },
    FUNDING_DEAL: {
        PROPOSED: 'Proposed',
        DUE_DILIGENCE: 'In Due Diligence',
        NEGOTIATION: 'Negotiation',
        AGREEMENT: 'Agreement Signed',
        DISBURSEMENT: 'Disbursement Ongoing',
        MONITORING: 'Active Monitoring',
        CLOSED: 'Closed'
    },
    DOSSIER: {
        DRAFT: 'Draft',
        SUBMITTED: 'Submitted',
        REVIEW: 'Review',
        VERIFIED: 'Verified',
        APPROVED: 'Approved',
        PUBLISHED: 'Published',
        ARCHIVED: 'Archived'
    },
    CONTRIBUTION: {
        PENDING: 'Pending',
        UNDER_REVIEW: 'Under Review',
        ACCEPTED: 'Accepted',
        ACTIVE: 'Active',
        COMPLETED: 'Completed'
    }
};

export const ROLE_CAPABILITIES = {
    Innovator: {
        canCreateProjects: true,
        canRequestFunding: true,
        canRequestMentorship: true,
        viewDashboards: ['Innovator'],
        workspaces: ['projects', 'funding', 'mentors', 'community']
    },
    Mentor: {
        canReviewProjects: true,
        canValidateMilestones: true,
        viewDashboards: ['Mentor'],
        workspaces: ['mentees', 'requests', 'sessions', 'resources', 'community']
    },
    Sponsor: {
        canFinance: true,
        canEvaluate: true,
        canManagePortfolio: true,
        viewDashboards: ['Sponsor'],
        workspaces: ['discover', 'pipeline', 'watchlist', 'portfolio', 'reports', 'community']
    },
    Admin: {
        canManageUsers: true,
        canAuditSystem: true,
        canEnforcePolicy: true,
        viewDashboards: ['Admin'],
        workspaces: ['metrics', 'compliance', 'users', 'audit', 'community']
    }
};

export const DOMAIN_ROUTES = {
    projects: { label: 'Projects', path: '/projects', icon: 'Briefcase' },
    funding: { label: 'Funding', path: '/funding', icon: 'Zap' },
    portfolio: { label: 'Portfolio', path: '/sponsor/portfolio', icon: 'PieChart' },
    reports: { label: 'Intel Hub', path: '/sponsor/reports', icon: 'FileText' },
    community: { label: 'Community', path: '/feed', icon: 'MessageSquare' },
    messages: { label: 'Messages', path: '/messages', icon: 'MessageCircle' },
    notifications: { label: 'Notifications', path: '/notifications', icon: 'Bell' },
};
