import { createConnection } from "node:net";
import { delay } from "@/lib/delay";

export async function ping() {
	return new Promise<boolean>((resolve) => {
		const conn = createConnection(
			{
				host: import.meta.env.HOST,
				port: Number(import.meta.env.PORT),
			},
			() => {
				resolve(true);
				conn.end();
			}
		);
		conn.on("error", () => {
			resolve(false);
		});
	});
}

export async function waitServer() {
	const attempts = 3;
	for (let i = 0; i <= attempts; i++) {
		await delay(1000);
		if (await ping()) {
			break;
		}
		if (i === attempts) {
			throw new Error("Server did not start");
		}
	}
}

export const baseApiUrl = new URL(
	`http://${import.meta.env.HOST}:${import.meta.env.PORT}/api`
);
