import Router from 'express';
import { VerifyToken } from '../middleware/auth.middleware.js';
import { cancelOrder, createOrder, getAllOrders, getOrderByUser } from '../controllers/order.controller.js';

const router = Router()

 router.route('/create').post(VerifyToken,createOrder)
 router.route('/all-order').get(VerifyToken,getAllOrders)
 router.route('/cancel-order/:_id').put(VerifyToken, cancelOrder)
 router.route('/get-order-by-user').get(VerifyToken, getOrderByUser)


 export default router