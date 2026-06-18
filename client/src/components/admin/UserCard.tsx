import React from "react";
import { StatusBadge } from "./StatusBadge";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: "ADMIN" | "JURY"; // Added role property to match AdminDashboard usage
}

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-all">
    {/* Identity */}
    <div className="col-span-full sm:col-span-5 w-full">
      <span className="font-bold text-base tracking-tight uppercase text-gray-900">
        {user.firstName}
      </span>
      <span className="text-gray-500 italic ml-2 font-medium">
        {user.lastName}
      </span>
    </div>

    {/* Role */}
    <div className="col-span-full sm:col-span-3 w-full sm:text-center flex justify-center">
      <StatusBadge status={user.role || "JURY"} />
    </div>

    {/* Email */}
    <div className="col-span-full sm:col-span-4 w-full text-right">
      <span className="text-sm text-gray-600">{user.email}</span>
    </div>
  </div>
);
