/**
 * Funding Deals Engine Data
 * Models include: Equity, Grant, CSR, Donation, Revenue-Share
 */

export const FUNDING_PIPELINE = [
    {
        id: "deal_1",
        projectId: "proj_1",
        projectName: "AgriDrone AI",
        sponsorId: "spon_1",
        type: "Equity",
        amountSought: "₹25 L",
        committed: "₹25 L",
        stage: "Disbursement",
        status: "Active",
        tranches: [
            { id: "t1", amount: "₹10 L", condition: "Initial", status: "Paid", date: "2026-02-15" },
            { id: "t2", amount: "₹10 L", condition: "Field Trial", status: "Pending", date: "2026-04-10" },
            { id: "t3", amount: "₹5 L", condition: "Final Review", status: "Pending", date: "2026-06-01" }
        ],
        roi: "3.5x Est.",
        riskLevel: "Low"
    },
    {
        id: "deal_2",
        projectId: "proj_2",
        projectName: "MedAssist AI",
        sponsorId: "spon_1",
        type: "Grant",
        amountSought: "₹50 L",
        committed: "₹50 L",
        stage: "Monitoring",
        status: "Active",
        tranches: [
            { id: "t1", amount: "₹50 L", condition: "Upfront", status: "Paid", date: "2026-01-20" }
        ],
        roi: "Social Yield",
        riskLevel: "Medium"
    }
];

export const PIPELINE_STAGES = [
    "Discovery",
    "Due Diligence",
    "Negotiation",
    "Agreement",
    "Disbursement",
    "Monitoring"
];
