<script lang="ts">
	import type { PageData } from './$types'
	import PostCard from '../../components/post_card.svelte'
	import ProfileCard from '../../components/profile_card.svelte'

	let { data }: { data: PageData } = $props()
</script>

<ProfileCard user={data.profile} />

<hr class="divider" />

<section class="posts-section">
	{#if data.posts.length > 0}
		<div class="feed">
			{#each data.posts as post}
				<PostCard {post} user={data.profile} current_user_id={data.viewerUserId ?? null} />
			{/each}
		</div>
	{:else}
		<div class="card">
			<p>No posts yet.</p>
		</div>
	{/if}
</section>
