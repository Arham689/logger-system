import type { Context, Next } from 'hono';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { db } from '../db.js';
import { activityLogsTable, usersTable } from '../schema.js';
import { desc, eq } from 'drizzle-orm';
import { TAG_OPTIONS } from '../utils/constants.js';
export enum LogEventType {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    PAGE_VISIT = 'PAGE_VISIT',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    API_CALL = 'API_CALL',
}

export type TagOption = (typeof TAG_OPTIONS)[number];

interface LogDataType {
    eventType: LogEventType;
    metadata: string;
    ipAddress: string;
    userAgent: string;
    tag: TagOption[];
    userName: string;
}
export const getAllUsers = asyncErrorHandler(async (c: Context, next: Next) => {
    const users = await db.select().from(usersTable);
    console.log(users);
    return c.json(
        {
            status: 'success',
            users,
        },
        200
    );
});

export const isAdmin = async (c: Context) => {
    try {
        return c.json({
            message: 'seccsfull',
            isAdmin: true,
        });
    } catch (error) {
        console.log(error);
        return c.json({
            message: 'thia account is not Admin ',
            isAdmin: false,
        });
    }
};

export const getAllData = asyncErrorHandler(async (c: Context) => {
    const query = c.req.query();
    const event = c.req.query('event');
    const tags = c.req.queries('tags');
    const date = query.date;
    const page = Math.max(1, Number(c.req.query('page')) || 1);
    const limit = Math.max(1, Number(c.req.query('limit')) || 10);

    const user = c.get('user');

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const hasMatchingTags = (logTags: string[], requestedTags: string[]): boolean => {
        if (!requestedTags || requestedTags.length === 0) return true;
        return requestedTags.some((requestedTag) => logTags.some((logTag) => logTag === requestedTag));
    };

    const logsWithUsers = await db
        .select({
            logId: activityLogsTable.id,
            eventType: activityLogsTable.eventType,
            metadata: activityLogsTable.metadata,
            ipAddress: activityLogsTable.ipAddress,
            tag: activityLogsTable.tag,
            userAgent: activityLogsTable.userAgent,
            createdAt: activityLogsTable.createdAt,
            userName: usersTable.name,
        })
        .from(activityLogsTable)
        .innerJoin(usersTable, eq(activityLogsTable.userId, usersTable.id))
        .orderBy(desc(activityLogsTable.createdAt));

    let filteredData: LogDataType[] = logsWithUsers
        .filter((log) => {
            if (log.tag === null) return false;

            if (event && log.eventType !== event) return false;

            if (tags && tags.length > 0) {
                const logTags = Array.isArray(log.tag) ? log.tag : [log.tag];
                if (!hasMatchingTags(logTags, tags)) return false;
            }

            //Mon Jun 16 2025 109:58:39 GMT+0530 (India Standard Time) -- query
            //Wed Jun 04 2025 05:30:00 GMT 0530 (India Standard Time) -- log
            if (date !== 'null') {
                const logDate = typeof log.createdAt === 'string' ? new Date(log.createdAt) : log.createdAt;
                const filterDate = new Date(date);
                if (
                    logDate.getUTCFullYear() !== filterDate.getUTCFullYear() ||
                    logDate.getUTCMonth() !== filterDate.getUTCMonth() ||
                    logDate.getUTCDate() !== filterDate.getUTCDate()
                ) {
                    return false;
                }
            }

            return true;
        })
        .map((log) => ({
            eventType: log.eventType as LogEventType,
            tag: log.tag as (typeof TAG_OPTIONS)[number][],
            metadata: log.metadata ?? '',
            ipAddress: log.ipAddress ?? '',
            userAgent: log.userAgent ?? '',
            createdAt: log.createdAt,
            userName: log.userName,
        }));

    console.log('Filtered data count:', filteredData.length);

    const paginatedLogs = filteredData.slice(startIndex, endIndex);

    const totalLogs = filteredData.length;
    const totalPages = Math.ceil(totalLogs / limit);

    return c.json({
        message: 'success',
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        appliedFilters: {
            eventType: event || null,
            tags: tags || null,
        },
        logs: paginatedLogs,
    });
});
