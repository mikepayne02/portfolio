import type { APIRoute } from "astro";
import { db, Views, eq } from "astro:db";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  console.log(url);
  const params = new URLSearchParams(url.search);

  const slug = params.get("slug");

  if (!slug) {
    return new Response("Not found", { status: 404 });
  }

  let item: any
  try {
    item = await db
      .select({
        slug: Views.slug,
        count: Views.count,
      })
      .from(Views)
      .where(eq(Views.slug, slug))
      .then((res: any) => res[0]);
  } catch (error) {
    item = { slug, count: 1 };
  }

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, s-maxage=60, stale-while-revalidate=25",
    },
  });
};
