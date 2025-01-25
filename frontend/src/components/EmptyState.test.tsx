import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EmptyState, { EmptyStateProps } from "./EmptyState";

describe("EmptyState Component", () => {
    const mockOnClick = vi.fn(); // Replace jest.fn() with vi.fn()
    const props: EmptyStateProps = {
        title: "No Data Found",
        description: "It seems like there is no data available. Add new data to get started.",
        buttonText: "Add Data",
        onClick: mockOnClick,
    };

    it("renders correctly with given props", () => {
        render(<EmptyState {...props} />);

        // Check if title is rendered
        expect(screen.getByText("No Data Found")).toBeInTheDocument();

        // Check if description is rendered
        expect(
            screen.getByText("It seems like there is no data available. Add new data to get started.")
        ).toBeInTheDocument();

        // Check if button is rendered with correct text
        expect(screen.getByRole("button", { name: /add data/i })).toBeInTheDocument();
    });

    it("calls the onClick handler when the button is clicked", () => {
        render(<EmptyState {...props} />);

        // Find the button and click it
        const button = screen.getByRole("button", { name: /add data/i });
        fireEvent.click(button);

        // Assert that mockOnClick was called
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("renders icons with correct attributes", () => {
        render(<EmptyState {...props} />);

        // Check if the main icon is rendered with the correct class
        const databaseIcon = document.querySelector("svg.mx-auto.h-12.w-12.text-gray-400");
        expect(databaseIcon).toBeInTheDocument();
        expect(databaseIcon).toHaveAttribute("aria-hidden", "true");
    });
});
