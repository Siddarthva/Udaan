import React, { useState } from "react";
import { X, Lock, ShieldCheck } from "lucide-react";
import Button from "../ui/Button";

export default function FundingModal({ project, onClose }) {
  const [model, setModel] = useState("donation");
  const [amount, setAmount] = useState(10000);

  const getReturns = () => {
    if (model === "rsa") return "1.5x Return Cap (3% Revenue Share)";
    if (model === "psa") return "Early Access + 50 Units Pre-ordered";
    return "Tax Deduction Certificate (80G)";
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-2xl font-bold">Fund {project.title}</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
          {["donation", "rsa", "psa"].map(m => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={`flex-1 py-2 rounded-lg text-sm ${model === m ? "bg-white shadow" : "text-gray-500"}`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        <label className="text-sm text-gray-500">Amount (₹)</label>
        <input
          className="w-full text-3xl font-bold border-b focus:border-black outline-none bg-transparent mb-6"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="bg-gray-50 p-4 rounded-xl border">
          <div className="flex gap-3 items-start">
            <ShieldCheck className="text-green-600" />
            <div>
              <p className="font-bold">Escrow Protected</p>
              <p className="text-xs text-gray-500">Funds release only on milestone verification.</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t text-sm">
            Expected Return: {getReturns()}
          </div>
        </div>

        <Button className="w-full mt-6">Confirm Transfer</Button>
      </div>
    </div>
  );
}
