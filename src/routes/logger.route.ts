import { Hono } from 'hono';
import {
  deletelogs,
  getlogs,
  getUsers,
  postlogs,
} from '../controllers/logger.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const logger = new Hono();

logger.get('/log', protect , getlogs);
logger.get('/users' , getUsers )
logger.post('/log', postlogs);

logger.delete('/log/:id', deletelogs);
export default logger;
