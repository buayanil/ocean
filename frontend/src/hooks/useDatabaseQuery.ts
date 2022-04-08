import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "react-query";

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

export const useDeleteDatabaseWithPermissionMutation = (
  options?: Omit<UseMutationOptions<any, Error, number>, "mutationFn">
) =>
  useMutation<any, Error, number>(async (variables) => {
    const { data } = await DatabaseClient.deleteDatabaseWithPermission(
      variables
    );
    return data;
  }, options);
