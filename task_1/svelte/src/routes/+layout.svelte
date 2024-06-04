<script lang="ts">
	import "./app.css";
	import { page } from "$app/stores";
	import { onNavigate } from "$app/navigation";
	import { listenForSubmitFromOtherBrowserTabs } from "src/lib/browser-tabs-communication";
	import { countryCodesContext } from "src/lib/contexts";

	let { children, data } = $props();

	countryCodesContext.set(data.countryCodes);

	let currentPath = $derived($page.url.pathname);
	let nextPath = $state("");
	let pathToHighlight = $derived(() => nextPath || currentPath);

	let scrollY: number = $state(0);
	let innerHeight: number = $state(0);
	let isInSurveysListPage = $derived(() => currentPath === "/");
	let shouldScrollTopButtonShow = $derived(() => scrollY > innerHeight && isInSurveysListPage());
	let shouldShowRefreshDataButton = $state(false);

	$effect(() => {
		return listenForSubmitFromOtherBrowserTabs(() => {
			if (!isInSurveysListPage()) return;
			shouldShowRefreshDataButton = true;
		});
	});

	onNavigate((url) => {
		nextPath = url.to?.url.pathname ?? "";

		return () => {
			nextPath = "";
		};
	});

	function scrollToTop() {
		setTimeout(() => {
			// may conflict with user scroll
			window.scrollTo({ top: 0, behavior: "smooth" });
		}, 100);
	}

	function handleRefreshDataClick() {
		scrollToTop();
		shouldShowRefreshDataButton = false;

		setTimeout(() => {
			// wait for the scroll to finish
			window.dispatchEvent(new CustomEvent("app:refresh-data"));
		}, 300);
	}
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div class="Layout">
	<header>
		<section>
			<nav>
				<ul>
					<li>
						<a class:current={pathToHighlight() === "/"} href="/" inert={pathToHighlight() === "/"}>List</a>
					</li>
					<li>
						<a class:current={pathToHighlight() === "/submit"} href="/submit">Submit</a>
					</li>
				</ul>
			</nav>
			<section class="right">
				{#if shouldShowRefreshDataButton}
					<div>
						<span> New data is available: </span>
						<button class="secondary" onclick={handleRefreshDataClick}>
							<span>Refresh Data</span>
						</button>
					</div>
				{/if}

				{#if shouldScrollTopButtonShow()}
					<button class="secondary" onclick={scrollToTop}>
						<span>Scroll To Top</span>
					</button>
				{/if}
			</section>
		</section>
		<div class="shadow"></div>
	</header>

	<section class="content">
		{@render children()}
	</section>
</div>

<style>
	.Layout {
		display: contents;
		--header-height: 56px;
	}

	header {
		position: sticky;
		inset-block-start: 0;
		z-index: 1;
		background: var(--color--surface);
		height: var(--header-height);
		padding-inline-end: 16px;
	}

	nav,
	ul,
	li,
	a,
	header section {
		height: 100%;
	}

	header section,
	ul {
		display: flex;
	}

	header section {
		justify-content: space-between;
	}

	a {
		display: flex;
		align-items: center;
		padding-inline: 16px;
		border-block-end: solid 4px transparent;
		color: var(--color--primary);

		&:hover {
			border-block-end-color: hsl(from var(--color--secondary) h s 80);
		}

		&:active {
			border-block-end-color: var(--color--secondary);
		}

		&.current {
			border-block-end-color: var(--color--secondary);
		}
	}

	.content {
		--content-margin: 16px;

		margin: var(--content--margin);
		min-height: calc(100dvh - var(--header-height) - var(--content-margin));
	}

	.right {
		display: flex;
		height: 100%;
		align-items: center;
		gap: 16px;
	}
</style>
