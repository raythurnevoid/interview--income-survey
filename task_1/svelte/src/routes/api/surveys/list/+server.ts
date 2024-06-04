import { getDb } from "$lib/server/db/db";
import type { RequestHandler } from "./$types";
import { surveys as surveysTable } from "$lib/server/db/schema";
import { errorResponse } from "src/lib/server/api-helpers";
import { and, asc, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { Issue } from "src/lib/issue";
import { filterNonNullish } from "src/lib/arrays";
import { validateBirthDate, validateCountryCode, validateName } from "src/lib/validation";

export const GET: RequestHandler = async (req) => {
	if (!req.url.searchParams.has("page")) {
		return errorResponse(`"page" query parameter is required`, 400);
	}

	const page = Number(req.url.searchParams.get("page"));

	if (Number.isNaN(page)) {
		return errorResponse(`"page" query parameter must be a number`, 400);
	} else if (page < 1) {
		return errorResponse(`"page" query parameter must start from 1`, 400);
	}

	const countryCode = req.url.searchParams.get("country-code")?.toUpperCase();

	if (countryCode && validateCountryCode(countryCode) instanceof Issue) {
		const validation = validateCountryCode(countryCode);

		if (validation instanceof Issue)
			return errorResponse(`"country-code" query parameter ${validation.issue.message}`, 400);
	}

	const birthDateFrom = (() => {
		const param = req.url.searchParams.get("from-birth-date");
		if (!param) return;

		const validation = validateBirthDate(param);

		if (validation instanceof Issue) {
			return new Issue(errorResponse(`"from-birth-date" query parameter ${validation.issue.message}`, 400));
		}

		return new Date(param);
	})();
	if (birthDateFrom instanceof Issue) return birthDateFrom.issue;

	const birthDateTo = (() => {
		const param = req.url.searchParams.get("to-birth-date");
		if (!param) return;

		const validation = validateBirthDate(param);

		if (validation instanceof Issue) {
			return new Issue(errorResponse(`"to-birth-date" query parameter ${validation.issue.message}`, 400));
		}

		return new Date(param);
	})();
	if (birthDateTo instanceof Issue) return birthDateTo.issue;

	if (birthDateFrom && birthDateTo && birthDateFrom > birthDateTo) {
		return errorResponse(`"from-birth-date" must be less than "to-birth-date"`, 400);
	}

	const name = req.url.searchParams.get("name");

	if (name) {
		const validation = validateName(name);

		if (validation instanceof Issue) {
			return errorResponse(`"name" query parameter ${validation.issue.message}`, 400);
		}
	}

	const sort = req.url.searchParams.get("sort") as Sort | null;

	if (sort && !["asc", "desc"].includes(sort)) {
		return errorResponse(`"sort" query parameter must be "asc" or "desc"`, 400);
	}

	const pageSize = 100;
	const offset = (page - 1) * pageSize;

	const db = getDb();

	const query = db.select().from(surveysTable);

	const filters = filterNonNullish([
		countryCode ? eq(surveysTable.countryCode, countryCode) : null,
		birthDateFrom ? gte(surveysTable.birthDate, birthDateFrom.toISOString()) : null,
		birthDateTo ? lte(surveysTable.birthDate, birthDateTo.toISOString()) : null,
		...(name
			? name
					.split(" ")
					.filter((part) => part.length > 0)
					.map((part) => or(ilike(surveysTable.firstName, `%${part}%`), ilike(surveysTable.lastName, `%${part}%`)))
			: []),
	]);

	if (filters.length) query.where(and(...filters));

	query.orderBy(sort === "asc" ? asc(surveysTable.income) : desc(surveysTable.income));

	const result = await query.offset(offset).limit(pageSize);

	return new Response(JSON.stringify(result), {
		headers: {
			"content-type": "application/json",
		},
	});
};

export const fallback: RequestHandler = async () => {
	return errorResponse(`Method not allowed`, 405);
};

export type Sort = "asc" | "desc";
