/**
 * Sponsor Payments Dataset 💸
 * Tracks simulated financial transactions and upcoming obligations.
 */

export const PAYMENT_RECORDS = [
    {
        id: "pay_1",
        dealId: "deal_1",
        projectName: "AgriDrone AI",
        amount: "₹5.0 Lakhs",
        type: "Installment",
        status: "Completed",
        date: "2026-02-28",
        receiptId: "RAZ_923847"
    },
    {
        id: "pay_2",
        dealId: "deal_1",
        projectName: "AgriDrone AI",
        amount: "₹5.0 Lakhs",
        type: "Installment",
        status: "Pending",
        date: "2026-03-31",
        dueDate: "2026-03-31"
    }
];

export const UPCOMING_OBLIGATIONS = [
    { id: "ob_1", projectName: "AgriDrone AI", amount: "₹5,00,000", dueDate: "2026-03-31", type: "Installment" },
    { id: "ob_2", projectName: "SunLeaf Solar", amount: "₹10,00,000", dueDate: "2026-04-15", type: "Grant Disbursement" }
];
