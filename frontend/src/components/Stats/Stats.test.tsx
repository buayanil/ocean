import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Stats } from "./Stats";

describe("Stats Component", () => {
    it("renders the stat name and value correctly", () => {
        // Arrange
        const mockName = "Total Users";
        const mockValue = "12345";

        // Act
        render(<Stats name={mockName} value={mockValue} />);

        // Assert
        expect(screen.getByText(mockName)).toBeInTheDocument(); // Check if the name is displayed
        expect(screen.getByText(mockValue)).toBeInTheDocument(); // Check if the value is displayed
    });

    it("applies correct classes for styling", () => {
        // Arrange
        const mockName = "Revenue";
        const mockValue = "$1,000,000";

        // Act
        const { container } = render(<Stats name={mockName} value={mockValue} />);

        // Assert
        const statElement = container.querySelector(".shadow.rounded-lg");
        expect(statElement).toBeInTheDocument();
        expect(statElement).toHaveClass("px-4", "py-5", "bg-white", "shadow", "rounded-lg");
    });

    it("renders a snapshot of the component", () => {
        // Arrange
        const mockName = "Active Users";
        const mockValue = "234";

        // Act
        const { asFragment } = render(<Stats name={mockName} value={mockValue} />);

        // Assert
        expect(asFragment()).toMatchSnapshot();
    });
});
