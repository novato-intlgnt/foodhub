import { Router } from 'express'
import { UserController } from '../controllers/users.mjs'
import { METHODS as auth } from '../middlewares/auth.mjs'
import {  assignRole } from '../middlewares/userHandler.mjs'

export const stailRouter = ({ userModel, emailService }) => {
  const stailRouter = Router()

  const userController = new UserController({ userModel, emailService })

  stailRouter.post('/create', assignRole('admin'), userController.create)

  stailRouter.post('/product/', assignRole('admin'), userController.create)
  stailRouter.post('/product/create', userController.auth)
  stailRouter.post('/product/delete', userController.auth)

  stailRouter.post('/order/create', assignRole('client'), userController.create)
  return stailRouter
}
