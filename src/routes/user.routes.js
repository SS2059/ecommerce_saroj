import { Router } from "express";
import  {userLogin, userRegister, userLogout, getUser, genRefreshToken}  from "../controllers/user.controller.js"
import { upload } from "../middleware/multer.middleware.js";
import { VerifyToken} from "../middleware/auth.middleware.js";


const router = Router()

router.route("/register").post(upload.single("profile_pic"),userRegister)
router.route("/login").post(userLogin)
router.route("/logout").post(VerifyToken, userLogout)
router.route("/getuser").get(VerifyToken, getUser)
router.route("/refreshtoken").get(genRefreshToken)

 
export {router}


// if there is default in export, then we can use any thing like (export default router), for tbis (app.use('/auth', userRoutes))
// if there is not default then whatever there is, same should be imported.