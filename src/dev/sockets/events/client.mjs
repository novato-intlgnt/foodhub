import { OrderController } from "../../controllers/order.mjs"
export default function clientEvents(io, socket, orderModel) {
  socket.on('join:clients', () => {
    socket.join('clients');
    console.log(`Cliente ${socket.id} se unió a la sala "clients"`);
  });

  const orderController = new OrderController({ orderModel })
  socket.on('client:order', async (data, cb) => {
    socket.body = {...socket.body, ... data}
    const resOrder = await orderController.setOrder(io, socket)
    console.log(resOrder)
    cb(resOrder)

    socket.broadcast.to('clients').emit('client:new-order', {
      message: `Nuevo pedido en la cola, hay ${resOrder.totalOrder}`,
      totalOrder: resOrder.totalOrder
    });
  })

  socket.on('client:order/update', async (data, cb) => {
    // cb(result)
  })
}
