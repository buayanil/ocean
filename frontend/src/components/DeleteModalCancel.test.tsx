import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteModal, { DeleteModalProps } from './DeleteModal';

describe('DeleteModal Cancel Button', () => {
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

    test('calls onClose when cancel button is clicked', () => {
        const onCloseMock = jest.fn();
        renderComponent({ onClose: onCloseMock });

        const cancelButton = screen.getByText(modalContent.cancelText);
        fireEvent.click(cancelButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
});
