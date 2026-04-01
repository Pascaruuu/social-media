import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { mock_functions } from '$lib/mock_data'

export const load: PageServerLoad = ({ locals, params }) => {
	const auth = locals.auth()
	if (!auth.userId) {
		throw redirect(302, '/login')
	}

	const post = mock_functions.mock_get_posts().find((item) => item.id === params.id)
	if (!post) {
		throw error(404, 'Post not found.')
	}

	if (post.user_id !== auth.userId) {
		throw error(403, 'You can only edit your own posts.')
	}

	return { post }
}

export const actions: Actions = {
	edit_post: async ({ locals, request, params }) => {
		const auth = locals.auth()
		if (!auth.userId) {
			return fail(401, {
				edit_error: 'Please sign in before editing a post.',
			})
		}

		const existing_post = mock_functions.mock_get_posts().find((item) => item.id === params.id)
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

		if (!content) {
			return fail(400, {
				edit_error: 'Post content is required.',
			})
		}

		mock_functions.mock_edit_post(params.id, content)
		throw redirect(303, '/profile')
	},
}
