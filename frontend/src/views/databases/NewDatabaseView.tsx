import React from 'react';

import Layout from '../../components/Layout';
import { DatabasesNavigation } from '../../constants/menu.';

interface NewDatabaseViewProps {}


const NewDatabaseView: React.FC<NewDatabaseViewProps> = () => {
  return (
    <Layout selectedNavigation={DatabasesNavigation.name}>NewDatabaseView</Layout>
  );
}

export default NewDatabaseView;
