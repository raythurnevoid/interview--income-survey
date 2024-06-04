<script lang="ts">
	import type { Survey } from "src/lib/server/db/schema";
	import SortArrow from "./SortArrow.svelte";
	import type { Sort } from "./api/surveys/list/+server";

	let {
		surveys,
		sort,
		onEndOfTable,
		onSortChange,
	}: {
		surveys: Survey[];
		sort: Sort;
		onEndOfTable: () => void;
		onSortChange: (sort: Sort) => void;
	} = $props();

	let endOfTable: HTMLDivElement;

	const numberFormatter = new Intl.NumberFormat([], {
		// 2 decimal places
		style: "decimal",
		minimumFractionDigits: 2,
	});

	$effect(() => {
		const endOFTableObserver = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					onEndOfTable();
				}
			},
			{
				root: null,
				rootMargin: "0px 0px 400px 0px",
				threshold: 1.0,
			},
		);

		endOFTableObserver.observe(endOfTable);

		return () => {
			endOFTableObserver.unobserve(endOfTable);
		};
	});

	function handleIncomeHeaderClick() {
		sort = sort === "asc" ? "desc" : "asc";
		onSortChange(sort);
	}
</script>

<table>
	<thead>
		<tr>
			<th class="name">Name</th>
			<th class="birthdate">Birth Date</th>
			<th class="country">Country</th>
			<th class="income">
				<button onclick={handleIncomeHeaderClick}> <div>Income <SortArrow direction={sort} /></div> </button>
			</th>
		</tr>
	</thead>
	<tbody>
		{#each surveys as survey}
			<tr>
				<td class="name">{survey.firstName} {survey.lastName}</td>
				<td class="birthdate">{new Date(survey.birthDate).toLocaleDateString()}</td>
				<td class="country">{survey.countryCode}</td>
				<td class="income">{numberFormatter.format(survey.income)}</td>
			</tr>
		{/each}
	</tbody>
</table>
<div bind:this={endOfTable}></div>

<style>
	table {
		width: 100%;
		max-width: 1200px;
		border-collapse: collapse;
		background: var(--color--surface);
		border-radius: 8px;
		table-layout: fixed;
	}

	th {
		text-align: left;
		border-bottom: 1px solid var(--color--border);
		height: 2em;
	}

	th:not(:has(> button)) {
		padding: 8px;
	}

	th:has(> button) {
		padding: 0;
	}

	th button {
		box-sizing: border-box;
		cursor: pointer;
		height: 100%;
		width: 100%;
		padding-inline: 8px;
		gap: 4px;
	}

	th button div {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	td {
		padding: 8px;
		border-bottom: 1px solid var(--color--border);
	}

	tr:hover {
		background: var(--color--surface--hover);
	}

	tbody tr:nth-child(odd) {
		background: hsl(from var(--color--surface) h s 95);
	}

	tbody tr:nth-child(even) {
		background: hsl(from var(--color--surface) h s 90);
	}

	tbody tr {
		content-visibility: auto;
	}

	.name {
		width: 18ch;
	}

	.birthdate {
		width: 10ch;
	}

	.country {
		width: 2ch;
	}

	.income {
		width: 12ch;
		text-align: end;
	}
</style>
