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
    let token;

    token = getCookie(c, 'token');
    
    console.log("token" , token )
    if (!token) {   
        throw new CustomError('You are not logged in', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECREATE as string) as JWTPayload;
    console.log(decoded);
    if (decoded === null) return;
    // d call to check the email or user is present

    const user = await db
        .select({ email: usersTable.email, password: usersTable.password, id: usersTable.id , role : usersTable.role , name : usersTable.name })
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
export const roleAuthAdmin =async (c : Context , next : Next )=>{
    const user = c.get('user')
    console.log("from role auth admin " , user )
    if(user.role !== 'admin')
    {   
        return c.json({
            message : "you are not admin"
        }, 401 )
    }

    await next()
}

export const roleAuthUser =async (c : Context , next : Next )=>{
    const user = c.get('user')
    if(user.role !== 'user')
    {   
        return c.json({
            message : "you are not user"
        }, 401 )
    }

    await next()
}
