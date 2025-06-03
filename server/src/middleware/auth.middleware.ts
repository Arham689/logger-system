import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { Context, Next } from 'hono';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import { getCookie } from 'hono/cookie';
import CustomError from '../utils/customerror.js';
import { db } from '../db.js';
import { email } from 'zod/v4';
import { usersTable } from '../schema.js';
import { eq } from 'drizzle-orm';
type JWTPayload = {
    email: string;
};
export const protect = asyncErrorHandler(async (c: Context, next: Next) => {
    const tempToken = c.req.header('authorization')?.replace('Bearer ', '');
    let token;
    if (c.req.header('authorization') && tempToken?.startsWith('bearer')) {
        token = tempToken.split(' ')[1];
    } else {
        token = getCookie(c, 'token');
    }

    if (!token) {
        throw new CustomError('You are not loged in', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECREATE as string) as JWTPayload;
    console.log(decoded);
    if (decoded === null) return;
    // d call to check the email or user is present

    const user = await db
        .select({ email: usersTable.email, password: usersTable.password, id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, decoded.email));

    console.log('user from middle ', user[0]);

    if (user.length === 0) {
        throw new CustomError('User not founded ', 401);
    } else {
        c.set('user', user[0]);
    }

    await next();
});
