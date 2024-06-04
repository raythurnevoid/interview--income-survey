import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getDbCredentials } from "./db-credentials";

const clients = new Map<
	"single-connection" | "multi-connection",
	ReturnType<typeof drizzle> & {
		[Symbol.dispose](): Promise<void>;
	}
>();

export function getDb(
	{
		singleConnection,
	}: {
		singleConnection: boolean;
	} = { singleConnection: false },
) {
	const clientKey = singleConnection ? "single-connection" : "multi-connection";

	if (!clients.has(clientKey)) {
		const dbCredentials = getDbCredentials();
		const connection = postgres(
			`postgres://${dbCredentials.user}:${dbCredentials.password}@${dbCredentials.host}:${dbCredentials.port}/${dbCredentials.database}`,
			{
				idle_timeout: 20,
				max_lifetime: 60 * 30,
			},
		);
		const client = Object.assign(drizzle(connection), {
			async [Symbol.dispose]() {
				await connection.end();
			},
		});
		clients.set(clientKey, client);
	}

	return clients.get(clientKey)!;
}
