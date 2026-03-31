import { db } from '../db/index' // Adjust this to where your drizzle instance is
import { posts } from '../db/schema'
import { eq, desc, and } from 'drizzle-orm'

export type NewPost = typeof posts.$inferInsert
export type UpdatePost = Partial<typeof posts.$inferInsert>

export async function create_post(data: NewPost) {
	return await db.insert(posts).values(data).returning()
}

export async function get_posts() {
	return await db.query.posts.findMany({
		orderBy: [desc(posts.createdAt)],
	})
}

export async function get_post_by_id(id: number) {
	const result = await db.select().from(posts).where(eq(posts.id, id))
	return result[0] || null
}

export async function update_post(id: number, authorId: string, data: UpdatePost) {
	return await db
		.update(posts)
		.set(data)
		.where(and(eq(posts.id, id), eq(posts.authorId, authorId)))
		.returning()
}

export async function delete_post(id: number, authorId: string) {
	return await db
		.delete(posts)
		.where(and(eq(posts.id, id), eq(posts.authorId, authorId)))
		.returning()
}
