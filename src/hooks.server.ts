import { withClerkHandler } from 'svelte-clerk/server'
import { config } from '$lib/config'

export const handle = withClerkHandler({
	publishableKey: config.clerk_publishable_key,
	secretKey: config.clerk_secret_key,
})
