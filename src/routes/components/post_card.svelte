<script lang="ts">
	import ConfirmationModal from './confirmation_modal.svelte'
	import default_profile from '$lib/assets/empty_profile.png'
	import { helpers } from '$lib/helpers'

	let { post, user, can_manage = false, current_user_id = null, current_path = '/' } = $props()
	let show_delete_confirm = $state(false)
	let delete_form = $state<HTMLFormElement | undefined>(undefined)

	function get_author_profile_href() {
		if (current_user_id && post.user_id === current_user_id) {
			return '/profile'
		}

		return `/profile/${encodeURIComponent(post.user_id)}`
	}

	function get_edit_post_href() {
		return `/post/edit/${post.id}?return_to=${encodeURIComponent(current_path)}`
	}

	function open_delete_modal() {
		show_delete_confirm = true
	}

	function close_delete_modal() {
		show_delete_confirm = false
	}

	function confirm_delete() {
		if (!delete_form) return
		delete_form.requestSubmit()
	}
</script>

<article class="card profile-post-card">
	<div class="post-card-header">
		<div>
			<div class="post-author-row">
				<a
					class="post-author-link"
					href={get_author_profile_href()}
					aria-label={`View profile of ${user.fullName || user.username || 'user'}`}
				>
					<img
						class="post-author-logo"
						src={user.imageUrl || default_profile}
						alt=""
						aria-hidden="true"
					/>
				</a>
				<div>
					<a
						class="post-author-link"
						href={get_author_profile_href()}
						aria-label={`View profile of ${user.fullName || user.username || 'user'}`}
					>
						<p class="post-author">{user.fullName || user.username || 'guest'}</p>
					</a>
					<p class="post-date">{helpers.formatDate(post.created_at)}</p>
				</div>
			</div>
		</div>

		{#if can_manage}
			<div class="post-card-actions">
				<a
					class="icon-action-btn"
					href={get_edit_post_href()}
					aria-label="Edit post"
					title="Edit post"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20Z" />
						<path d="M12.5 7 17 11.5" />
					</svg>
				</a>

				<form bind:this={delete_form} method="POST" action="?/delete_post" class="icon-action-form">
					<input type="hidden" name="post_id" value={post.id} />
					<input type="hidden" name="return_to" value={current_path} />
					<button
						class="icon-action-btn danger-action"
						type="button"
						aria-label="Delete post"
						title="Delete post"
						onclick={open_delete_modal}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M5 7h14" />
							<path d="M9 7V5h6v2" />
							<path d="M8 7l1 12h6l1-12" />
							<path d="M10.5 10.5v6" />
							<path d="M13.5 10.5v6" />
						</svg>
					</button>
				</form>
			</div>
		{/if}
	</div>

	<p class="post-content">{post.content}</p>
	<!-- <div class="stats">
		<span>Like 0</span>
		<span>Views 0</span>
	</div> -->
</article>

<ConfirmationModal
	open={show_delete_confirm}
	tone="danger"
	title="Delete this post?"
	message="This action cannot be undone."
	confirm_text="Delete"
	cancel_text="Cancel"
	on:confirm={confirm_delete}
	on:cancel={close_delete_modal}
/>
