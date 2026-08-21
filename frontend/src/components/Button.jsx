import React from "react";
import { cn } from "@/utils/helpers";

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    type = "button",
    onClick,
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
        primary: "bg-gray-900 text-white hover:bg-gray-800 border border-gray-900",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200",
        outline: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700 border border-red-600",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 border border-transparent"
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base"
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
}
export { Button };
