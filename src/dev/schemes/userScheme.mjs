import z from 'zod'

const userSchema = z.object({
  urlhost: z.string().url(),
  user: z.string({
    invalid_type_error: 'Name user must be a string',
    required_error: 'Name user is required'
  }),
  email: z.string().email(),
  phone: z.number().min(900000000, { message: 'The telephone number must be have 9 digits' }).max(1000000000),
  pass: z
    .string().min(8, { message: 'The password must contain at least 8 characters' })
    .refine((pass) => /\d/.test(pass), { message: 'The password must contain at least one number' })
    .refine((pass) => /[A-Z]/.test(pass), { message: 'The password msut contain at least one capital letter' })
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validatePartialUser (object) {
  return userSchema.partial().safeParse(object)
}
