import { Router } from 'express'
import { METHODS as auth } from '../middlewares/auth.mjs'
import {  assignRole } from '../middlewares/userHandler.mjs'

export const workerRouter = ({ workerModel }) => {
  const workerRouter = Router()

  return workerRouter
}
