import type { Context } from 'hono';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';
import { activityLogsTable, apikeyTable } from '../schema.js';
import { desc, eq } from 'drizzle-orm';
import { encryptUserId } from '../utils/crypto.js';
import { eventTypeEnum, TAG_OPTIONS } from '../utils/constants.js';
import { z } from 'zod';

export type LogDataType = z.infer<typeof logSchema>;
const logSchema = z.object({
    userId: z.number().int(),
    eventType: eventTypeEnum,
    metadata: z.string().optional(),
    ipAddress: z.string().ip().optional(),
    userAgent: z.string().optional(),
    tag: z.enum(TAG_OPTIONS).array(),
});

export const gnerateApiKey = asyncErrorHandler(async (c: Context) => {
    const user = c.get('user');
    const userId = user.id.toString(); // Ensure userId is a string for encryption
    const expireAt = getOneDayExpiration();

    // 1. Encrypt the user's ID to create the API key
    const apiKey = encryptUserId(userId);

    // 2. Store the generated key and its metadata in the database
    // This is still useful for auditing and tracking which keys exist.
    const [insertedData] = await db
        .insert(apikeyTable)
        .values({
            userId: user.id, // Store the actual user ID for reference
            key: apiKey, // Store the encrypted key
            isActive: true,
            expireAt: expireAt,
        })
        .returning(); // Use .returning() to get the inserted data back

    return c.json({
        message: "API Key generated successfully. Store it securely, it won't be shown again.",
        apiKey: apiKey, // This is the key the user will use
        expiresAt: expireAt.toISOString(),
    });
});

export function getOneDayExpiration() {
    const now = new Date();
    const expireAt = new Date(now.getTime());
    expireAt.setDate(now.getDate() + 1);
    return expireAt;
}

// get all the logs
export const pathWitToken = asyncErrorHandler(async (c: Context) => {
    // extract token from token
    const key = c.req.header('x-api-key');

    // validate middleware isActive

    const data = await db.select().from(activityLogsTable).orderBy(desc(activityLogsTable.createdAt));
    return c.json({
        message: 'this app can call the api ',
        api_Key: key,
        data,
    });
});

export const getUsersKey = asyncErrorHandler(async (c: Context) => {
    // const key = c.req.header('x-api-key');
    // if (!key) {
    //     return c.json({ error: 'API key missing' }, 400);
    // }

    const user = c.get('user');
    const data = await db.select().from(apikeyTable).where(eq(apikeyTable.userId, user.id));
    console.log(data);

    return c.json({
        userKeys: data,
    });
});

export const postLogApiKey = asyncErrorHandler(async (c: Context) => {
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

    return c.json(
        {
            status: 'success',
            message: 'Activity log recorded successfully.',
        },
        201
    );
});

export const deleteUsersKey = asyncErrorHandler(async (c: Context) => {
    // const key = c.req.header('x-api-key');
    // if (!key) {
    //     return c.json({ error: 'API key missing' }, 400);
    // }
    const idParam = c.req.param('id');
    const id = Number(idParam);

    console.log(id);

    // const user = c.get('user')
    await db.delete(apikeyTable).where(eq(apikeyTable.id, id));
    // console.log(data)

    return c.json({
        message: 'deleted',
        userKeys: id,
    });
});
