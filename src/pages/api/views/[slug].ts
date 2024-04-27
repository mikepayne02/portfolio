export const prerender = false

import type { APIRoute } from 'astro'
import { db, Views, sql } from 'astro:db'

export const GET: APIRoute = async ({ params }) => {
	const slug = params.slug

	if (!slug) {
		return new Response('Not found', { status: 404 })
	}

	let item: any
	try {
		item = await db
			.insert(Views)
			.values({
				slug,
				count: 1
			})
			.onConflictDoUpdate({
				target: Views.slug,
				set: {
					count: sql`count + 1`
				}
			})
			.returning({
				slug: Views.slug,
				count: Views.count
			})
			.then((res) => res[0])
	} catch (error) {
		console.error(error)
		item = { slug, count: 1 }
	}

	return new Response(JSON.stringify(item), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	})
}
