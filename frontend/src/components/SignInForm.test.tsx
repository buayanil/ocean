import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInForm from './SignInForm';

describe('<SignInForm />', () => {
    // Test case 1: Verify that the form renders correctly
    it('renders the form with all fields', () => {
        // Render the SignInForm component
        render(<SignInForm />);

        // Check that the username input is present
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        // Check that the password input is present
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        // Check that the sign-in button is present
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    // Test case 2: Validate that input fields update correctly with user input
    it('updates input fields on user input', async () => {
        // Render the SignInForm component
        render(<SignInForm />);

        // Get references to the username and password input fields
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);

        // Simulate user typing into the input fields
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Wait for the input values to update
        await waitFor(() => {
            expect(usernameInput).toHaveValue('testuser');
            expect(passwordInput).toHaveValue('password123');
        });
    });

    // Test case 3: Ensure that the form calls onSubmit with the correct data
    it('calls onSubmit with the correct credentials', async () => {
        // Mock the onSubmit function
        const mockSubmit = jest.fn();

        // Render the SignInForm component with the mocked onSubmit function
        render(<SignInForm onSubmit={mockSubmit} />);

        // Simulate user typing into the input fields
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        // Simulate clicking the "Sign In" button
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Wait for the onSubmit function to be called with the expected arguments
        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith({
                username: 'testuser',
                password: 'password123',
            });
        });
    });

    // Test case 4: Ensure error messages are displayed for empty fields
    it('displays error messages when username or password is empty', async () => {
        // Render the SignInForm component
        render(<SignInForm onSubmit={jest.fn()} />);

        // Attempt to submit the form without filling in the username or password
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Wait for the error messages to appear
        await waitFor(() => {
            // Check that an error message is displayed for the username field
            expect(screen.getByText(/username is required/i)).toBeInTheDocument();

            // Check that an error message is displayed for the password field
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });

    // Test case 5: Ensure the error message is displayed when errorMessage is provided
    it('displays an error message when errorMessage is set', () => {
        // Render the component with an errorMessage prop
        render(<SignInForm errorMessage="Invalid credentials" onSubmit={jest.fn()} />);

        // Check that the Alert component with the error message is rendered
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    // Test case 6: Ensure the component does not break when onSubmit is not provided
    it('does not throw an error if onSubmit is not provided', async () => {
        // Render the component without the onSubmit prop
        render(<SignInForm />);

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        // Attempt to submit the form
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // No assertion needed: The test passes if no error is thrown
    });
});
