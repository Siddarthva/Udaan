/**
 * Ledger Data
 * Investor accounting system for outflows and inflows.
 */

export const LEDGER_RECORDS = [
    {
        id: "tx_1",
        date: "2026-02-15",
        project: "AgriDrone AI",
        type: "Outflow",
        category: "Installment",
        amount: "₹25.0 L",
        status: "Completed",
        receipt: "RCP-10293"
    },
    {
        id: "tx_2",
        date: "2026-02-28",
        project: "MedAssist AI",
        type: "Inflow",
        category: "Revenue Share",
        amount: "₹4.2 L",
        status: "Completed",
        receipt: "RCP-11029"
    },
    {
        id: "tx_3",
        date: "2026-03-05",
        project: "Eco-Grow Systems",
        type: "Outflow",
        category: "Initial Funding",
        amount: "₹15.0 L",
        status: "Completed",
        receipt: "RCP-12093"
    },
    {
        id: "tx_4",
        date: "2026-03-12",
        project: "AgriDrone AI",
        type: "Inflow",
        category: "Dividend",
        amount: "₹8.5 L",
        status: "Pending",
        receipt: "RCP-13092"
    }
];

export const FINANCIAL_REPORTS = {
    totalCapitalDeployed: "₹4.8 Cr",
    totalReturnsRealized: "₹12.7 L",
    projectedReturnsQ3: "₹45.0 L",
    burnRateAvg: "₹8.5 L / month"
};
