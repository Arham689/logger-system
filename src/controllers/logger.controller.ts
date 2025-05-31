import type { Context } from 'hono';
import { db } from '../db.js';
import { usersTable, type SelectUser } from '../schema.js';
import { eq } from 'drizzle-orm';

export const getlogs = (c: Context) => {
    return c.text('llogger callded get from hello test');
};

export const postlogs = (c: Context) => {
    return c.text('llogger callded post from contorllers');
};

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
    await db.delete(usersTable).where(eq(usersTable.id, id));
}
