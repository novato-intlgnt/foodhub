// Core and Express modules
import http from 'http'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'

// Routers
import { userRouter } from './dev/routes/user.mjs'
import { stallRouter } from './dev/routes/stall.mjs'
import { clientRouter } from './dev/routes/client.mjs'
import { orderRouter } from './dev/routes/orders.mjs'

import { initSocket } from './dev/sockets/io.mjs' 

// Monitoring
import { httpRequestCounter, register } from './dev/metrics/metrics.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Create Express app with dependency injection
export const createApp = ({ emailService, userModel, stallModel, clientModel, orderModel }) => {
  const app = express()
  const server = http.createServer(app)
  const io = initSocket(server, orderModel)
  const PORT = process.env.PORT ?? 4000

  // Middlewares
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(cookieParser())
  app.disable('x-powered-by')
  app.use(express.static(path.join(__dirname, 'public')))

  // Metrics middleware
  app.use((req, res, next) => {
    res.on('finish', () => {
      httpRequestCounter.labels(req.method, req.path, res.statusCode).inc()
    })
    next()
  })

  // Routes (frontend static)
  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  })
  app.get('/login', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
  })
  app.get('/login/stail', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'loginStall.html'))
  })
  app.get('/dash', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', '/dash/dashboardtienda.html'))
  })

  // API Routes
  app.use('/user', userRouter({ userModel, emailService }))
  app.use('/stall', stallRouter({ stallModel }))
  app.use('/client', clientRouter({ clientModel }))
  app.use('/order', orderRouter({ orderModel }))

  // Metrics endpoint (for Prometheus)
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType)
    res.end(await register.metrics())
  })

  // Start server with WebSocket support
  server.listen(PORT, () => {
    console.log(`✅ Server listening at http://localhost:${PORT}`)
    console.log(`✅ WebSocket server ready at ws://localhost:${PORT}`)
  })

  return { app, server, io } // Return io instance for further use
}
