import clientEvents from './events/client.mjs'
import stallEvents from './events/stall.mjs'
import orderEvents from './events/stall.mjs'

export const registerSocketHandlers = (io, socket, orderModel) => {
  stallEvents(io, socket, orderModel)
  clientEvents(io, socket, orderModel)
  orderEvents(io, socket, orderModel)

}
