import 'dotenv/config'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { faker } from '@faker-js/faker'
import * as schema from './schema'

const client = createClient({
	url: process.env.TURSO_CONNECTION_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
})

const db = drizzle(client, { schema })

async function main() {
	console.log('--- Seeding started ---')

	// 1. Optional: Clear existing posts to start fresh
	console.log('Cleaning up old posts...')
	await db.delete(schema.posts)

	// 2. Mock Clerk User IDs
	// In a real app, these would be the IDs from your Clerk Dashboard
	const mock_clerk_user_ids = [
		'user_2N9z7p4W8k5j3mQ1rL0xV9bA',
		'user_2M7x5y3Z1v9n8mQ0pL2wS4tR',
		'user_local_dev_123',
	]

	// 3. Seed Posts
	console.log('Seeding posts...')
	const posts_to_insert = []

	for (let i = 0; i < 20; i++) {
		posts_to_insert.push({
			authorId: faker.helpers.arrayElement(mock_clerk_user_ids),
			content: faker.lorem.paragraph(),
			createdAt: faker.date.recent({ days: 30 }),
		})
	}

	await db.insert(schema.posts).values(posts_to_insert)

	console.log(`--- Seeding completed! (Inserted ${posts_to_insert.length} posts) ---`)
	process.exit(0)
}

main().catch((err) => {
	console.error('Seeding failed:', err)
	process.exit(1)
})
