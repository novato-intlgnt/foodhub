import { z } from 'zod'

export const orderSchema = z.object({
  user: z.string({
    invalid_type_error: 'User must be a string',
    required_error: 'User is required'
  }),

  role: z.enum(['stall', 'client'], {
    invalid_type_error: 'Role must be either "stall" or "client"',
    required_error: 'Role is required'
  }),

  clientName: z.string({
    invalid_type_error: 'Client name must be a string',
    required_error: 'Client name is required'
  }).min(1, { message: 'Client name cannot be empty' }),

  payMethod: z.string({
    invalid_type_error: 'Pay method must be a string',
    required_error: 'Pay method is required'
  }).min(1, { message: 'Pay method cannot be empty' }),

  products: z.record(
    z.string().regex(/^\d+$/, { message: 'Product ID must be a stringified number' }),
    z.number().int().positive({ message: 'Quantity must be a positive integer' })
  ).refine(obj => Object.keys(obj).length > 0, {
    message: 'At least one product is required'
  })
})

export function validateOrder (object) {
  return orderSchema.safeParse(object)
}

export function validatePartialOrder(object) {
  return orderSchema.partial().safeParse(object)
}
