import { db, Views } from 'astro:db';
import { getAllPosts } from '../src/utils/project.ts';

export default async function() {

  const randomViewCount = () => Math.floor(Math.random() * 400) + 5000

  const projects = await getAllPosts()
  const queries = projects.map(project =>
    db.insert(Views)
      .values({ slug: project.slug, count: randomViewCount() })
  );

  queries.push(db.insert(Views).values({ slug: 'index', count: randomViewCount() }));

  type Query = typeof queries[number];

  await db.batch(
    queries as [Query, ...Query[]] // typescript kung fu required to make it work
  );
}

