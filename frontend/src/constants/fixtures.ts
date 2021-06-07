import { EngineOption } from "../components/EngineSelector/EngineSelector";
import { DatabaseProperties } from "../types/models";

export const databases: ReadonlyArray<DatabaseProperties> = [
    {
      id: 1,
      name: 'production-postgres-domain-io',
      engine: 'PostgreSQL',
      created: 'July 11, 2020',
    },
    {
      id: 2,
      name: 'staging-mongodb',
      engine: 'MongoDB',
      created: 'July 15, 2020',
    },
]

export const engineOptions: ReadonlyArray<EngineOption> = [
  {
    id: 1,
    label: 'PostgreSQL',
    imageSrc: 'https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg',
    alt: 'postgresql logo',
  },
  {
    id: 2,
    label: 'MongoDB',
    imageSrc: 'https://1000logos.net/wp-content/uploads/2020/08/MongoDB-Emblem.jpg',
    alt: 'mongodb logo',
  },
]