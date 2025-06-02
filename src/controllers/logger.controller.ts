import type { Context, Next } from 'hono';
import { db } from '../db.js';
import { usersTable, type SelectUser } from '../db/schema/user.js';
import { eq } from 'drizzle-orm';
import { activityLogsTable } from '../schema.js';
import { z } from 'zod';
import {asyncErrorHandler } from "../utils/asyncErrorHandler.js"
export const eventTypeEnum = z.enum(['LOGIN', 'LOGOUT', 'PAGE_VISIT', 'ERROR']);

const logSchema = z.object({
  userId: z.number().int(),
  eventType: eventTypeEnum,
  metadata: z.string().optional(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
});

export type LogDataType = z.infer<typeof logSchema>;

export const getlogs = asyncErrorHandler(async (c: Context , next : Next) => {
    // make seperate fo useres and activelog affer auth 
    console.log("user from logs" , c.get('user'))
    const logs = await db.select().from(activityLogsTable)
    console.log(logs)
    
    c.status(200)
    return c.json({
        message : 'success',
        logs
    });
})

export const getUsers = asyncErrorHandler(async ( c : Context , next :Next ) => {
    const users =await db.select().from(usersTable)
    console.log(users)

    return c.json({
        message : "success",
        users
    } , 200 )
})

export const postlogs = asyncErrorHandler(async (c: Context, next: Next) => {
  const body = await c.req.json();

  const result = logSchema.safeParse(body);

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
