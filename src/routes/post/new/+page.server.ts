import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { mock_functions } from '$lib/mock_data'

export const load: PageServerLoad = ({ locals }) => {
	const auth = locals.auth()
	if (!auth.userId) {
		throw redirect(302, '/login')
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

		mock_functions.mock_create_post(auth.userId, content)

		throw redirect(303, '/profile')
	},
}
