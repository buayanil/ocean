import React from 'react';

import AppLayout from '../layouts/AppLayout';
import { SettingsNavigation } from '../constants/menu.';

interface SettingsViewProps {}


const SettingsView: React.FC<SettingsViewProps> = () => {
  return (
    <AppLayout selectedNavigation={SettingsNavigation.name}>SettingsView</AppLayout>
  );
}

export default SettingsView;
