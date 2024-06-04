import { test, expect, describe } from "vitest";
import { baseApiUrl } from "./test-utils";

describe("GET countries/list", () => {
	test("returns 405 for non-GET requests", async () => {
		const response = await fetch(`${baseApiUrl}/countries/list`, { method: "POST" });
		expect(response.status).toBe(405);
	});

	test("returns a list of country codes", async () => {
		const response = await fetch(`${baseApiUrl}/countries/list`.toString());
		const countryCodes = await response.json();
		expect(response.status).toBe(200);
		expect(countryCodes).toContain("US");
		expect(countryCodes).toContain("CA");
	});
});
