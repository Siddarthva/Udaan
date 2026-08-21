import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";
import { DollarSign, CreditCard, ShieldCheck, CheckCircle2, Loader2, Landmark, Wallet, QrCode } from "lucide-react";
import { useInvestStartupMutation } from "@/api/hooks";
import toast from "react-hot-toast";

export default function InvestmentModal({ isOpen, onClose, startup }) {
    const [amount, setAmount] = useState("1000");
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [processingStep, setProcessingStep] = useState(0); // 0: Idle, 1: Processing, 2: Success
    const [transactionResult, setTransactionResult] = useState(null);

    const investMutation = useInvestStartupMutation();

    const paymentOptions = [
        { id: "UPI", label: "UPI (Google Pay / PhonePe)", icon: QrCode },
        { id: "Credit Card", label: "Credit Card", icon: CreditCard },
        { id: "Debit Card", label: "Debit Card", icon: CreditCard },
        { id: "Net Banking", label: "Net Banking", icon: Landmark },
        { id: "Wallet", label: "Digital Wallet", icon: Wallet }
    ];

    const amountPresets = [100, 500, 1000, 5000];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0 || !agreedTerms || !startup) return;

        setProcessingStep(1);

        // Simulate multi-step processing animation
        setTimeout(async () => {
            try {
                const res = await investMutation.mutateAsync({
                    id: startup.id,
                    data: {
                        amount: Number(amount),
                        payment_method: paymentMethod
                    }
                });

                setTransactionResult(res);
                setProcessingStep(2);
                toast.success(`Investment of $${Number(amount).toLocaleString()} processed!`);
            } catch (err) {
                setProcessingStep(0);
                toast.error(err.message || "Failed to process investment transaction");
            }
        }, 1200);
    };

    const handleClose = () => {
        setProcessingStep(0);
        setTransactionResult(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={processingStep === 2 ? "Transaction Confirmation" : `Invest in ${startup?.title || 'Startup'}`}>
            {processingStep === 1 ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">Processing Capital Investment</h3>
                        <p className="text-xs text-gray-500 mt-1">Connecting to simulated payment gateway ({paymentMethod})...</p>
                    </div>
                </div>
            ) : processingStep === 2 ? (
                <div className="py-6 space-y-6 text-center">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Capital Transfer Successful!</h3>
                        <p className="text-xs text-gray-500 mt-1">Transaction ref: <strong>{transactionResult?.transaction_id}</strong></p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Startup:</span>
                            <span className="font-semibold text-gray-900">{startup?.title}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Investment Amount:</span>
                            <span className="font-bold text-emerald-600">${Number(amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Payment Channel:</span>
                            <span className="font-semibold text-gray-900">{paymentMethod}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="text-gray-500">Status:</span>
                            <span className="font-bold text-emerald-600 uppercase">Completed</span>
                        </div>
                    </div>

                    <Button onClick={handleClose} className="w-full">
                        Done & Close
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Amount Input & Presets */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Investment Amount ($)</label>
                        <Input
                            type="number"
                            icon={DollarSign}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter investment amount..."
                            required
                            min="10"
                        />

                        <div className="flex gap-2 mt-2">
                            {amountPresets.map((preset) => (
                                <button
                                    type="button"
                                    key={preset}
                                    onClick={() => setAmount(preset.toString())}
                                    className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                                        amount === preset.toString() ? "bg-gray-900 text-white border-gray-900" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    ${preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dummy Payment Methods */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Select Payment Method</label>
                        <div className="space-y-2">
                            {paymentOptions.map((opt) => {
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

                    {/* Terms & Conditions */}
                    <div className="flex items-start gap-2 pt-2 border-t border-gray-100">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreedTerms}
                            onChange={(e) => setAgreedTerms(e.target.checked)}
                            className="mt-0.5 text-indigo-600 rounded focus:ring-indigo-500"
                            required
                        />
                        <label htmlFor="terms" className="text-[11px] text-gray-500 leading-tight">
                            I understand this is a simulated SaaS funding workflow with zero real capital charge. I accept the UDAAN Venture Agreement terms.
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" disabled={!agreedTerms || !amount || Number(amount) <= 0}>
                            Proceed & Invest ${Number(amount || 0).toLocaleString()}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
