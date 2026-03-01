import { defineConfig } from '@prisma/config'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // We use DIRECT_URL here so migrations/push don't hang on the Supabase Pooler 6543 port
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  }
})
