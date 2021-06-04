import React from 'react';

import Layout from '../components/Layout';

interface SettingsViewProps {}


const SettingsView: React.FC<SettingsViewProps> = () => {
  return (
    <Layout selectedNavigation="Settings">SettingsView</Layout>
  );
}

export default SettingsView;
