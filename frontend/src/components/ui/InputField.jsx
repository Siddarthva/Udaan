import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const InputField = forwardRef(
    ({ className, label, error, hint, icon: Icon, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    {Icon && (
                        <div className="absolute left-3 text-gray-400">
                            <Icon size={16} />
                        </div>
                    )}
                    <input
                        id={inputId}
                        ref={ref}
                        className={cn(
                            "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                            Icon && "pl-9",
                            error && "border-red-500 focus-visible:ring-red-500",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="text-[13px] font-medium text-red-500">{error}</p>}
                {hint && !error && <p className="text-[13px] text-gray-500">{hint}</p>}
            </div>
        );
    }
);
InputField.displayName = "InputField";
