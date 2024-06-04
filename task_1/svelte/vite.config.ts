/// <reference types="vitest" />
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { config } from "dotenv";

config({
	path: ".env",
	override: false,
});

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: Number(process.env.PORT),
	},
	preview: {
		port: Number(process.env.PORT),
	},
	test: {
		globalSetup: "tests/integration/test-global-setup.ts",
		setupFiles: ["tests/integration/test-setup.ts"],
		globals: false,
		env: {
			HOST: process.env.HOST!,
			PORT: process.env.PORT!,
		},
	},
});
