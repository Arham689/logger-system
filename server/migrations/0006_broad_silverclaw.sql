ALTER TABLE "tags" ALTER COLUMN "tag" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."tag";--> statement-breakpoint
CREATE TYPE "public"."tag" AS ENUM('first_log', 'recent', 'favorite', 'useful', 'repeating', 'error', 'warning', 'info', 'debug', 'critical', 'archived', 'manual', 'auto_generated');--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "tag" SET DATA TYPE "public"."tag" USING "tag"::"public"."tag";