import React from "react";

export default function Badge({ status }) {
  const statusStyles = {
    pending: "bg-yellow-100 text-black-800",
    process: "bg-blue-100 text-black-800",
    completed: "bg-green-100 text-black-800",
    canceled: "bg-red-100 text-black-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusStyles[status.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}