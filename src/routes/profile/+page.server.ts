import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { mock_functions, type Post } from '$lib/mock_data'

type ProfilePost = Post

export const load: PageServerLoad = ({ locals }) => {
	const auth = locals.auth()
	if (!auth.userId) {
		throw redirect(302, '/login')
	}

	const posts: ProfilePost[] = mock_functions
		.mock_get_user_posts(auth.userId)
		.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

	return {
		userId: auth.userId,
		posts,
	}
}

export const actions: Actions = {
	delete_post: async ({ locals, request }) => {
		const auth = locals.auth()
		if (!auth.userId) {
			return fail(401, { delete_error: 'Please sign in before deleting a post.' })
		}

		const form_data = await request.formData()
		const post_id = String(form_data.get('post_id') ?? '')

		if (!post_id) {
			return fail(400, { delete_error: 'Post id is required.' })
		}

		const post = mock_functions.mock_get_posts().find((item) => item.id === post_id)
		if (!post) {
			return fail(404, { delete_error: 'Post not found.' })
		}

		if (post.user_id !== auth.userId) {
			return fail(403, { delete_error: 'You can only delete your own posts.' })
		}

		mock_functions.mock_delete_post(post_id)
		return { delete_success: true }
	},
}
