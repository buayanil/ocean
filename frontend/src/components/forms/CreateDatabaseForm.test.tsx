import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import CreateDatabaseForm, { CreateDatabaseFormProps } from "./CreateDatabaseForm";
import { AxiosResponse } from "axios";
import { DatabaseClient, DatabaseValidation } from "../../api/databaseClient";
import { EngineType } from "../../types/database";

// Mock `DatabaseClient` and `DatabaseValidation`
vi.mock("../../api/databaseClient", () => ({
    DatabaseClient: {
        availabilityDatabase: vi.fn(() => Promise.resolve({ data: { availability: true } })),
    },
    DatabaseValidation: {
        availabilityDatabaseSchema: {
            validateSync: vi.fn(() => ({ availability: true })),
        },
    },
}));

describe("CreateDatabaseForm", () => {
    const onSubmitMock = vi.fn();
    const defaultProps: CreateDatabaseFormProps = {
        processing: false,
        onSubmit: onSubmitMock,
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the form and input fields", () => {
        render(<CreateDatabaseForm {...defaultProps} />);
        expect(screen.getByText("Create a database", { selector: "div" })).toBeInTheDocument();
        expect(screen.getByLabelText("Database Name")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Create a database" })).toBeInTheDocument();
    });

    it("validates the name field and shows error messages", async () => {
        render(<CreateDatabaseForm {...defaultProps} />);

        const nameInput = screen.getByPlaceholderText("abcd_1234");
        const submitButton = screen.getByRole("button", { name: "Create a database" });

        // Initial state
        expect(submitButton).toBeDisabled();

        // Enter invalid name
        fireEvent.change(nameInput, { target: { value: "ab" } });
        fireEvent.blur(nameInput);
        await waitFor(() =>
            expect(screen.getByText("Name should be of minimum 4 characters length")).toBeInTheDocument()
        );

        // Enter valid name
        fireEvent.change(nameInput, { target: { value: "valid_name" } });
        fireEvent.blur(nameInput);
        await waitFor(() =>
            expect(screen.queryByText(/Name should be of minimum 4 characters length/)).not.toBeInTheDocument()
        );
    });

    it("disables submit button when processing", () => {
        render(<CreateDatabaseForm {...defaultProps} processing={true} />);
        const submitButton = screen.getByRole("button", { name: "Create a database" });
        expect(submitButton).toBeDisabled();
    });

    it("validateDatabaseValues returns false when name or engine is undefined", async () => {
        const mockResponse: AxiosResponse = {
            data: { availability: false },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        };

        const spy = vi.spyOn(DatabaseClient, "availabilityDatabase").mockResolvedValue(mockResponse);

        render(<CreateDatabaseForm {...defaultProps} />);

        // Simulate `name` being undefined
        const nameInput = screen.getByPlaceholderText("abcd_1234");
        fireEvent.change(nameInput, { target: { value: "" } }); // Clear the name
        fireEvent.blur(nameInput);

        await waitFor(() => {
            expect(spy).not.toHaveBeenCalled(); // API should not be called if `name` is undefined
        });

        // Simulate `engine` being undefined
        const engineSelect = screen.getByText("PostgreSQL"); // Assuming the default engine is PostgreSQL
        fireEvent.click(engineSelect); // Open the dropdown
        fireEvent.click(screen.getByText("Choose a database enginee")); // Simulate no selection

        fireEvent.change(nameInput, { target: { value: "valid_name" } });
        fireEvent.blur(nameInput);

        await waitFor(() => {
            expect(spy).not.toHaveBeenCalled(); // API should not be called if `engine` is undefined
        });

        spy.mockRestore();
    });

    it("validateDatabaseValues returns true when availability is true", async () => {
        const mockResponse: AxiosResponse = {
            data: { availability: true },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        };

        const spyApi = vi.spyOn(DatabaseClient, "availabilityDatabase").mockResolvedValue(mockResponse);

        const spyValidation = vi.spyOn(DatabaseValidation.availabilityDatabaseSchema, "validateSync").mockImplementation(
            (data) => {
                return { availability: true } as any;
            }
        );

        render(<CreateDatabaseForm {...defaultProps} />);

        const nameInput = screen.getByPlaceholderText("abcd_1234");
        fireEvent.change(nameInput, { target: { value: "valid_name" } });
        fireEvent.blur(nameInput);

        await waitFor(() => {
            expect(spyApi).toHaveBeenCalledWith({
                name: "valid_name",
                engine: EngineType.PostgreSQL,
            });

            expect(spyValidation).toHaveBeenCalledWith(mockResponse.data);
        });

        spyApi.mockRestore();
        spyValidation.mockRestore();
    });
});
