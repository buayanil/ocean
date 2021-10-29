import { TabProperties } from "../components/TabList";
import { EngineType } from "../types/database";

const databaseDetailTabs: TabProperties[] = [
  { id: 1, name: "Overview" },
  { id: 2, name: "Users" },
  { id: 3, name: "Invitations" },
];

export const getDetailViewTabsFor = (
  engineType: EngineType | undefined
): TabProperties[] => {
  const postgresqlIds = [1, 2, 3];
  const mongodbIds = [1, 2];

  if (engineType === EngineType.PostgreSQL) {
    return databaseDetailTabs.filter((tab) => postgresqlIds.includes(tab.id));
  } else if (engineType === EngineType.MongoDB) {
    return databaseDetailTabs.filter((tab) => mongodbIds.includes(tab.id));
  } else if (engineType === undefined) {
    return [];
  } else {
    const assertNever = (_: never): TabProperties[] => [];
    return assertNever(engineType);
  }
};

export const settingsViewTabs: TabProperties[] = [{ id: 1, name: "Profile" }];
