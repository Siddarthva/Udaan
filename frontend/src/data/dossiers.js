/**
 * Strategic Intelligence & Governance Dossiers
 * Managing report lifecycle and executive decision tracing.
 */

export const STRATEGIC_DOSSIERS = [
    {
        id: "dos_1",
        title: "Q1 AgriDrone AI Performance Audit",
        category: "Performance",
        project: "AgriDrone AI",
        author: "Sarah Chen (Partner)",
        date: "2026-03-01",
        status: "Verified",
        summary: "Performance shows 92% SLA compliance. Technical debt is low.",
        findings: "System efficiency exceeded expectations by 14% this quarter.",
        riskFlags: 0,
        opportunity: "High",
        actions: "Approve next funding tranche.",
        history: [
            { event: "Draft Created", actor: "Sarah Chen", date: "2026-02-25" },
            { event: "Submitted for Review", actor: "Sarah Chen", date: "2026-02-27" },
            { event: "Verified by Compliance", actor: "Legal Node", date: "2026-03-01" }
        ],
        files: ["Audit-Report-Q1.pdf", "Financial-Utilization.xlsx"]
    },
    {
        id: "dos_2",
        title: "MedAssist AI Regulatory Risk Assessment",
        category: "Risk & Compliance",
        project: "MedAssist AI",
        author: "Dr. Emily White (Risk Officer)",
        date: "2026-03-10",
        status: "Under Review",
        summary: "Upcoming health data policy change in Q3 may require architectural pivot.",
        findings: "New data sovereignty laws in 3 states.",
        riskFlags: 2,
        opportunity: "Medium",
        actions: "Launch deep-dive compliance audit.",
        history: [
            { event: "Draft Created", actor: "Emily White", date: "2026-03-08" },
            { event: "Submitted for Review", actor: "Emily White", date: "2026-03-10" }
        ],
        files: ["Regulatory-Policy-Doc.pdf"]
    }
];

export const INTEL_ALERTS = [
    { id: "alt_1", type: "Financial", severity: "High", message: "Budget deviation detected in Eco-Grow Q4 budget.", time: "2h ago" },
    { id: "alt_2", type: "Milestone", severity: "Medium", message: "MedAssist AI missed public beta prototype target by 12 days.", time: "1d ago" },
    { id: "alt_3", type: "Compliance", severity: "Critical", message: "IP filing missing in FinGuard subsidiary dossier.", time: "4h ago" }
];

export const INTEL_REQUESTS = [
    { id: "req_1", type: "Due Diligence Study", project: "SolarSpark", requester: "Sarah Chen", date: "2026-03-15", status: "In Progress" },
    { id: "req_2", type: "Market Analysis", project: "All Portfolios", requester: "Sarah Chen", date: "2026-03-20", status: "In Queue" }
];
