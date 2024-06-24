import type { APIContext } from 'astro'
import { drizzle } from 'drizzle-orm/d1'
export { views } from 'src/schema'

export const connect = ({ locals }: APIContext) => {
  const { DB } = locals.runtime.env
  return drizzle(DB)
}
