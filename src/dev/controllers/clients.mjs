export class ClientController {
  constructor ({ clientModel }) {
    this.clientModel = clientModel
  }

  getAllProducts = async (req, res) => {
      try {
        const productList = await this.clientModel.getAllProducts({ input: req.body })
        
        if (!productList == true) return res.status(400).json({ status: 'warning', message: `We couldn't loaded the products` })
          
        return res.status(200).json({ success: true, data: productList })
      } catch (err) {
        console.log('Error:', err)
        return res.status(500).send({ status: 'error', message: 'Error internal server' })
      }
  }

  getAllCategories = async (req, res) => {
      try {
        const categoryList = await this.clientModel.getAllCategories({ input: req.body })

        return res.status(200).json({ success: true, data: categoryList })
        } catch (err) {
        console.log('Error:', err)
        return res.status(500).send({ status: 'error', message: 'Error internal server' })
        }
  }
}
