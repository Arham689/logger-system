import { Hono } from "hono";
import type { Context } from "hono/jsx";
import {  isAuth, login, logout, signUp } from "../controllers/auth.controller.js";
import { protect, roleAuthUser } from "../middleware/auth.middleware.js";
import { getAllData } from "../controllers/admin.controller.js";



const authRoute = new Hono()

authRoute.post('/signup' , signUp  )

authRoute.post('/login' , login )

authRoute.get('/isauth' , protect , isAuth ,getAllData) 

authRoute.get('/logout'  , logout  )
export default authRoute