import { BaseModel } from "./models";

const {
  VITE_POSTGRESQL_HOSTNAME,
  VITE_POSTGRESQL_PORT,
  VITE_MONGODB_HOSTNAME,
  VITE_MONGODB_PORT,
  VITE_ADMINER_URL,
} = import.meta.env;

export interface DatabaseProperties {
  id: number;
  name: string;
  engine: EngineType;
  createdAt: Date;
  userId: number;
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

export class Database extends BaseModel {
  public readonly props: DatabaseProperties;

  public readonly name: string;
  public readonly engine: EngineType;
  public readonly createdAt: Date;
  public readonly userId: number;

  constructor(props: DatabaseProperties) {
    super({ id: props.id });
    this.props = props;

    this.name = props.name;
    this.engine = props.engine;
    this.createdAt = props.createdAt;
    this.userId = props.userId;
  }

  public get hostname(): string {
    if (this.props.engine === EngineType.PostgreSQL) {
      return VITE_POSTGRESQL_HOSTNAME || "";
    } else if (this.props.engine === EngineType.MongoDB) {
      return VITE_MONGODB_HOSTNAME || "";
    } else {
      const assertNever = (_: never): string => "";
      return assertNever(this.props.engine);
    }
  }

  public get port(): number {
    if (this.props.engine === EngineType.PostgreSQL) {
      return Number.parseInt(VITE_POSTGRESQL_PORT || "5432");
    } else if (this.props.engine === EngineType.MongoDB) {
      return Number.parseInt(VITE_MONGODB_PORT || "27017");
    } else {
      const assertNever = (_: never): number => NaN;
      return assertNever(this.props.engine);
    }
  }

  public connectionString(psqlUsername?: string): string {
    if (this.props.engine === EngineType.PostgreSQL) {
      return `psql -U ${psqlUsername} -h ${this.hostname} -p ${this.port} -d ${this.props.name}`;
    } else if (this.props.engine === EngineType.MongoDB) {
      return `mongodb://${this.hostname}:${this.port.toString()}/?authSource=${
        this.props.name
      }`;
    } else {
      const assertNever = (_: never): string => "";
      return assertNever(this.props.engine);
    }
  }

  public get adminerUrl(): string {
    return VITE_ADMINER_URL || "";
  }
}
