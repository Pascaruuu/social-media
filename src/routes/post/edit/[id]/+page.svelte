<script lang="ts">
	import { Show } from 'svelte-clerk'
	import { useClerkContext } from 'svelte-clerk'
	import PostForm from '../../../components/post_form.svelte'
	import type { PageData } from './$types'

	let { form, data }: { form: any; data: PageData } = $props()

	const ctx = useClerkContext()
	const user = $derived(ctx.user)
</script>

<Show when="signed-in">
	<section class="new-post-overlay">
		<PostForm
			{user}
			{form}
			post_content={data.post.content}
			form_action="?/edit_post"
			submit_label="Save post"
			cancel_href={data.return_to}
			return_to={data.return_to}
			confirm_cancel={true}
			confirm_submit={true}
			cancel_confirm_title="Discard post changes?"
			cancel_confirm_message="Any updates you made to this post will be lost."
			submit_confirm_title="Save this edit?"
			submit_confirm_message="Your post will be updated with these changes."
		/>
	</section>
</Show>
