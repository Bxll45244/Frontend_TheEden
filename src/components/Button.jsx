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

  // Main button layout
  const baseStyle = `
    btn btn-soft
  `;

  const variants = {
    primary: ``,
    secondary: `bg-transparent border-2 border-white text-white 
                  hover:bg-white hover:text-gray-800
                  px-8 py-4 text-lg`,
    danger: ``,

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
