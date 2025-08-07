import config from "@/lib/config";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(config.env.databaseUrl);

export const db: NeonHttpDatabase<typeof schema> = drizzle(sql, { schema });
