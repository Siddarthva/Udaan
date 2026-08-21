import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/helpers";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    className = ""
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div
                className="fixed inset-0"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className={cn(
                    "relative w-full max-w-lg bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh]",
                    className
                )}
            >
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
                <div className="p-6 overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    );
}
export { Modal };
