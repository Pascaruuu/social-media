import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { mock_functions, type Post, type User } from '$lib/mock_data'

type FeedPost = Post & {
	author: Pick<User, 'fullName' | 'username' | 'imageUrl'>
}

export const load: PageServerLoad = ({ locals, url }) => {
	const auth = locals.auth()
	const search_query = url.searchParams.get('q')?.trim().toLowerCase() ?? ''

	const posts: FeedPost[] = mock_functions
		.mock_get_posts()
		.map((post) => {
			const author = mock_functions.mock_get_profile(post.user_id)
			const fallback_name =
				post.user_id === auth.userId ? 'you' : `user:${post.user_id.slice(0, 8)}`

			return {
				...post,
				author: {
					fullName: author?.fullName ?? fallback_name,
					username: author?.username ?? fallback_name,
					imageUrl: author?.imageUrl,
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
		.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

	return {
		posts,
		search_query,
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

		return {
			create_success: true,
		}
	},
}
