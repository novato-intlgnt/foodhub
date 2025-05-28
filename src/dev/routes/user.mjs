import { Router } from 'express'
import { UserController } from '../controllers/users.mjs'
import { METHODS as auth } from '../middlewares/auth.mjs'
import {  assignRole } from '../middlewares/userHandler.mjs'

export const userRouter = ({ userModel, emailService }) => {
  const userRouter = Router()

  const userController = new UserController({ userModel, emailService })

  userRouter.post('/stail/signup', assignRole('admin'), userController.create)
  userRouter.post('/stail/signin', userController.auth)

  userRouter.post('/client/signup', assignRole('client'), userController.create)
  userRouter.post('/client/signin', userController.auth)
  userRouter.get('/:token', userController.verify)
  userRouter.get('/:name/dashboard', auth.onlyUser, userController.access)
  return userRouter
}
