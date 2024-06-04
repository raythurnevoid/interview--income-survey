import "dotenv/config";
import type { Config } from "drizzle-kit";
import { config } from "dotenv";
import { getDbCredentials } from "./src/lib/server/db/db-credentials";

config({
	path: ".env",
	override: false,
});

export default {
	dialect: "postgresql",
	schema: "./src/lib/server/db/schema.ts",
	out: "./drizzle",
	dbCredentials: getDbCredentials(),
} satisfies Config;
