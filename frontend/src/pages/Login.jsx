import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Rocket, Users, Shield, Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/api/api";
import toast from "react-hot-toast";

const loginSchema = z.object({
    loginInput: z.string().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function Login() {
    const [role, setRole] = useState("innovator");
    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Username availability state
    const [usernameAvailable, setUsernameAvailable] = useState(null); // null | true | false
    const [checkingUsername, setCheckingUsername] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isSignup = mode === "signup";
    const from = location.state?.from?.pathname || "/dashboard";

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(isSignup ? signupSchema : loginSchema),
        defaultValues: { fullName: "", username: "", email: "", loginInput: "", password: "", confirmPassword: "" }
    });

    const watchedUsername = watch("username");

    // Debounced username checking
    useEffect(() => {
        if (!isSignup || !watchedUsername || watchedUsername.trim().length < 3) {
            setUsernameAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            setCheckingUsername(true);
            try {
                const res = await authApi.checkUsername(watchedUsername);
                setUsernameAvailable(res.available);
            } catch {
                setUsernameAvailable(null);
            } finally {
                setCheckingUsername(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [watchedUsername, isSignup]);

    const handleSwitchMode = (newMode) => {
        setMode(newMode);
        setUsernameAvailable(null);
        reset();
    };

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            if (isSignup) {
                if (usernameAvailable === false) {
                    toast.error("Username is already taken");
                    setIsSubmitting(false);
                    return;
                }
                const result = await signup({
                    full_name: values.fullName,
                    username: values.username.toLowerCase(),
                    email: values.email,
                    password: values.password,
                    role: role.toUpperCase()
                });
                if (result.requiresEmailConfirmation) {
                    toast.success(result.message || "Account created. Please confirm your email, then log in.", { duration: 6000 });
                    handleSwitchMode("login");
                    return;
                }
                toast.success(`Welcome, ${values.fullName}! Account created.`);
            } else {
                await login({
                    loginInput: values.loginInput, // email or username
                    password: values.password
                });
                toast.success("Authenticated successfully.");
            }
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.message || "Authentication failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const roles = [
        { id: "innovator", label: "INNOVATOR", icon: Rocket },
        { id: "mentor", label: "MENTOR", icon: Users },
        { id: "sponsor", label: "SPONSOR", icon: Shield }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <div className="h-12 w-12 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center text-xl mx-auto mb-4">
                        U
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">UDAAN Portal</h1>
                    <p className="text-xs text-gray-500 mt-1">Enter your credentials to access your workspace</p>
                </div>

                <Card className="space-y-6">
                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => handleSwitchMode("login")}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                !isSignup ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSwitchMode("signup")}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                isSignup ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Role selection for Sign Up only */}
                        {isSignup && (
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-700">Primary Role</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {roles.map((r) => {
                                        const Icon = r.icon;
                                        const isSelected = role === r.id;
                                        return (
                                            <button
                                                key={r.id}
                                                type="button"
                                                onClick={() => setRole(r.id)}
                                                className={`p-2.5 rounded-lg border text-center flex flex-col items-center gap-1 text-xs font-medium transition-colors cursor-pointer ${
                                                    isSelected
                                                        ? "border-gray-900 bg-gray-900 text-white"
                                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                                }`}
                                            >
                                                <Icon size={16} />
                                                <span>{r.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {isSignup ? (
                            <>
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    error={errors.fullName?.message}
                                    {...register("fullName")}
                                />

                                <div className="space-y-1">
                                    <Input
                                        label="Username"
                                        placeholder="johndoe_dev"
                                        error={errors.username?.message}
                                        {...register("username")}
                                    />
                                    {checkingUsername && (
                                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                            <Loader2 size={12} className="animate-spin" /> Checking username...
                                        </p>
                                    )}
                                    {!checkingUsername && usernameAvailable === true && (
                                        <p className="text-[11px] text-green-600 flex items-center gap-1 font-medium">
                                            <CheckCircle2 size={12} /> Username available
                                        </p>
                                    )}
                                    {!checkingUsername && usernameAvailable === false && (
                                        <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
                                            <XCircle size={12} /> Username already taken
                                        </p>
                                    )}
                                </div>

                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="name@company.com"
                                    error={errors.email?.message}
                                    {...register("email")}
                                />
                            </>
                        ) : (
                            <Input
                                label="Email or Username"
                                placeholder="name@company.com or username"
                                error={errors.loginInput?.message}
                                {...register("loginInput")}
                            />
                        )}

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                error={errors.password?.message}
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {isSignup && (
                            <Input
                                label="Confirm Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                error={errors.confirmPassword?.message}
                                {...register("confirmPassword")}
                            />
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-10 mt-2"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" /> Authenticating...
                                </span>
                            ) : (
                                isSignup ? "Create Account" : "Log In"
                            )}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
