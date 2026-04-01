import { and, desc, eq } from 'drizzle-orm'
import { db } from '../db/index'
import { posts } from '../db/schema'

type DbPost = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type UpdatePost = Partial<Pick<typeof posts.$inferInsert, 'content'>>

export type StoredPost = {
	id: string
	user_id: string
	content: string
	created_at: Date
}

function normalize_created_at(value: unknown): Date {
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value
	}

	if (typeof value === 'number' && Number.isFinite(value)) {
		return new Date(value < 1_000_000_000_000 ? value * 1000 : value)
	}

	if (typeof value === 'string') {
		const numeric = Number(value)
		if (!Number.isNaN(numeric)) {
			return new Date(numeric < 1_000_000_000_000 ? numeric * 1000 : numeric)
		}

		const parsed = new Date(value)
		if (!Number.isNaN(parsed.getTime())) {
			return parsed
		}
	}

	return new Date(0)
}

function to_stored_post(post: DbPost): StoredPost {
	return {
		id: String(post.id),
		user_id: post.authorId,
		content: post.content,
		created_at: normalize_created_at(post.createdAt),
	}
}

export async function create_post(data: NewPost): Promise<StoredPost> {
	const [post] = await db
		.insert(posts)
		.values({
			...data,
			createdAt: data.createdAt ?? new Date(),
		})
		.returning()
	return to_stored_post(post)
}

export async function get_posts(): Promise<StoredPost[]> {
	const result = await db.query.posts.findMany({
		orderBy: [desc(posts.createdAt)],
	})
	return result.map(to_stored_post).sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
}

export async function get_user_posts(user_id: string): Promise<StoredPost[]> {
	const result = await db.query.posts.findMany({
		where: eq(posts.authorId, user_id),
		orderBy: [desc(posts.createdAt)],
	})
	return result.map(to_stored_post).sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
}

export async function get_post_by_id(id: number): Promise<StoredPost | null> {
	const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1)
	return post ? to_stored_post(post) : null
}

export async function update_post(
	id: number,
	user_id: string,
	data: UpdatePost,
): Promise<StoredPost[]> {
	const result = await db
		.update(posts)
		.set(data)
		.where(and(eq(posts.id, id), eq(posts.authorId, user_id)))
		.returning()

	return result.map(to_stored_post)
}

export async function delete_post(id: number, user_id: string): Promise<StoredPost[]> {
	const result = await db
		.delete(posts)
		.where(and(eq(posts.id, id), eq(posts.authorId, user_id)))
		.returning()

	return result.map(to_stored_post)
}
