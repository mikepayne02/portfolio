import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_ID || !process.env.D1_TOKEN) {
  throw new Error('Please provide DATABASE_ID and D1_TOKEN in the environment')
}

export default defineConfig({
  schema: 'src/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  out: './drizzle',
  dbCredentials: {
    accountId: process.env.ACCOUNT_ID!,
    databaseId: process.env.DATABASE_ID!,
    token: process.env.D1_TOKEN!
  },
  // verbose: true,
  strict: true
})
