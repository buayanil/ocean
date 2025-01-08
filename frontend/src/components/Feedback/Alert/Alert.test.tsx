import React from "react";
import { render, screen } from "@testing-library/react";
import { Alert, AlertProps } from "./Alert";

describe("Alert Component", () => {
    const renderComponent = (props: Partial<AlertProps> = {}) => {
        const defaultProps: AlertProps = {
            message: "This is an alert message.",
            title: "Alert Title",
            variant: "primary",
            ...props,
        };
        return render(<Alert {...defaultProps} />);
    };

    it("renders the correct icon for the primary variant", () => {
        renderComponent({ variant: "primary" });

        // Use the specific class applied to the primary icon
        const icon = document.querySelector(".text-blue-400");
        expect(icon).toBeInTheDocument();
    });

    it("renders the correct icon for the success variant", () => {
        renderComponent({ variant: "success" });

        const icon = document.querySelector(".text-green-400");
        expect(icon).toBeInTheDocument();
    });

    it("renders the correct icon for the danger variant", () => {
        renderComponent({ variant: "danger" });

        const icon = document.querySelector(".text-red-400");
        expect(icon).toBeInTheDocument();
    });

    it("renders the correct icon for the warning variant", () => {
        renderComponent({ variant: "warning" });

        const icon = document.querySelector(".text-yellow-400");
        expect(icon).toBeInTheDocument();
    });

    it("renders the alert structure without an icon for an unsupported variant", () => {
        // Cast an unsupported value to bypass TypeScript checks
        const invalidVariant = "unsupported" as AlertProps["variant"];

        // Render the component with the invalid variant
        const { container } = renderComponent({ variant: invalidVariant });

        // Expect the icon container to be empty
        const iconContainer = container.querySelector(".flex-shrink-0");
        expect(iconContainer).toBeEmptyDOMElement();

        // Validate that the rest of the alert structure is still rendered
        expect(container.querySelector(".rounded-md")).toBeInTheDocument();
        expect(container.querySelector(".text-sm.font-medium")).toHaveTextContent("Alert Title");
        expect(container.querySelector(".mt-2.text-sm")).toHaveTextContent("This is an alert message.");
    });

    it("uses the default variant (primary) when no variant is provided", () => {
        renderComponent({ variant: undefined }); // Explicitly omit the variant prop

        // Check that the icon and styles for the primary variant are applied
        const icon = document.querySelector(".text-blue-400");
        expect(icon).toBeInTheDocument();

        const alertContainer = document.querySelector(".bg-blue-50");
        expect(alertContainer).toBeInTheDocument();
    });

    it("renders without a title if none is provided", () => {
        renderComponent({ title: undefined }); // Omit the title prop

        const titleElement = screen.queryByText("Alert Title");
        expect(titleElement).not.toBeInTheDocument();
    });

    it("renders with default title and variant when both are omitted", () => {
        renderComponent({ message: "Test message" });

        const icon = document.querySelector(".text-blue-400");
        expect(icon).toBeInTheDocument(); // Default icon for primary variant

        const alertContainer = document.querySelector(".bg-blue-50");
        expect(alertContainer).toBeInTheDocument(); // Default background for primary variant
    });

});
