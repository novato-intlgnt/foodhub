import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { userRouter } from './dev/routes/user.mjs'
import { workerRouter } from './dev/routes/worker.mjs'
import { stailRouter } from './dev/routes/stail.mjs'
import { clientRouter } from './dev/routes/client.mjs'

// Fix to __dirname in module scope
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const createApp = ({ emailService, userModel, workerModel, stailModel, clientModel}) => {
  const app = express()
  const PORT = process.env.PORT ?? 4000

  // Middlewares
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(cookieParser())
  app.disable('x-powered-by')
  app.use(express.static(path.join(__dirname, 'public')))

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  })

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
  })

  app.get('/login/stail', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'loginStail.html'))
  })
  app.get('/dash', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/dash/dashboardtienda.html'))
  })
  app.use('/user', userRouter({ userModel, emailService }))
  app.use('/worker', workerRouter({ workerModel }))
  app.use('/stail', stailRouter({ stailModel }))
  app.use('/client', clientRouter({ clientModel }))

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
