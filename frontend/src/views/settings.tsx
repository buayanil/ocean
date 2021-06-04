import React from 'react';

import Layout from '../components/Layout';
import { SettingsNavigation } from '../constants/menu.';

interface SettingsViewProps {}


const SettingsView: React.FC<SettingsViewProps> = () => {
  return (
    <Layout selectedNavigation={SettingsNavigation.name}>SettingsView</Layout>
  );
}

export default SettingsView;
