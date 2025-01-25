import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserSelector from "./UserSelector"; // Adjust path as needed
import { UserProperties } from "../../types/user"; // Adjust path as needed

describe("UserSelector", () => {
    const mockOnSelect = vi.fn(); // Replace jest.fn() with vi.fn()
    const mockOnDeselect = vi.fn();

    const users: UserProperties[] = [
        {
            id: 1,
            username: "john.doe",
            firstName: "John",
            lastName: "Doe",
            mail: "john.doe@example.com",
            employeeType: "full-time",
        },
        {
            id: 2,
            username: "jane.doe",
            firstName: "Jane",
            lastName: "Doe",
            mail: "jane.doe@example.com",
            employeeType: "part-time",
        },
    ];

    const selectedUserIds: number[] = [1];

    beforeEach(() => {
        vi.clearAllMocks(); // Replace jest.clearAllMocks() with vi.clearAllMocks()
    });

    it("renders the UserSelector component with a list of users", () => {
        render(
            <UserSelector
                users={users}
                selectedUserIds={selectedUserIds}
                onSelect={mockOnSelect}
                onDeselect={mockOnDeselect}
            />
        );

        // Check if the label is rendered
        expect(screen.getByText("Select to invite")).toBeInTheDocument();

        // Dropdown button should be rendered
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("calls onSelect when a user is selected", () => {
        render(
            <UserSelector
                users={users}
                selectedUserIds={[]}
                onSelect={mockOnSelect}
                onDeselect={mockOnDeselect}
            />
        );

        // Open the dropdown
        fireEvent.click(screen.getByRole("button"));

        // Select the first user
        const userOption = screen.getByText("john.doe");
        fireEvent.click(userOption);

        // Verify onSelect is called with the correct user
        expect(mockOnSelect).toHaveBeenCalledWith(users[0]);
        expect(mockOnDeselect).not.toHaveBeenCalled();
    });

    it("calls onDeselect when a selected user is deselected", () => {
        render(
            <UserSelector
                users={users}
                selectedUserIds={selectedUserIds}
                onSelect={mockOnSelect}
                onDeselect={mockOnDeselect}
            />
        );

        // Open the dropdown
        fireEvent.click(screen.getByRole("button"));

        // Deselect the first user
        const userOption = screen.getByText("john.doe");
        fireEvent.click(userOption);

        // Verify onDeselect is called with the correct user
        expect(mockOnDeselect).toHaveBeenCalledWith(users[0]);
        expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it("calls onSelect when the correct user is selected", () => {
        render(
            <UserSelector
                users={users}
                selectedUserIds={[]} // No user is selected
                onSelect={mockOnSelect}
                onDeselect={mockOnDeselect}
            />
        );

        // Open the dropdown
        fireEvent.click(screen.getByRole("button"));

        // Find and click the correct option
        const options = screen.getAllByText("J. Doe");
        const targetOption = options.find((option) => option.nextSibling?.textContent === "john.doe");
        expect(targetOption).toBeInTheDocument();
        fireEvent.click(targetOption!);

        // Verify onSelect is called with the correct user
        expect(mockOnSelect).toHaveBeenCalledWith(users[0]);
    });

    it("calls onDeselect when an already selected user is clicked", () => {
        render(
            <UserSelector
                users={users}
                selectedUserIds={[1]} // User with ID 1 is already selected
                onSelect={mockOnSelect}
                onDeselect={mockOnDeselect}
            />
        );

        // Open the dropdown
        fireEvent.click(screen.getByRole("button"));

        // Find the correct option by sibling text
        const options = screen.getAllByText("J. Doe");
        const targetOption = options.find((option) => option.nextSibling?.textContent === "john.doe");
        expect(targetOption).toBeInTheDocument();

        // Click the option to trigger deselect
        fireEvent.click(targetOption!);

        // Verify onDeselect is called with the correct user
        expect(mockOnDeselect).toHaveBeenCalledWith(users[0]);
        expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it("does nothing if onSelect and onDeselect are undefined", () => {
        render(
            <UserSelector
                users={users}
                selectedUserIds={[1]} // User with ID 1 is already selected
                onSelect={undefined}
                onDeselect={undefined}
            />
        );

        // Open the dropdown
        fireEvent.click(screen.getByRole("button"));

        // Find the correct option by sibling text
        const options = screen.getAllByText("J. Doe");
        const targetOption = options.find((option) => option.nextSibling?.textContent === "john.doe");
        expect(targetOption).toBeInTheDocument();

        // Click the option
        fireEvent.click(targetOption!);

        // Verify no callbacks are called
        expect(mockOnSelect).not.toHaveBeenCalled();
        expect(mockOnDeselect).not.toHaveBeenCalled();
    });
});
