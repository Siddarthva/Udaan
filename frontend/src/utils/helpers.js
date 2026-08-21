import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
    const val = parseFloat(amount || 0);
    return `₹${val.toLocaleString()} Lakhs`;
}

export function formatDate(dateString) {
    if (!dateString) return "";
    try {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    } catch {
        return dateString;
    }
}
