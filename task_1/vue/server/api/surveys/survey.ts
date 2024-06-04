import { errorResponse } from "@/lib/server/api-helpers";
import {
	validateBirthDate,
	validateCountryCode,
	validateName,
} from "@/lib/validation";
import { Issue } from "@/lib/issue";
import { getDb } from "@/lib/server/db/db";
import { type Survey, surveys } from "@/lib/server/db/schema";

export default defineEventHandler(async (event) => {
	switch (event.method) {
		case "POST": {
			const body = (await readBody(event)) as Omit<Survey, "id"> | undefined;

			if (!body) {
				return errorResponse(`Request body is required`, 400);
			}

			const validationIssue = (() => {
				const countryCodeValidation = validateCountryCode(body.countryCode);
				if (countryCodeValidation instanceof Issue) {
					return new Issue({
						message:
							`"countryCode" ${countryCodeValidation.issue.message}` as const,
					});
				}

				const birthDateValidation = validateBirthDate(body.birthDate);
				if (birthDateValidation instanceof Issue) {
					return new Issue({
						message:
							`"birthDate" ${birthDateValidation.issue.message}` as const,
					});
				}

				const firstNameValidation = validateName(body.firstName);
				if (firstNameValidation instanceof Issue) {
					return new Issue({
						message:
							`"firstName" ${firstNameValidation.issue.message}` as const,
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

			return new Response(
				JSON.stringify(row satisfies PostSurveyResponseBody),
				{
					status: 201,
				}
			);
		}
		default: {
			return new Response(
				JSON.stringify({
					message: "Method not allowed",
					code: 405,
				}),
				{ status: 405 }
			);
		}
	}
});

export interface PostSurveyResponseBody {
	id: number;
}
