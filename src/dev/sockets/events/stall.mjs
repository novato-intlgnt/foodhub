import { OrderController } from "../../controllers/order.mjs"
export default function stallEvents(io, socket, orderModel) {
  socket.on("stall:join", (stallId) => {
    socket.join(`stall-${stallId}`);
    console.log(`Puesto ${stallId} se ha unido a la sala.`);
  });
  const orderController = new OrderController({ orderModel })
  socket.on('stall:order', async (data, cb) => {
    socket.body = {...socket.body, ... data}
    const resOrder = await orderController.setOrder(io, socket)
    cb(resOrder)

    socket.broadcast.to('clients').emit('client:new-order', {
      message: `Nuevo pedido en la cola, hay ${resOrder.totalOrder}`,
      totalOrder: resOrder.totalOrder
    });
    
  })

  socket.on('stall:order/update', async (data, cb) => {
    cb(result)
  })
}
