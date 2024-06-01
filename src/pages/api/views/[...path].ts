export const prerender = false

import type { APIContext, APIRoute } from 'astro'
import { connect, views } from '@/db'
import { sql, eq } from 'drizzle-orm'

export const GET: APIRoute = async (ctx: APIContext) => {
	const db = connect(ctx)
	const path = ctx.params.path

	if (!path) {
		return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
	}

	let item: any
	try {
		item = await db
			.update(views)
			.set({
				count: sql`${views.count} + 1`
			})
			.where(eq(views.path, path))
			.returning({
				path: views.path,
				count: views.count
			})
			.then((res) => res[0])
	} catch (error) {
		console.error(error)
		item = { path, count: 1 }
	}

	return new Response(JSON.stringify(item), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	})
}
