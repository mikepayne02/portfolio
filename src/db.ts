import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/web'
import type { APIContext } from 'astro'
export { views } from 'src/schema'

export const connect = (ctx: APIContext) => {
	const { env } = ctx.locals.runtime
	return drizzle(
		createClient({
			url: env.TURSO_DATABASE_URL,
			authToken: env.TURSO_AUTH_TOKEN
		})
	)
}
