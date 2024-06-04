import { fork } from "node:child_process";
import { cwd } from "node:process";
import { waitServer } from "./test-utils";
import { delay } from "@/lib/delay";

export default async function setup() {
	const child =
		import.meta.env.MODE === "test:dev"
			? fork(`${cwd()}/node_modules/nuxt/bin/nuxt.mjs`, ["dev"], {
					stdio: ["ignore", "inherit", "inherit", "ipc"],
				})
			: fork(`${cwd()}/.output/server/index.mjs`, {
					stdio: ["ignore", "inherit", "inherit", "ipc"],
				});

	if (import.meta.env.MODE === "test:dev") await delay(5000);

	await waitServer();

	console.log("");

	return () => {
		child.kill();
	};
}
