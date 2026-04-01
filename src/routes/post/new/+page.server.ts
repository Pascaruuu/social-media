import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { create_post } from '$lib/posts'
import { normalize_return_to } from '$lib/return_to'

export const load: PageServerLoad = ({ locals, url }) => {
	const auth = locals.auth()
	if (!auth.userId) {
		throw redirect(302, '/login')
	}

	return {
		return_to: normalize_return_to(url.searchParams.get('return_to'), '/profile'),
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
		const return_to = normalize_return_to(form_data.get('return_to'), '/profile')

		if (!content) {
			return fail(400, {
				create_error: 'Post content is required.',
			})
		}

		await create_post({
			authorId: auth.userId,
			content,
		})

		throw redirect(303, return_to)
	},
}
