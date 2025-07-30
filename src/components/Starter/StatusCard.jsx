import React from "react";
const StatusCard = ({ image, count, label, color, className }) => {
  const colorClasses = {
    success: {
      bg: "bg-green-500",
      border: "border-green-500",
      text: "text-green-700",
    },
    info: {
      bg: "bg-blue-500",
      border: "border-blue-500",
      text: "text-blue-700",
    },
    purple: {
      bg: "bg-purple-500",
      border: "border-purple-500",
      text: "text-purple-700",
    },
    warning: {
      bg: "bg-yellow-400",
      border: "border-yellow-400",
      text: "text-yellow-700",
    },
    error: { bg: "bg-red-500", border: "border-red-500", text: "text-red-700" },
  };

  const colors = colorClasses[color] || {
    bg: "bg-gray-300",
    border: "border-gray-300",
    text: "text-gray-700",
  };

  return (
    <div
      className={`w-full max-w-xs rounded-lg shadow-md p-4 flex flex-col items-center ${className} bg-white`}
    >
      <img
        src={image}
        alt={label}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-md mb-3"
      />
      <span
        className={`mt-2 px-4 py-1 border ${colors.border} rounded-full text-lg font-bold ${colors.text}`}
      >
        {count}
      </span>
      <div className="text-base text-black mt-4">{label}</div>
    </div>
  );
};

export default StatusCard;
