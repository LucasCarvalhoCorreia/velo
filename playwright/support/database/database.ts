import { config as loadEnv } from 'dotenv'
import { Pool } from 'pg'

// CI: `.github/workflows/cd.yml` define `DOTENV_CONFIG_PATH` para o mesmo ambiente
// Preview da Vercel do deploy sob teste (evita seed no Postgres de produção).
if (process.env.DOTENV_CONFIG_PATH) {
  loadEnv({ path: process.env.DOTENV_CONFIG_PATH })
} else {
  loadEnv()
}
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from './schema'

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  })
})

export const db = new Kysely<Database>({
  dialect,
})