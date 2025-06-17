import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const eventTypeEnum = pgEnum('event_type', ['LOGIN', 'LOGOUT', 'PAGE_VISIT', 'ERROR', 'WARNING', 'API_CALL']);
export const roleTypeEnum = pgEnum('role', ['admin', 'user']);

export const tagsTypeEnum = pgEnum('tag', [
    'first_log',
    'recent',
    'favorite',
    'useful',
    'repeating',
    'error',
    'warning',
    'info',
    'debug',
    'critical',
    'archived',
    'manual',
    'auto_generated',
]);

export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    age: integer('age').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: roleTypeEnum('role'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

const userRelation = relations(usersTable, ({ many }) => ({
    activityLogsTable: many(activityLogsTable),
    apikeyTable: many(apikeyTable),
}));

export const activityLogsTable = pgTable('activity_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => usersTable.id, { onDelete: 'cascade' }),
    eventType: eventTypeEnum('event_type').notNull(),
    metadata: text('metadata'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    tag: tagsTypeEnum('tag').array(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const logRelations = relations(activityLogsTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [activityLogsTable.userId],
        references: [usersTable.id],
    }),
}));

export const apikeyTable = pgTable('api_key', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => usersTable.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    expireAt: timestamp('expire_at', { withTimezone: true }).notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

// export type InsertPost = typeof postsTable.$inferInsert;
// export type SelectPost = typeof postsTable.$inferSelect;

export type InsertActivity = typeof activityLogsTable.$inferInsert;
export type SelectActivity = typeof activityLogsTable.$inferSelect;

export type InsertApiKey = typeof apikeyTable.$inferInsert;
export type SelectApiKey = typeof apikeyTable.$inferSelect;
