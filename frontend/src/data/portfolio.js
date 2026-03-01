/**
 * Portfolio & Investment Positions Data
 * Structured for institutional capital management.
 */

export const PORTFOLIO_HEALTH = {
    index: 84, // Portfolio Health Index (PHI)
    status: "Stable",
    trend: "Improving",
    metrics: {
        performance: 88,
        risk: 72,
        impact: 94,
        compliance: 100
    }
};

export const INVESTMENT_POSITIONS = [
    {
        id: "pos_1",
        name: "AgriDrone AI",
        domain: "AgriTech",
        model: "Equity",
        committed: "₹1.5 Cr",
        disbursed: "₹85 L",
        valuation: "₹12 Cr",
        roi: "3.2x",
        risk: "Low",
        impact: 92,
        compliance: "Verified",
        nextMilestone: "Q3 Field Trials",
        exitReadiness: "Medium",
        lifecycle: "Active Deployment",
        reportingStatus: "On-time"
    },
    {
        id: "pos_2",
        name: "MedAssist AI",
        domain: "HealthTech",
        model: "Grant",
        committed: "₹50 L",
        disbursed: "₹50 L",
        valuation: "N/A",
        roi: "Social Return",
        risk: "Medium",
        impact: 98,
        compliance: "Audit Required",
        nextMilestone: "Public Beta",
        exitReadiness: "N/A",
        lifecycle: "Generating returns",
        reportingStatus: "Delayed"
    },
    {
        id: "pos_3",
        name: "Eco-Grow Systems",
        domain: "Sustainability",
        model: "Revenue Share",
        committed: "₹75 L",
        disbursed: "₹45 L",
        valuation: "₹5.5 Cr",
        roi: "1.8x",
        risk: "Low",
        impact: 89,
        compliance: "Verified",
        nextMilestone: "Carbon Credit Sync",
        exitReadiness: "Low",
        lifecycle: "Allocated",
        reportingStatus: "On-time"
    }
];

export const CAPITAL_LIFECYCLE = [
    { stage: "Committed", amount: "₹8.4 Cr", color: "blue" },
    { stage: "Allocated", amount: "₹6.2 Cr", color: "indigo" },
    { stage: "Disbursed", amount: "₹4.8 Cr", color: "emerald" },
    { stage: "Active", amount: "₹3.2 Cr", color: "amber" },
    { stage: "Returns", amount: "₹1.2 Cr", color: "rose" }
];
