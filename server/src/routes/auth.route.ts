import { Hono } from "hono";
import type { Context } from "hono/jsx";
import {  login, signUp } from "../controllers/auth.controller.js";



const authRoute = new Hono()

authRoute.post('/signup' , signUp  )

authRoute.post('/login' , login )

export default authRoute