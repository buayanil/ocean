export interface DatabaseProperties {
  id: number;
  name: string;
  engine: EngineType;
  createdAt: Date;
}

export enum EngineType {
  /** PostgreSQL Cluster */
  PostgreSQL = "P",
  /** MongoDB Cluster */
  MongoDB = "M",
}

export type UpstreamDatabaseProperties = Pick<
  DatabaseProperties,
  "name" | "engine"
>;
