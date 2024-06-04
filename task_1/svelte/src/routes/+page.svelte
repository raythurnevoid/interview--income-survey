<script lang="ts">
	import SurveysTable from "./SurveysTable.svelte";
	import type { Sort } from "src/routes/api/surveys/list/+server";
	import axios from "axios";
	import SurveysFilters, { newFilters, type Filters } from "./SurveysFilters.svelte";
	import type { Survey } from "src/lib/server/db/schema";
	import { untrack } from "svelte";

	let page = $state(1);
	let isFetching = $state(true);
	let surveys: Survey[] = $state([]);
	let filters: Filters = $state(newFilters());
	let canAppendResults = true;
	let lastPageReached = $state(false);
	let sort: Sort = $state("desc");

	$effect(() => {
		untrack(() => {
			fetchData();
		});
	});

	$effect(() => {
		window.addEventListener("app:refresh-data", refreshData);

		return () => window.removeEventListener("app:refresh-data", refreshData);
	});

	function fetchData() {
		isFetching = true;

		const url = new URL("/api/surveys/list", window.location.origin);

		url.searchParams.set("page", "" + page);

		if (filters.name) url.searchParams.set("name", filters.name);
		if (filters.countryCode) url.searchParams.set("country-code", filters.countryCode);
		if (filters.birthDateFrom) url.searchParams.set("from-birth-date", filters.birthDateFrom);
		if (filters.birthDateTo) url.searchParams.set("to-birth-date", filters.birthDateTo);

		url.searchParams.set("sort", sort);

		axios.get<Survey[]>(url.toString()).then((response) => {
			if (canAppendResults) {
				surveys = [...surveys, ...response.data];
			} else {
				surveys = response.data;
			}

			if (response.data.length < 100) {
				lastPageReached = true;
			}

			isFetching = false;
			canAppendResults = true;
		});
	}

	function refreshData() {
		page = 1;
		canAppendResults = false;
		lastPageReached = false;
		fetchData();
	}

	function handleFiltersChange(newFilters: Filters) {
		filters = newFilters;
		refreshData();
	}

	function handleSortChange(newSort: Sort) {
		sort = newSort;
		refreshData();
	}

	function handleEndOfTable() {
		if (isFetching || lastPageReached) return;

		page += 1;
		fetchData();
	}
</script>

<div class="SurveysListPage">
	<h1>Surveys</h1>
	<SurveysFilters onChange={handleFiltersChange} />
	{#if isFetching}
		<p>Loading...</p>
	{:else if surveys.length === 0}
		<p>No surveys found.</p>
	{:else}
		<p>Showing {surveys.length}{lastPageReached ? "" : "+"} {`survey${surveys.length > 1 ? "s" : ""}`}.</p>
	{/if}
	<SurveysTable {surveys} {sort} onSortChange={handleSortChange} onEndOfTable={handleEndOfTable}></SurveysTable>
</div>

<style>
	.SurveysListPage {
		max-width: max-content;
		margin-inline: auto;
	}
</style>
