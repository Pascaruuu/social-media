<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { Snippet } from 'svelte'

	type ConfirmationTone = 'default' | 'danger' | 'warning' | 'success'
	type CloseReason = 'cancel' | 'backdrop' | 'escape'

	let {
		open = false,
		title = 'Please confirm',
		message = 'Are you sure you want to continue?',
		confirm_text = 'Confirm',
		cancel_text = 'Cancel',
		tone = 'default',
		busy = false,
		close_on_backdrop = true,
		close_on_escape = true,
		show_icon = true,
		children,
		actions,
	}: {
		open?: boolean
		title?: string
		message?: string
		confirm_text?: string
		cancel_text?: string
		tone?: ConfirmationTone
		busy?: boolean
		close_on_backdrop?: boolean
		close_on_escape?: boolean
		show_icon?: boolean
		children?: Snippet
		actions?: Snippet
	} = $props()

	const dispatch = createEventDispatcher<{
		confirm: void
		cancel: { reason: CloseReason }
		close: { reason: CloseReason }
	}>()

	const tone_class = $derived(`tone-${tone}`)

	function close_modal(reason: CloseReason) {
		dispatch('cancel', { reason })
		dispatch('close', { reason })
	}

	function confirm_action() {
		dispatch('confirm')
	}

	function on_keydown(event: KeyboardEvent) {
		if (!open || !close_on_escape) return
		if (event.key === 'Escape') {
			event.preventDefault()
			close_modal('escape')
		}
	}
</script>

<svelte:window onkeydown={on_keydown} />

{#if open}
	<div class="confirm-overlay" role="presentation">
		{#if close_on_backdrop}
			<button
				type="button"
				class="confirm-backdrop-hit"
				aria-label="Close confirmation dialog"
				onclick={() => close_modal('backdrop')}
			></button>
		{/if}

		<div
			class={`confirm-modal ${tone_class}`}
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-modal-title"
		>
			<div class="confirm-header">
				<!-- {#if show_icon}
					<div class={`confirm-icon ${tone_class}`} aria-hidden="true">
						{#if tone === 'danger'}
							<svg viewBox="0 0 24 24">
								<path d="M12 8v5.5" />
								<circle cx="12" cy="17.2" r="0.8" />
								<path
									d="M10.6 3.8 2.8 18A2 2 0 0 0 4.5 21h15a2 2 0 0 0 1.8-3L13.4 3.8a1.6 1.6 0 0 0-2.8 0Z"
								/>
							</svg>
						{:else if tone === 'warning'}
							<svg viewBox="0 0 24 24">
								<path d="M12 8v5.5" />
								<circle cx="12" cy="17.2" r="0.8" />
								<circle cx="12" cy="12" r="9" />
							</svg>
						{:else if tone === 'success'}
							<svg viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="9" />
								<path d="m8.5 12.5 2.3 2.3 4.7-4.7" />
							</svg>
						{:else}
							<svg viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="9" />
								<path d="M12 10v5" />
								<circle cx="12" cy="7.5" r="0.8" />
							</svg>
						{/if}
					</div>
				{/if} -->

				<h2 id="confirm-modal-title" class="confirm-title">{title}</h2>
			</div>

			{#if message}
				<p class="confirm-message">{message}</p>
			{/if}

			{#if children}
				<div class="confirm-body">{@render children()}</div>
			{/if}

			<div class="confirm-actions">
				{#if actions}
					{@render actions()}
				{:else}
					<button
						type="button"
						class="confirm-cancel"
						disabled={busy}
						onclick={() => close_modal('cancel')}
					>
						{cancel_text}
					</button>
					<button
						type="button"
						class={`confirm-submit ${tone_class}`}
						disabled={busy}
						onclick={confirm_action}
					>
						{confirm_text}
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.confirm-overlay {
		position: fixed;
		inset: 0;
		z-index: 1200;
		padding: 16px;
		background: rgba(15, 23, 42, 0.45);
		backdrop-filter: blur(2px);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.confirm-modal {
		position: relative;
		z-index: 2;
		width: min(440px, 100%);
		background: #fff;
		border: 1px solid #e4e4e7;
		border-radius: 14px;
		padding: 18px;
		box-shadow:
			0 12px 30px rgba(0, 0, 0, 0.16),
			0 3px 8px rgba(0, 0, 0, 0.08);
	}

	.confirm-backdrop-hit {
		position: absolute;
		inset: 0;
		border: 0;
		padding: 0;
		background: transparent;
		cursor: default;
	}

	.confirm-header {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.confirm-icon {
		width: 28px;
		height: 28px;
		border-radius: 999px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.confirm-title {
		font-size: 1rem;
		font-weight: 700;
		color: #111827;
		margin: 0;
	}

	.confirm-message {
		margin-top: 10px;
		font-size: 0.92rem;
		color: #71717a;
		line-height: 1.45;
	}

	.confirm-body:empty {
		display: none;
	}

	.confirm-body {
		margin-top: 10px;
	}

	.confirm-actions {
		margin-top: 18px;
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}

	.confirm-actions button {
		padding: 8px 14px;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 600;
		border: 1px solid transparent;
		cursor: pointer;
	}

	.confirm-cancel {
		background: #fff;
		color: #52525b;
		border-color: #e4e4e7;
	}

	.confirm-cancel:hover {
		background: #f4f4f5;
	}

	.confirm-submit {
		color: #fff;
	}

	.tone-default.confirm-submit {
		background: #ff6000;
	}

	.tone-default.confirm-icon {
		background: rgba(255, 96, 0, 0.12);
		color: #ff6000;
	}

	.tone-danger.confirm-submit {
		background: #dc2626;
	}

	.tone-danger.confirm-icon {
		background: rgba(220, 38, 38, 0.12);
		color: #dc2626;
	}

	.tone-warning.confirm-submit {
		background: #d97706;
	}

	.tone-warning.confirm-icon {
		background: rgba(217, 119, 6, 0.14);
		color: #d97706;
	}

	.tone-success.confirm-submit {
		background: #16a34a;
	}

	.tone-success.confirm-icon {
		background: rgba(22, 163, 74, 0.14);
		color: #16a34a;
	}

	.confirm-actions button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 540px) {
		.confirm-modal {
			padding: 16px;
		}

		.confirm-actions {
			flex-direction: column-reverse;
		}

		.confirm-actions button {
			width: 100%;
		}
	}
</style>
