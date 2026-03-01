import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export const PageHeader = ({ title, description, action, breadcrumbs }) => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
        >
            <div>
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                        {breadcrumbs.map((bc, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && <ChevronRight size={14} className="text-gray-300" />}
                                {bc.href ? (
                                    <a href={bc.href} className="hover:text-gray-900 transition-colors">{bc.label}</a>
                                ) : (
                                    <span className="text-gray-900 font-medium">{bc.label}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </motion.header>
    );
};
