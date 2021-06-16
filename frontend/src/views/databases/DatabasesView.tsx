import React from 'react';

import { databases } from '../../constants/fixtures';
import { DatabasesNavigation } from '../../constants/menu.';
import AppLayout from '../../layouts/AppLayout';
import DatabaseList from '../../components/DatabaseList/DatabaseList';

interface DatabasesViewProps {}


const DatabasesView: React.FC<DatabasesViewProps> = () => {
  return (
    <AppLayout selectedNavigation={DatabasesNavigation.name}>
      <h2 className="max-w-6xl mx-auto mt-8 mb-4 px-4 text-2xl font-semibold text-gray-900 sm:px-6 lg:px-8">
        Databases
      </h2>
      <DatabaseList databases={databases} />
    </AppLayout>
  );
}

export default DatabasesView;
