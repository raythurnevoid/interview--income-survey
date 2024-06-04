import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async (event) => {
	const countryCodes = await event.fetch("/api/countries/list").then((res) => res.json());

	return {
		countryCodes,
	};
};
