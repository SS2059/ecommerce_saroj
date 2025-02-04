import jwt from "jsonwebtoken"
import {User} from "../model/user.model.js"

export const VerifyToken = async (req, res, next) => {
    try {
        console.log(req.cookies)
        const token = req.cookies?.accessToken
        console.log('accesstoken', token)

        if (!token){
            res.status(401).json({
                message: "Unauthorized request"
            })   
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        console.log("user", user)                                       
         if (!user) {
            res.status(404).json ({
                message: "User not found"
            })
         }
        req.user = user
         next()
    }catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
}


