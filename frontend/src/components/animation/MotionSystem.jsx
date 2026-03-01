import React from "react";
import { motion } from "framer-motion";

const variants = {
    hidden: (direction) => ({
        opacity: 0,
        y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
        x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
        filter: "blur(10px)",
    }),
    visible: {
        opacity: 1,
        y: 0,
        x: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for premium feel
        },
    },
};

export const AnimatedSection = ({
    children,
    className = "",
    delay = 0,
    direction = "up"
}) => {
    return (
        <motion.div
            custom={direction}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={variants}
            transition={{ delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const RevealOnScroll = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
            duration: 0.8,
            delay,
            ease: [0.16, 1, 0.3, 1]
        }}
    >
        {children}
    </motion.div>
);

export const StaggerContainer = ({ children, delay = 0 }) => (
    <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1,
                    delayChildren: delay
                }
            }
        }}
    >
        {children}
    </motion.div>
);
