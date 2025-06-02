import type { Context, Next } from 'hono';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.js';
import CustomError from '../utils/customerror.js';
import { db } from '../db.js';
import { usersTable } from '../schema.js';
import { setCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const userSchema = z.object({
    name: z.string().nonempty(),
    age: z.number().min(18).max(60),
    email: z.string().email(),
    password: z.string().min(4).max(16),
});

const loginSchema = userSchema.pick({ email: true, password: true });

export const signToken = (email: string): string => {
    if (!process.env.JWT_SECREATE) {
        throw new CustomError('env not loaded', 500);
    }
    return jwt.sign({ email }, process.env.JWT_SECREATE);
};

export const encryptPassword = (password: string): string => {
    const saltRounds = 10;
    // Generate a salt
    const salt = bcrypt.genSaltSync(saltRounds);

    // Hash the password using the generated salt
    const hash = bcrypt.hashSync(password, salt);

    return hash;
};

export type userType = z.infer<typeof userSchema>;
export const signUp = asyncErrorHandler(async (c: Context, next: Next) => {
    const data = await c.req.json();

    // validate data
    const result = userSchema.safeParse(data);

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

    const validatedData: userType = result.data;

    const hashedPass = encryptPassword(validatedData.password);

    // create user
    await db.insert(usersTable).values({ ...validatedData, password: hashedPass });

    // generate token
    let token: string;
    try {
        token = signToken(validatedData.email);
    } catch (err) {
        return c.json(
            {
                status: 'error',
                message: 'Token generation failed',
                error: (err as Error).message,
            },
            500
        );
    }

    // set token cookie
    setCookie(c, 'token', token, {
        httpOnly: true,
        maxAge: 2592000,
    });

    return c.json({
        message: 'success',
        token: token,
    });
});

export const login = asyncErrorHandler(async (c: Context, next: Next) => {
    // get the email password
    const { email, password } = await c.req.json();
    console.log(email, password);
    // validate
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
        return c.json({ error: result.error.errors }, 400);
    }
    // email exist in db else redirect to signup
    const user = await db.select({email : usersTable.email , password : usersTable.password}).from(usersTable).where(eq(usersTable.email, email)).limit(1);
    console.log(user)
    if (user.length === 0) {
        // Email not found — redirect to signup
        return c.redirect('/signup');
    }

    // check the password else throw the error
    const isPasswordCorrect =await bcrypt.compare(password , user[0].password)

    if(!user || isPasswordCorrect ){
        return c.json(
            { status: 'error', message: 'User not found or password is not correct' },
            400
        );
    }else{
        c.set('user', user[0]);
    }

    // generate token and send is cookie
    const token = signToken(user[0].email)

    setCookie(c , 'token' , token ,  {
        httpOnly: true,
        maxAge: 2592000,
    })
    // final respoinst
    return c.json({
        message: 'successful',
        token
    });
});
