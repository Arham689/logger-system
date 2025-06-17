import { eq } from 'drizzle-orm';

import { db } from '../db.js';
import { apikeyTable, usersTable } from '../schema.js';
import type { Context, Next } from 'hono';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { decryptUserId } from '../utils/crypto.js';

export async function validateApiKey(c: Context, next: Next) {
    // const keyData = apiKeysDb.get(apiKey);

    // access headers
    const apiKey = c.req.header('x-api-key');
    if (!apiKey) {
        return c.json({ message: 'api key not found ' });
    }
    const keyData = await db.select().from(apikeyTable).where(eq(apikeyTable.key, apiKey));
    console.log('apikey', keyData);

    if (keyData.length === 0) {
        return c.json({ error: 'Invalid API key' }, 403);
    }

    if (!keyData[0].isActive) {
        return c.json({ error: 'API key is inactive' }, 403);
    }

    if (new Date() > new Date(keyData[0].expireAt)) {
        await db.update(apikeyTable).set({ isActive: false }).where(eq(apikeyTable.key, keyData[0].key));
        return c.json({ error: 'API key has expired' }, 403);
    }

    await next();
}

export const decryptApiKey = asyncErrorHandler(async (c: Context, next: Next) => {
    const authHeader = c.req.header('x-api-key');
    console.log(authHeader, 'header');
    if (!authHeader) {
        return c.json({ error: 'Authorization header missing or malformed' }, 401);
    }

    const apiKey = authHeader;
    try {
        const userIdString = decryptUserId(apiKey);
        console.log(userIdString);
        const userId = parseInt(userIdString, 10);

        if (isNaN(userId)) {
            return c.json({ error: 'Invalid user ID in key' }, 401);
        }

        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.id, userId),
        });

        if (!user) {
            return c.json({ error: 'Invalid API key. User not found.' }, 401);
        }

        c.set('user', user);
        console.log(user);
        await next();
    } catch (error) {
        return c.json({ error: 'Invalid or expired API Key' }, 401);
    }
});
