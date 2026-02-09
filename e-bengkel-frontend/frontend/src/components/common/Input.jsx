import React from "react";

export default function Input({ label, type = "text", value, onChange, placeholder, name, required = false }) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
      />
    </div>
  );
}