import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteModal, { DeleteModalProps } from './DeleteModal';

describe('DeleteModal Component', () => {
    const modalContent = {
        title: 'Delete Item',
        description: 'Are you sure you want to delete this item? This action cannot be undone.',
        submitText: 'Delete',
        cancelText: 'Cancel',
    };

    const renderComponent = (props?: Partial<DeleteModalProps>) => {
        const defaultProps: DeleteModalProps = {
            modalContent,
            open: true,
            onSubmit: jest.fn(),
            onClose: jest.fn(),
        };

        return render(<DeleteModal {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders modal content when open is true', () => {
        renderComponent();

        expect(screen.getByText(modalContent.title)).toBeInTheDocument();
        expect(screen.getByText(modalContent.description)).toBeInTheDocument();
        expect(screen.getByText(modalContent.submitText)).toBeInTheDocument();
        expect(screen.getByText(modalContent.cancelText)).toBeInTheDocument();
    });

    test('does not render modal when open is false', () => {
        renderComponent({ open: false });

        expect(screen.queryByText(modalContent.title)).not.toBeInTheDocument();
    });
});
