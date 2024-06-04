export default defineEventHandler(() => {
	return new Response(
		JSON.stringify({
			message: "Not found",
			code: 404,
		}),
		{ status: 404 }
	);
});
