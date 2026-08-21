import React, { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const Input = forwardRef(({
    label,
    error,
    hint,
    icon: Icon,
    className = "",
    type = "text",
    ...props
}, ref) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="block text-xs font-semibold text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {Icon && (
                    <div className="absolute left-3 text-gray-400 pointer-events-none">
                        <Icon size={16} />
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={cn(
                        "w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-500",
                        Icon && "pl-9",
                        error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
            {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
        </div>
    );
});

Input.displayName = "Input";
export default Input;
export { Input };
