import { Router } from "express";
import { userRegister } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(userRegister)
 
export default router


// if there is default in export, then we can use any thing like (export default router), for tbis (app.use('/auth', userRoutes))
// if there is not default then whatever there is, same should be imported.