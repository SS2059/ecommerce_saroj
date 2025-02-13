import { Order } from "../model/order.model.js"
import { Product } from "../model/product.model.js"
import { User } from "../model/user.model.js"


const createOrder = async (req, res) => {
  try {
    console.log("code was here")
    const Admin = await User.findById(req.user._id)
    console.log(Admin)
    if (Admin.isAdmin) {
      return res.status(403).json({
        message: "Forbidden request"
      })
    }
    let mapped_products = []
    for (let product of req.body.products) {
      const dbProduct = await Product.findById(product.product_id)
        console.log(dbProduct);
        
      mapped_products.push({
        product_id: dbProduct._id,
        name: dbProduct.title,
        price: dbProduct.price,
        quantity: product.quantity || 1
      })

    }

    const order = await Order.create({
      products: mapped_products,
      created_by: req.user._id
    })

    res.status(201).json({
      data: order,
      message: "Order Created Successfully"
    })
  } catch (error) {
    console.log("Error in creating order", error)
    res.status(500).json({
      message: "Failed to create"
    })
  }
}


const getAllOrders = async(req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if(!user.isAdmin){
      return res.status(403).json({
        message: "Forbiden Request"
      })
    }
    const orders = await Order.find().populate("created_by")
    return res.status(200).json({  
      message: "Orders Fetched Successfully",
      data: orders
    })
  } catch (error) {
    console.log("Error orders", error)
    return res.status(500).json({
      message: "Error while getting all orders"
    })
    
  }
}

// Look this one (not included in Course)
const cancelOrder = async(req, res) => {
  try {
    const order = await Order.findById(req.params._id)
    if(!order){
      return res.status(404).json({
        message: "Order not found"
      })
    }

    if(order.order_status === 'DELIVERED'){
      return res.status(400).json({
        message: "Delivered Orders Can't be Canceled"
      })
    }
    order.order_status = 'FAILED'
    await order.save({validateBeforeSave: true})

    return res.status(200).json({
      message: "Order Cancelled Successfully"
    })

  } catch (error) {
    console.log("error", error)
    return res.status(500).json({
      message: "Failed to Cancel the Order"
    })
    
  }
}


const getOrderByUser = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
    if (!user){  
      return res.status(401).json({
        message: "Unauthorized Request"
      })
    }
    const orders = await Order.find({created_by: req.user._id}).populate("created_by", "username email")
    if (!orders.length){
      return res.status(404).json({
        message: "No orders Found"
      })
    }

    return res.status(200).json({
      data : orders,
      message: "Orders Fetched"
    })
  } catch (error) {
    console.log("Error while fetching order by user", error);
    return res.status(500).json({
      message: "Error Fetching Order"
    })    
  }
}
export {createOrder, getAllOrders, cancelOrder, getOrderByUser}
