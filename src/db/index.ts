import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'
import 'dotenv/config'

const url = process.env.TURSO_CONNECTION_URL
const auth_token = process.env.TURSO_AUTH_TOKEN

if (!url) {
	throw new Error('TURSO_CONNECTION_URL is not defined in .env')
}

const client = createClient({
	url: url,
	authToken: auth_token,
})

export const db = drizzle(client, { schema })
