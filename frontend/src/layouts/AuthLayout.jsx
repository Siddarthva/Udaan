import React from "react";
import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
    return (
        <div className="relative min-h-screen bg-[#F7F7F3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#CBD4CE] rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D8D8D3] rounded-full blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-12 relative z-10"
            >
                <Link to="/" className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-[#2F2F2F] text-white flex items-center justify-center rounded-2xl font-serif text-2xl font-bold shadow-2xl">U</div>
                    <span className="font-serif text-3xl font-bold tracking-tight text-[#2F2F2F]">Udaan</span>
                </Link>
            </motion.div>

            <div className="w-full relative z-10">
                <Outlet />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-gray-400 text-sm font-medium relative z-10"
            >
                &copy; {new Date().getFullYear()} Udaan Innovation Platform.
            </motion.div>
        </div>
    );
};

export default AuthLayout;
