<script lang="ts">
	import type { Sort } from "./api/surveys/list/+server";

	let { direction }: { direction: Sort } = $props();
</script>

<svg
	class:asc={direction === "asc"}
	class:desc={direction === "desc"}
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke="currentColor"
>
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
</svg>

<style>
	svg {
		display: inline-block;
		height: 1em;
		width: 1em;
	}

	svg.desc {
		transform: rotate(180deg);
	}
</style>
