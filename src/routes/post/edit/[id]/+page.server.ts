import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { get_post_by_id, update_post } from '$lib/posts'
import { normalize_return_to } from '$lib/return_to'

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const auth = locals.auth()
	if (!auth.userId) {
		throw redirect(302, '/login')
	}

	const post_id = Number(params.id)
	if (!Number.isInteger(post_id) || post_id <= 0) {
		throw error(404, 'Post not found.')
	}

	const post = await get_post_by_id(post_id)
	if (!post) {
		throw error(404, 'Post not found.')
	}

	if (post.user_id !== auth.userId) {
		throw error(403, 'You can only edit your own posts.')
	}

	return {
		post,
		return_to: normalize_return_to(url.searchParams.get('return_to'), '/profile'),
	}
}

export const actions: Actions = {
	edit_post: async ({ locals, request, params }) => {
		const auth = locals.auth()
		if (!auth.userId) {
			return fail(401, {
				edit_error: 'Please sign in before editing a post.',
			})
		}

		const post_id = Number(params.id)
		if (!Number.isInteger(post_id) || post_id <= 0) {
			return fail(404, {
				edit_error: 'Post not found.',
			})
		}

		const existing_post = await get_post_by_id(post_id)
		if (!existing_post) {
			return fail(404, {
				edit_error: 'Post not found.',
			})
		}

		if (existing_post.user_id !== auth.userId) {
			return fail(403, {
				edit_error: 'You can only edit your own posts.',
			})
		}

		const form_data = await request.formData()
		const content = String(form_data.get('content') ?? '').trim()
		const return_to = normalize_return_to(form_data.get('return_to'), '/profile')

		if (!content) {
			return fail(400, {
				edit_error: 'Post content is required.',
			})
		}

		await update_post(post_id, auth.userId, { content })
		throw redirect(303, return_to)
	},
}
