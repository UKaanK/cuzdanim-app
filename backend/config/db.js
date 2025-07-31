import {neon} from "@neondatabase/serverless"
import "dotenv/config"

// Create a SQL Connection
export const sql =neon(process.env.DATABASE_URL)