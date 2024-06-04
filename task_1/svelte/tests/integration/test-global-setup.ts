import { fork } from "node:child_process";
import { cwd } from "node:process";
import { waitServer } from "./test-utils";

export default async function setup() {
	const child =
		import.meta.env.MODE === "test:dev"
			? fork(`${cwd()}/node_modules/vite/bin/vite.js`, {
					stdio: ["ignore", "inherit", "inherit", "ipc"],
				})
			: fork(`${cwd()}/build/index.js`, {
					stdio: ["ignore", "inherit", "inherit", "ipc"],
				});

	await waitServer();

	console.log("");

	return () => {
		child.kill();
	};
}
