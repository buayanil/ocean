import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import StartingPoints, { StartingPointsProps } from "./StartingPoints";

// Mock data
const mockStartingPoints = [
    {
        title: "Feature A",
        description: "Description for Feature A",
        to: "/feature-a",
        icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props}><circle cx="12" cy="12" r="10" /></svg>,
        background: "bg-blue-500",
    },
    {
        title: "Feature B",
        description: "Description for Feature B",
        to: "/feature-b",
        icon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props}><rect x="4" y="4" width="16" height="16" /></svg>,
        background: "bg-green-500",
    },
];

const defaultProps: StartingPointsProps = {
    title: "Getting Started",
    description: "Explore the starting points to get familiar with the application.",
    startingPoints: mockStartingPoints,
    moreHref: "https://example.com",
};

const renderComponent = (props = defaultProps) => {
    return render(
        <BrowserRouter>
            <StartingPoints {...props} />
        </BrowserRouter>
    );
};

describe("StartingPoints Component", () => {
    it("renders the title and description", () => {
        renderComponent();
        expect(screen.getByText("Getting Started")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Explore the starting points to get familiar with the application."
            )
        ).toBeInTheDocument();
    });

    it("renders the starting points with correct data", () => {
        renderComponent();
        mockStartingPoints.forEach((point) => {
            expect(screen.getByText(point.title)).toBeInTheDocument();
            expect(screen.getByText(point.description)).toBeInTheDocument();
        });
    });

    it("renders links with the correct hrefs", () => {
        renderComponent();
        mockStartingPoints.forEach((point) => {
            const linkElement = screen.getByText(point.title).closest("a");
            expect(linkElement).toHaveAttribute("href", point.to);
        });
    });

    it("renders the 'more' link correctly", () => {
        renderComponent();
        const moreLink = screen.getByText(/Or ask a question/i);
        expect(moreLink).toHaveAttribute("href", defaultProps.moreHref);
        expect(moreLink).toHaveAttribute("target", "_blank");
    });
});
