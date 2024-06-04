<script setup lang="ts">
import SurveysFilters from "./SurveysFilters.vue";
import SurveysTable from "./SurveysTable.vue";
import { newFilters, type Filters } from "./SurveysFilters";
import axios from "axios";
import type { Survey } from "~/lib/server/db/schema";
import type { Sort } from "~/server/api/surveys/list";

let page = ref(1);
let isFetching = ref(true);
let surveys = ref<Survey[]>([]);
let filters = ref(newFilters());
let canAppendResults = ref(true);
let lastPageReached = ref(false);
let sort = ref<Sort>("desc");

onMounted(() => {
	fetchData();

	window.addEventListener("app:refresh-data", refreshData);
});

onUnmounted(() => {
	window.removeEventListener("app:refresh-data", refreshData);
});

function fetchData() {
	isFetching.value = true;

	const url = new URL("/api/surveys/list", window.location.origin);

	url.searchParams.set("page", "" + page.value);

	if (filters.value.name) url.searchParams.set("name", filters.value.name);
	if (filters.value.countryCode)
		url.searchParams.set("country-code", filters.value.countryCode);
	if (filters.value.birthDateFrom)
		url.searchParams.set("from-birth-date", filters.value.birthDateFrom);
	if (filters.value.birthDateTo)
		url.searchParams.set("to-birth-date", filters.value.birthDateTo);

	url.searchParams.set("sort", sort.value);

	axios.get<Survey[]>(url.toString()).then((response) => {
		if (canAppendResults.value) {
			surveys.value = [...surveys.value, ...response.data];
		} else {
			surveys.value = response.data;
		}

		if (response.data.length < 100) {
			lastPageReached.value = true;
		}

		isFetching.value = false;
		canAppendResults.value = true;
	});
}

function refreshData() {
	page.value = 1;
	canAppendResults.value = false;
	lastPageReached.value = false;
	fetchData();
}

function handleFiltersChange(newFilters: Filters) {
	filters.value = newFilters;
	refreshData();
}

function handleSortChange(newSort: Sort) {
	sort.value = newSort;
	refreshData();
}

function handleEndOfTable() {
	if (isFetching.value || lastPageReached.value) return;

	page.value += 1;
	fetchData();
}
</script>

<template>
	<div class="SurveysListPage">
		<h1>Surveys</h1>
		<SurveysFilters @change="handleFiltersChange" />
		<p v-if="isFetching">Loading...</p>
		<p v-else-if="surveys.length === 0">No surveys found.</p>
		<p v-else>
			Showing {{ surveys.length }}{{ lastPageReached ? "" : "+" }} survey{{
				surveys.length > 1 ? "s" : ""
			}}.
		</p>
		<SurveysTable
			:surveys="surveys"
			:sort="sort"
			@sortChange="handleSortChange"
			@endOfTable="handleEndOfTable"
		/>
	</div>
</template>

<style scoped>
.SurveysListPage {
	max-width: max-content;
	margin-inline: auto;
}
</style>
