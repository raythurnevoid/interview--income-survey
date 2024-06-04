import { sql } from "drizzle-orm";
import { check, date, index, numeric, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";

const amountType = customType<{ data: number; driverData: string }>({
	dataType() {
		return "numeric(14, 2)";
	},
	fromDriver(value) {
		return Number(value);
	},
});

export const surveys = pgTable(
	"surveys",
	{
		id: serial("id").primaryKey(),
		firstName: varchar("name", { length: 50 }).notNull(),
		lastName: varchar("last_name", { length: 50 }).notNull(),
		birthDate: date("birth_date").notNull(),
		countryCode: varchar("country_code", { length: 2 }).notNull(),

		// max 999_999_999_999.99
		income: amountType("income").notNull(),
	},
	(surveys) => {
		return {
			incomeMustBePositive: check(
				// Not implemented: https://orm.drizzle.team/docs/indexes-constraints#check
				"income_must_be_positive",
				sql`${surveys.income} >= 0`,
			),
			incomeIdx: index("income_idx").on(surveys.income).desc(),
			birthDateIdx: index("birth_date_idx").on(surveys.birthDate),
		};
	},
);

export interface Survey {
	id: number;
	firstName: string;
	lastName: string;
	/** YYYY-MM-DD */
	birthDate: string;
	/** 2 digits country code */
	countryCode: string;
	income: number;
}
