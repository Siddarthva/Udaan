/**
 * Sponsor Funding Pipeline Dataset 📈
 * Project flow through stages: New Leads, Under Review, Due Diligence, Approved, Declined.
 */

export const FUNDING_PIPELINE = [
    {
        id: "fp1",
        projectName: "SunLeaf Solar",
        stage: "Under Review",
        requestedAmount: "₹50.0 Lakhs",
        progress: 45,
        lastInteraction: "2 days ago",
        reviewer: "Dr. Arvind S.",
        riskRating: "Medium",
        notes: "Reviewing rural hub scalability model.",
        nextAction: "Hub performance analysis."
    },
    {
        id: "fp2",
        projectName: "MedAssist AI",
        stage: "Under Review",
        requestedAmount: "₹40.0 Lakhs",
        progress: 30,
        lastInteraction: "1 day ago",
        reviewer: "Ms. Priyanka K.",
        riskRating: "Low",
        notes: "Clinical validation trials showing positive results.",
        nextAction: "Trial data audit."
    },
    {
        id: "fp3",
        projectName: "Eco-Grow Hydroponics",
        stage: "Due Diligence",
        requestedAmount: "₹1.0 Cr",
        progress: 75,
        lastInteraction: "5 hours ago",
        reviewer: "Mr. Ramesh V.",
        riskRating: "Low",
        notes: "Auditing supermarket supply agreements.",
        nextAction: "Final financial review."
    },
    {
        id: "fp4",
        projectName: "AgriDrone AI",
        stage: "Approved",
        requestedAmount: "₹25.0 Lakhs",
        progress: 100,
        lastInteraction: "Just Now",
        reviewer: "Committee Board",
        riskRating: "Very Low",
        notes: "Approved for full grant disbursement.",
        nextAction: "Disbursement setup."
    },
    {
        id: "fp5",
        projectName: "FinGuard",
        stage: "Declined",
        requestedAmount: "₹30.0 Lakhs",
        progress: 10,
        lastInteraction: "1 week ago",
        reviewer: "Ms. Priyanka K.",
        riskRating: "High",
        notes: "Regulatory landscape for SME fraud is high-risk.",
        nextAction: "Close deal record."
    },
    {
        id: "fp6",
        projectName: "DeepVision Robotics",
        stage: "New Leads",
        requestedAmount: "₹1.5 Cr",
        progress: 5,
        lastInteraction: "3 days ago",
        reviewer: "Unassigned",
        riskRating: "N/A",
        notes: "Awaiting prototype demonstration.",
        nextAction: "Initial evaluation."
    }
];
