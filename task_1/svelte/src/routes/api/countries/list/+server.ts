import type { RequestHandler } from "./$types";
import { errorResponse } from "src/lib/server/api-helpers";
import { getCountryCodes } from "src/lib/country-codes";

export const GET: RequestHandler = async () => {
	const countryCodes = await getCountryCodes();

	return new Response(JSON.stringify(countryCodes), {
		headers: {
			"content-type": "application/json",
		},
	});
};

export const fallback: RequestHandler = async () => {
	return errorResponse(`Method not allowed`, 405);
};
