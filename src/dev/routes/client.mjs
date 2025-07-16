import { Router } from 'express'
import { ClientController } from '../controllers/clients.mjs'
import { METHODS as auth } from '../middlewares/auth.mjs'

export const clientRouter = ({ clientModel }) => {
  const clientRouter = Router()

  const clientController = new ClientController({ clientModel })

  clientRouter.post('/products', auth.userData, clientController.getAllProducts)
  clientRouter.get('/categories', auth.userData, clientController.getAllCategories)

  // clientRouter.post('/categories', auth.userData, clientController.addCategory)
  // clientRouter.post('/product', auth.userData, clientController.addProduct)

  return clientRouter
}
