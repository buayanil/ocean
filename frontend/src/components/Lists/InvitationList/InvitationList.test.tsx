import React from 'react';
import { render } from '@testing-library/react';

import { InvitationList } from './InvitationList';
import { IInvitedUser } from './InvitationListEntry';

describe('<InvitationList />', () => {
    const invitedUsers: IInvitedUser[] = [
        {
            id: 1,
            username: "username1",
            firstName: "firstName1",
            lastName: "lastName1",
            createdAt: new Date(),
            invitationId: 2,
        },
    ]
    it('renders without crashing', () => {
        render(<InvitationList invitedUsers={invitedUsers} />);
    });
});
