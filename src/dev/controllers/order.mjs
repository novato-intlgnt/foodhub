import { validateOrder, validatePartialOrder } from "../schemes/orderScheme.mjs"

export class OrderController {
  constructor ({ orderModel }) {
    this.orderModel = orderModel
  }

  setOrder = async (io, socket) => {
      try {
        const  result = validatePartialOrder(socket.body); 
        
        console.log(socket.body)
        if (!result.success) {
          const errorMessages = result.error.errors.map(err => err.message)
        return {
          success: false,
          error: 'Validation failed',
          details: errorMessages
        }
        }
        
        const newOrder = await this.orderModel.setOrder({ input: result.data })

        if(!newOrder.success) return { success: false, status: 'warning', message: 'Hubo un problema procesando el pedido'}
        const { position, totalOrder } = newOrder
        return { succes: true, status: 'success', message: `Se proceso el pedido, hay ${newOrder.totalOrder} pedidos, y usted esta en la posicion ${newOrder.position}`, position, totalOrder };
       
      } catch (err) {
        console.log('Error:', err)
        return {
          success: false,
          status: 'error',
          message: 'Error internal server',
        }
      }
  }
}
