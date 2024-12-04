import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core'

export const views = sqliteTable(
  'views',
  {
    path: text('path').notNull().primaryKey(),
    count: integer('count').notNull().default(0)
  },
  (t) => [index('path_index').on(t.path)]
)

export type InsertView = typeof views.$inferInsert
