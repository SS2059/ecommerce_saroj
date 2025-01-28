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
    export const user = mongoose.model("User", userSchema)