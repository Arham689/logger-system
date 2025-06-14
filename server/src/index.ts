import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { db } from './db.js';
import { usersTable, type InsertUser, type SelectUser } from './db/schema/user.js';
import logger from './routes/logger.route.js';
import { eq } from 'drizzle-orm';
import authRoute from './routes/auth.route.js';
import { cors } from 'hono/cors';

const app = new Hono();

app.use(
    '*',
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
    })
);

app.get('/', (c) => {
    return c.json({ helo: 'hono' });
});

// seed
app.get('/api/insert', async (c) => {
    try {
        await createUser({ name: 'Alice1', age: 25, email: 'alice1@example.com' });
        await createUser({ name: 'Bob2', age: 30, email: 'bob2@example.com' });

        // await createPost({
        // 	title: 'Alice’s First Post',
        // 	content: 'Hello world! This is Alice.',
        // 	userId: 1,
        // });
        // await createPost({
        // 	title: 'Bob’s Thoughts',
        // 	content: 'Bob shares his thoughts on TypeScript.',
        // 	userId: 2,
        // });
        // await createPost({
        // 	title: 'Another from Alice',
        // 	content: 'Alice writes again.',
        // 	userId: 1,
        // });

        console.log('the data is inserted ');

        return c.json({
            message: 'data inserted !',
        });
    } catch (error) {
        console.error(error);
        throw new Error();
    }
});

app.route('/api', logger);
app.route('/api', authRoute);

async function createUser(data: InsertUser) {
    await db.insert(usersTable).values(data);
}

// async function createPost(data: InsertPost) {
// 	await db.insert(postsTable).values(data);
// }

serve(
    {
        fetch: app.fetch,
        port: 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    }
);
