import { db, Views } from 'astro:db'
import { getStaticPaths as projectPaths } from 'src/pages/projects/[slug].astro'

export default async function () {
	const randomViewCount = () => Math.floor(Math.random() * 400) + 5000
	const projects = await projectPaths()
	// Add row for home page
	await db.insert(Views).values({ path: 'index', count: randomViewCount() })

	const queries = projects.map((project) =>
		db.insert(Views).values({
			path: `${project.props.entry.collection}/${project.props.entry.slug}`,
			count: randomViewCount()
		})
	)

	type Query = (typeof queries)[number]

	await db.batch(
		queries as [Query, ...Query[]] // typescript kung fu required to make it work
	)
}
