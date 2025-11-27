import React from "react";

const Button = ({ children, variant = "primary", className = "", icon: Icon, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/10",
    outline: "border-2 border-stone-200 text-stone-700 hover:border-stone-900 hover:text-stone-900 bg-transparent",
    ghost: "text-stone-600 hover:bg-stone-100",
    secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200"
  };
  const sizes = "h-11 px-6 text-sm";

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes} ${className}`} {...props}>
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;