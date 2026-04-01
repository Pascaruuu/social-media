<script lang="ts">
	import { page } from '$app/state'

	let {
		action = '/',
		placeholder = 'Search posts or users',
		compact = false,
		input_id = 'global-search-input',
	}: {
		action?: string
		placeholder?: string
		compact?: boolean
		input_id?: string
	} = $props()

	const current_query = $derived(page.url.searchParams.get('q') ?? '')
</script>

<div class={`global-search-wrap ${compact ? 'compact' : ''}`}>
	<form class="global-search" method="GET" {action} role="search">
		<label class="sr-only" for={input_id}>Search</label>
		<span class="search-icon" aria-hidden="true">
			<svg viewBox="0 0 24 24">
				<circle cx="11" cy="11" r="6.5" />
				<path d="m16 16 4 4" />
			</svg>
		</span>
		<input
			id={input_id}
			name="q"
			type="search"
			{placeholder}
			autocomplete="off"
			value={current_query}
		/>
	</form>
</div>

<style>
	.global-search-wrap {
		position: sticky;
		top: 14px;
		z-index: 40;
		padding-bottom: 24px;
		background: #fff;
	}

	.global-search-wrap.compact {
		position: static;
		top: auto;
		z-index: auto;
		padding-bottom: 0;
		background: transparent;
	}

	.global-search {
		position: relative;
		width: 100%;
	}

	.search-icon {
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: #71717a;
		display: inline-flex;
		pointer-events: none;
	}

	.search-icon svg {
		width: 16px;
		height: 16px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.global-search input {
		width: 100%;
		height: 42px;
		border: 1px solid #e4e4e7;
		border-radius: 12px;
		padding: 0 14px 0 40px;
		font-size: 0.92rem;
		color: #111827;
		background: #fff;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.global-search-wrap.compact .global-search input {
		height: 34px;
		font-size: 0.84rem;
		border-radius: 10px;
		padding-left: 34px;
	}

	.global-search-wrap.compact .search-icon {
		left: 11px;
	}

	.global-search-wrap.compact .search-icon svg {
		width: 14px;
		height: 14px;
	}

	.global-search input:focus {
		outline: none;
		border-color: #ff6000;
		box-shadow: 0 0 0 2px rgba(255, 96, 0, 0.12);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
