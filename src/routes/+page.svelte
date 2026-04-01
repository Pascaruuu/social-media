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
				<!-- <article class="card">
					<p class="meta">@{post.author_username} - {new Date(post.created_at).toLocaleString()}</p>
					<p>{post.content}</p>
				</article> -->
				<PostCard {post} user={post.author} />
			{/each}
		{/if}
	</div>
</section>
