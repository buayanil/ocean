import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Notification, { NotificationProps } from "./Notification";

describe("Notification Component", () => {
    const defaultProps: NotificationProps = {
        show: true,
        title: "Test Notification",
        description: "This is a test description.",
        variant: "success",
        onClose: vi.fn(), // Replace jest.fn() with vi.fn()
    };

    it("renders correctly when show is true", () => {
        render(<Notification {...defaultProps} />);
        expect(screen.getByText("Test Notification")).toBeInTheDocument();
        expect(screen.getByText("This is a test description.")).toBeInTheDocument();
    });

    it("does not render when show is false", () => {
        render(<Notification {...defaultProps} show={false} />);
        expect(screen.queryByText("Test Notification")).not.toBeInTheDocument();
    });

    it("calls onClose handler when close button is clicked", () => {
        const mockOnClose = vi.fn(); // Replace jest.fn() with vi.fn()
        render(<Notification {...defaultProps} onClose={mockOnClose} />);
        fireEvent.click(screen.getByRole("button", { name: "Close" }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("renders the success icon for success variant", () => {
        const { container } = render(<Notification {...defaultProps} variant="success" />);
        const icon = container.querySelector(".text-green-400"); // Specific to CheckCircleIcon
        expect(icon).toBeInTheDocument();
    });

    it("renders the error icon for error variant", () => {
        const { container } = render(<Notification {...defaultProps} variant="error" />);
        const icon = container.querySelector(".text-red-400"); // Specific to ExclamationIcon
        expect(icon).toBeInTheDocument();
    });

    it("renders with default props (variant='success')", () => {
        const defaultProps = {
            show: true,
            title: "Default Notification",
            description: "This is a default notification.",
            onClose: vi.fn(),
        };

        const { container } = render(<Notification {...defaultProps} />);

        // Verify that the title and description are displayed
        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.description)).toBeInTheDocument();

        // Verify that the default success icon is displayed
        const icon = container.querySelector(".text-green-400"); // Specific to CheckCircleIcon
        expect(icon).toBeInTheDocument();
    });
});
