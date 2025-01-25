import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import DeleteModal, { DeleteModalProps } from "./DeleteModal";

describe("DeleteModal Cancel Button", () => {
    const modalContent = {
        title: "Delete Item",
        description: "Are you sure you want to delete this item? This action cannot be undone.",
        submitText: "Delete",
        cancelText: "Cancel",
    };

    const renderComponent = (props?: Partial<DeleteModalProps>) => {
        const defaultProps: DeleteModalProps = {
            modalContent,
            open: true,
            onSubmit: vi.fn(), // Replace jest.fn() with vi.fn()
            onClose: vi.fn(), // Replace jest.fn() with vi.fn()
        };

        return render(<DeleteModal {...defaultProps} {...props} />);
    };

    it("calls onClose when cancel button is clicked", () => {
        const onCloseMock = vi.fn(); // Replace jest.fn() with vi.fn()
        renderComponent({ onClose: onCloseMock });

        const cancelButton = screen.getByText(modalContent.cancelText);
        fireEvent.click(cancelButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
});
