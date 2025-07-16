import { OrderController } from "../../controllers/order.mjs"
export default function orderEvents(io, socket, orderModel) {
  const orderController = new OrderController({ orderModel })
  socket.on('order:updateStatus', async (data, cb) => {
    socket.body = {...socket.body, ... data}
    console.log("estamos en order")
    console.log(socket.body)
    const resOrder = await orderController.updateStatus(io, socket)
    cb(resOrder)

    io.to(`client-${data.clientId}`).emit("order:statusChanged", {
      orderId: data.orderId,
      newStatus: data.newStatus
    });
    
  })

  socket.on('order:order/update', async (data, cb) => {
    cb(result)
  })
}
