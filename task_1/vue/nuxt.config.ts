import { config } from "dotenv";

config({
	path: ".env",
	override: false,
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devServer: {
		port: Number(process.env.PORT),
	},
	vite: {
		preview: {
			port: Number(process.env.PORT),
		},
	},
	devtools: { enabled: true },
	typescript: {
		typeCheck: true,
	},
});
