import { Hono } from "hono";
import type { Context } from "hono/jsx";
import {  isAuth, login, signUp } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";



const authRoute = new Hono()

authRoute.post('/signup' , signUp  )

authRoute.post('/login' , login )

authRoute.get('/isauth' , protect , isAuth )
export default authRoute