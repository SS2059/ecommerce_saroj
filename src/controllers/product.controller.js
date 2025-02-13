import { Product } from "../model/product.model.js"
import { User } from "../model/user.model.js"
import fs from "fs"
import path from "path"

const addProduct = async(req, res) => {
    try {
        const {title, description, price, Categories, stock_quantity,rating} = req.body
        console.log(req.body)
        const imagePath = `public/images/${req.file.filename}`

        const user = await User.findById(req.user?._id)
        if(!user.isAdmin){
            return res.status(400).json({
                message: "Unauthorized Request, Cannot Provide Access"
            })
        }
        const product = await Product.create({
            title,
            description,
            price,
            Categories,
            stock_quantity,
            rating,
            image: imagePath
        })
        console.log("User:", user);
        console.log("Product Data:", { title, description, price, Categories, stock_quantity, rating, imagePath });

        if(!product) {
            return res.status(400).json({
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            message: "Product Created Successfully"
        })
    }catch (error) {
        console.log("Error while adding product", error)
        res.status(500).json({
        message: error
    })
    }
}


const fetchProducts = async(req, res) => {
    try {
        let perPage = parseInt(req.query.perPage) || 5
        let page = parseInt(req.query.page) || 1
       let  category = req.query.category

        let productFilter = {}
        if(category){
            productFilter.Categories = category
        }

        let products = await Product.find(productFilter)
            .skip((page -1) * perPage)
            .limit(perPage)

            let totalProducts = await Product.countDocuments(productFilter)

            res.status(200).json({
                page: page,
                perPage: perPage,
                total: totalProducts,
                data: products
            })
    } catch (error) {
        console.log("Error while fetching Products", error)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

const fetchsingleproduct = async(req, res) => {
    try {
        console.log(req.params._id)
        
        const product= await Product.findById(req.params._id)
   
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            })
        }
        return res.status(200).json({
            message: "Single Product Fetched",
            data: product
        })
        
    } catch (error) {
        console.log("Error", error)
         res.status(500).json({      
            message:"Error fetching single product details"
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user.isAdmin){
            return res.status(401).json({
                message: "Unauthorized Request"
            })
        }
        const product = await Product.findById(req.params._id)
        if(!product){
            return res.status(404).json({
                message: "Product Not Found"
            })
        }
        
        await Product.deleteOne({_id:req.params._id})
        if (product.image){
            const imagePath = path.join(path.resolve(), product.image)
            fs.unlink(imagePath, (err) => {
                if(err){
                    console.log("Error deleting file", err);
                }
            })
        }
        res.status(200).json({
            message: "Product deleted successfully"
        })
    } catch (error) {
        console.log("error while deleting", error)
        res.status(500).json({
            message: "Failed to delete the product"
        })
    }
}
export {addProduct, fetchProducts, fetchsingleproduct, deleteProduct}