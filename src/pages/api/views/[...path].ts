export const prerender = false

import type { APIRoute } from 'astro'
import { db, Views, sql } from 'astro:db'

export const GET: APIRoute = async ({ params }) => {
	const path = params.path

	if (!path) {
		return new Response('Not found', { status: 404 })
	}

	let item: any
	try {
		item = await db
			.insert(Views)
			.values({
				path,
				count: 1
			})
			.onConflictDoUpdate({
				target: Views.path,
				set: {
					count: sql`count + 1`
				}
			})
			.returning({
				slug: Views.path,
				count: Views.count
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
