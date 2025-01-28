import mongoose, { mongo } from "mongoose";

const userSchema = new  mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
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
    }

    },
    {
        timestamps: true,
    }
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = bcryptjs.hash(this.password, 10)
    next()
  })
  
  userSchema.methods.isPasswordCorrect = async function (password) {
     return await bcryptjs.compare(password, this.password)
   }
  
    export const user = mongoose.model("User", userSchema)