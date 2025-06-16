import z from 'zod'

const productSchema = z.object({
  role: z.literal('stall'),
  user: z.string({
    invalid_type_error: `userName must be a string`,
    required_error: `userName is required`
  }),
  name: z.string({
    invalid_type_error: 'Product name must be a string',
    required_error: 'Product name is required',
  }).min(1, { message: 'Product name cannot be empty' }),

  description: z.string({
    invalid_type_error: 'Description must be a string',
  }).min(1, { message: 'Description cannot be empty' }).optional(),

  category: z.string({
    invalid_type_error: 'Category must be a string',
    required_error: 'Product name is required',
  }).min(1, { message: 'Category cannot be empty' }),

  salePrice: z.number({
    invalid_type_error: 'Sale price must be a number',
    required_error: 'Sale price is required',
  }).positive({ message: 'Sale price must be greater than 0' }),

  costPrice: z.number({
    invalid_type_error: 'Cost price must be a number',
    required_error: 'Cost price is required',
  }).positive({ message: 'Cost price must be greater than 0' }),

  stock: z.number({
    invalid_type_error: 'Stock must be a number',
    required_error: 'Stock is required',
  }).int().nonnegative({ message: 'Stock cannot be negative' }),
});

export function validateProduct (object) {
  return productSchema.safeParse(object)
}

export function validatePartialProduct (object) {
  return productSchema.partial().safeParse(object)
}
