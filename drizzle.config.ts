import { defineConfig } from 'drizzle-kit'

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
	throw new Error('Please provide TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the environment')
}

export default defineConfig({
	schema: 'src/schema.ts',
	driver: 'turso',
	dialect: 'sqlite',
	out: './drizzle',
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN
	},
	// verbose: true,
	strict: true
})
