CREATE INDEX IF NOT EXISTS "income_idx" ON "surveys" ("income" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "birth_date_idx" ON "surveys" ("birth_date");