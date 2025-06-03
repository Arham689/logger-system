import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const eventTypeEnum = pgEnum('event_type', ['LOGIN', 'LOGOUT', 'PAGE_VISIT', 'ERROR']);

export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    age: integer('age').notNull(),
    email: text('email').notNull().unique(),
    password : text('password').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

const userRelation = relations(usersTable, ({ many }) => ({
    activityLogsTable: many(activityLogsTable),
}));

export const activityLogsTable = pgTable('activity_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => usersTable.id, { onDelete: 'cascade' }),
    eventType: eventTypeEnum('event_type').notNull(),
    metadata: text('metadata'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

const logRelation = relations(activityLogsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [activityLogsTable.userId],
        references: [usersTable.id],
    }),
}));

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

// export type InsertPost = typeof postsTable.$inferInsert;
// export type SelectPost = typeof postsTable.$inferSelect;

export type InsertActivity = typeof activityLogsTable.$inferInsert;
export type SelectActivity = typeof activityLogsTable.$inferSelect;
