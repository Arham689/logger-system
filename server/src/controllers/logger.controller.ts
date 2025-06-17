import type { Context, Next } from 'hono';
import { db } from '../db.js';
import { usersTable, type SelectUser } from '../db/schema/user.js';
import { eq, and, or, desc, sql, like } from 'drizzle-orm';
import { activityLogsTable } from '../schema.js';
import { z } from 'zod';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { ioServer } from '../index.js';
import { eventTypeEnum, TAG_OPTIONS } from '../utils/constants.js';

const logSchema = z.object({
    userId: z.number().int(),
    eventType: eventTypeEnum,
    metadata: z.string().optional(),
    ipAddress: z.string().ip().optional(),
    userAgent: z.string().optional(),
    tag: z.enum(TAG_OPTIONS).array(),
});

export type LogDataType = z.infer<typeof logSchema>;

export const getlogs = asyncErrorHandler(async (c: Context, next: Next) => {
    const query = c.req.query();
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);

    const eventType = query.event as string | undefined;
    const tags = c.req.queries('tags');
    const date = query.date;
    console.log('requested date ', date);

    //2025-06-04 15:18:41.849785+00
    console.log('Requested tags:', tags);

    const user = c.get('user');

    const allLogs = await db
        .select()
        .from(activityLogsTable)
        .where(eq(activityLogsTable.userId, user.id))
        .orderBy(desc(activityLogsTable.createdAt));

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const hasMatchingTags = (logTags: string[], requestedTags: string[]): boolean => {
        if (!requestedTags || requestedTags.length === 0) return true;
        return requestedTags.some((requestedTag) => logTags.some((logTag) => logTag === requestedTag));
    };

    let filteredData: LogDataType[] = allLogs
        .filter((log) => {
            if (log.userId === null || log.tag === null) return false;

            if (eventType && log.eventType !== eventType) return false;

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
            userId: log.userId as number,
            eventType: log.eventType,
            tag: log.tag as (typeof TAG_OPTIONS)[number][],
            metadata: log.metadata ?? undefined,
            ipAddress: log.ipAddress ?? undefined,
            userAgent: log.userAgent ?? undefined,
            createdAt: log.createdAt,
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
            eventType: eventType || null,
            tags: tags || null,
        },
        logs: paginatedLogs,
    });
});

export const getUsers = asyncErrorHandler(async (c: Context, next: Next) => {
    const users = await db.select().from(usersTable);
    console.log(users);

    return c.json(
        {
            message: 'success',
            users,
        },
        200
    );
});

export const postlogs = asyncErrorHandler(async (c: Context, next: Next) => {
    const body = await c.req.json();
    console.log('body', body);
    const user = c.get('user');

    const result = logSchema.safeParse({ ...body, userId: user.id });

    if (!result.success) {
        return c.json(
            {
                status: 'error',
                message: 'Invalid input data',
                errors: result.error.flatten(),
            },
            400
        );
    }

    const validatedData: LogDataType = result.data;

    await db.insert(activityLogsTable).values(validatedData);

    ioServer.emit('log_created', { ...validatedData, userName: user.name });

    return c.json(
        {
            status: 'success',
            message: 'Activity log recorded successfully.',
        },
        201
    );
});

export const deletelogs = (c: Context) => {
    const para = c.req.param();
    const qurey = c.req.query();
    const id = parseInt(para.id);
    console.log(qurey);
    console.log(para.id);

    try {
        deleteUser(id);
    } catch (err) {
        console.log(err);
        throw new Error();
    }
    return c.text(`llogger callded delete from contorllers with ${para.id} `);
};

export async function deleteUser(id: SelectUser['id']) {
    // validatoins
    // when delete a user also deletes its activitest related
    await db.delete(usersTable).where(eq(usersTable.id, id));
}
