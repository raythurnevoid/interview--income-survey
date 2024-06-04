<script lang="ts">
	import type { FormEventHandler } from "svelte/elements";
	import { countryCodesContext } from "../contexts";

	let {
		value = $bindable(""),
		onInput,
	}: {
		value?: string;
		onInput?: FormEventHandler<HTMLInputElement>;
	} = $props();

	const options = countryCodesContext.get();
</script>

<label class="CountryCodeInput input-box country">
	<span>Search Country</span>
	<input placeholder="US" maxlength="2" list="countries" autocomplete="country" bind:value oninput={onInput} />
	<datalist id="countries">
		{#each options as option}
			<option>{option}</option>
		{/each}
	</datalist>
</label>

<style>
	input {
		text-transform: uppercase;
	}
</style>
