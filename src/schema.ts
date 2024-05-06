import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const views = sqliteTable('views', {
	path: text('path').notNull().primaryKey(),
	count: integer('count').notNull().default(0)
})

export type InsertView = typeof views.$inferInsert
