import React from 'react';
import { render } from '@testing-library/react';

import { EngineGroup } from './EngineGroup';
import { engineOptions } from '../../../constants/engines';

describe('<EngineGroup />', () => {
    it('renders without crashing', () => {
        render(<EngineGroup engineOptions={engineOptions} selectedValue="" />);
    });
});
