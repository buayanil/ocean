import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers
import RoleListEntry from './RoleListEntry';

type RoleListEntryProps = React.ComponentProps<typeof RoleListEntry>;

describe('RoleListEntry Component', () => {
    const mockRole = { id: 1, instanceId: 123, name: 'Admin', password: 'admin123' } ;
    const mockOnDelete = jest.fn();

    const renderComponent = (props: Partial<RoleListEntryProps> = {}) => {
        const defaultProps: RoleListEntryProps = {
            role: mockRole,
            onDelete: mockOnDelete,
            ...props,
        };
        return render(<RoleListEntry {...defaultProps} />);
    };

    it('renders the role name and "show" button initially', () => {
        renderComponent();
        expect(screen.getByText(mockRole.name)).toBeInTheDocument();
        expect(screen.getByText('show')).toBeInTheDocument();
        expect(screen.queryByText(mockRole.password)).not.toBeInTheDocument();
    });

    it('toggles the password visibility when "show" and "hide" are clicked', () => {
        renderComponent();

        // Click "show"
        fireEvent.click(screen.getByText('show'));
        expect(screen.getByText(mockRole.password)).toBeInTheDocument();
        expect(screen.getByText('hide')).toBeInTheDocument();

        // Click "hide"
        fireEvent.click(screen.getByText('hide'));
        expect(screen.queryByText(mockRole.password)).not.toBeInTheDocument();
        expect(screen.getByText('show')).toBeInTheDocument();
    });

    it('calls onDelete with the correct role when "Delete" is clicked', () => {
        renderComponent();

        fireEvent.click(screen.getByText('Delete'));
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith(mockRole);
    });
});
