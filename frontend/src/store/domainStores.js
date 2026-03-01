import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GLOBAL_PROJECTS } from '../data/projects';
import { LIFECYCLES } from '../config/platform';

/**
 * GovernanceStore: Domain state for system auditing, compliance, and institutional oversight.
 */
export const useGovernanceStore = create(
    persist(
        (set) => ({
            auditLogs: [
                { id: 'log_1', action: 'System Initialization', user: 'Admin Node', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'Success', details: 'Full system health check passed.' },
                { id: 'log_2', action: 'Security Protocol Upgrade', user: 'Security Bot', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'Success', details: 'Layer 7 encryption enforced.' }
            ],
            complianceChecks: [
                { id: 'comp_1', title: 'KYC/AML Registry', status: 'Pending', priority: 'High', due: '2024-12-01' },
                { id: 'comp_2', title: 'Institutional Fund Audit', status: 'In Review', priority: 'Critical', due: '2024-11-20' }
            ],

            addLog: (log) => set((state) => ({
                auditLogs: [{ ...log, id: `log_${Date.now()}`, timestamp: new Date().toISOString() }, ...state.auditLogs]
            })),

            updateComplianceStatus: (id, status) => set((state) => ({
                complianceChecks: state.complianceChecks.map(c => c.id === id ? { ...c, status } : c)
            }))
        }),
        { name: 'udaan-governance-storage' }
    )
);

/**
 * CollaborationStore: Domain state for mentorship and peer-to-peer contribution nodes.
 */
export const useCollaborationStore = create(
    persist(
        (set) => ({
            sessions: [],
            contributionRequests: [],

            scheduleSession: (session) => set((state) => ({
                sessions: [...state.sessions, { ...session, id: `sess_${Date.now()}`, status: 'Scheduled' }]
            })),

            addContributionRequest: (request) => set((state) => ({
                contributionRequests: [...state.contributionRequests, { ...request, id: `req_${Date.now()}`, status: 'Pending' }]
            }))
        }),
        { name: 'udaan-collaboration-storage' }
    )
);

/**
 * ProjectStore: Domain state for project lifecycle management.
 */
export const useProjectStore = create(
    persist(
        (set, get) => ({
            projects: GLOBAL_PROJECTS,

            // Actions
            addProject: (project) => set((state) => ({
                projects: [...state.projects, { ...project, id: `proj_${Date.now()}`, status: LIFECYCLES.PROJECT.DRAFT }]
            })),

            updateProject: (id, updates) => set((state) => ({
                projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
            })),

            transitionStage: (id, nextStage) => set((state) => ({
                projects: state.projects.map((p) => (p.id === id ? { ...p, stage: nextStage } : p))
            })),

            getProjectByFounder: (founderName) => {
                return get().projects.filter(p => p.founder === founderName);
            }
        }),
        { name: 'udaan-project-storage' }
    )
);

/**
 * FundingStore: Domain state for capitalization and pipelines.
 */
export const useFundingStore = create(
    persist(
        (set, get) => ({
            deals: [],
            watchlist: [],

            addToWatchlist: (projectId) => set((state) => ({
                watchlist: state.watchlist.includes(projectId) ? state.watchlist : [...state.watchlist, projectId]
            })),

            removeFromWatchlist: (projectId) => set((state) => ({
                watchlist: state.watchlist.filter(id => id !== projectId)
            })),

            initiateDeal: (deal) => set((state) => ({
                deals: [...state.deals, { ...deal, id: `deal_${Date.now()}`, stage: LIFECYCLES.FUNDING_DEAL.PROPOSED }]
            })),

            updateDealStage: (id, nextStage) => set((state) => ({
                deals: state.deals.map(d => d.id === id ? { ...d, stage: nextStage } : d)
            }))
        }),
        { name: 'udaan-funding-storage' }
    )
);

/**
 * IntelligenceStore: Domain state for strategic reporting & dossiers.
 */
export const useIntelligenceStore = create(
    persist(
        (set) => ({
            dossiers: [],
            alerts: [],

            addDossier: (dossier) => set((state) => ({
                dossiers: [...state.dossiers, { ...dossier, id: `dos_${Date.now()}`, status: LIFECYCLES.DOSSIER.DRAFT }]
            })),

            pushAlert: (alert) => set((state) => ({
                alerts: [{ ...alert, id: `alt_${Date.now()}`, timestamp: new Date() }, ...state.alerts]
            }))
        }),
        { name: 'udaan-intel-storage' }
    )
);

/**
 * AuthStore: Global identity and capability state.
 */
export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (userData) => set({ user: userData, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
            updateProfile: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null
            }))
        }),
        { name: 'udaan-auth-storage' }
    )
);
/**
 * TaskStore: Domain state for operational tasks, research sprints, and milestone tracking.
 */
export const useTaskStore = create(
    persist(
        (set) => ({
            tasks: [
                { id: 'task_1', title: 'Technical Feasibility Study', project: 'AgriDrone AI', priority: 'High', status: 'In Progress', type: 'Discovery' },
                { id: 'task_2', title: 'Market Saturation Analysis', project: 'MedAssist AI', priority: 'Medium', status: 'Pending', type: 'Intel' }
            ],

            addTask: (task) => set((state) => ({
                tasks: [{ ...task, id: `task_${Date.now()}`, status: 'Pending' }, ...state.tasks]
            })),

            updateTaskStatus: (id, status) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, status } : t)
            })),

            addDiscoverySprint: (projectId, focusAreas) => set((state) => ({
                tasks: [
                    ...focusAreas.map(area => ({
                        id: `task_${Date.now()}_${area}`,
                        title: `${area} Research Node`,
                        project: projectId,
                        priority: 'High',
                        status: 'Pending',
                        type: 'Discovery'
                    })),
                    ...state.tasks
                ]
            }))
        }),
        { name: 'udaan-task-storage' }
    )
);
