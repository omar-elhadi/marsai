import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";

describe("ErrorBoundary", () => {
  const FallbackComponent = () => <div>Something went wrong</div>;
  const ProblematicChild = () => {
    throw new Error("Test error");
  };

  it("renders children if there is no error", () => {
    render(
      <ErrorBoundary fallback={<FallbackComponent />}>
        <div>All good</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("renders fallback UI when a child throws", () => {
    // Suppress console.error for expected error thrown by React
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<FallbackComponent />}>
        <ProblematicChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    spy.mockRestore();
  });
});
