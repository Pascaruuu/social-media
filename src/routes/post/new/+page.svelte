<script lang="ts">
	import { Show } from 'svelte-clerk'
	import { useClerkContext } from 'svelte-clerk'
	import PostForm from '../../components/post_form.svelte'
	import type { ActionData, PageData } from './$types'

	let { form, data }: { form: ActionData; data: PageData } = $props()

	const ctx = useClerkContext()
	const user = $derived(ctx.user)
</script>

<Show when="signed-in">
	<section class="new-post-overlay">
		<PostForm
			{user}
			{form}
			post_content=""
			cancel_href={data.return_to}
			return_to={data.return_to}
		/>
	</section>
</Show>
