import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './user.js';
export const eventTypeEnum = pgEnum('event_type', ['LOGIN', 'LOGOUT', 'PAGE_VISIT', 'ERROR']);
export const activityLogsTable = pgTable('activity_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => usersTable.id),
    eventType: eventTypeEnum('event_type').notNull(),
    metadata: text('metadata'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type InsertActivity = typeof activityLogsTable.$inferInsert;
export type SelectActivity = typeof activityLogsTable.$inferSelect;
