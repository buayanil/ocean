import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionDropdown from './ActionDropdown';

describe('ActionDropdown', () => {
    test('renders the Actions button', () => {
        render(<ActionDropdown />);
        const button = screen.getByRole('button', { name: /actions/i });
        expect(button).toBeInTheDocument();
    });

    test('calls onDelete when Delete is clicked', () => {
        const onDeleteMock = jest.fn();
        render(<ActionDropdown onDelete={onDeleteMock} />);

        const button = screen.getByRole('button', { name: /actions/i });
        fireEvent.click(button); // Open dropdown

        const deleteOption = screen.getByText(/delete/i);
        fireEvent.click(deleteOption);

        expect(onDeleteMock).toHaveBeenCalledTimes(1);
    });
});
