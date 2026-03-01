import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Card = ({ children, className = "", noPadding = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
                "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden",
                !noPadding && "p-6",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
