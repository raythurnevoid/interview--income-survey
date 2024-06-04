export function errorResponse(message: string, code: number) {
	return new Response(
		JSON.stringify({
			message,
			code,
		}),
		{ status: code },
	);
}
