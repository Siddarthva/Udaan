import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button, Card } from "../components/ui";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RoleLandingSection } from "../components/role/RoleLandingSection";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const timelineRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

    useEffect(() => {
        const sections = gsap.utils.toArray(".timeline-section");

        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: timelineRef.current,
                pin: true,
                scrub: 1,
                snap: 1 / (sections.length - 1),
                end: () => "+=" + (timelineRef.current?.offsetWidth || 0),
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div className="relative overflow-hidden bg-white selection:bg-gray-200">
            {/* Nav Removed: Provided by PublicLayout */}

            {/* Hero Section */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 pt-10 bg-gray-50 border-b border-gray-200"
            >
                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-600 mb-8 shadow-sm">
                            <span className="flex w-2 h-2 rounded-full bg-blue-500"></span>
                            Platform v2.0 Live
                        </div>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight mb-8">
                            The operating system <br />
                            for startups.
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-10">
                            Udaan provides the tools visionaries need to secure funding, find mentors, and scale impact.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => navigate("/auth")}
                                size="lg"
                                className="h-12 px-8 text-base shadow-lg shadow-gray-200"
                            >
                                Get Started <ArrowRight className="ml-2" size={18} />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/projects")}
                                size="lg"
                                className="h-12 px-8 text-base bg-white"
                            >
                                Contact Sales
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Narrative Section 1 */}
            <section className="py-24 px-4 bg-white relative border-b border-gray-100">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                            Innovation is hard. <br />
                            <span className="text-gray-400">We make it scalable.</span>
                        </h2>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Traditional platforms are fragmented. Udaan consolidates your cap table, mentor advisory, and project metrics into a single source of truth, evolving seamlessly as you grow.
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-6">
                            <div className="space-y-1 border-l-2 border-gray-200 pl-4">
                                <h4 className="font-bold text-2xl text-gray-900">90%</h4>
                                <p className="text-sm text-gray-500">Faster due diligence.</p>
                            </div>
                            <div className="space-y-1 border-l-2 border-gray-200 pl-4">
                                <h4 className="font-bold text-2xl text-gray-900">$2B+</h4>
                                <p className="text-sm text-gray-500">Capital actively deployed.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-gray-50 aspect-square flex items-center justify-center p-6"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Dashboard Interface"
                                className="w-full h-full object-cover rounded-xl shadow-sm border border-gray-100"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Role Scrollytelling Section */}
            <RoleLandingSection />

            {/* GSAP Timeline Section */}
            <section ref={timelineRef} className="bg-gray-900 text-white min-h-screen flex items-center overflow-hidden">
                <div className="flex w-fit">
                    <div className="timeline-section w-screen h-screen flex flex-col justify-center px-8 md:px-24">
                        <span className="text-gray-400 font-semibold mb-4 text-sm tracking-wider uppercase">Phase 01</span>
                        <h3 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Build.</h3>
                        <p className="max-w-xl text-xl text-gray-400 leading-relaxed">
                            Structured workflows for rapid prototyping. Validate assumptions with built-in analytics and peer reviews.
                        </p>
                    </div>
                    <div className="timeline-section w-screen h-screen flex flex-col justify-center px-8 md:px-24">
                        <span className="text-gray-400 font-semibold mb-4 text-sm tracking-wider uppercase">Phase 02</span>
                        <h3 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Connect.</h3>
                        <p className="max-w-xl text-xl text-gray-400 leading-relaxed">
                            Access a curated network of elite advisors. Tactical, actionable guidance exactly when you need it.
                        </p>
                    </div>
                    <div className="timeline-section w-screen h-screen flex flex-col justify-center px-8 md:px-24">
                        <span className="text-gray-400 font-semibold mb-4 text-sm tracking-wider uppercase">Phase 03</span>
                        <h3 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Scale.</h3>
                        <p className="max-w-xl text-xl text-gray-400 leading-relaxed">
                            Streamlined cap table management and milestone-based funding to fuel your next growth stage.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-4 bg-gray-50 border-t border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">Enterprise-grade capabilities.</h2>
                        <p className="text-lg text-gray-500">Everything needed to run a world-class startup.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Zap,
                                title: "Automated Workflows",
                                desc: "Reduce operational overhead with built-in templates and process automation.",
                            },
                            {
                                icon: Shield,
                                title: "Verified Governance",
                                desc: "Smart contracts and verified identity ensure all transactions are secure.",
                            },
                            {
                                icon: Sparkles,
                                title: "Data Intelligence",
                                desc: "Predictive analytics and market insights to power data-driven decisions.",
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full flex flex-col p-6">
                                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mb-6 text-gray-700 border border-gray-200">
                                        <feature.icon size={20} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 px-4 bg-white text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Start building today.
                    </h2>
                    <p className="text-lg text-gray-500">
                        Join the fastest growing platform for modern founders and investors.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={() => navigate("/auth")}
                            size="lg"
                            className="h-12 px-8 text-base shadow-sm"
                        >
                            Start for Free
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
