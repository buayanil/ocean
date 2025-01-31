import React, {JSX} from "react";
import {
  HomeIcon,
  DatabaseIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/outline";

// TODO: create a map for all routes
export type LinkProps = {
  name: string;
  to: string;
};

export type Navigation = LinkProps & {
  section: "primary" | "secondary";
  requiredPermission?: string;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
};

export const OverviewNavigation: Navigation = {
  name: "Overview",
  to: "/overview",
  section: "primary",
  icon: HomeIcon,
};

export const DatabasesNavigation: Navigation = {
  name: "Databases",
  to: "/databases",
  section: "primary",
  icon: DatabaseIcon,
};

export const SettingsNavigation: Navigation = {
  name: "Settings",
  to: "/settings",
  section: "secondary",
  icon: CogIcon,
};

export const FAQNavigation: Navigation = {
  name: "FAQ",
  to: "/faq",
  section: "secondary",
  icon: QuestionMarkCircleIcon,
};

export const ReportingNavigation: Navigation = {
  name: "Reporting",
  to: "/reporting",
  section: "secondary",
  requiredPermission: "Staff",
  icon: ChartBarIcon,
};

// HINT: INSERT NEW NAVIGATION HERE

export const navigation = [
  OverviewNavigation,
  DatabasesNavigation,
  SettingsNavigation,
  ReportingNavigation,
  FAQNavigation,
];
