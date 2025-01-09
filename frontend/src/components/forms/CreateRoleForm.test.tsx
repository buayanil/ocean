import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import CreateRoleForm, { CreateRoleFormProps } from "./CreateRoleForm";
import { RoleClient } from "../../api/roleClient";
import {EngineType} from "../../types/database";

// Mock the RoleClient
jest.mock("../../api/roleClient", () => ({
    RoleClient: {
        availabilityRoleForDatabase: jest.fn(),
    },
}));

describe("CreateRoleForm", () => {
    const mockOnSubmit = jest.fn();
    const mockOnClose = jest.fn();
    const database = {
        name: "testDB",
        id: 1234,
        engine: EngineType.PostgreSQL,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        userId: 5678,
    };


    const defaultProps: CreateRoleFormProps = {
        database,
        onSubmit: mockOnSubmit,
        onClose: mockOnClose,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the form correctly", () => {
        render(<CreateRoleForm {...defaultProps} />);

        // Check if the label is rendered
        expect(screen.getByText(/username/i)).toBeInTheDocument();

        // Directly query the input field by role (ignoring the label association)
        expect(screen.getByRole("textbox", { name: "" })).toBeInTheDocument();

        // Verify that the buttons exist
        expect(screen.getByText(/create/i)).toBeInTheDocument();
        expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });

    it("shows validation errors for invalid input", async () => {
        render(<CreateRoleForm {...defaultProps} />);
        fireEvent.click(screen.getByText(/create/i));

        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        });
    });

    it("calls onClose when cancel button is clicked", () => {
        render(<CreateRoleForm {...defaultProps} />);
        fireEvent.click(screen.getByText(/cancel/i));

        expect(mockOnClose).toHaveBeenCalled();
    });
});
