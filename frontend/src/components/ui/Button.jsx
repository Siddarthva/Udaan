import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({
    children,
    variant = "primary",
    size = "md",
    className = "",
    icon: Icon,
    ...props
}, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-900";

    const variants = {
        primary: "bg-gray-900 text-white hover:bg-gray-800 shadow-sm border border-transparent",
        secondary: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm",
        outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100/80 border border-transparent",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent"
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-11 px-6 text-base"
    };

    return (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
            {...props}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
        >
            {Icon && (
                <Icon
                    size={size === "sm" ? 14 : size === "md" ? 16 : 18}
                    className={clsx(children ? "mr-2" : "", "shrink-0")}
                />
            )}
            {children}
        </motion.button>
    );
});
Button.displayName = "Button";

export default Button;
