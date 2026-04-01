import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { create_post, delete_post, get_post_by_id, get_posts, type StoredPost } from '$lib/posts'
import { clerkClient } from 'svelte-clerk/server'
import { normalize_return_to } from '$lib/return_to'

type FeedPost = StoredPost & {
	author: {
		fullName: string
		username: string
		imageUrl?: string
	}
}

type AuthorProfile = {
	fullName: string
	username: string
	imageUrl?: string
}

function get_string_value(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined
}

function get_current_user_profile(auth: {
	userId: string | null
	sessionClaims: unknown | null
}): AuthorProfile | null {
	if (!auth.userId || !auth.sessionClaims) {
		return null
	}

	const claims = auth.sessionClaims as Record<string, unknown>
	const first_name = get_string_value(claims.first_name)
	const last_name = get_string_value(claims.last_name)
	const full_name = [first_name, last_name].filter(Boolean).join(' ')
	const username = get_string_value(claims.username) ?? 'you'
	const image_url = get_string_value(claims.image_url) ?? get_string_value(claims.picture)

	return {
		fullName: full_name || username,
		username,
		imageUrl: image_url,
	}
}

async function get_author_profiles(user_ids: string[]): Promise<Map<string, AuthorProfile>> {
	const unique_user_ids = Array.from(new Set(user_ids))
	if (unique_user_ids.length === 0) {
		return new Map()
	}

	try {
		const response = await clerkClient.users.getUserList({
			userId: unique_user_ids,
			limit: unique_user_ids.length,
		})

		if (response.data.length !== unique_user_ids.length) {
			console.warn(
				`[feed] Clerk profiles resolved ${response.data.length}/${unique_user_ids.length}. Some post author IDs are not valid Clerk users.`,
			)
		}

		return new Map(
			response.data.map((user) => {
				const fallback_name = `user:${user.id.slice(0, 8)}`
				return [
					user.id,
					{
						fullName: user.fullName ?? user.username ?? fallback_name,
						username: user.username ?? fallback_name,
						imageUrl: user.imageUrl,
					},
				] satisfies [string, AuthorProfile]
			}),
		)
	} catch (error) {
		console.error('[feed] Clerk user lookup failed:', error)
		return new Map()
	}
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const auth = locals.auth()
	const search_query = url.searchParams.get('q')?.trim().toLowerCase() ?? ''
	const stored_posts = await get_posts()
	const author_profiles = await get_author_profiles(stored_posts.map((post) => post.user_id))
	const current_user_profile = get_current_user_profile(auth)

	const posts: FeedPost[] = stored_posts
		.map((post) => {
			const fallback_name =
				post.user_id === auth.userId ? 'you' : `user:${post.user_id.slice(0, 8)}`
			const author_profile = author_profiles.get(post.user_id)
			const current_author_profile = post.user_id === auth.userId ? current_user_profile : null

			return {
				...post,
				author: {
					fullName: author_profile?.fullName ?? current_author_profile?.fullName ?? fallback_name,
					username: author_profile?.username ?? current_author_profile?.username ?? fallback_name,
					imageUrl: author_profile?.imageUrl ?? current_author_profile?.imageUrl,
				},
			}
		})
		.filter((post) => {
			if (!search_query) return true
			return (
				post.content.toLowerCase().includes(search_query) ||
				post.author.fullName.toLowerCase().includes(search_query) ||
				post.author.username.toLowerCase().includes(search_query)
			)
		})

	return {
		posts,
		search_query,
		userId: auth.userId,
		currentPath: `${url.pathname}${url.search}`,
	}
}

export const actions: Actions = {
	create_post: async ({ locals, request }) => {
		const auth = locals.auth()
		if (!auth.userId) {
			return fail(401, {
				create_error: 'Please sign in before creating a post.',
			})
		}

		const form_data = await request.formData()
		const content = String(form_data.get('content') ?? '').trim()

		if (!content) {
			return fail(400, {
				create_error: 'Post content is required.',
			})
		}

		await create_post({
			authorId: auth.userId,
			content,
		})

		return {
			create_success: true,
		}
	},
	delete_post: async ({ locals, request }) => {
		const auth = locals.auth()
		if (!auth.userId) {
			return fail(401, { delete_error: 'Please sign in before deleting a post.' })
		}

		const form_data = await request.formData()
		const post_id = Number(form_data.get('post_id'))
		const return_to = normalize_return_to(form_data.get('return_to'), '/')

		if (!Number.isInteger(post_id) || post_id <= 0) {
			return fail(400, { delete_error: 'Post id is required.' })
		}

		const post = await get_post_by_id(post_id)
		if (!post) {
			return fail(404, { delete_error: 'Post not found.' })
		}

		if (post.user_id !== auth.userId) {
			return fail(403, { delete_error: 'You can only delete your own posts.' })
		}

		await delete_post(post_id, auth.userId)
		throw redirect(303, return_to)
	},
}
