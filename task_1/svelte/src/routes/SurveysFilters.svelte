<script lang="ts" context="module">
	export interface Filters {
		name: string;
		countryCode: string;
		birthDateFrom: string;
		birthDateTo: string;
	}

	export function newFilters(): Filters {
		return {
			name: "",
			countryCode: "",
			birthDateFrom: "",
			birthDateTo: "",
		};
	}
</script>

<script lang="ts">
	import CountryCodeInput from "src/lib/components/CountryCodeInput.svelte";

	import { debounce } from "src/lib/debounce";

	let {
		onChange,
	}: {
		onChange: (filters: Filters) => void;
	} = $props();

	const filters = $state(newFilters());
	let lastCleanedFilters = cleanFiltersForEventDispatch(filters);

	function cleanFiltersForEventDispatch(filters: Filters) {
		return {
			name: filters.name.trim(),
			countryCode: filters.countryCode.length === 2 ? filters.countryCode : "",
			birthDateFrom: filters.birthDateFrom,
			birthDateTo: filters.birthDateTo,
		};
	}

	function tryOnChangeDispatch() {
		const cleanedFilters = cleanFiltersForEventDispatch(filters);

		if (JSON.stringify(cleanedFilters) === JSON.stringify(lastCleanedFilters)) return;

		onChange(cleanedFilters);
		lastCleanedFilters = cleanedFilters;
	}

	async function handleNameInput() {
		const hasOverlap = await debounce({
			key: handleNameInput,
			delay: 500,
		});

		if (hasOverlap()) return;

		tryOnChangeDispatch();
	}

	async function handleInput() {
		tryOnChangeDispatch();
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
	}
</script>

<form role="search" aria-label="Search surveys" onsubmit={handleSubmit}>
	<label class="input-box">
		<span>Search Name</span>
		<input type="search" placeholder="John Doe" bind:value={filters.name} oninput={handleNameInput} />
	</label>
	<fieldset class="birthdate">
		<label class="input-box">
			<span>Birth Date From</span>
			<input type="date" bind:value={filters.birthDateFrom} oninput={handleInput} />
		</label>
		<label class="input-box">
			<span>Birth Date To</span>
			<input type="date" bind:value={filters.birthDateTo} oninput={handleInput} />
		</label>
	</fieldset>
	<CountryCodeInput bind:value={filters.countryCode} onInput={handleInput} />
</form>

<style>
	form {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 40px;
		margin-block: 40px;
	}

	.input-box {
		width: 140px;
	}

	fieldset {
		border: none;
		appearance: none;
		padding: 0;
		margin: 0;
		display: flex;
		gap: 4px;
	}

	.birthdate {
		grid-column: span 2;
	}
</style>
