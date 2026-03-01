import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, description, children, footer }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[200] bg-gray-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <div className="fixed inset-0 z-[210] flex items-center justify-center px-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 -mr-1 -mt-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                {children}
                            </div>
                            {footer && (
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 flex-wrap">
                                    {footer}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
