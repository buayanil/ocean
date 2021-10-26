import { EngineOption } from "../components/EngineSelector/EngineSelector";

import mongodbLogo from "../img/mongodb-logo.svg";
import postgresqlLogo from "../img/postgresql-logo.svg";

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
    label: "MongoDB (in Arbeit :))",
    value: "M",
    imageSrc: mongodbLogo,
    alt: "mongodb logo",
  },
];
