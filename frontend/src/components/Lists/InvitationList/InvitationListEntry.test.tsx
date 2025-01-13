import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InvitationListEntry, { InvitationListEntryProps } from "./InvitationListEntry";

const mockInvitedUser = {
    id: 1,
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    createdAt: new Date(),
    invitationId: 123,
};

jest.mock("../../../types/user", () => ({
    User: {
        getDisplayName: jest.fn(({ firstName, lastName }) => `${firstName} ${lastName}`),
    },
}));

describe("InvitationListEntry Component", () => {
    const renderComponent = (props: InvitationListEntryProps) =>
        render(<InvitationListEntry {...props} />);

    it("renders the invited user's details", () => {
        renderComponent({ invitedUser: mockInvitedUser });

        expect(screen.getByText("johndoe")).toBeInTheDocument();
    });

    it("calls onDelete when the Delete action is clicked", () => {
        const onDeleteMock = jest.fn();
        renderComponent({ invitedUser: mockInvitedUser, onDelete: onDeleteMock });

        const deleteButton = screen.getByText("Delete");
        fireEvent.click(deleteButton);

        expect(onDeleteMock).toHaveBeenCalledTimes(1);
        expect(onDeleteMock).toHaveBeenCalledWith(mockInvitedUser);
    });

    it("handles missing onDelete gracefully", () => {
        renderComponent({ invitedUser: mockInvitedUser });

        const deleteButton = screen.getByText("Delete");
        fireEvent.click(deleteButton);

        // Since onDelete is optional, clicking the delete button should not throw an error.
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });
});
