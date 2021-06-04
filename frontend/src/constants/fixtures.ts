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
  