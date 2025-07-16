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
        return { success: true, "data": newOrder.data };
       
      } catch (err) {
        console.log('Error:', err)
        return {
          success: false,
          status: 'error',
          message: 'Error internal server',
        }
      }
  }
  getAllOrders = async (req, res) => {
      try {
      console.log(req.body)
      const orderlist = await this.orderModel.getAllOrders({ input: req.body })
      
      if (!orderlist == true) return res.status(400).json({ status: 'warning', message: `we couldn't loaded the products` })
        
      return res.status(200).json({ success: true, data: orderlist })
    } catch (err) {
      console.log('error:', err)
      return res.status(500).send({ status: 'error', message: 'error internal server' })
    }
  }
  updateStatus = async (req, res) => {
    try {
      console.log(req.body)
      const orderlist = await this.orderModel.updateStatus({ input: req.body })
      
      if (!orderlist == true) return res.status(400).json({ status: 'warning', message: `we couldn't loaded the products` })
        
      return res.status(200).json({ success: true, data: orderlist })
    } catch (err) {
      console.log('error:', err)
      return res.status(500).send({ status: 'error', message: 'error internal server' })
    }
  }
}
