import React from 'react';
import { render } from '@testing-library/react';

import { Alert } from './Alert';


describe('<Alert />', () => {
    it('renders without crashing', () => {
        render(<Alert message="message" />);
    });
});
