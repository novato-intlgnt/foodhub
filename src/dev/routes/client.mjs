import { Router } from 'express'
import { UserController } from '../controllers/users.mjs'
import { METHODS as auth } from '../middlewares/auth.mjs'
import {  assignRole } from '../middlewares/userHandler.mjs'

export const clientRouter = ({ workerModel }) => {
  const clientRouter = Router()

  return clientRouter
}
