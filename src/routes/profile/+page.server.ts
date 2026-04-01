import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { delete_post, get_post_by_id, get_user_posts, type StoredPost } from '$lib/posts'
import { normalize_return_to } from '$lib/return_to'

type ProfilePost = StoredPost

export const load: PageServerLoad = async ({ locals, url }) => {
	const auth = locals.auth()
	if (!auth.userId) {
		throw redirect(302, '/login')
	}

	const posts: ProfilePost[] = await get_user_posts(auth.userId)

	return {
		userId: auth.userId,
		posts,
		currentPath: `${url.pathname}${url.search}`,
	}
}

export const actions: Actions = {
	delete_post: async ({ locals, request }) => {
		const auth = locals.auth()
		if (!auth.userId) {
			return fail(401, { delete_error: 'Please sign in before deleting a post.' })
		}

		const form_data = await request.formData()
		const post_id = Number(form_data.get('post_id'))
		const return_to = normalize_return_to(form_data.get('return_to'), '/profile')

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
