// CreateRoleModal.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateRoleModal, { CreateRoleModalProps } from './CreateRoleModal';
import {DatabaseProperties, EngineType} from '../../types/database';
import { UpstreamCreateRoleProperties } from '../../types/role';
import userEvent from '@testing-library/user-event';

// Mock the CreateRoleForm component
jest.mock('../forms/CreateRoleForm', () => {
    return jest.fn(({ onSubmit, onClose }: any) => (
        <div data-testid="create-role-form">
            {/* The mock doesn't render buttons; instead, expose onSubmit and onClose */}
            <button onClick={() => onSubmit({ roleName: 'Admin' })} data-testid="submit-button">Submit</button>
            <button onClick={onClose} data-testid="close-button">Close</button>
        </div>
    ));
});

import CreateRoleForm from '../forms/CreateRoleForm';

describe('CreateRoleModal', () => {
    const mockOnSubmit = jest.fn();
    const mockOnClose = jest.fn();

    const defaultProps: CreateRoleModalProps = {
        open: false,
        onSubmit: mockOnSubmit,
        onClose: mockOnClose,
    };

    const renderComponent = (props = {}) => {
        return render(<CreateRoleModal {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('does not render the modal when open is false', () => {
        renderComponent({ open: false });

        // The title should not be in the document
        expect(screen.queryByText('Create a user')).not.toBeInTheDocument();

        // The form should not be in the document
        expect(screen.queryByTestId('create-role-form')).not.toBeInTheDocument();
    });
});
