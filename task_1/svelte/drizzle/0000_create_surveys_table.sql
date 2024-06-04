CREATE TABLE IF NOT EXISTS "surveys" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"birth_date" date NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"income" numeric(14, 2) NOT NULL
);

ALTER TABLE "surveys" ADD CONSTRAINT "income_must_be_positive" CHECK ("income" >= 0);