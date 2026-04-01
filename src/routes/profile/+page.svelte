<script lang="ts">
	import { useClerkContext } from 'svelte-clerk'
	import type { PageData } from './$types'
	import ProfileCard from '../components/profile_card.svelte'
	import PostCard from '../components/post_card.svelte'

	let { data }: { data: PageData } = $props()

	const ctx = useClerkContext()
	const user = $derived(ctx.user)
</script>

<ProfileCard {user} />

<hr class="divider" />

<section class="posts-section">
	{#if user && data.posts && data.posts.length > 0}
		<div class="feed">
			{#each data.posts as post}
				<PostCard {post} {user} can_manage={true} />
			{/each}
		</div>
	{:else}
		<div class="card">
			<p>You haven't posted anything yet.</p>
		</div>
	{/if}
</section>
