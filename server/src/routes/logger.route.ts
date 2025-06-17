import { Hono } from 'hono';
import { deletelogs, getlogs, getUsers, postlogs } from '../controllers/logger.controller.js';
import { protect, roleAuthUser } from '../middleware/auth.middleware.js';

const logger = new Hono();

logger.get('/log', protect, roleAuthUser, getlogs);

logger.post('/log', protect, postlogs);

logger.delete('/log/:id', protect, deletelogs);

export default logger;
