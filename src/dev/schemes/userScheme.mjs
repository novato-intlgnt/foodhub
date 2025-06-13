import { z } from 'zod'

const nameField = (fieldName) =>
  z.string({
    invalid_type_error: `${fieldName} must be a string`,
    required_error: `${fieldName} is required`
  })

const passwordSchema = z.string()
  .min(8, { message: 'The password must contain at least 8 characters' })
  .refine((val) => /\d/.test(val), {
    message: 'The password must contain at least one number'
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: 'The password must contain at least one capital letter'
  })

const phoneSchema = z.number()
  .min(900000000, { message: 'The telephone number must have 9 digits' })
  .max(999999999)

const baseUserSchema = z.object({
  urlhost: z.string().url(),
  user: nameField('User'),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: phoneSchema,
  pass: passwordSchema,
})

const clientSchema = z.object({
  role: z.literal('client'),
  name: nameField('First Name'),
  lastName: nameField('Last Name'),
})

const stallSchema = z.object({
  role: z.literal('stall'),
  stallId: z.string({ required_error: 'Stall ID is required' }),
  area: z.enum(['engineering', 'social', 'biomedical'], {
    errorMap: () => ({ message: 'Area must be include in the UNSA'})
  }),
  place: nameField('Place stall')
})

const userSchema = z.discriminatedUnion('role', [
  baseUserSchema.merge(clientSchema),
  baseUserSchema.merge(stallSchema)
])

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validatePartialUser (object) {
  return baseUserSchema.partial().safeParse(object)
}
