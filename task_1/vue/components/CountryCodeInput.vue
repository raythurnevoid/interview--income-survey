<script setup lang="ts">
import { countryCodesContext } from "@/lib/contexts";

const value = defineModel<string>({
	default: "",
});

const emit = defineEmits<{
	(e: "input", value: string): void;
}>();

const options = countryCodesContext.get();
</script>

<template>
	<label class="CountryCodeInput input-box country">
		<span>Search Country</span>
		<input
			placeholder="US"
			maxlength="2"
			list="countries"
			autocomplete="country"
			v-model="value"
			@input="$emit('input', value)"
		/>
		<datalist id="countries">
			<option v-for="option in options" :key="option">{{ option }}</option>
		</datalist>
	</label>
</template>

<style scoped>
input {
	text-transform: uppercase;
}
</style>
