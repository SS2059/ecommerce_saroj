import { Router } from "express";
import  {userLogin, userRegister, userLogout, getUser, refreshAccessToken, updateUserDetails, updatePassword, updateprofilepic}  from "../controllers/user.controller.js"
import { upload } from "../middleware/multer.middleware.js";
import { VerifyToken} from "../middleware/auth.middleware.js";
import Joi from 'joi'
import validator from 'express-joi-validation'
import fs from 'fs'
import path from 'path'


const router = Router()
const validate = validator.createValidator()
const registerValidationSchema = Joi.object({
    username: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(14).required().pattern(new RegExp
        ("^(?=.*[^a-zA-Z0-9])(?=.*[A-Z])(?=.*\\d).{8,}$")).message({
            "string.pattern.base": "Password must include one special character, one uppercase letter and one digit."
        })
    })  


router.route("/register").post(upload.single("profile_pic"),  async (req, res, next) => {
    try {
        await registerValidationSchema.validateAsync(req.body)
        next();
    } catch (error) {
        console.log("Validation Error:", error.message);
        
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            if (err){
                console.log("error deleting file:", err);
     }})
}
    const errorMessage = error.details.map((err) => err.message.replaceAll('"', ''))
    return res.status(400).json({
        message:  errorMessage
    });
}
}, userRegister)


router.route("/login").post(userLogin)
router.route("/logout").post(VerifyToken, userLogout)
router.route("/getuser").get(VerifyToken, getUser)
router.route("/accesstoken").get(refreshAccessToken)
router.route("/update-data").patch(updateUserDetails)
router.route("/update-password").patch(VerifyToken,updatePassword)
router.route("/update-pic").patch(upload.single("profile_pic"),VerifyToken,updateprofilepic)


export default router


// if there is default in export, then we can use any thing like (export default router), for tbis (app.use('/auth', userRoutes))
// if there is not default then whatever there is, same should be imported.