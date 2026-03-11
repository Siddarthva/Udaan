import React from 'react';
import { motion } from 'framer-motion';
import { X, Shield, Clock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGovernanceStore } from '@/store/domainStores';
import { Badge, Button } from '@/components/ui';

export default function AuditDrawer({ onClose }) {
    const { auditLogs } = useGovernanceStore();

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-[2000] border-l border-gray-100 flex flex-col"
        >
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">System Audit Trail</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Institutional Governance Node</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X size={24} className="text-gray-400" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Total Logs</p>
                        <p className="text-2xl font-black text-emerald-900">{auditLogs.length}</p>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                        <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-1">Active Monitors</p>
                        <p className="text-2xl font-black text-blue-900">12</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] px-2">Live Activity Stream</h3>
                    <div className="space-y-4">
                        {auditLogs.map((log) => (
                            <div key={log.id} className="p-6 bg-white border border-gray-100 rounded-3xl hover:border-gray-900 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                            {log.status === 'Success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{log.action}</p>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{log.user}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-black border-gray-100 text-gray-400 uppercase tracking-widest">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed italic">"{log.details}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                <Button className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                    Export Full Ledger (CSV/PDF)
                </Button>
            </div>
        </motion.div>
    );
}
