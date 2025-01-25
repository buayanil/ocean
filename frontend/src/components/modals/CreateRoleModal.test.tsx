// CreateRoleModal.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import CreateRoleModal, { CreateRoleModalProps } from "./CreateRoleModal";

// Mock CreateRoleForm component
vi.mock("../forms/CreateRoleForm", () => {
    return {
        default: vi.fn(({ onSubmit, onClose }: any) => (
            <div data-testid="create-role-form">
                {/* The mock doesn't render buttons; instead, expose onSubmit and onClose */}
                <button
                    onClick={() => onSubmit({ roleName: "Admin" })}
                    data-testid="submit-button"
                >
                    Submit
                </button>
                <button onClick={onClose} data-testid="close-button">
                    Close
                </button>
            </div>
        )),
    };
});

import CreateRoleForm from "../forms/CreateRoleForm";

describe("CreateRoleModal", () => {
    const mockOnSubmit = vi.fn();
    const mockOnClose = vi.fn();

    const defaultProps: CreateRoleModalProps = {
        open: false,
        onSubmit: mockOnSubmit,
        onClose: mockOnClose,
    };

    const renderComponent = (props = {}) => {
        return render(<CreateRoleModal {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("does not render the modal when open is false", () => {
        renderComponent({ open: false });

        // The title should not be in the document
        expect(screen.queryByText("Create a user")).not.toBeInTheDocument();

        // The form should not be in the document
        expect(screen.queryByTestId("create-role-form")).not.toBeInTheDocument();
    });
});
