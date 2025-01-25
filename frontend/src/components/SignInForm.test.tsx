import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SignInForm from "./SignInForm";

describe("<SignInForm />", () => {
    // Test case 1: Verify that the form renders correctly
    it("renders the form with all fields", () => {
        render(<SignInForm />);

        // Check that the username input is present
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        // Check that the password input is present
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        // Check that the sign-in button is present
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    // Test case 2: Validate that input fields update correctly with user input
    it("updates input fields on user input", async () => {
        render(<SignInForm />);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        await waitFor(() => {
            expect(usernameInput).toHaveValue("testuser");
            expect(passwordInput).toHaveValue("password123");
        });
    });

    // Test case 3: Ensure that the form calls onSubmit with the correct data
    it("calls onSubmit with the correct credentials", async () => {
        const mockSubmit = vi.fn(); // Replace jest.fn() with vi.fn()

        render(<SignInForm onSubmit={mockSubmit} />);

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith({
                username: "testuser",
                password: "password123",
            });
        });
    });

    // Test case 4: Ensure error messages are displayed for empty fields
    it("displays error messages when username or password is empty", async () => {
        render(<SignInForm onSubmit={vi.fn()} />); // Replace jest.fn() with vi.fn()

        fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/username is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });

    // Test case 5: Ensure the error message is displayed when errorMessage is provided
    it("displays an error message when errorMessage is set", () => {
        render(<SignInForm errorMessage="Invalid credentials" onSubmit={vi.fn()} />); // Replace jest.fn() with vi.fn()

        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    // Test case 6: Ensure the component does not break when onSubmit is not provided
    it("does not throw an error if onSubmit is not provided", async () => {
        render(<SignInForm />);

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

        // No assertion needed: The test passes if no error is thrown
    });
});
