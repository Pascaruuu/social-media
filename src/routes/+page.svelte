<script lang="ts">
	import type { ActionData, PageData } from './$types'
	import PostCard from './components/post_card.svelte'

	let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<section>
	<div class="feed">
		{#if data.posts.length === 0}
			<div class="card"><p>No posts yet.</p></div>
		{:else}
			{#each data.posts as post}
				<PostCard
					{post}
					user={post.author}
					current_user_id={data.userId ?? null}
					current_path={data.currentPath}
					can_manage={Boolean(data.userId && data.userId === post.user_id)}
				/>
			{/each}
		{/if}
	</div>
</section>
