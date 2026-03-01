import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Video, BookOpen, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCollaborationStore } from '../../store/domainStores';
import { Badge, Button } from '../ui';
import toast from 'react-hot-toast';

export default function SessionScheduler({ data, onClose }) {
    const { scheduleSession } = useCollaborationStore();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [objective, setObjective] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            scheduleSession({
                projectName: data?.projectName || data?.name || 'Venture Node',
                mentorName: 'Dr. Alok Sharma',
                date: selectedDate,
                time: selectedTime,
                objective: objective,
                status: 'Confirmed'
            });
            setIsSubmitting(false);
            toast.success("Strategic Session Scheduled Successfully!");
            onClose();
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
        >
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose} />
            <motion.div
                className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col"
            >
                <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-gray-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
                            <Calendar size={28} />
                        </div>
                        <div className="space-y-1">
                            <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">Mentorship Node</Badge>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Schedule Strategic Guidance</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-gray-50/30">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Preferred Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="date" required
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full h-14 bg-white border border-gray-100 rounded-2xl pl-14 pr-5 text-sm font-bold focus:ring-4 focus:ring-gray-900/5 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Preferred Time</label>
                            <div className="relative">
                                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="time" required
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="w-full h-14 bg-white border border-gray-100 rounded-2xl pl-14 pr-5 text-sm font-bold focus:ring-4 focus:ring-gray-900/5 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Session Primary Objective</label>
                        <div className="relative">
                            <BookOpen className="absolute left-5 top-6 text-gray-300" size={18} />
                            <textarea
                                required
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                placeholder="E.g. Scalability Roadmap Audit, Go-to-Market Strategy Review..."
                                className="w-full h-32 bg-white border border-gray-100 rounded-[2rem] pl-14 pr-5 pt-6 text-sm font-bold focus:ring-4 focus:ring-gray-900/5 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-100 rounded-[2rem] space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center">
                                    <Video size={18} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Protocol: Secure Video Node</p>
                                    <p className="text-[10px] font-bold text-gray-400">Encrypted Institutional Stream</p>
                                </div>
                            </div>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase tracking-widest">Active</Badge>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Transmitting Schedule Node...' : 'Schedule Strategic Session'}
                    </Button>
                </form>
            </motion.div>
        </motion.div>
    );
}
