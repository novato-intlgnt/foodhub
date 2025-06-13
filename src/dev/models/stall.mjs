import { pool } from './dbConnect.mjs'
import dotenv from 'dotenv'


dotenv.config()
export class StallModel {
  static async getAll ({ input }) {
    const client = await pool.connect();
    try {
      const { role, user } = input
      const { rows } = await client.query(
        'SELECT user_id FROM users WHERE name = $1 and role = $2',
        [user, role]
      );

      if (rows.length === 1) input.userId = rows[0].user_id
      let query = `
        SELECT
          product.product_id,
          product.name AS product_name,
          product.description,
          product.stock,
          product.price,
          category.category_id,
          category.name AS category_name,
          stall.stall_id,
          stall.num_id AS stall_num_id,
          stall.location
        FROM products product
        JOIN categories category ON product.category_id = category.category_id
        JOIN stalls stall ON product.stall_id = stall.stall_id;
      `;

      const values = [];

      if (user.role === "stall") {
        query += " WHERE stall.id = $1";
        values.push(rows[0].user_id);
      }

      const result = await pool.query(query, values);

      const products = result.rows.map(row => ({
        product_id: row.product_id,
        name: row.product_name,
        description: row.description,
        stock: row.stock,
        price: row.price,
        category: {
          category_id: row.category_id,
          name: row.category_name
        },
        stall: {
          stall_id: row.stall_id,
          num_id: row.stall_num,
          location: row.location
        }
      }));
      console.log(result)
    } catch (error) {
      console.error('Error in checking:', error);
      throw error;
    }
  }

}
