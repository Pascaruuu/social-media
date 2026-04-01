<script lang="ts">
	import { page } from '$app/state'
	import { ClerkProvider, UserButton, Show } from 'svelte-clerk'
	import SearchBar from './components/search_bar.svelte'
	import logo from '$lib/assets/logo.png'
	import empty_profile from '$lib/assets/empty_profile.png'
	import type { LayoutData } from './$types'
	import '../style.css'

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props()
	let guest_menu_open = $state(false)

	function toggle_guest_menu() {
		guest_menu_open = !guest_menu_open
	}

	function close_guest_menu() {
		guest_menu_open = false
	}

	function guest_menu_click_outside(node: HTMLElement) {
		const handle_click = (event: MouseEvent) => {
			if (node.contains(event.target as Node)) return
			close_guest_menu()
		}

		document.addEventListener('click', handle_click, true)

		return {
			destroy() {
				document.removeEventListener('click', handle_click, true)
			},
		}
	}

	const return_to = $derived(encodeURIComponent(`${page.url.pathname}${page.url.search}`))
</script>

<ClerkProvider publishableKey={data.publishableKey}>
	<div class="app">
		<header class="topbar">
			<a class="brand" href="/">
				<img class="brand-logo" src={logo} alt="Simple Social" />
			</a>

			<div class="mobile-top-search">
				<SearchBar compact={true} input_id="mobile-global-search-input" />
			</div>

			<nav>
				<a class="nav-icon-link" href="/" aria-label="Home" title="Home">
					<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M3 10.5 12 3l9 7.5" />
						<path d="M5.25 9.75V21h13.5V9.75" />
						<path d="M9.75 21v-6.75h4.5V21" />
					</svg>
				</a>

				<Show when="signed-in">
					<a class="nav-icon-link" href="/profile" aria-label="Your posts" title="Your posts">
						<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
							<rect x="4" y="3.5" width="16" height="17" rx="2.5" />
							<path d="M8 8.5h8" />
							<path d="M8 12h8" />
							<path d="M8 15.5h5" />
						</svg>
					</a>
					<UserButton />
				</Show>

				<Show when="signed-out">
					<div class="guest-menu" use:guest_menu_click_outside>
						<button
							type="button"
							class="nav-icon-link guest-trigger"
							aria-label="Account menu"
							title="Account menu"
							aria-expanded={guest_menu_open}
							onclick={toggle_guest_menu}
						>
							<img class="guest-icon" src={empty_profile} alt="" aria-hidden="true" />
						</button>

						{#if guest_menu_open}
							<div class="guest-dropdown" role="menu">
								<a href="/login" role="menuitem" onclick={close_guest_menu}>Login</a>
								<a href="/signup" role="menuitem" onclick={close_guest_menu}>Sign Up</a>
							</div>
						{/if}
					</div>
				</Show>
			</nav>
		</header>

		<main class="content">
			<div class="desktop-top-search">
				<SearchBar input_id="desktop-global-search-input" />
			</div>
			{@render children()}
		</main>

		<Show when="signed-in">
			<a
				class="composer-toggle"
				href={`/post/new?return_to=${return_to}`}
				aria-label="Create new post"
				title="Create new post"
			>
				<svg class="composer-icon" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M12 5v14" />
					<path d="M5 12h14" />
				</svg>
			</a>
		</Show>
	</div>
</ClerkProvider>
