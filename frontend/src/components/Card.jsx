import React from "react";
import { cn } from "@/utils/helpers";

export default function Card({ children, className = "", noPadding = false, ...props }) {
    return (
        <div
            className={cn(
                "bg-white border border-gray-200 rounded-lg shadow-xs",
                !noPadding && "p-5",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
export { Card };
