import mongoose from "mongoose";

const categorySchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    }
},
{
    timestamps : true,
}
)
export const category = mongoose.model("Category", categorySchema)