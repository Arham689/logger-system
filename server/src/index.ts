import { serve } from '@hono/node-server';
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Hono } from 'hono';
import logger from './routes/logger.route.js';

import authRoute from './routes/auth.route.js';
import { cors } from 'hono/cors';
import adminRoute from './routes/admin.route.js';
import apiKeyRoute from './routes/apikey.route.js';

const app = new Hono();

app.use(
    '*',
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
       allowHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'x-api-key'], 
    })
);

app.get('/', (c) => {
    return c.json({ helo: 'hono' });
});

app.route('/api', logger);
app.route('/api', authRoute);
app.route('/api', adminRoute);
app.route('/api', apiKeyRoute )

const server = serve(
    {
        fetch: app.fetch,
        port: 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    }
);

export const ioServer = new Server(server as HttpServer, {
    path: '/ws',
    serveClient: false,
});

ioServer.on('error', (err) => {
    console.log(err);
});

ioServer.on('connection', (socket) => {
    console.log('client connected');
    socket.on('disconnect', (reason) => {
        console.log(`Client disconnected with reason: ${reason}`);
        // Perform cleanup or other actions here
    });

    socket.emit('hello', { id: socket.id });

    socket.on('message' , (d)=>{
        console.log(d)
    })
});

// setInterval(() => {
//     ioServer.emit('hello', 'world');
// }, 1000);

// websockets has support for androiod or rust implimentation
// but we have to write out out andriond or rust implimentation , but have some repos but not mantained
