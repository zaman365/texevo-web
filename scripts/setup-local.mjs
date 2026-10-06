import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
const root = process.cwd()
mkdirSync('.data', { recursive: true })
if (!existsSync('.env')) {
  writeFileSync(
    '.env',
    `SITE_MODE=preview\nSITE_URL=http://localhost:3000\nDATABASE_URL=postgresql://texevo@127.0.0.1:55432/texevo\nPAYLOAD_SECRET=${randomBytes(48).toString('hex')}\nADMIN_GATE_USER=texevo\nADMIN_GATE_PASSWORD=${randomBytes(24).toString('base64url')}\nSEED_ADMIN_EMAIL=preview@example.test\nSEED_ADMIN_PASSWORD=${randomBytes(24).toString('base64url')}\n`,
    { mode: 0o600 },
  )
  console.log('Created .env with private local credentials. Do not commit this file.')
}
function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.status !== 0)
    throw new Error(
      `${command} failed. PostgreSQL 17+ must be installed locally, or use compose.yaml and configure DATABASE_URL.`,
    )
}
const data = path.join(root, '.data/postgres')
if (!existsSync(path.join(data, 'PG_VERSION')))
  run('initdb', ['-D', data, '-U', 'texevo', '--auth=trust', '--encoding=UTF8', '--locale=C'])
const status = spawnSync('pg_ctl', ['-D', data, 'status'], { stdio: 'ignore' })
if (status.status !== 0)
  run('pg_ctl', [
    '-D',
    data,
    '-l',
    path.join(root, '.data/postgres.log'),
    '-o',
    `-h 127.0.0.1 -p 55432 -k ${path.join(root, '.data')}`,
    'start',
  ])
const check = spawnSync(
  'psql',
  [
    'postgresql://texevo@127.0.0.1:55432/postgres',
    '-tAc',
    "SELECT 1 FROM pg_database WHERE datname='texevo'",
  ],
  { encoding: 'utf8' },
)
if (!check.stdout?.includes('1'))
  run('createdb', ['-h', '127.0.0.1', '-p', '55432', '-U', 'texevo', 'texevo'])
console.log('Local preview database ready. Run pnpm db:migrate, pnpm seed, then pnpm dev.')
