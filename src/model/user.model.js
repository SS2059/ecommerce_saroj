import mongoose, { mongo } from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new  mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    refreshToken: {
        type:String
    }

    },
    {
        timestamps: true,
    }
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcryptjs.hash(this.password, 10)
    next()
  })
  
  userSchema.methods.isPasswordCorrect = async function (password) {
     return await bcryptjs.compare(password, this.password)
   } 

   userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
   )
   }
  
    export const user = mongoose.model("User", userSchema)