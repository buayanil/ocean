import * as yup from "yup";

import { RoleProperties, UpstreamCreateRoleProperties } from "../types/role";
import { axiosInstance } from "./client";

export class RoleClient {
  /**
   * Get all roles for a database
   */
  public static getRolesForDatabase = async (databaseId: number): Promise<RoleProperties[]> => {
    const { data } = await axiosInstance.get<RoleProperties[]>(`databases/${databaseId.toString()}/roles`);
    return data;
  }

  /**
   * Creates a role for a database
   */
  public static createRoleForDatabase = async (role: UpstreamCreateRoleProperties): Promise<RoleProperties> => {
    const { data } = await axiosInstance.post<RoleProperties>("/roles", role);
    return data;
  }
    
  /**
   * Checks if role exists for a database
   */
  public static existsRoleForDatabase = (role: UpstreamCreateRoleProperties) =>
    axiosInstance.post<any>("/roles/_exists_", role);

  /**
   * Deletes a database by id
   */
  public static deleteRoleForDatabase = async (id: number) => {
    const { data } = await axiosInstance.delete<any>(`/roles/${id.toString()}`);
    return data
  }
    
}

export class RoleValidation {
  public static existsRoleForDatabaseSchema = yup.object().shape({
    exists: yup.boolean().required(),
  });

}
