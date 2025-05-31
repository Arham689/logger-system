import { Hono } from 'hono';
import {
  deletelogs,
  getlogs,
  postlogs,
} from '../controllers/logger.controller.js';

const logger = new Hono();

logger.get('/log', getlogs);

logger.post('/log', postlogs);

logger.delete('/log/:id', deletelogs);
export default logger;
