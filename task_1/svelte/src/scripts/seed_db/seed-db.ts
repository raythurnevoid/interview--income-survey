import * as fs from "node:fs";
import url from "node:url";
import { dirname } from "node:path";
import { config } from "dotenv";
import { getDb } from "src/lib/server/db/db";
import * as csv from "csv/sync";
import { surveys } from "src/lib/server/db/schema";
import { getTableName, sql } from "drizzle-orm";

const currentPath = dirname(url.fileURLToPath(import.meta.url));

config({
	path: ".env",
	override: true,
});

const seed_data_content = fs.readFileSync(`${currentPath}/seed_data.csv`, "utf-8");
const seed_data = (
	(await csv.parse(seed_data_content, {
		delimiter: ",",
		columns: ["firstName", "lastName", "birthDate", "countryCode", "income"],
		fromLine: 2,
		quote: "'",
		escape: "\\",
	})) as { firstName: string; lastName: string; birthDate: string; countryCode: string; income: string }[]
).map((r) => ({ ...r, birthDate: new Date(Number(`${r.birthDate}000`)).toISOString(), income: Number(r.income) }));

await using db = getDb({ singleConnection: true });

await db.execute(sql`TRUNCATE TABLE ${surveys}`);
await db.execute(sql`ALTER SEQUENCE ${sql.raw(getTableName(surveys))}_${sql.raw(surveys.id.name)}_seq RESTART WITH 1`);

await Promise.all(
	chunk(seed_data, 1000).map(async (chunk) => {
		await db.insert(surveys).values(chunk);
	}),
);

function chunk<T>(arr: T[], size: number): T[][] {
	const res = [];
	for (let i = 0; i < arr.length; i += size) {
		res.push(arr.slice(i, i + size));
	}
	return res;
}
