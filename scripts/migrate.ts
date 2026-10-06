import { readFile } from 'node:fs/promises'
import { db } from '../src/lib/db'
const client = await db.connect()
try {
  await client.query('BEGIN')
  await client.query(await readFile(new URL('../db/001-initial.sql', import.meta.url), 'utf8'))
  await client.query('COMMIT')
  console.log('Application schema ready.')
} catch (e) {
  await client.query('ROLLBACK')
  throw e
} finally {
  client.release()
  await db.end()
}
