import { getDb } from "$lib/server/db/db";
import { surveys } from "$lib/server/db/schema";
import { asc } from "drizzle-orm";

let countryCodes: string[] | null = null;

export async function getCountryCodes() {
	if (countryCodes === null) {
		const db = getDb();

		const newCountryCodes = await db
			.selectDistinct({
				countryCode: surveys.countryCode,
			})
			.from(surveys)
			.orderBy(asc(surveys.countryCode))
			.then((rows) => rows.map((row) => row.countryCode));

		countryCodes = newCountryCodes;
	}

	return countryCodes;
}
