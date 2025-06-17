import { Hono } from 'hono';
import {
    deleteUsersKey,
    getUsersKey,
    gnerateApiKey,
    pathWitToken,
    postLogApiKey,
} from '../controllers/apiKey.controller.js';
import { protect, roleAuthUser } from '../middleware/auth.middleware.js';
import { decryptApiKey, validateApiKey } from '../middleware/apikey.middleware.js';
import { apikeyTable } from '../schema.js';

const apiKeyRoute = new Hono();

apiKeyRoute.get('/apikey', protect, roleAuthUser, gnerateApiKey);

apiKeyRoute.get('/userkeys', protect, roleAuthUser, getUsersKey);

apiKeyRoute.delete('/delete/:id', protect, roleAuthUser, deleteUsersKey);

apiKeyRoute.get('/getallusers', decryptApiKey, pathWitToken);

apiKeyRoute.post('/key', decryptApiKey, postLogApiKey);
export default apiKeyRoute;
