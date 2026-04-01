import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { clerkClient } from 'svelte-clerk/server'
import { get_user_posts } from '$lib/posts'

type PublicProfile = {
	id: string
	fullName: string
	username: string
	imageUrl?: string
	emailAddress?: string
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const profile_id = params.id?.trim()
	if (!profile_id) {
		throw error(404, 'Profile not found.')
	}
	const viewer_user_id = locals.auth().userId

	const posts = await get_user_posts(profile_id)
	let has_clerk_profile = false

	let profile: PublicProfile = {
		id: profile_id,
		fullName: `user:${profile_id.slice(0, 8)}`,
		username: profile_id.slice(0, 8),
		imageUrl: undefined,
		emailAddress: undefined,
	}

	try {
		const user = await clerkClient.users.getUser(profile_id)
		const fallback_name = `user:${profile_id.slice(0, 8)}`
		const primary_email = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
		has_clerk_profile = true

		profile = {
			id: user.id,
			fullName: user.fullName ?? user.username ?? fallback_name,
			username: user.username ?? fallback_name,
			imageUrl: user.imageUrl,
			emailAddress: primary_email?.emailAddress,
		}
	} catch (lookup_error) {
		console.warn(`[profile/${profile_id}] Clerk user lookup failed`, lookup_error)
	}

	if (posts.length === 0 && !has_clerk_profile) {
		throw error(404, 'Profile not found.')
	}

	return {
		profile,
		posts,
		viewerUserId: viewer_user_id,
	}
}
