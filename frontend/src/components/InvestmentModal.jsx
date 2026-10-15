import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";
import { CreditCard, CheckCircle2, Loader2, Landmark, QrCode, AlertTriangle } from "lucide-react";
import { useInvestStartupMutation } from "@/api/hooks";
import { errorMessage } from "@/api/axios";
import { formatCurrency } from "@/utils/helpers";
import toast from "react-hot-toast";

const PAYMENT_OPTIONS = [
    { id: "UPI", label: "UPI (simulated)", icon: QrCode },
    { id: "CARD", label: "Card (simulated)", icon: CreditCard },
    { id: "NETBANKING", label: "Net Banking (simulated)", icon: Landmark }
];

/**
 * Funding DEMO. No payment is taken and nothing is stored: the schema has no transaction ledger, so the
 * startup's funding totals are never changed by this flow. Real interest is recorded via "Express interest".
 */
export default function InvestmentModal({ isOpen, onClose, startup }) {
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [step, setStep] = useState("form"); // form | processing | done
    const [receipt, setReceipt] = useState(null);

    const investMutation = useInvestStartupMutation();
    const amountNumber = Number(amount);
    const canSubmit = agreedTerms && Number.isFinite(amountNumber) && amountNumber > 0;

    const reset = () => {
        setStep("form");
        setReceipt(null);
        setAmount("");
        setAgreedTerms(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit || !startup) return;
        setStep("processing");
        try {
            const res = await investMutation.mutateAsync({
                id: startup.id,
                data: { amount: amountNumber, payment_method: paymentMethod, accepted_terms: true }
            });
            setReceipt(res);
            setStep("done");
        } catch (err) {
            setStep("form");
            toast.error(errorMessage(err, "Simulation failed"));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={step === "done" ? "Simulation Receipt" : `Fund ${startup?.title || "Startup"} (Demo)`}>
            {step === "processing" ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">Running funding simulation</h3>
                        <p className="text-xs text-gray-500 mt-1">No real payment is being made.</p>
                    </div>
                </div>
            ) : step === "done" ? (
                <div className="py-4 space-y-5 text-center">
                    <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Simulation complete</h3>
                        <p className="text-xs text-gray-500 mt-1">Simulated reference: <strong>{receipt?.reference}</strong></p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-gray-500">Startup</span><span className="font-semibold text-gray-900">{receipt?.startup?.title}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Amount (simulated)</span><span className="font-bold text-gray-900">{formatCurrency(receipt?.amount)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-semibold text-gray-900">{receipt?.payment_method}</span></div>
                        <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-gray-500">Status</span><span className="font-bold text-amber-600 uppercase">Demo only</span></div>
                    </div>
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 text-left">
                        {receipt?.notice} Funding totals were not changed.
                    </p>
                    <Button onClick={handleClose} className="w-full">Close</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex items-start gap-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                        <span>This is a demonstration. No money moves and nothing is recorded against the startup's funding.</span>
                    </div>

                    {startup && (
                        <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase">Funding goal</p>
                                <p className="font-bold text-gray-900">{formatCurrency(startup.funding_required)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase">Received so far</p>
                                <p className="font-bold text-gray-900">{formatCurrency(startup.funding_received)}</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Amount (₹ Lakhs)</label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 10"
                            min="0"
                            step="any"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Simulated payment method</label>
                        <div className="space-y-2">
                            {PAYMENT_OPTIONS.map((opt) => {
                                const Icon = opt.icon;
                                return (
                                    <label
                                        key={opt.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                                            paymentMethod === opt.id ? "border-indigo-600 bg-indigo-50/50 text-gray-900" : "border-gray-200 hover:bg-gray-50 text-gray-600"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon className={`w-4 h-4 ${paymentMethod === opt.id ? "text-indigo-600" : "text-gray-400"}`} />
                                            <span>{opt.label}</span>
                                        </div>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={opt.id}
                                            checked={paymentMethod === opt.id}
                                            onChange={() => setPaymentMethod(opt.id)}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-start gap-2 pt-2 border-t border-gray-100">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreedTerms}
                            onChange={(e) => setAgreedTerms(e.target.checked)}
                            className="mt-0.5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="terms" className="text-[11px] text-gray-500 leading-tight">
                            I understand this is a demo: no real payment is made, no funding is recorded, and the reference shown is simulated.
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" disabled={!canSubmit}>Run simulation</Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
