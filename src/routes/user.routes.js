import { Router } from "express";
import  {userLogin, userRegister}  from "../controllers/user.controller.js"
import { upload } from "../middleware/multer.middleware.js";



const router = Router()

router.route("/register").post(upload.single("profile_pic"),userRegister)
router.route("/login").post(userLogin)

 
export {router}


// if there is default in export, then we can use any thing like (export default router), for tbis (app.use('/auth', userRoutes))
// if there is not default then whatever there is, same should be imported.