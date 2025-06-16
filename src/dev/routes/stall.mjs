import { Router } from 'express'
import { StallController } from '../controllers/stall.mjs'
import { METHODS as auth } from '../middlewares/auth.mjs'

export const stallRouter = ({ stallModel }) => {
  const stallRouter = Router()

  const stallController = new StallController({ stallModel })

  stallRouter.get('/products', auth.userData, stallController.getAllProducts)
  stallRouter.get('/categories', auth.userData, stallController.getAllCategories)

  stallRouter.post('/categories', auth.userData, stallController.addCategory)
  stallRouter.post('/product', auth.userData, stallController.addProduct)

  // stailRouter.post('/product/', assignRole('admin'), userController.create)
  // stailRouter.post('/product/create', userController.auth)
  // stailRouter.post('/product/delete', userController.auth)
  //
  // stailRouter.post('/order/create', assignRole('client'), userController.create)
  return stallRouter
}
