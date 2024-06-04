<script setup lang="ts">
import type { Sort } from "@/server/api/surveys/list";

const props = defineProps<{
	direction: Sort;
}>();
</script>

<template>
	<svg
		:class="{
			asc: props.direction === 'asc',
			desc: props.direction === 'desc',
		}"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M5 15l7-7 7 7"
		/>
	</svg>
</template>

<style scoped>
svg {
	display: inline-block;
	height: 1em;
	width: 1em;
}

svg.desc {
	transform: rotate(180deg);
}
</style>
