<script lang="ts">
	import { Show } from 'svelte-clerk'
	import { useClerkContext } from 'svelte-clerk'
	import PostForm from '../../components/post_form.svelte'
	import type { ActionData } from './$types'

	let { form }: { form: ActionData } = $props()

	const ctx = useClerkContext()
	const user = $derived(ctx.user)
</script>

<Show when="signed-in">
	<section class="new-post-overlay">
		<PostForm {user} {form} post_content="" />
	</section>
</Show>
