import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Shield, Rocket, Users, Loader2 } from "lucide-react";
import { Button, Card, InputField } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

/**
 * AuthPage: Production-style entry point for the platform.
 * Features: Role selection, login simulation with real-world latency.
 */
export default function AuthPage() {
    const [role, setRole] = useState("Innovator");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [mode, setMode] = useState("login"); // "login" | "signup"

    const { signup, login } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const isSignup = mode === "signup";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
    });

    // After login, redirect to safe dashboard or the page they intended to visit
    const from = location.state?.from?.pathname || "/dashboard";

    const onSubmit = async (values) => {
        setIsAuthenticating(true);
        try {
            if (isSignup) {
                // Signup: create user and log them in
                await signup({
                    name: values.fullName,
                    email: values.email,
                    password: values.password,
                    role,
                });
                toast.success(`Welcome, ${values.fullName}. Your workspace is ready.`);
            } else {
                // Login: validate against stored credentials
                await login({
                    email: values.email,
                    password: values.password,
                });
                toast.success("Authenticated successfully.");
            }

            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error?.message || "Authentication failed. Please try again.");
            console.error("[AUTH]:", error);
        } finally {
            setIsAuthenticating(false);
        }
    };

    const roles = [
        { id: "Innovator", label: "Innovator", icon: Rocket, desc: "Build projects and connect with mentors." },
        { id: "Mentor", label: "Mentor", icon: Users, desc: "Guide and advise early-stage founders." },
        { id: "Sponsor", label: "Sponsor", icon: Shield, desc: "Discover and back verified startups." }
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 selection:bg-gray-900 selection:text-white">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[480px]"
            >
                <div className="text-center mb-10">
                    <div className="h-14 w-14 bg-gray-900 text-white flex items-center justify-center rounded-2xl mx-auto mb-6 font-black text-2xl shadow-2xl shadow-black/10 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                        U
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Platform Access</h1>
                    <p className="text-sm text-gray-400 font-medium">Enter your credentials to access the Udaan ecosystem.</p>
                </div>

                <Card className="p-8 border-none shadow-2xl shadow-black/5 bg-white">
                    {/* Auth Mode Toggle */}
                    <div className="flex items-center justify-center mb-6 bg-gray-50 rounded-2xl p-1">
                        <button
                            type="button"
                            onClick={() => setMode("login")}
                            className={`flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                !isSignup ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("signup")}
                            className={`flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                isSignup ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-3 mb-8">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Primary Role</p>
                            <div className="grid grid-cols-3 gap-2">
                                {roles.map((r) => {
                                    const Icon = r.icon;
                                    const isSelected = role === r.id;
                                    return (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setRole(r.id)}
                                            className={`group relative p-3 rounded-xl border flex flex-col items-center gap-2 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-900/5 ${isSelected
                                                ? "border-gray-900 bg-gray-900 text-white shadow-lg shadow-black/10"
                                                : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 hover:bg-white"
                                                }`}
                                        >
                                            <Icon size={18} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{r.label}</span>
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="activeRoleIndicator"
                                                    className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white text-white"
                                                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                                >
                                                    <CheckCircle size={8} />
                                                </motion.div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {isSignup && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                    <InputField
                                        type="text"
                                        placeholder="John Doe"
                                        className="h-12 bg-gray-50 border-gray-100 hover:border-gray-300 focus:bg-white text-sm"
                                        {...register("fullName", {
                                            required: isSignup ? "Full name is required" : false,
                                        })}
                                    />
                                    {errors.fullName && (
                                        <p className="text-[11px] text-red-500 font-medium mt-1">{errors.fullName.message}</p>
                                    )}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Work Email</label>
                                <InputField
                                    type="email"
                                    placeholder="name@company.com"
                                    className="h-12 bg-gray-50 border-gray-100 hover:border-gray-300 focus:bg-white text-sm"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /.+@.+\..+/,
                                            message: "Please enter a valid email address",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-[11px] text-red-500 font-medium mt-1">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Password</label>
                                <InputField
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-12 bg-gray-50 border-gray-100 hover:border-gray-300 focus:bg-white text-sm"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password should be at least 6 characters",
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <p className="text-[11px] text-red-500 font-medium mt-1">{errors.password.message}</p>
                                )}
                            </div>
                            <Button
                                disabled={isAuthenticating}
                                type="submit"
                                size="lg"
                                className="w-full h-12 bg-gray-900 text-white shadow-xl shadow-black/5 flex items-center justify-center gap-2 group border-none"
                            >
                                {isAuthenticating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin opacity-50" /> Initializing Workspace...
                                    </>
                                ) : (
                                    <>
                                        Authenticate Portal <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-50 text-center space-y-4">
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
                            Restricted Sandbox Mode
                        </p>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Enterprise access enabled. Session will persist in local sandbox.
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
