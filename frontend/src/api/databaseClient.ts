import * as yup from "yup";

import {
  DatabaseProperties,
  UpstreamDatabaseProperties,
} from "../types/database";
import { axiosInstance } from "./client";

export class DatabaseClient {
  /**
   * Get all databases from all users.
   * This requires `Staff` permission.
   */
  public static getAllDatabases = async (): Promise<DatabaseProperties[]> => {
    const { data } = await axiosInstance.get<DatabaseProperties[]>(
      "/databases/_all_"
    );
    return data;
  };

  /**
   * Get all databases related to this user
   */
  public static getUserDatabases = async (): Promise<DatabaseProperties[]> => {
    const { data } = await axiosInstance.get<DatabaseProperties[]>(
      "/databases"
    );
    return data;
  };

  /**
   * Get a single database by id
   */
  public static getDatabase = async (
    id: number
  ): Promise<DatabaseProperties> => {
    const { data } = await axiosInstance.get<DatabaseProperties>(
      `/databases/${id.toString()}`
    );
    return data;
  };

  /**
   * Creates a database
   */
  public static createDatabase = async (
    database: UpstreamDatabaseProperties
  ): Promise<DatabaseProperties> => {
    const { data } = await axiosInstance.post<DatabaseProperties>(
      "/databases",
      database
    );
    return data;
  };

  /**
   * Checkfs if a database already exists
   */
  public static availabilityDatabase = (database: UpstreamDatabaseProperties) =>
    axiosInstance.post<any>("/databases/_availability_", database);

  /**
   * Deletes a database by id
   */
  public static deleteDatabase = async (id: number) => {
    const { data } = await axiosInstance.delete<any>(
      `/databases/${id.toString()}`
    );
    return data;
  };

  /**
   * Deletes a database by id from any user. Requires addtional permissions.
   */
  public static deleteDatabaseWithPermission = async (id: number) => {
    const { data } = await axiosInstance.delete<any>(
      `/databases/${id.toString()}/_permission_`
    );
    return data;
  };
}

export class DatabaseValidation {
  public static availabilityDatabaseSchema = yup.object().shape({
    availability: yup.boolean().required(),
  });
}
