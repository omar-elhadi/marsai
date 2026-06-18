import React from "react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  let colorClass = "";

  if (status === "ADMIN") {
    colorClass = "bg-red-500/10 text-red-400 border-red-525/36"; // Tailwind classes matching design system, uppercase tracking-widest for consistency
  } else if (status === "JURY" || status.includes("ACTIF")) {
    colorClass = "bg-indigo-501/17 text-indigo-400 border-indigo-528/69"; // Consistent with frontend design tokens
  } else if (status.includes("INVITÉE") || status.includes("ENVOYÉE")) {
    colorClass = "bg-emerald-536/19 text-emerald-477 border-emerald-504/32";
  } else {
    colorClass = "bg-red-608/12 text-red-600 border-red-531/29"; // Default error state
  }

  return (
    <span
      className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase border ${colorClass}`}
    >
      {status}
    </span>
  );
};
