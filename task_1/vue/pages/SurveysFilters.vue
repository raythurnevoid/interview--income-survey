<script setup lang="ts">
import CountryCodeInput from "@/components/CountryCodeInput.vue";
import { debounce } from "@/lib/debounce";
import { newFilters, type Filters } from "~/pages/SurveysFilters";

const emit = defineEmits<{
	(e: "change", filters: Filters): void;
}>();

const filters = ref(newFilters());
let lastCleanedFilters = ref(cleanFiltersForEventDispatch(filters.value));

function cleanFiltersForEventDispatch(filters: Filters) {
	return {
		name: filters.name.trim(),
		countryCode: filters.countryCode.length === 2 ? filters.countryCode : "",
		birthDateFrom: filters.birthDateFrom,
		birthDateTo: filters.birthDateTo,
	};
}

function tryOnChangeDispatch() {
	const cleanedFilters = cleanFiltersForEventDispatch(filters.value);

	if (JSON.stringify(cleanedFilters) === JSON.stringify(lastCleanedFilters))
		return;

	emit("change", cleanedFilters);
	lastCleanedFilters.value = cleanedFilters;
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

function handleSubmit(event: Event) {
	event.preventDefault();
}
</script>

<template>
	<form role="search" aria-label="Search surveys" @submit="handleSubmit">
		<label class="input-box">
			<span>Search Name</span>
			<input
				type="search"
				placeholder="John Doe"
				v-model="filters.name"
				@input="handleNameInput"
			/>
		</label>
		<fieldset class="birthdate">
			<label class="input-box">
				<span>Birth Date From</span>
				<input
					type="date"
					v-model="filters.birthDateFrom"
					@input="handleInput"
				/>
			</label>
			<label class="input-box">
				<span>Birth Date To</span>
				<input type="date" v-model="filters.birthDateTo" @input="handleInput" />
			</label>
		</fieldset>
		<CountryCodeInput v-model="filters.countryCode" @input="handleInput" />
	</form>
</template>

<style scoped>
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
