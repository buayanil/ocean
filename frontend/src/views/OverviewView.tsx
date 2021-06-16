import React from 'react';

import AppLayout from '../layouts/AppLayout';
import { OverviewNavigation } from '../constants/menu.';


interface OverviewViewProps {}

const OverviewView: React.FC<OverviewViewProps> = () => {
  return (
    <AppLayout selectedNavigation={OverviewNavigation.name}>OverviewView</AppLayout>
  );
}

export default OverviewView;
