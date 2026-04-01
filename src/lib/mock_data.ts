// --- mock data container -----------------------------------------

export interface User {
	id: string
	username: string
	fullName: string
	primaryEmailAddress: string
	imageUrl?: string
	bio?: string
}

export interface Post {
	id: string
	user_id: string
	content: string
	image?: string
	created_at: Date
}

// --- list of mock users (clerk-like ids) -------------------------

export const mock_users: User[] = [
	{
		id: 'user_mock_john',
		username: 'john_doe',
		fullName: 'John Doe',
		primaryEmailAddress: 'john@example.com',
		imageUrl: '',
		bio: 'Web developer and tech enthusiast',
	},
	{
		id: 'user_mock_jane',
		username: 'jane_smith',
		fullName: 'Jane Smith',
		primaryEmailAddress: 'jane@example.com',
		imageUrl: '',
		bio: 'Photographer and nature lover',
	},
	{
		id: 'user_mock_alex',
		username: 'alex_tech',
		fullName: 'Alex Tech',
		primaryEmailAddress: 'alex@example.com',
		imageUrl: '',
		bio: 'Software engineer and open source contributor',
	},
]

// --- list of mock posts ------------------------------------------

export const mock_posts: Post[] = [
	{
		id: '1',
		user_id: 'user_mock_jane',
		content: 'Just finished an amazing project! Feeling proud.',
		created_at: new Date('2026-03-24'),
	},
	{
		id: '2',
		user_id: 'user_mock_alex',
		content: 'Beautiful sunset at the beach today.',
		created_at: new Date('2026-03-23'),
	},
	{
		id: '3',
		user_id: 'user_mock_john',
		content: 'My first post on this new social media platform!',
		created_at: new Date('2026-03-22'),
	},
]

// --- mock functions to simulate API calls ------------------------

export const mock_functions = {
	mock_get_posts: () => mock_posts,

	mock_get_user_posts: (user_id: string) => mock_posts.filter((post) => post.user_id === user_id),

	mock_get_profile: (user_id: string) => mock_users.find((user) => user.id === user_id),

	mock_edit_profile: (
		user_id: string,
		new_bio: string,
		new_image_url?: string,
	): User | undefined => {
		const user = mock_users.find((u) => u.id === user_id)
		if (user) {
			user.bio = new_bio
			if (new_image_url !== undefined) {
				user.imageUrl = new_image_url
			}
			return user
		}
		return undefined
	},

	mock_get_searched_users: (query: string): User[] =>
		mock_users.filter(
			(user) =>
				user.username.toLowerCase().includes(query.toLowerCase()) ||
				user.fullName.toLowerCase().includes(query.toLowerCase()) ||
				user.primaryEmailAddress.toLowerCase().includes(query.toLowerCase()),
		),

	mock_get_searched_posts: (query: string): Post[] =>
		mock_posts.filter((post) => post.content.toLowerCase().includes(query.toLowerCase())),

	mock_create_post: (user_id: string, content: string, image?: string): Post => {
		const new_post: Post = {
			id: (mock_posts.length + 1).toString(),
			user_id,
			content,
			image,
			created_at: new Date(),
		}
		mock_posts.push(new_post)
		return new_post
	},

	mock_edit_post: (post_id: string, new_content: string, new_image?: string): Post | undefined => {
		const post = mock_posts.find((p) => p.id === post_id)
		if (post) {
			post.content = new_content
			if (new_image !== undefined) {
				post.image = new_image
			}
			return post
		}
		return undefined
	},

	mock_delete_post: (post_id: string): boolean => {
		const post_index = mock_posts.findIndex((p) => p.id === post_id)
		if (post_index !== -1) {
			mock_posts.splice(post_index, 1)
			return true
		}
		return false
	},
}
