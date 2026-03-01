import React from "react";

/**
 * Badge: Standardized label component for status, roles, and tags.
 * Optimized for professional SaaS aesthetic.
 */
export const Badge = ({ children, variant = "secondary", className = "" }) => {
    const variants = {
        primary: "bg-gray-900 text-white border-transparent",
        secondary: "bg-gray-100 text-gray-600 border-gray-200",
        outline: "bg-transparent text-gray-900 border-gray-200",
        success: "bg-emerald-50 text-emerald-700 border-emerald-100",
        warning: "bg-amber-50 text-amber-700 border-amber-100",
        danger: "bg-rose-50 text-rose-700 border-rose-100",
    };

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${variants[variant] || variants.secondary} ${className}`}>
            {children}
        </span>
    );
};
