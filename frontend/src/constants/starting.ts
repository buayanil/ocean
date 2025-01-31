import { CogIcon, DatabaseIcon } from "@heroicons/react/outline";
import {JSX} from "react";

export interface StartingPoint {
  title: string;
  description: string;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  to: string;
  background: string;
}

export const startingPoints: StartingPoint[] = [
  {
    title: "Create a Database",
    description: "Add a new database now.",
    icon: DatabaseIcon,
    to: "/databases/new",
    background: "bg-pink-500",
  },
  {
    title: "Manage Databases",
    description: "Manage databases in one place.",
    icon: DatabaseIcon,
    to: "/databases/",
    background: "bg-pink-500",
  },
  {
    title: "Manage your profile",
    description: "All your user-specific settings are located here.",
    icon: CogIcon,
    to: "/settings/",
    background: "bg-yellow-500",
  },
];
