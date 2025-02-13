import mongoose from "mongoose"
import { Product } from "./product.model.js"


const orderSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    product_id: {
                        type: mongoose.Types.ObjectId,
                        ref : "Product",
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    },
                    price: {
                        type: Number,
                        min: 0,
                        required: true
                    },
                    quantity: {
                        type: Number,
                        min: 1 
                        
                    },
                    status: {
                        type: String,
                        enum: ['PENDING', 'DELIVERED', 'FAILED' ],
                        required: true,
                        default: 'PENDING'
                    }
                }
            ],
            required:true,
            validate: {
                validator: function (value) {
                    if(value.length===0) return false
                },
                message: "Minimum one product must be selected"
            }
        },
        created_by: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

orderSchema.post("save", async function (order){
    for (let product of order.products) {
        await Product.findByIdAndUpdate(product.product_id,
        {
            $inc: {
                stock_quantity: -(product.quantity)
            }
        })
    }
})


export const Order = mongoose.model("Order", orderSchema)