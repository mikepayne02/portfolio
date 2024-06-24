export const prerender = false

import type { APIContext, APIRoute } from 'astro'
import { connect, views } from '@/db'
import { sql } from 'drizzle-orm'

import { getAllPosts } from '@/data/project'

const projects = await getAllPosts()
const validPaths = projects.map((post) => `projects/${post.slug}`)
validPaths.push('index')

const abbreviateNumber = (value: number): string => {
  if (value < 1000) {
    return value.toString()
  }

  const suffixes = ['', 'k', 'm', 'b', 't']
  const suffixNum = Math.floor(('' + value).length / 3)
  if (suffixNum > 4) return value.toString()
  let shortValue = 0

  for (var precision = 2; precision >= 1; precision--) {
    shortValue = parseFloat(
      (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
        precision
      )
    )
    var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '')
    if (dotLessShortValue.length <= 2) {
      break
    }
  }

  if (shortValue % 1 != 0) return shortValue.toFixed(1) + suffixes[suffixNum]
  return shortValue + (suffixes[suffixNum] ?? '')
}

export const GET: APIRoute = async (ctx: APIContext) => {
  const path = ctx.params.path ?? ''

  if (!validPaths.includes(path)) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  }
  const db = connect(ctx)
  if (!path) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  }

  let item: any
  try {
    item = await db
      .insert(views)
      .values({
        path: path,
        count: 1
      })
      .onConflictDoUpdate({
        target: views.path,
        set: {
          count: sql`${views.count} + 1`
        }
      })
      .returning({
        path: views.path,
        count: views.count
      })
      .then((res) => res[0])
  } catch (error) {
    console.error(error)
    item = { count: 1 }
  }

  item = { count: abbreviateNumber(item.count) }

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
