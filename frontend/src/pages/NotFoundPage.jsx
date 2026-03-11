import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F7F7F3] flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12"
            >
                <h1 className="text-[12rem] font-serif font-black text-[#2F2F2F] leading-none opacity-5">404</h1>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h2 className="text-4xl font-serif font-bold mb-4">Lost in Space</h2>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8">The coordinate you're looking for doesn't exist in our innovation network.</p>
                    <Button onClick={() => navigate("/")} className="h-14 px-10 rounded-2xl shadow-xl">
                        Back to Orbit
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
