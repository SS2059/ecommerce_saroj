import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
        
        }
},
{
    timestamps: true,
}
)
export const product = mongoose.model("Product", productSchema)