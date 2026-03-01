import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-[#F7F7F3] flex flex-col items-center justify-center z-[1000] relative">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="h-20 w-20 bg-[#2F2F2F] rounded-[2rem] flex items-center justify-center text-white text-3xl font-serif font-bold shadow-2xl mb-8"
            >
                U
            </motion.div>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "200px" }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-1 bg-gray-200 rounded-full relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[#2F2F2F] w-1/2 animate-shimmer" />
            </motion.div>
        </div>
    );
};

export default LoadingScreen;
