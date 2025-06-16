import type { Context, Next } from 'hono';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { db } from '../db.js';
import { activityLogsTable, usersTable } from '../schema.js';
import { desc, eq } from 'drizzle-orm';

export const getAllUsers = asyncErrorHandler(async (c: Context, next: Next) => {
    const users = await db.select().from(usersTable);
    console.log(users)
    return c.json(
        {
            status: 'success',
            users,
        },
        200
    );
});

export const isAdmin = async (c : Context )=> {
    try {
        return c.json({
            message : "seccsfull",
            isAdmin : true 
        })
    } catch (error) {
        console.log(error)
        return c.json({
            message : "thia account is not Admin ",
            isAdmin  : false 
        })
    }
}

export const getAllData = asyncErrorHandler(async (c : Context ) => {
    const logsWithUsers = await db
  .select({
    logId: activityLogsTable.id,
    eventType: activityLogsTable.eventType,
    metadata: activityLogsTable.metadata,
    ipAddress: activityLogsTable.ipAddress,
    userAgent: activityLogsTable.userAgent,
    createdAt: activityLogsTable.createdAt,
    userName: usersTable.name,
  })
  .from(activityLogsTable)
  .innerJoin(usersTable, eq(activityLogsTable.userId, usersTable.id))
  .orderBy(desc(activityLogsTable.createdAt));

  return c.json({
    message : "successful",
    logs : logsWithUsers
  })
})