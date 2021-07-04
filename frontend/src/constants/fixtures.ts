import { EngineOption } from "../components/EngineSelector/EngineSelector";
import { DatabaseProperties } from "../types/models";

import mongodbLogo from "../img/mongodb-logo.svg";
import postgresqlLogo from "../img/postgresql-logo.svg";

export const databases: ReadonlyArray<DatabaseProperties> = [
  {
    id: 1,
    name: "production-postgres-domain-io",
    engine: "PostgreSQL",
    createdAt: "July 11, 2020",
  },
  {
    id: 2,
    name: "staging-mongodb",
    engine: "MongoDB",
    createdAt: "July 15, 2020",
  },
];

export const engineOptions: ReadonlyArray<EngineOption> = [
  {
    id: 1,
    label: "PostgreSQL",
    value: "P",
    imageSrc: postgresqlLogo,
    alt: "postgresql logo",
  },
  {
    id: 2,
    label: "MongoDB",
    value: "M",
    imageSrc: mongodbLogo,
    alt: "mongodb logo",
  },
];
