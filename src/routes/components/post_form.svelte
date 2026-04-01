<script lang="ts">
	import ProfileCard from './profile_card.svelte'
	import ConfirmationModal from './confirmation_modal.svelte'
	let {
		user,
		form,
		post_content = '',
		form_action = '?/create_post',
		submit_label = 'Publish post',
		cancel_href = '/',
		return_to = '/',
		confirm_cancel = false,
		confirm_submit = false,
		cancel_confirm_title = 'Discard changes?',
		cancel_confirm_message = 'Your current edits will be lost.',
		submit_confirm_title = 'Save changes?',
		submit_confirm_message = 'Do you want to save this post now?',
	}: {
		user: any
		form: any
		post_content?: string
		form_action?: string
		submit_label?: string
		cancel_href?: string
		return_to?: string
		confirm_cancel?: boolean
		confirm_submit?: boolean
		cancel_confirm_title?: string
		cancel_confirm_message?: string
		submit_confirm_title?: string
		submit_confirm_message?: string
	} = $props()

	let post_form = $state<HTMLFormElement | undefined>(undefined)
	let show_cancel_confirm = $state(false)
	let show_submit_confirm = $state(false)

	function on_cancel_click(event: MouseEvent) {
		if (!confirm_cancel) return
		event.preventDefault()
		show_cancel_confirm = true
	}

	function on_submit_click(event: MouseEvent) {
		if (!confirm_submit) return
		event.preventDefault()
		show_submit_confirm = true
	}

	function confirm_cancel_action() {
		window.location.assign(cancel_href)
	}

	function confirm_submit_action() {
		if (!post_form) return
		post_form.requestSubmit()
	}
</script>

<div class="new-post-modal card">
	<div class="new-post-head">
		<ProfileCard {user} />
		<a
			class="new-post-close"
			href={cancel_href}
			aria-label="Close new post window"
			title="Close"
			onclick={on_cancel_click}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M6 6l12 12" />
				<path d="M18 6 6 18" />
			</svg>
		</a>
	</div>

	<form bind:this={post_form} class="new-post-form" method="POST" action={form_action}>
		<input type="hidden" name="return_to" value={return_to} />
		<textarea
			name="content"
			rows="7"
			placeholder="What are you thinking about?"
			value={post_content}
			required
		></textarea>

		{#if form?.create_error || form?.edit_error}
			<p class="new-post-error">{form?.create_error || form?.edit_error}</p>
		{/if}

		<div class="new-post-actions">
			<a class="new-post-cancel" href={cancel_href} onclick={on_cancel_click}>Cancel</a>
			<button
				class="new-post-submit"
				type="submit"
				aria-label={submit_label}
				title={submit_label}
				onclick={on_submit_click}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M5 12h14" />
					<path d="M12 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</form>
</div>

<ConfirmationModal
	open={show_cancel_confirm}
	tone="warning"
	title={cancel_confirm_title}
	message={cancel_confirm_message}
	confirm_text="Discard"
	cancel_text="Keep editing"
	on:confirm={confirm_cancel_action}
	on:cancel={() => (show_cancel_confirm = false)}
/>

<ConfirmationModal
	open={show_submit_confirm}
	tone="default"
	title={submit_confirm_title}
	message={submit_confirm_message}
	confirm_text={submit_label}
	cancel_text="Review again"
	on:confirm={confirm_submit_action}
	on:cancel={() => (show_submit_confirm = false)}
/>
