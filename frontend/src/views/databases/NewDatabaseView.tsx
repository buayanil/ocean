import React from 'react';

import AppLayout from '../../layouts/AppLayout';
import { DatabasesNavigation } from '../../constants/menu.';

import CreateDatabaseForm from '../../components/CreateDatabaseForm';

interface NewDatabaseViewProps { }


const NewDatabaseView: React.FC<NewDatabaseViewProps> = () => {
  return (
    <AppLayout selectedNavigation={DatabasesNavigation.name}>
      <CreateDatabaseForm />
    </AppLayout>
  );
}

export default NewDatabaseView;
