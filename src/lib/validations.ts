import { createInsertSchema } from 'drizzle-zod'
import { posts } from '../db/schema'
import { z } from 'zod'

// 1. Schema for CREATING a post
// We refine the 'content' field to add specific social media limits
export const insert_post_schema = createInsertSchema(posts, {
	content: (schema) => schema.min(1, 'Post cannot be empty').max(500, 'Post is too long'),
	authorId: (schema) => schema.min(1),
}).omit({
	id: true, // Database handles this
	createdAt: true, // Database handles this
})

// 2. Schema for UPDATING a post (all fields optional, but content must follow rules)
export const update_post_schema = insert_post_schema.partial()

// 3. Schema for the Post ID (useful for delete/get routes)
export const post_id_schema = z.object({
	id: z.coerce.number().int().positive(),
})

// Export types for use in Svelte components
export type InsertPost = z.infer<typeof insert_post_schema>
