import React from "react";
import { Lock, CheckCircle } from "lucide-react";

export default function Badge({ type }) {
  if (type === "escrow")
    return (
      <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs border border-green-200">
        <Lock size={12} /> Escrow Secured
      </div>
    );

  if (type === "verified")
    return (
      <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs border border-blue-200">
        <CheckCircle size={12} /> Mentor Verified
      </div>
    );

  return null;
}
