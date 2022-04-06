import { UseQueryOptions, useQuery } from "react-query";

import { DatabaseClient } from "../api/databaseClient";
import { Database } from "../types/database";

export const useDatabasesQuery = (
  options?: UseQueryOptions<ReadonlyArray<Database>>
) => {
  return useQuery<ReadonlyArray<Database>>(
    ["databases", "_all_"],
    async () => {
      const data = await DatabaseClient.getAllDatabases();
      return data.map((database) => new Database(database));
    },
    {
      ...options,
    }
  );
};
