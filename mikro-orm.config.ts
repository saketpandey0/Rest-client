import { defineConfig } from "@mikro-orm/postgresql";
import { RequestHistory } from "./src/entities/RequestHistory";
import { Migrator } from '@mikro-orm/migrations'; 



export default defineConfig({
  entities: [RequestHistory],
  dbName: process.env.DATABASE_NAME || "rest_client",
  user: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: +(process.env.DATABASE_PORT || 5432),
  debug: true,
  extensions: [Migrator],
});
