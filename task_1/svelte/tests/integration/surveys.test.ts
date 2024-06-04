import { test, expect, describe } from "vitest";
import { baseApiUrl } from "./test-utils";

describe("GET surveys/list", () => {
	test("should return 404 when the path is non-existent", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/nonexistent`));
		expect(res.status).toBe(404);
		const json = await res.json();
		expect(json.message).toBe(`Not found`);
	});

	test("should return 405 when using a method different from GET", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list`), {
			method: "POST",
		});
		expect(res.status).toBe(405);
		const json = await res.json();
		expect(json.message).toBe(`Method not allowed`);
	});

	test("should return 400 when the page query parameter is missing", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list`));
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"page" query parameter is required`);
	});

	test("should return 400 when the page query parameter is less than 1", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=-1`));
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"page" query parameter must start from 1`);
	});

	test("should return 200 when the page query parameter is valid", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1`));
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.length).toBeGreaterThan(0);
	});

	test("can filter by country code", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1&country-code=US`));
		expect(res.status).toBe(200);
		const json = await res.json();
		const returnedCountryCodes = Array.from(new Set(json.map((i: any) => i.countryCode)));
		expect(returnedCountryCodes.length).toBe(1);
		expect(returnedCountryCodes[0]).toBe("US");
	});

	test("should return 400 when the country-code query parameter is not a 2-letter country code", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1&country-code=USA`));
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"country-code" query parameter must be a 2-letter country code`);
	});

	test("can filter by birth date range", async () => {
		const res = await fetch(
			new URL(`${baseApiUrl}/surveys/list?page=1&from-birth-date=2000-01-01&to-birth-date=2000-12-31`),
		);
		expect(res.status).toBe(200);
		const json = await res.json();
		const birthDates = json.map((i: any) => i.birthDate);
		expect(
			birthDates.every((i: any) => new Date("2000-01-01") <= new Date(i) && new Date(i) <= new Date("2000-12-31")),
		).toBe(true);
	});

	test("can filter from birth date", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1&from-birth-date=2000-01-01`));
		expect(res.status).toBe(200);
		const json = await res.json();
		const birthDates = json.map((i: any) => i.birthDate);
		expect(birthDates.every((i: any) => new Date("2000-01-01") <= new Date(i))).toBe(true);
	});

	test("can filter to birth date", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1&to-birth-date=2000-12-31`));
		expect(res.status).toBe(200);
		const json = await res.json();
		const birthDates = json.map((i: any) => i.birthDate);
		expect(birthDates.every((i: any) => new Date(i) <= new Date("2000-12-31"))).toBe(true);
	});

	test("should return 400 when the from-birth-date query parameter is invalid", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1&from-birth-date=invalid`));
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"from-birth-date" query parameter must be a date in the format "YYYY-MM-DD"`);
	});

	test("should return 400 when the to-birth-date query parameter is invalid", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1&to-birth-date=invalid`));
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"to-birth-date" query parameter must be a date in the format "YYYY-MM-DD"`);
	});

	test("should return 400 when the from-birth-date is greater than to-birth-date", async () => {
		const res = await fetch(
			new URL(`${baseApiUrl}/surveys/list?page=1&from-birth-date=2000-12-31&to-birth-date=2000-01-01`),
		);
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"from-birth-date" must be less than "to-birth-date"`);
	});

	test("should return 400 when the name query parameter contains numbers", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1&name=123`));
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"name" query parameter must not contain numbers`);
	});

	test("can filter by name", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1&name=John`));
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json.every((i: any) => i.firstName.includes("John") || i.lastName.includes("John"))).toBe(true);
	});

	test("can sort in ascending order", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1&sort=asc`));
		expect(res.status).toBe(200);
		const json = await res.json();
		const sorted = [...json].sort((a: any, b: any) => a.income - b.income);
		expect(json).toEqual(sorted);
	});

	test("can sort in descending order", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1&sort=desc`));
		expect(res.status).toBe(200);
		const json = await res.json();
		const sorted = [...json].sort((a: any, b: any) => b.income - a.income);
		expect(json).toEqual(sorted);
	});

	test("by default is sorted in descending order", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/list?page=1`));
		expect(res.status).toBe(200);
		const json = await res.json();
		const sorted = [...json].sort((a: any, b: any) => b.income - a.income);
		expect(json).toEqual(sorted);
	});
});

let newCreatedSurveyId: number | null = null;

describe("POST surveys/survey", () => {
	test("should return 400 when the request body is missing", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/survey`), {
			method: "POST",
		});
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`Request body is required`);
	});

	test("should return 400 when the country code is invalid", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/survey`), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				countryCode: "USA",
				birthDate: "2000-01-01",
				firstName: "John",
				lastName: "Doe",
				income: 1000,
			}),
		});
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"countryCode" must be a 2-letter country code`);
	});

	test("should return 400 when the birth date is invalid", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/survey`), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				countryCode: "US",
				birthDate: "invalid",
				firstName: "John",
				lastName: "Doe",
				income: 1000,
			}),
		});
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"birthDate" must be a date in the format "YYYY-MM-DD"`);
	});

	test("should return 400 when the first name contains numbers", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/survey`), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				countryCode: "US",
				birthDate: "2000-01-01",
				firstName: "John123",
				lastName: "Doe",
				income: 1000,
			}),
		});
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"firstName" must not contain numbers`);
	});

	test("should return 400 when the last name contains numbers", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/survey`), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				countryCode: "US",
				birthDate: "2000-01-01",
				firstName: "John",
				lastName: "Doe123",
				income: 1000,
			}),
		});
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"lastName" must not contain numbers`);
	});

	test("should return 201 when the survey is created", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/survey`), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				countryCode: "US",
				birthDate: "2000-01-01",
				firstName: "John",
				lastName: "Doe",
				income: 1000,
			}),
		});
		expect(res.status).toBe(201);
		const json = await res.json();
		expect(json.id).toBeGreaterThan(0);
		newCreatedSurveyId = json.id;
	});
});

describe("DELETE surveys/survey/[id]", () => {
	test("should return 404 when the survey does not exist", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/survey/999999999`), {
			method: "DELETE",
		});
		expect(res.status).toBe(404);
		const json = await res.json();
		expect(json.message).toBe(`Not found`);
	});

	test("should return 400 when the id is not a number", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/survey/invalid`), {
			method: "DELETE",
		});
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"id" path parameter must be a number`);
	});

	test("should return 400 when the id is less than 1", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/survey/0`), {
			method: "DELETE",
		});
		expect(res.status).toBe(400);
		const json = await res.json();
		expect(json.message).toBe(`"id" path parameter must be greater than 0`);
	});

	test("should return 405 when using a method different from DELETE", async () => {
		const res = await fetch(new URL(`${baseApiUrl}/surveys/survey/1`), {
			method: "POST",
		});
		expect(res.status).toBe(405);
		const json = await res.json();
		expect(json.message).toBe(`Method not allowed`);
	});

	test("should return 204 when the survey is deleted", async (ctx) => {
		if (newCreatedSurveyId == null) {
			ctx.skip();
		}
		const res = await fetch(new URL(`${baseApiUrl}/surveys/survey/${newCreatedSurveyId}`), {
			method: "DELETE",
		});
		expect(res.status).toBe(204);
	});
});
