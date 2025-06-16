ALTER TABLE "tags" RENAME COLUMN "user_id" TO "activity_log_id";--> statement-breakpoint
ALTER TABLE "tags" DROP CONSTRAINT "tags_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_activity_log_id_activity_logs_id_fk" FOREIGN KEY ("activity_log_id") REFERENCES "public"."activity_logs"("id") ON DELETE cascade ON UPDATE no action;