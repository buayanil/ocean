import React, { useState } from 'react';
import { useQuery } from 'react-query';

import { SettingsNavigation } from '../constants/menu.';
import { settingsViewTabs } from '../constants/tabs';
import { UserClient } from '../api/userClient';
import AppLayout from '../layouts/AppLayout';
import Headline from '../components/Headline';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import { Tabs } from '../components/Navigation/Tabs/Tabs';

interface SettingsViewProps { }


const SettingsView: React.FC<SettingsViewProps> = () => {
  const [activeId, setActiveId] = useState(settingsViewTabs[0].id);
  const userQuery = useQuery("user", () => UserClient.getUser())

  return (
    <AppLayout selectedNavigation={SettingsNavigation.name}>
      <div>
        <Headline title="Settings" size="large" />
        <Tabs tabs={settingsViewTabs} activeId={activeId} onSelect={setActiveId} />
        <ProfileCard user={userQuery.data} loading={userQuery.isFetching} />
      </div>
    </AppLayout>
  );
}

export default SettingsView;
