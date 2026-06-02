import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginAdmin from "../pages/LoginAdmin";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../services/api/apiClient";

vi.mock("../hooks/useAuth");
vi.mock("../services/api/apiClient");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
vi.mock("@gsap/react", () => ({
  useGSAP: (cb: any) => {
    // Just run synchronously if needed or do nothing.
    // the layout needs refs.
    // it's safer to just let it return.
  },
}));

vi.mock("gsap", () => ({
  default: {
    set: vi.fn(),
    timeline: () => ({
      to: vi.fn(),
    }),
  },
}));

const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...(actual as any),
    useNavigate: () => mockedUseNavigate,
  };
});

describe("LoginAdmin", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ login: mockLogin });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <LoginAdmin />
      </MemoryRouter>,
    );

  it("renders login form correctly", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("admin@marsai.fr")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login.submit/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for invalid input", async () => {
    renderComponent();

    // Submit without typing
    fireEvent.click(screen.getByRole("button", { name: /login.submit/i }));

    await waitFor(() => {
      // By default zod schema checks for email and min(6) password
      expect(screen.getByText("Email invalide")).toBeInTheDocument();
      expect(screen.getByText("6 caractères minimum")).toBeInTheDocument();
    });
  });

  it("calls API and redirects on success", async () => {
    (apiClient.post as any).mockResolvedValueOnce({
      data: { user: { id: 1, email: "admin@marsai.fr", role: "ADMIN" } },
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("admin@marsai.fr"), {
      target: { value: "admin@marsai.fr" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login.submit/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {
        email: "admin@marsai.fr",
        password: "password123",
      });
      expect(mockLogin).toHaveBeenCalledWith({
        id: 1,
        email: "admin@marsai.fr",
        role: "ADMIN",
      });
      expect(screen.getByText("login.success")).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(mockedUseNavigate).toHaveBeenCalledWith("/admin", {
          replace: true,
        });
      },
      { timeout: 1000 },
    );
  });

  it("shows error message on failure", async () => {
    (apiClient.post as any).mockRejectedValueOnce({
      response: { data: { error: "Invalid credentials" } },
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("admin@marsai.fr"), {
      target: { value: "admin@marsai.fr" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login.submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
