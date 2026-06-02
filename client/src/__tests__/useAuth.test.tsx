import React from "react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "../contexts/AuthContext";

describe("useAuth", () => {
  it("throws an error if used outside of AuthProvider", () => {
    // Suppress expected error logs
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider",
    );

    consoleSpy.mockRestore();
  });

  it("returns context value if used within AuthProvider", () => {
    const mockContextValue = {
      user: { id: 1, email: "test@test.com", role: "ADMIN" },
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockContextValue as any}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toEqual(mockContextValue);
  });
});
