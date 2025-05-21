import { validatePartialUser, validateUser } from '../schemes/userScheme.mjs'

// Fix to __dirname in module scope
import path from 'path'
import { fileURLToPath } from 'url'
const cwd = path.dirname(fileURLToPath(import.meta.url))
const __dirname = path.resolve(cwd, '..', '..')

export class UserController {
  constructor ({ userModel, emailService }) {
    this.userModel = userModel
    this.emailService = emailService
  }

  create = async (req, res) => {
    try {
      const result = validatePartialUser(req.body)
      console.log(req.body)
      console.log('------------')
      console.log(result.data)

      Object.assign(result.data, { role: "admin"})
      if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message), postMessage: req.body })
      }

      const isUserExist = await this.userModel.check({ input: result.data })
      if (isUserExist === true) {
        return res.status(400).send({ status: 'error', message: 'Some of the data entered is already registered' })
      }

      if (Object.keys(isUserExist).length === 4) {
        const verifyEmail = await this.emailService.send({ input: isUserExist })

        if (verifyEmail === 0) {
          return res.status(400).send({ status: 'error', message: 'There is some problem, sending the email verification' })
        }
        if (Object.keys(verifyEmail).length === 1) {
          const newData = { ...result.data }
          const newUser = await this.userModel.createWorker({ input: newData })
          if (newUser) {
            return res.status(201).send({ status: 'success', message: 'User successfully created, you only need to check your email address to verify your account' })
          } else {
            return res.status(500).send({ status: 'error', message: 'User could not be created' })
          }
        }
      }
    } catch (err) {
      console.log('Error:', err)
      res.status(500).send({ status: 'error', message: 'Error internal server' })
    }
  }

  verify = async (req, res) => {
    try {
      if (!req.params.token) {
        return res.redirect('/')
      }
      const isVerify = await this.userModel.verify({ input: req.params.token })
      if (isVerify === true) {
        return res.status(400).json({ status: 'Error', message: 'There is some problem with the token' }).redirect('/')
      }
      if (isVerify === 1) {
        return res.status(301).json({ status: 'Error', message: "You've been verified before" })
      }
      if (Object.keys(isVerify).length === 3) {
        const { auth, cookie, user } = isVerify
        console.log(isVerify)
        res.cookie('user', auth, cookie)
        return res.redirect(`${user}/dashboard`)
      }
      return res.status(400).json({ status: 'Error', message: 'You are not registered with us' }).redirect('/')
    } catch (err) {
      res.status(500)
      console.log(err)
      res.redirect('/')
    }
  }

   auth = async (req, res) => {
     try {
       const result = validatePartialUser(req.body)
       console.log(req.body)
       console.log('-------')
       console.log(result.data)

       if (!result.success) {
         return res.status(400).send({ status: 'error', message: 'The fields have not been filled correctly' })
       }

       const authUser = await this.userModel.auth({ input: result.data })
       if (authUser === false) {
         return res.status(400).send({ status: 'error', message: 'There is some problem with the data entered' })
       }
       const { auth, cookie, name } = authUser
       res.cookie('user', auth, cookie)
       return res.status(200).send({ status: 'ok', redirect: `user/${name}/dashboard` })
     } catch (err) {
       console.log('Error: ', err)
       res.status(500).json({ status: 'error', message: 'Error internal server' })
     }
   }

  access = async (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
  }
}
