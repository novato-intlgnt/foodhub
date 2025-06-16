import { validatePartialProduct, validateProduct } from '../schemes/productScheme.mjs'

// Fix to __dirname in module scope
import path from 'path'
import { fileURLToPath } from 'url'
const cwd = path.dirname(fileURLToPath(import.meta.url))
const __dirname = path.resolve(cwd, '..', '..')

export class StallController {
  constructor ({ stallModel }) {
    this.stallModel = stallModel
  }

  getAllProducts = async (req, res) => {
      try {
        const productList = await this.stallModel.getAllProducts({ input: req.body })
        
        if (!productList == true) return res.status(400).json({ status: 'warning', message: `We couldn't loaded the products` })
          
        return res.status(200).json({ success: true, data: productList })
      } catch (err) {
        console.log('Error:', err)
        return res.status(500).send({ status: 'error', message: 'Error internal server' })
      }
  }

  getAllCategories = async (req, res) => {
      try {
        const categoryList = await this.stallModel.getAllCategories({ input: req.body })

        return res.status(200).json({ success: true, data: categoryList })
        } catch (err) {
        console.log('Error:', err)
        return res.status(500).send({ status: 'error', message: 'Error internal server' })
        }
  }

  addProduct = async (req, res) => {
      try {
        const result = validateProduct(req.body)
        
        if (result.error) {
          return res.status(400).json({ error: JSON.parse(result.error.message), postMessage: req.body })
        }
        const productList = await this.stallModel.addProduct({ input: result.data })

        if(productList.success == false) return res.status(400).json({ status: 'warning', message: `We couldn't add the product ${result.name}` })

        return res.status(200).json({ success: true, data: productList })
      } catch (err) {
        console.log('Error:', err)
        return res.status(500).send({ status: 'error', message: 'Error internal server' })
      }
  }
  
  addCategory = async (req, res) => {
      try {
        console.log(req.body)

        const productList = await this.stallModel.getAll({ input: req.body })

        return res.status(200).json({ success: true, data: productList })
      } catch (err) {
        console.log('Error:', err)
        return res.status(500).send({ status: 'error', message: 'Error internal server' })
      }
  }
}
