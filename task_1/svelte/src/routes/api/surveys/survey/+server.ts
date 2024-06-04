import { errorResponse } from "src/lib/server/api-helpers";
import type { RequestHandler } from "./$types";
import { validateBirthDate, validateCountryCode, validateName } from "src/lib/validation";
import { Issue } from "src/lib/issue";
import { getDb } from "src/lib/server/db/db";
import { surveys, type Survey } from "src/lib/server/db/schema";

export const POST: RequestHandler = async (req) => {
	if (!req.request.body) {
		return errorResponse(`Request body is required`, 400);
	}

	const body = (await req.request.json()) as Omit<Survey, "id">;

	const validationIssue = (() => {
		const countryCodeValidation = validateCountryCode(body.countryCode);
		if (countryCodeValidation instanceof Issue) {
			return new Issue({
				message: `"countryCode" ${countryCodeValidation.issue.message}` as const,
			});
		}

		const birthDateValidation = validateBirthDate(body.birthDate);
		if (birthDateValidation instanceof Issue) {
			return new Issue({
				message: `"birthDate" ${birthDateValidation.issue.message}` as const,
			});
		}

		const firstNameValidation = validateName(body.firstName);
		if (firstNameValidation instanceof Issue) {
			return new Issue({
				message: `"firstName" ${firstNameValidation.issue.message}` as const,
			});
		}

		const lastNameValidation = validateName(body.lastName);
		if (lastNameValidation instanceof Issue) {
			return new Issue({
				message: `"lastName" ${lastNameValidation.issue.message}` as const,
			});
		}
	})();
	if (validationIssue instanceof Issue) {
		return errorResponse(validationIssue.issue.message, 400);
	}

	const db = await getDb();
	const row = await db
		.insert(surveys)
		.values(body)
		.returning({
			id: surveys.id,
		})
		.then((rows) => rows[0]);

	if (!row) {
		return errorResponse(`Failed to insert survey`, 500);
	}

	return new Response(JSON.stringify(row satisfies PostSurveyResponseBody), { status: 201 });
};

export const fallback: RequestHandler = async () => {
	return errorResponse(`Method not allowed`, 405);
};

export interface PostSurveyResponseBody {
	id: number;
}
