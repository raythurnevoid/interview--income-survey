import { Issue } from "./issue";

export function validateCountryCode(code: string) {
	if (code.length !== 2 || !/^[A-Z]{2}$/.test(code)) {
		return new Issue({ message: "must be a 2-letter country code" as const });
	}
}

export function validateBirthDate(date: string) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return new Issue({ message: `must be a date in the format "YYYY-MM-DD"` as const });
	}
}

export function validateName(name: string) {
	if (/\d/g.test(name)) {
		return new Issue({ message: `must not contain numbers` as const });
	}
}
