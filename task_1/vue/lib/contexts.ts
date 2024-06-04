export const countryCodesContext = {
	set(value: string[]) {
		provide("countryCodes", value);
	},
	get() {
		return inject<string[]>("countryCodes");
	},
};
