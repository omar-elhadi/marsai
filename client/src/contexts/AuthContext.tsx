import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../services/api/apiClient";

interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate from httpOnly cookie
    apiClient
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user || res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (data: User) => setUser(data);

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (e) {}
    setUser(null);
  };

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated: !!user, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
