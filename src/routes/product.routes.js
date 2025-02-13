import { Router } from "express"
import { addProduct, deleteProduct, fetchProducts, fetchsingleproduct} from "../controllers/product.controller.js"
import { VerifyToken } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = Router()

router.route("/add-product").post(upload.single("image"), VerifyToken, addProduct)
router.route("/fetch-product").get(VerifyToken,fetchProducts)
router.route("/single-product/:_id").get(fetchsingleproduct)
router.route("/delete-product/:_id").delete(VerifyToken, deleteProduct)
 
export default router