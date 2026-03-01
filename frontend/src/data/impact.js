/**
 * Impact Measurement Engine Data
 * ESG and SDG mapping for institutional governance.
 */

export const IMPACT_METRICS = {
    beneficiaries: "52,482+",
    carbonReduction: "12,500 tCO2e",
    jobsCreated: "842",
    ruralCoverage: "14 States",
    sdgAlignment: [
        { id: 1, label: "No Poverty", score: 82, color: "red" },
        { id: 2, label: "Zero Hunger", score: 94, color: "amber" },
        { id: 3, label: "Good Health", score: 76, color: "emerald" },
        { id: 6, label: "Clean Water", score: 64, color: "blue" },
        { id: 13, label: "Climate Action", score: 91, color: "green" }
    ],
    esgStatus: {
        score: "8.6/10",
        trend: "+0.4 Q/Q",
        lastAudit: "Feb 2026"
    }
};

export const RISK_INDEX = [
    { type: "Financial", level: 24, status: "Improving" },
    { type: "Regulatory", level: 62, status: "Stable" },
    { type: "Technology", level: 38, status: "Optimal" },
    { type: "Execution", level: 45, status: "Worsening" },
    { type: "Reputation", level: 12, status: "Low" }
];
