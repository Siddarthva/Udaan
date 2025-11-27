import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/70 backdrop-blur border rounded-2xl p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
