import { errorResponse } from "@/lib/server/api-helpers";
import { getDb } from "@/lib/server/db/db";
import { eq } from "drizzle-orm";
import { surveys } from "@/lib/server/db/schema";

export default defineEventHandler(async (event) => {
	switch (event.method) {
		case "DELETE": {
			const params = getRouterParams(event);

			const id = Number(params.id);
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
