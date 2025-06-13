import { validatePartialUser, validateUser } from '../schemes/userScheme.mjs'

// Fix to __dirname in module scope
import path from 'path'
import { fileURLToPath } from 'url'
const cwd = path.dirname(fileURLToPath(import.meta.url))
const __dirname = path.resolve(cwd, '..', '..')

export class StallController {
  constructor ({ stallModel }) {
    this.stallModel = stallModel
  }

  getAll = async (req, res) => {
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
