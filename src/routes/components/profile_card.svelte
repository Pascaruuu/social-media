<script lang="ts">
	import empty_profile from '$lib/assets/empty_profile.png'
	let { user } = $props()

	function get_display_email(value: unknown): string {
		if (!value || typeof value !== 'object') return 'not-a-clerk-user'

		const maybe_user = value as {
			emailAddress?: string
			emailAddresses?: Array<{ emailAddress?: string }>
		}

		return (
			maybe_user.emailAddress ?? maybe_user.emailAddresses?.[0]?.emailAddress ?? 'not-a-clerk-user'
		)
	}
</script>

<section class="profile-compact">
	{#if user}
		<div class="user-identity-bar">
			<img
				src={user.imageUrl || empty_profile}
				alt={user.fullName || user.username || 'User'}
				class="avatar-small"
			/>

			<div class="name-stack">
				<h1 class="display-name">{user.fullName || user.username}</h1>
				<p class="handle">@{get_display_email(user)}</p>
			</div>
		</div>
	{:else}
		<p class="loading">Loading profile...</p>
	{/if}
</section>
