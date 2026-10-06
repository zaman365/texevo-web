import pg from 'pg'
import { databasePoolOptions } from './cloudflare'
const globalDB = globalThis as unknown as { texevoPool?: pg.Pool }
export const db =
  globalDB.texevoPool ||
  new pg.Pool({
    ...databasePoolOptions(),
    max: 6,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
  })
if (process.env.NODE_ENV !== 'production') globalDB.texevoPool = db
// Deliberately log an error code only, never a connection string or request body.
db.on('error', () => console.error('database_pool_error'))
