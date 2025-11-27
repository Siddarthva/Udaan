// src/components/ui/Button.jsx
import React from "react";
import clsx from "clsx";

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200",
        "bg-black text-white hover:brightness-95",
        className
      )}
    >
      {children}
    </button>
  );
}
