import React from 'react';

import Layout from '../components/Layout';
import { OverviewNavigation } from '../constants/menu.';


interface OverviewViewProps {}

const OverviewView: React.FC<OverviewViewProps> = () => {
  return (
    <Layout selectedNavigation={OverviewNavigation.name}>OverviewView</Layout>
  );
}

export default OverviewView;
