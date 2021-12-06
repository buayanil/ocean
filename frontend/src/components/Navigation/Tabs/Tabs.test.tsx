import React from 'react';
import { render } from '@testing-library/react';

import { Tabs } from './Tabs';
import { ITab } from './Tab';

describe('<Tabs />', () => {
    const fixture: ITab[] = [
        { id: 1, name: "Overview" },
        { id: 2, name: "Users" },
        { id: 3, name: "Invitations" },
    ];

    it('renders without crashing', () => {
        render(<Tabs tabs={fixture} activeId={NaN} />);
    });
});
