import React from 'react';
import { Link } from 'react-router-dom';

import Layout from '../../components/Layout';
import { DatabasesNavigation } from '../../constants/menu.';

interface DatabasesViewProps {}


const DatabasesView: React.FC<DatabasesViewProps> = () => {
  return (
    <Layout selectedNavigation={DatabasesNavigation.name}>
      DatabasesView
      <Link to="/databases/new">
        <button type="button"
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
            CreateDatabaseView
          </button>
      </Link>
    </Layout>
  );
}

export default DatabasesView;
