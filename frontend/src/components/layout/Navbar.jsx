import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Button from "../ui/Button";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: "Projects", path: "/projects" },
        { name: "Community", path: "/feed" },
        { name: "Trending", path: "/trending" },
    ];

    const isDarkMode = location.pathname === "/" && !isScrolled;

    // Only show this Navbar for authenticated sessions
    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled
                ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-4 shadow-sm"
                : "bg-transparent py-8"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl font-serif text-xl font-bold transition-colors ${isScrolled ? "bg-[#2F2F2F] text-white" : "bg-white text-black"
                            }`}
                    >
                        U
                    </motion.div>
                    <span className={`font-serif text-2xl font-bold tracking-tight transition-colors ${isDarkMode ? "text-white" : "text-[#2F2F2F]"
                        }`}>
                        Udaan
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `relative text-sm font-bold transition-colors uppercase tracking-widest ${isDarkMode
                                    ? (isActive ? "text-white" : "text-white/60 hover:text-white")
                                    : (isActive ? "text-black" : "text-gray-500 hover:text-black")
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-underline"
                                            className={`absolute -bottom-1 left-0 w-full h-[2px] rounded-full ${isDarkMode ? "bg-white" : "bg-black"
                                                }`}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Auth Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Link to="/inbox" className="p-2 relative group">
                            <Bell size={20} className={isDarkMode ? "text-white" : "text-gray-600"} />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Link>
                        <div className="hidden lg:flex flex-col items-end mr-2">
                            <span className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/70" : "text-gray-500"}`}>
                                Welcome
                            </span>
                            <span className={isDarkMode ? "text-white text-sm font-semibold" : "text-gray-800 text-sm font-semibold"}>
                                {user?.name || "User"}
                            </span>
                        </div>
                        <div
                            className="h-10 w-10 bg-[#CBD4CE] rounded-xl flex items-center justify-center text-sm font-bold cursor-pointer hover:ring-2 ring-black/10 transition-all overflow-hidden"
                            onClick={() => navigate("/dashboard")}
                        >
                            <span>{user?.name?.[0]}</span>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                navigate("/", { replace: true });
                            }}
                            className={`flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                                isDarkMode
                                    ? "border-white/30 text-white/80 hover:bg-white/10"
                                    : "border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className={isDarkMode ? "text-white" : "text-black"} />
                    ) : (
                        <Menu className={isDarkMode ? "text-white" : "text-black"} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-6 text-[#2F2F2F]">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-lg font-bold"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Button onClick={() => navigate("/dashboard")} className="w-full h-14 rounded-xl">Dashboard</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
