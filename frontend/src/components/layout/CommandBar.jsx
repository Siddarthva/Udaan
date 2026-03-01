import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Zap,
    Briefcase,
    Target,
    Users,
    FileText,
    Command,
    ArrowRight,
    TrendingUp,
    Shield,
    PieChart,
    ChevronRight,
    Search as SearchIcon,
    Globe,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/domainStores';
import { useUIStore } from '../../store/uiStore';
import { DOMAIN_ROUTES } from '../../config/platform';

/**
 * CommandBar: A FAANG-level spotlight search and global action palette.
 * Keyboard Trigger: Cmd+K or Ctrl+K
 */
export const CommandBar = ({ isOpen, onClose }) => {
    const { user } = useAuthStore();
    const { openOverlay } = useUIStore();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    // Filtered actions based on role and query
    const actions = [
        { id: 'dash', label: 'Go to Dashboard', icon: Target, category: 'Navigation', path: '/dashboard' },
        { id: 'projects', label: 'Explore Projects', icon: Briefcase, category: 'Navigation', path: '/projects' },
        { id: 'community', label: 'Ecosystem Feed', icon: Users, category: 'Community', path: '/feed' },

        // Global Command Overlays
        { id: 'impact_map', label: 'Analyze Ecosystem Map', icon: Globe, category: 'Intelligence', overlay: 'IMPACT_MAP' },
        { id: 'registry', label: 'Search System Registry', icon: Users, category: 'Governance', overlay: 'REGISTRY_VIEWER' },
        { id: 'audit', label: 'Platform Activity Log', icon: FileText, category: 'Governance', overlay: 'AUDIT_DRAWER' },

        // Role-Specific Rapid Execution
        ...(user?.role === 'Innovator' ? [
            { id: 'venture', label: 'Launch Project Wizard', icon: Plus, category: 'Venture', overlay: 'VENTURE_WIZARD' },
        ] : []),

        ...(user?.role === 'Sponsor' ? [
            { id: 'deal', label: 'Initiate Funding Deal', icon: Zap, category: 'Sponsorship', overlay: 'DEAL_WIZARD' },
            { id: 'compliance', label: 'Compliance Console', icon: Shield, category: 'Governance', overlay: 'COMPLIANCE_CONSOLE' },
        ] : []),

        ...(user?.role === 'Admin' ? [
            { id: 'compliance_admin', label: 'Governance Oversight', icon: Shield, category: 'Governance', overlay: 'COMPLIANCE_CONSOLE' },
        ] : []),

        // Global Tools
        { id: 'settings', label: 'Account Settings', icon: Command, category: 'System', path: '/settings' },
    ].filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => (i + 1) % actions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => (i - 1 + actions.length) % actions.length);
            } else if (e.key === 'Enter') {
                if (actions[selectedIndex]) {
                    handleAction(actions[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, actions, selectedIndex]);

    const handleAction = (action) => {
        if (action.path) {
            navigate(action.path);
        } else if (action.overlay) {
            openOverlay(action.overlay);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden"
                    >
                        <div className="flex items-center px-6 py-5 border-b border-gray-100">
                            <SearchIcon className="text-gray-400 mr-4" size={20} />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search by domain, workspace, or action..."
                                className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-gray-900 placeholder-gray-300"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="flex items-center gap-1">
                                <kbd className="hidden sm:inline-flex h-6 px-1.5 items-center justify-center bg-gray-50 border border-gray-200 rounded-md text-[10px] font-black text-gray-400">ESC</kbd>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
                            {actions.length > 0 ? (
                                <div className="space-y-4 py-4 px-2">
                                    {Object.entries(actions.reduce((acc, a) => {
                                        (acc[a.category] = acc[a.category] || []).push(a);
                                        return acc;
                                    }, {})).map(([category, items]) => (
                                        <div key={category} className="space-y-1">
                                            <p className="px-4 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">{category}</p>
                                            {items.map((item) => {
                                                const globalIdx = actions.indexOf(item);
                                                const isActive = globalIdx === selectedIndex;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                        onClick={() => handleAction(item)}
                                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 ${isActive ? 'bg-gray-900 text-white translate-x-1' : 'text-gray-600 hover:bg-gray-50'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`h-10 w-10 rounded-[1.25rem] flex items-center justify-center transition-colors ${isActive ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-white'}`}>
                                                                <item.icon size={20} />
                                                            </div>
                                                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                                        </div>
                                                        {isActive && <ChevronRight size={18} className="text-white/40" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                                        <Search size={24} className="text-gray-300" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">No capabilities found matching "{query}"</p>
                                    <p className="text-xs font-medium text-gray-400 mt-1">Try searching for "Pipeline", "Compliance" or "Settings"</p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <kbd className="h-5 px-1.5 flex items-center justify-center bg-white border border-gray-200 rounded text-[9px] font-black">↑↓</kbd>
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Navigate</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <kbd className="h-5 px-1.5 flex items-center justify-center bg-white border border-gray-200 rounded text-[9px] font-black">ENTER</kbd>
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Execute</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Udaan Command Node v1.0</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
