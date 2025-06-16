import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env' }); // or .env.local
import * as schema from './schema.js'

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql , {schema});
