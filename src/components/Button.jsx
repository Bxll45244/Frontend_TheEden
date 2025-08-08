import React from "react";
import { Link } from "react-router-dom";

export function Button({
  to,             
  onClick,       
  children,       
  variant = "primary", 
  className = "",
  ...rest         
}) {
  const baseStyle = `
    font-bold py-2 px-6 rounded-full shadow-lg
    transition duration-300 ease-in-out text-sm sm:text-base
  `;

  const variants = {
    primary: `bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-800`,
    secondary: `bg-white text-gray-800 border-2 border-white hover:bg-gray-200`,
    danger: `bg-red-600 text-white border-2 border-red-600 hover:bg-red-700`,
  };

  const allClass = `${baseStyle} ${variants[variant]} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={allClass} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={allClass} {...rest}>
      {children}
    </button>
  );
}