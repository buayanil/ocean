import React from 'react';
import { Link } from 'react-router-dom';

import { DatabasesNavigation } from '../../constants/menu.';
import { databases } from '../../constants/fixtures';
import Layout from '../../components/Layout';
import DatabaseList from '../../components/DatabaseList/DatabaseList';

interface DatabasesViewProps {}


const DatabasesView: React.FC<DatabasesViewProps> = () => {
  return (
    <Layout selectedNavigation={DatabasesNavigation.name}>
      <Link to="/databases/new">
        <button type="button"
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
            CreateDatabaseView (Demo)
          </button>
      </Link>
      <h2 className="max-w-6xl mx-auto mt-8 mb-4 px-4 text-2xl font-semibold text-gray-900 sm:px-6 lg:px-8">
        Databases
      </h2>
      <DatabaseList databases={databases} />
    </Layout>
  );
}

export default DatabasesView;
