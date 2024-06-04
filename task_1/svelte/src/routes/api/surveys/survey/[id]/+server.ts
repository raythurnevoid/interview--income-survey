import { errorResponse } from "src/lib/server/api-helpers";
import type { RequestHandler } from "./$types";
import { getDb } from "src/lib/server/db/db";
import { eq } from "drizzle-orm";
import { surveys } from "src/lib/server/db/schema";

export const DELETE: RequestHandler = async (req) => {
	const id = Number(req.params.id);
	if (Number.isNaN(id)) {
		return errorResponse(`"id" path parameter must be a number`, 400);
	} else if (id < 1) {
		return errorResponse(`"id" path parameter must be greater than 0`, 400);
	}

	const db = await getDb();
	const deletedId = await db
		.delete(surveys)
		.where(eq(surveys.id, id))
		.returning({
			id: surveys.id,
		})
		.then((rows) => rows[0]);
	if (deletedId == null) {
		return errorResponse(`Not found`, 404);
	}

	return new Response(null, { status: 204 });
};

export const fallback: RequestHandler = async () => {
	return errorResponse(`Method not allowed`, 405);
};
