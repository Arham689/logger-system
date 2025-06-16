import { Hono } from 'hono';
import { getAllData, getAllUsers, isAdmin } from '../controllers/admin.controller.js';
import { protect, roleAuthAdmin } from '../middleware/auth.middleware.js';

const adminRoute = new Hono();

adminRoute.get('/users', protect, roleAuthAdmin, getAllUsers);

adminRoute.get('/isadmin', protect, roleAuthAdmin, isAdmin);

adminRoute.get('/data' , protect , roleAuthAdmin , getAllData)

export default adminRoute;
