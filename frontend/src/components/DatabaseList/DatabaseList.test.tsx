import React from 'react';
import {render, screen, within} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DatabaseList from './DatabaseList';
import { DatabaseProperties, EngineType } from '../../types/database';
import { engineOptions } from '../../constants/engines';

const mockData: readonly DatabaseProperties[] = [
    {
        id: 1,
        name: 'Database 1',
        engine: engineOptions.find((e) => e.label === 'PostgreSQL')?.value as EngineType,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        userId: 100,
    },
    {
        id: 2,
        name: 'Database 2',
        engine: engineOptions.find((e) => e.label === 'MongoDB')?.value as EngineType,
        createdAt: new Date('2023-02-01T00:00:00Z'),
        userId: 101,
    },
    {
        id: 3,
        name: 'Database 3',
        engine: 'X' as EngineType, // Unsupported engine value
        createdAt: new Date('2023-03-01T00:00:00Z'),
        userId: 102,
    },
];

describe('<DatabaseList />', () => {
    // Test case 1: Dynamically matches databases in mobile view regardless of rendering order
    it('renders a list of databases in mobile view', () => {
        render(
            <MemoryRouter>
                <DatabaseList databases={mockData} />
            </MemoryRouter>
        );

        // Scope query to the mobile container
        const mobileContainer = screen.getByRole('list'); // Assuming <ul> is used for mobile view
        const mobileDatabaseItems = within(mobileContainer).getAllByRole('listitem'); // Target <li> elements

        // Verify the number of <li> elements matches the mock data length
        expect(mobileDatabaseItems).toHaveLength(mockData.length);

        // Dynamically match the content
        const database1Item = mobileDatabaseItems.find((item) =>
            within(item).queryByText('Database 1')
        );
        const database2Item = mobileDatabaseItems.find((item) =>
            within(item).queryByText('Database 2')
        );
        const database3Item = mobileDatabaseItems.find((item) =>
            within(item).queryByText('Database 3')
        );

        // Verify the content of each item
        expect(database1Item).toBeDefined();
        expect(within(database1Item!).getByText('PostgreSQL')).toBeInTheDocument();

        expect(database2Item).toBeDefined();
        expect(within(database2Item!).getByText('MongoDB')).toBeInTheDocument();

        expect(database3Item).toBeDefined();
        expect(within(database3Item!).getByText('Unknown')).toBeInTheDocument();
    });

    // Test case 2: Dynamically matches databases in desktop view regardless of rendering order
    it('renders a list of databases in desktop view', () => {
        render(
            <MemoryRouter>
                <DatabaseList databases={mockData} />
            </MemoryRouter>
        );

        // Scope query to the desktop container
        const desktopContainer = screen.getByRole('table'); // Assuming <table> is used for desktop view
        const desktopDatabaseRows = within(desktopContainer).getAllByRole('row'); // Target <tr> elements

        // Exclude the header row
        const databaseRows = desktopDatabaseRows.slice(1);

        // Verify the number of rows matches the mock data length
        expect(databaseRows).toHaveLength(mockData.length);

        // Dynamically match the content
        const database1Row = databaseRows.find((row) =>
            within(row).queryByText('Database 1')
        );
        const database2Row = databaseRows.find((row) =>
            within(row).queryByText('Database 2')
        );
        const database3Row = databaseRows.find((row) =>
            within(row).queryByText('Database 3')
        );

        // Verify the content of each row
        expect(database1Row).toBeDefined();
        expect(within(database1Row!).getByText('PostgreSQL')).toBeInTheDocument();

        expect(database2Row).toBeDefined();
        expect(within(database2Row!).getByText('MongoDB')).toBeInTheDocument();

        expect(database3Row).toBeDefined();
        expect(within(database3Row!).getByText('Unknown')).toBeInTheDocument();
    });

    // Test case 3: Handles an empty list
    it('renders empty containers when no databases are available', () => {
        render(
            <MemoryRouter>
                <DatabaseList databases={[]} />
            </MemoryRouter>
        );

        // Verify that the mobile container is empty
        const mobileContainer = screen.getByRole('list');
        expect(within(mobileContainer).queryAllByRole('listitem')).toHaveLength(0);

        // Verify that the desktop table body is empty
        const desktopContainer = screen.getByRole('table');
        const desktopRows = within(desktopContainer).queryAllByRole('row');
        expect(desktopRows).toHaveLength(1); // Only the header row should be present
    });

    // Test case 4: Handles user interaction (e.g., selecting a database)
    it('calls onClick when a database is clicked', async () => {
        const mockOnClick = jest.fn();

        render(
            <MemoryRouter>
                <DatabaseList databases={mockData} onClick={mockOnClick} />
            </MemoryRouter>
        );

        // Use getAllByText to find all matching elements
        const databaseElements = screen.getAllByText(/Database 1/i);

        // Simulate user clicking on the first matching element
        await userEvent.click(databaseElements[0]);

        // Verify that the onClick callback was called with the correct database ID
        expect(mockOnClick).toHaveBeenCalledWith(1);
    });

    // Test case 5: Handles row clicks in desktop view
    it('calls onClick when a row is clicked in desktop view', async () => {
        const mockOnClick = jest.fn(); // Mock the onClick callback

        render(
            <MemoryRouter>
                <DatabaseList databases={mockData} onClick={mockOnClick} />
            </MemoryRouter>
        );

        // Scope query to the desktop container
        const desktopContainer = screen.getByRole('table'); // Assuming <table> is used for desktop view
        const desktopDatabaseRows = within(desktopContainer).getAllByRole('row'); // Target <tr> elements

        // Exclude the header row
        const databaseRows = desktopDatabaseRows.slice(1);

        // Dynamically find the row for "Database 1"
        const database1Row = databaseRows.find((row) =>
            within(row).queryByText('Database 1')
        );

        // Verify the row was found
        expect(database1Row).toBeDefined();

        // Simulate clicking on the row
        await userEvent.click(database1Row!);

        // Verify that the onClick callback was called with the correct database ID
        expect(mockOnClick).toHaveBeenCalledWith(1); // Expect ID of "Database 1"
    });


});
