import React, { useState } from 'react';
import { useQuery } from 'react-query';

import { SettingsNavigation } from '../constants/menu.';
import { settingsViewTabs } from '../constants/tabs';
import { UserClient } from '../api/userClient';
import AppLayout from '../layouts/AppLayout';
import Headline from '../components/Headline';
import TabList from '../components/TabList';
import ProfileCard from '../components/ProfileCard/ProfileCard';

interface SettingsViewProps { }


const SettingsView: React.FC<SettingsViewProps> = () => {
  const [selectedTabId, setSelectedTabId] = useState(settingsViewTabs[0].id);
  const userQuery = useQuery("user", () => UserClient.getUser())

  return (
    <AppLayout selectedNavigation={SettingsNavigation.name}>
      <div>
        <Headline title="Settings" size="large" />
        <TabList tabs={settingsViewTabs} selectedId={selectedTabId} onSelect={setSelectedTabId} />
        <ProfileCard user={userQuery.data} loading={userQuery.isFetching} />
      </div>
    </AppLayout>
  );
}

export default SettingsView;
