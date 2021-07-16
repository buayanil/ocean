import * as yup from "yup";

import { axiosInstance } from "./client";
import { UpstreamDatabaseProperties } from "../types/models";

export class DatabaseClient {
  /**
   * Get all databases related to this user
   */
  public static getDatabases = () => axiosInstance.get<any>("/databases");

  /**
   * Get a single database by id
   */
  public static getDatabase = (id: number) =>
    axiosInstance.get<any>(`/databases/${id.toString()}`);

  /**
   * Creates a database
   */
  public static createDatabase = (database: UpstreamDatabaseProperties) =>
    axiosInstance.post<any>("/databases", database);

  /**
   * Checkfs if a database already exists
   */
  public static existsDatabase = (database: UpstreamDatabaseProperties) =>
    axiosInstance.post<any>("/databases/_exists_", database);

  /**
   * Deletes a database by id
   */
  public static deleteDatabase = (id: number) =>
    axiosInstance.delete<any>(`/databases/${id.toString()}`);
}

export class DatabaseValidation {
  public static databasesSchema = yup
    .array()
    .required()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        name: yup.string().required(),
        engine: yup.string().required(),
        createdAt: yup.string().required(),
      })
    );

  public static getDatabaseSchema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    engine: yup.string().required(),
    createdAt: yup.string().required(),
  });

  public static createDatabaseSchema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    engine: yup.string().required(),
    createdAt: yup.string().required(),
  });

  public static existsDatabaseSchema = yup.object().shape({
    exists: yup.boolean().required(),
  });

  public static deleteDatabaseSchema = yup.object().shape({
    rows: yup.number().required(),
  });
}
