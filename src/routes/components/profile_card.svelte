<script lang="ts">
	let { user } = $props()
</script>

<section class="profile-compact">
	{#if user}
		<div class="user-identity-bar">
			<img
				src={user.imageUrl}
				alt={user.fullName || user.username || 'User'}
				class="avatar-small"
			/>

			<div class="name-stack">
				<h1 class="display-name">{user.fullName || user.username}</h1>
				<p class="handle">@{user.emailAddresses[0]?.emailAddress || 'unknown'}</p>
			</div>
		</div>
	{:else}
		<p class="loading">Loading profile...</p>
	{/if}
</section>
