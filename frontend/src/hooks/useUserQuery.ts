import { useQuery, UseQueryOptions } from "react-query";

import { UserClient } from "../api/userClient";
import { UserProperties } from "../types/user";

export const useUsersQuery = (
  options?: UseQueryOptions<ReadonlyArray<UserProperties>>
) => {
  return useQuery<ReadonlyArray<UserProperties>>(
    ["users"],
    async () => {
      const data = await UserClient.getUsers();
      return data;
    },
    {
      ...options,
    }
  );
};
