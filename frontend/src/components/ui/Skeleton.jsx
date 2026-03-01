import React from "react";
import { motion } from "framer-motion";

/**
 * Skeleton: A production-quality placeholder for async content.
 * Uses a subtle pulse animation and follows the gray-scale theme.
 */
export const Skeleton = ({ className = "" }) => {
    return (
        <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className={`bg-gray-200/60 rounded-lg ${className}`}
        />
    );
};

/**
 * DashboardSkeleton: Specific mockup for async dashboard tracking.
 */
export const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex flex-col gap-4 pb-6 border-b border-gray-100">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl space-y-4">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="bg-white border border-gray-100 rounded-2xl h-[400px] p-6 space-y-6">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-8 w-24 rounded-lg" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4 space-y-6">
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <Skeleton className="h-48 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
