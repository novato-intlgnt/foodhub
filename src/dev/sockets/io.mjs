import { Server as SocketIOServer } from 'socket.io'
import { registerSocketHandlers as socketRouter } from './socketRouter.mjs'
import { onlyUser } from './middlewares/auth.mjs'

/*
  - Inicializa el servidor WebSocket y lo configura.
  - @param {http.Server} server - Servidor HTTP ya creado.
  - @returns {import('socket.io').Server} - Instancia de WebSocket
 */
export const initSocket = (server, orderModel) => {
  const io = new SocketIOServer(server, 
    // {
    // cors: {
    //   origin: '*',
    //   methods: ['GET', 'POST']
    // }}
  )

  io.use(onlyUser)

  // Registro de eventos por conexión
  io.on('connection', (socket) => {
    console.log('🔌 Nueva conexión WebSocket:', socket.id)
    socketRouter(io, socket, orderModel)

    socket.on('disconnect', () => {
      console.log('❌ Cliente desconectado:', socket.id)
    })
  })

  return io
}
