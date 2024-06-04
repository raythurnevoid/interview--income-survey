/// <reference types="vitest" />
import { defineConfig } from "vite";
import { config } from "dotenv";
import path from "path";

config({
	path: ".env",
	override: false,
});

export default defineConfig({
	test: {
		globalSetup: "tests/integration/test-global-setup.ts",
		setupFiles: ["tests/integration/test-setup.ts"],
		globals: false,
		env: {
			HOST: process.env.HOST!,
			PORT: process.env.PORT!,
		},
		alias: {
			"@": path.resolve(import.meta.dirname),
		},
	},
});
