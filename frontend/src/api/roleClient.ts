import * as yup from "yup";

import { UpstreamCreateRoleProperties } from "../types/role";
import { axiosInstance } from "./client";

export class RoleClient {
  /**
   * Get all roles for a database
   */
  public static getRolesForDatabase = (databaseId: number) =>
    axiosInstance.get<any>(`databases/${databaseId.toString()}/roles`);

  /**
   * Creates a role for a database
   */
  public static createRoleForDatabase = (role: UpstreamCreateRoleProperties) =>
    axiosInstance.post<any>("/roles", role);

  /**
   * Checks if role exists for a database
   */
  public static existsRoleForDatabase = (role: UpstreamCreateRoleProperties) =>
    axiosInstance.post<any>("/roles/_exists_", role);

  /**
   * Deletes a database by id
   */
  public static deleteRoleForDatabase = (id: number) =>
    axiosInstance.delete<any>(`/roles/${id.toString()}`);
}

export class RoleValidation {
  public static getRolesForDatabaseSchema = yup
    .array()
    .required()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        instanceId: yup.number().required(),
        name: yup.string().required(),
        password: yup.string().required(),
      })
    );

  public static createRoleForDatabaseSchema = yup.object().shape({
    id: yup.number().required(),
    instanceId: yup.number().required(),
    name: yup.string().required(),
    password: yup.string().required(),
  });

  public static existsRoleForDatabaseSchema = yup.object().shape({
    exists: yup.boolean().required(),
  });

  public static deleteDatabaseSchema = yup.object().shape({
    rows: yup.number().required(),
  });
}
