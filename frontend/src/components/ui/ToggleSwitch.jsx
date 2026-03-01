import React from "react";
import { motion } from "framer-motion";

export const ToggleSwitch = ({ checked, onChange, label, description, disabled = false }) => {
    return (
        <label className={`flex items-start justify-between gap-4 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
            {(label || description) && (
                <div className="flex flex-col gap-1">
                    {label && <span className="text-sm font-medium text-gray-900 leading-none">{label}</span>}
                    {description && <span className="text-[13px] text-gray-500 leading-snug">{description}</span>}
                </div>
            )}
            <div
                className={`relative inline-flex h-5 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${checked ? "bg-gray-900" : "bg-gray-200"} ${disabled ? "pointer-events-none" : ""}`}
                role="switch"
                aria-checked={checked}
                onClick={(e) => {
                    e.preventDefault();
                    if (!disabled) onChange(!checked);
                }}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (!disabled) onChange(!checked);
                    }
                }}
            >
                <motion.span
                    className="pointer-events-none isolate h-4 w-4 rounded-full bg-white shadow-sm ring-0"
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{
                        x: checked ? "calc(100% - 2px)" : "2px"
                    }}
                />
            </div>
        </label>
    );
};
