import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

import { DatabaseClient } from "../api/databaseClient";
import { Database } from "../types/database";

export const useDatabasesQuery = (
    options?: UseQueryOptions<ReadonlyArray<Database>>
) => {
    return useQuery({
        queryKey: ["databases", "_all_"], // ✅ Correct: key is inside an object
        queryFn: async () => {
            const data = await DatabaseClient.getAllDatabases();
            return data.map((database) => new Database(database));
        },
        ...options, // ✅ Spread additional options inside the object
    });
};


export const useDeleteDatabaseWithPermissionMutation = (
    options?: Omit<UseMutationOptions<any, Error, number>, "mutationFn">
) => {
    return useMutation({
        mutationFn: async (variables: number) => {
            const { data } = await DatabaseClient.deleteDatabaseWithPermission(variables);
            return data;
        },
        ...options, // ✅ Spread options inside the object
    });
};
