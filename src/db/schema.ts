import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// 1. Posts Table
export const posts = sqliteTable(
	'posts',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		authorId: text('author_id').notNull(),
		content: text('content').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`),
	},
	(table) => [
		// Use an array instead of an object for the extraConfig
		index('idx_posts_author').on(table.authorId),
	],
)
