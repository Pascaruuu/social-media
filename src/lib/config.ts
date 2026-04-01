export const config = {
	turso_connection_url: import.meta.env.TURSO_CONNECTION_URL || '',
	turso_auth_token: import.meta.env.TURSO_AUTH_TOKEN || '',
	clerk_publishable_key: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
	clerk_secret_key: import.meta.env.CLERK_SECRET_KEY || '',
}
