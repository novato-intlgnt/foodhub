import { validatePartialUser, validateUser } from '../schemes/userScheme.mjs'

// Fix to __dirname in module scope
import path from 'path'
import { fileURLToPath } from 'url'
const cwd = path.dirname(fileURLToPath(import.meta.url))
const __dirname = path.resolve(cwd, '..', '..')

export class StailController {}
