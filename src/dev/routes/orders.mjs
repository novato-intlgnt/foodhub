import { Router } from 'express'
import { OrderController } from '../controllers/order.mjs'
import { METHODS as auth } from '../middlewares/auth.mjs'

export const orderRouter = ({ orderModel }) => {
  const orderRouter = Router()

  const orderController = new OrderController({ orderModel })

  orderRouter.get('/', auth.userData, orderController.getAllOrders)

  // orderRouter.post('/categories', auth.userData, clientController.addCategory)
  // orderRouter.post('/product', auth.userData, clientController.addProduct)

  return orderRouter
}
