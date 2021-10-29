export interface DatabaseProperties {
  id: number;
  name: string;
  engine: string;
  createdAt: Date;
}

export type UpstreamDatabaseProperties = Pick<
  DatabaseProperties,
  "name" | "engine"
>;
