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
