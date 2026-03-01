/**
 * Sponsor Deals Dataset 💼
 * Persisted locally to track active investment negotiations and signed contracts.
 */

export const ACTIVE_DEALS = [
    {
        id: "deal_1",
        projectId: "sp1",
        projectName: "AgriDrone AI",
        sponsorId: "s1",
        model: "Grant",
        amount: "₹25.0 Lakhs",
        stage: "Contract Signed",
        status: "Active",
        dateInitiated: "2026-02-15",
        lastUpdate: "Just Now",
        valuation: "N/A",
        ownership: "0%",
        terms: "Milestone-based release for rural deployment.",
        progress: 100
    }
];

export const FUNDING_MODELS = [
    { id: "equity", label: "Equity Investment", icon: "PieChart", description: "Direct ownership stake in the venture." },
    { id: "grant", label: "Grant / CSR Funding", icon: "Gift", description: "Non-repayable funding for social impact." },
    { id: "revenue_share", label: "Revenue Share", icon: "TrendingUp", description: "% of future revenue until cap is reached." },
    { id: "sponsorship", label: "Product Sponsorship", icon: "Package", description: "In-kind support via resources or equipment." },
    { id: "donation", label: "Donation / Philanthropy", icon: "Heart", description: "One-time contribution with no financial return." }
];
