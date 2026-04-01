import { buildClerkProps } from 'svelte-clerk/server'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals }) => {
	const auth = locals.auth()

	return {
		...buildClerkProps(auth),
		userId: auth.userId,
		publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? '',
	}
}
