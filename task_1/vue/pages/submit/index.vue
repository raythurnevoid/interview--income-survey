<script setup lang="ts">
import CountryCodeInput from "@/components/CountryCodeInput.vue";
import axios, { AxiosError } from "axios";
import { delay } from "@/lib/delay";
import type { Survey } from "@/lib/server/db/schema";
import { notifySubmitToOtherBrowserTabs } from "@/lib/browser-tabs-communication";
import { Issue } from "@/lib/issue";

let formdata = ref<Omit<Survey, "id" | "income"> & { income: number | null }>({
	firstName: "",
	lastName: "",
	birthDate: "",
	countryCode: "",
	income: null,
});

let loading = ref(false);

let submitIssue = ref<Issue<AxiosError<{ message: string }>> | null>(null);

computed(() => {
	void { ...formdata.value };
	submitIssue.value = null;
});

async function handleSubmit(event: Event) {
	event.preventDefault();

	submitIssue.value = null;

	const url = new URL("/api/surveys/survey", window.location.origin);
	loading.value = true;
	await delay(1000);
	const response = await axios
		.post(url.toString(), formdata.value)
		.catch((e: AxiosError<{ message: string }>) => new Issue(e));

	if (response instanceof Issue) {
		submitIssue.value = response;
		return;
	}

	notifySubmitToOtherBrowserTabs();

	await navigateTo("/");
	loading.value = false;
}
</script>

<template>
	<!-- <div class="SubmitPage" class:loading>
		<form onsubmit={handleSubmit} inert={loading}>
			<label class="input-box first-name">
				<span>First Name</span>
				<input type="text" placeholder="John" required bind:value={formdata.firstName} />
			</label>
			<label class="input-box last-name">
				<span>Last Name</span>
				<input type="text" placeholder="Doe" required bind:value={formdata.lastName} />
			</label>
			<label class="input-box birth-date">
				<span>Birth Date</span>
				<input type="date" required autocomplete="bday" bind:value={formdata.birthDate} />
			</label>
			<div class="country-code">
				<CountryCodeInput bind:value={formdata.countryCode} />
			</div>
			<label class="input-box income">
				<span>Income</span>
				<input type="number" required min="0" step="0.01" placeholder="50000.00" bind:value={formdata.income} />
			</label>
			<div class="submit">
				<button class="primary" type="submit">
					<span>Submit</span>
				</button>
				{#if submitIssue}
					<p class="submit-issue">
						<small>
							{(submitIssue.issue.response?.data.message ?? submitIssue.issue.message)
								.replace('"lastName"', '"Last Name"')
								.replace('"firstName"', '"First Name"')
								.replace('"birthDate"', '"Birth Date"')
								.replace('"countryCode"', '"Country Code"')
								.replace('"income"', '"Income"')}
						</small>
					</p>
				{/if}
			</div>
		</form>
	</div> -->

	<div class="SubmitPage" :class="{ loading: loading }">
		<form @submit="handleSubmit" :inert="loading">
			<label class="input-box first-name">
				<span>First Name</span>
				<input
					type="text"
					placeholder="John"
					required
					v-model="formdata.firstName"
				/>
			</label>
			<label class="input-box last-name">
				<span>Last Name</span>
				<input
					type="text"
					placeholder="Doe"
					required
					v-model="formdata.lastName"
				/>
			</label>
			<label class="input-box birth-date">
				<span>Birth Date</span>
				<input
					type="date"
					required
					autocomplete="bday"
					v-model="formdata.birthDate"
				/>
			</label>
			<div class="country-code">
				<CountryCodeInput v-model="formdata.countryCode" />
			</div>
			<label class="input-box income">
				<span>Income</span>
				<input
					type="number"
					required
					min="0"
					step="0.01"
					placeholder="50000.00"
					v-model="formdata.income"
				/>
			</label>
			<div class="submit">
				<button class="primary" type="submit">
					<span>Submit</span>
				</button>
				<p v-if="submitIssue" class="submit-issue">
					<small>
						{{
							(
								submitIssue.issue.response?.data.message ??
								submitIssue.issue.message
							)
								.replace('"lastName"', '"Last Name"')
								.replace('"firstName"', '"First Name"')
								.replace('"birthDate"', '"Birth Date"')
								.replace('"countryCode"', '"Country Code"')
								.replace('"income"', '"Income"')
						}}
					</small>
				</p>
			</div>
		</form>
	</div>
</template>

<style scoped>
.SubmitPage {
	min-height: inherit;
	padding-block-start: 100px;
}

form {
	display: grid;
	grid-template:
		"first-name 	last-name birth-date" auto
		"country-code income 		." auto
		"submit 			submit 		submit" auto / 35ch 35ch 35ch;
	grid-gap: 16px;
	width: max-content;
	max-width: 100ch;
	margin-inline: auto;

	@media (max-width: 1200px) {
		grid-template:
			"first-name 	last-name" auto
			"birth-date 	." auto
			"country-code income" auto
			"submit 			submit" auto / 35ch 35ch;
	}

	@media (max-width: 700px) {
		grid-template:
			"first-name" auto
			"last-name" auto
			"birth-date" auto
			"country-code" auto
			"income" auto
			"submit" auto / 35ch;
	}
}

.first-name {
	grid-area: first-name;
}

.last-name {
	grid-area: last-name;
}

.birth-date {
	grid-area: birth-date;
}

.country-code {
	grid-area: country-code;
}

.country-code :global(.CountryCodeInput) {
	width: 100%;
}

.income {
	grid-area: income;
}

.submit {
	grid-area: submit;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.loading {
	opacity: 0.8;
	cursor: wait;
}

.submit-issue {
	color: var(--color--error-text);
}
</style>
