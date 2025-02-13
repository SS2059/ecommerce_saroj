import mongoose from "mongoose";

const categories = ['Men', 'Women', 'Kids']
const productSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        Categories: {
            type: String,
            enum : categories
        }, 
        stock_quantity: {
            type: Number,
            default: 0,
            required: true
        },
        image: {
            type: String
        }, 
        review: {
            type: String,
        }
},
{
    timestamps: true,
}
)
export const Product = mongoose.model("Product", productSchema)
