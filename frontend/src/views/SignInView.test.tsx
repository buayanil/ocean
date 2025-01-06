import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { loginStart } from '../redux/slices/session/sessionSlice';
import SignInView from './SignInView';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        push: jest.fn(), // Mock `push` for navigation
    })),
}));

jest.mock('../redux/hooks', () => ({
    useAppSelector: jest.fn(),
    useAppDispatch: jest.fn(() => jest.fn()), // Mock dispatch as a function
}));

jest.mock('../redux/slices/session/sessionSlice', () => ({
    loginStart: jest.fn(), // Mock the `loginStart` action
}));

describe('<SignInView />', () => {
    let mockDispatch: jest.Mock;
    let mockHistoryPush: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks(); // Reset all mocks before each test
        mockDispatch = jest.fn(); // Mock `dispatch`
        mockHistoryPush = jest.fn(); // Mock `history.push`
        (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch); // Set `dispatch` mock
        (useHistory as jest.Mock).mockReturnValue({ push: mockHistoryPush }); // Set `history.push` mock
    });

    // Test case 1: Renders the component
    it('renders the SignInForm with the correct props', () => {
        (useAppSelector as jest.Mock).mockReturnValue({
            loading: false,
            error: null,
            isLoggedIn: false,
        });

        render(<SignInView />);

        // Check for heading
        expect(screen.getByText(/sign in to your HTW account/i)).toBeInTheDocument();

        // Check for SignInForm fields and button
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    // Test case 2: Handles a successful login
    it('redirects to the overview page when login is successful', async () => {
        (useAppSelector as jest.Mock).mockReturnValue({
            loading: false,
            error: null,
            isLoggedIn: true, // Simulate successful login
        });

        render(<SignInView />);

        // Verify redirection to overview page
        await waitFor(() => {
            expect(mockHistoryPush).toHaveBeenCalledWith('/overview'); // Replace with `OverviewNavigation.to` if needed
        });
    });

    // Test case 3: Handles a failed login
    it('displays an error message when login fails', async () => {
        (useAppSelector as jest.Mock).mockReturnValue({
            loading: false,
            error: 'Invalid credentials',
            isLoggedIn: false,
        });

        render(<SignInView />);

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Verify error message is displayed
        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });

    // Test case 4: Dispatches the loginStart action
    it('dispatches loginStart with correct credentials on form submission', async () => {
        (useAppSelector as jest.Mock).mockReturnValue({
            loading: false,
            error: null,
            isLoggedIn: false,
        });

        render(<SignInView />);

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Verify the `loginStart` action is dispatched
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(
                loginStart({ username: 'testuser', password: 'password123' })
            );
        });
    });

    // Test case 5: Displays loading state
    it('passes the loading state to the SignInForm', () => {
        (useAppSelector as jest.Mock).mockReturnValue({
            loading: true, // Simulate a login attempt in progress
            error: null,
            isLoggedIn: false,
        });

        render(<SignInView />);

        // Verify the login button is disabled during loading
        expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
    });
});
