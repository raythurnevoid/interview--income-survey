import { getContext, setContext } from "svelte";

export const countryCodesContext = {
	set(value: string[]) {
		setContext("countryCodes", value);
	},
	get() {
		return getContext<string[]>("countryCodes");
	},
};
