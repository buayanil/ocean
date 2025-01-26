import React from "react";

import AppLayout from "../layouts/AppLayout";
import { OverviewNavigation } from "../constants/menu.";
import { startingPoints } from "../constants/starting";
import Headline from "../components/Headline";
import StartingPoints from "../components/StartingPoints";

interface OverviewViewProps {}

const { VITE_ISSUE_LINK } = import.meta.env;

const OverviewView: React.FC<OverviewViewProps> = () => {
  return (
    <AppLayout selectedNavigation={OverviewNavigation.name}>
      <Headline title="Overview" size="large" />
      <StartingPoints
        title="Getting started"
        description="Get started by selecting a template."
        startingPoints={startingPoints}
        moreHref={VITE_ISSUE_LINK || "#"}
      />
    </AppLayout>
  );
};

export default OverviewView;
