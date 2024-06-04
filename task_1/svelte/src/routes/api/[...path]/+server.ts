import type { RequestHandler } from "./$types";

export const fallback: RequestHandler = async () => {
	return new Response(
		JSON.stringify({
			message: "Not found",
			code: 404,
		}),
		{ status: 404 },
	);
};
