import React from 'react';
import EngineSelector from '../../components/EngineSelector/EngineSelector';

import Layout from '../../components/Layout';
import { DatabasesNavigation } from '../../constants/menu.';
import { engineOptions } from '../../constants/fixtures';
import { CheckCircleIcon } from '@heroicons/react/solid';

interface NewDatabaseViewProps {}


const NewDatabaseView: React.FC<NewDatabaseViewProps> = () => {
  return (
    <Layout selectedNavigation={DatabasesNavigation.name}>
      <div className="text-3xl text-gray-600 sm:text-4xl mb-5">Create a database</div>
      <div className="text-xl  text-gray-600 sm:text-2xl mb-3">Choose a database engine</div>
      <div className="text-sm font-light mb-3">A database runs a single database engine that powers one or more individual databases.</div>
      <EngineSelector engineOptions={engineOptions} selectionOptionId={2} />
      <div className="text-xl text-gray-600 sm:text-2xl mt-6 mb-3">Choose a unique database name</div>
      <div className="text-sm font-light">Names must be lowercase and start with a letter. They can be between 3 and 63 characters long and may contain dashes.</div>
      <div className="mt-3">
        <label htmlFor="database_name" className="block text-sm font-medium text-gray-700">
          Database Name
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            name="database_name"
            id="database_name"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="db-postgresql-htw1-70738"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
          </div>
        </div>
    </div>
    <button
        type="button"
        className="mt-6 px-4 w-full py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create a database
    </button>
    </Layout>
  );
}

export default NewDatabaseView;
