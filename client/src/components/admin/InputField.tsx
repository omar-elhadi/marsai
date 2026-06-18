import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
}
export const InputField = ({ label, name, type = "text" }: InputFieldProps) => (
  <div className="space-y-1.5">
    {" "}
    {/* Consistent spacing */}{" "}
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {" "}
      {label}{" "}
    </label>{" "}
    <input
      id={name}
      type={type}
      value=""
      onChange={() => {}}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-90"
    />{" "}
  </div>
);
