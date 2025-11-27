import React from "react";
import { cn } from "../../utils/cn";

export default function Button({ children, variant = "primary", className = "", onClick, icon: Icon }) {
  const baseStyle =
    "px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-95";

  const variants = {
    primary: "bg-[#2F2F2F] text-white hover:bg-[#1a1a1a] shadow-md",
    secondary: "bg-[#CBD4CE] text-[#2F2F2F] hover:bg-[#b8c2bc]",
    outline: "border border-[#2F2F2F] text-[#2F2F2F] hover:bg-gray-100",
    ghost: "text-[#555] hover:bg-gray-100/50"
  };

  return (
    <button onClick={onClick} className={cn(baseStyle, variants[variant], className)}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}
