/**
 * My Projects Dataset (Founder-Owned) 🚀
 * Represents the logged-in user's personal projects and their performance metrics.
 */

export const MY_PROJECTS = [
    {
        id: "mp1",
        name: "EcoTrack AI",
        domain: "CleanTech",
        status: "MVP",
        description: "Automated carbon footprint analysis using satellite imagery and IoT sensors for industrial zones.",
        teamSize: 4,
        fundingRaised: "₹12.5 Lakhs",
        fundingTarget: "₹50 Lakhs",
        lastUpdated: "2 hours ago",
        milestoneProgress: 65,
        activityScore: 88,
        investorInterest: "High",
        contributors: 8,
        updates: [
            { date: "2026-02-28", text: "Successfully integrated Sentinel-2 API for real-time monitoring." },
            { date: "2026-02-20", text: "Alpha testing completed with 3 industrial partners." }
        ],
        tags: ["AI", "Sustainability", "IoT"]
    },
    {
        id: "mp2",
        name: "NeuroSync",
        domain: "HealthTech",
        status: "Prototype",
        description: "Cheap, non-invasive BCI (Brain-Computer Interface) for assistive communication in ALS patients.",
        teamSize: 3,
        fundingRaised: "₹2.0 Lakhs",
        fundingTarget: "₹25 Lakhs",
        lastUpdated: "1 day ago",
        milestoneProgress: 40,
        activityScore: 72,
        investorInterest: "Medium",
        contributors: 5,
        updates: [
            { date: "2026-02-25", text: "PCB design for version 2.0 finalized." },
            { date: "2026-02-15", text: "Initial signal processing algorithm achieving 85% accuracy." }
        ],
        tags: ["MedTech", "BCI", "Hardware"]
    }
];

export const MY_PORTFOLIO_STATS = {
    totalProjects: 2,
    activeProjects: 2,
    totalTeamMembers: 7,
    fundingRaised: "₹14.5 Lakhs",
    mentorConnections: 5,
    pendingRequests: 3
};
