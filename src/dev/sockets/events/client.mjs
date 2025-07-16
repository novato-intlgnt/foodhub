import { OrderController } from "../../controllers/order.mjs"
export default function clientEvents(io, socket, orderModel) {
  socket.on('client:join', (clientId) => {
    socket.join(`client-${clientId}`);
    console.log(`Cliente ${clientId} se unió a la sala "clients"`);
  });

  const orderController = new OrderController({ orderModel })
  socket.on('client:order', async (data, cb) => {
    socket.body = {...socket.body, ... data.order}
    const resOrder = await orderController.setOrder(io, socket)
    console.log(resOrder)
    cb(resOrder)


    // if(resOrder.success) {
      socket.broadcast.to('clients').emit('client:new-order', {
        message: `Nuevo pedido en la cola`,
      });
      io.to(`stall-${data.stallId}`).emit("order:new", resOrder);
    // }
  })

  socket.on('client:order/update', async (data, cb) => {
    // cb(result)
  })
}
