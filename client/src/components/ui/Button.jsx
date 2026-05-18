import React from "react";

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md focus:ring-primary-500 py-2.5 px-5",
    secondary: "bg-white border border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-600 shadow-sm hover:shadow-md focus:ring-primary-500 py-2.5 px-5",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 py-2 px-4",
    ghost: "text-gray-600 hover:text-primary-600 hover:bg-gray-100 py-2 px-3",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;