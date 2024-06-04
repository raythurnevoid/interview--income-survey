import { getCountryCodes } from "~/lib/country-codes";

export default defineEventHandler(async (event) => {
	switch (event.method) {
		case "GET": {
			const countryCodes = await getCountryCodes();

			return new Response(JSON.stringify(countryCodes), {
				headers: {
					"content-type": "application/json",
				},
			});
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
