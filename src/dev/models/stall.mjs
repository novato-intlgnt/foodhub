import { pool } from './dbConnect.mjs'
import dotenv from 'dotenv'


dotenv.config()
export class StallModel {
  static async getAllProducts ({ input }) {
    const client = await pool.connect();
    
    try {
      const { role, user } = input;
      
      const { rows } = await client.query(
        'SELECT user_id FROM users WHERE name = $1 AND role = $2',
        [user, role]
      );
      
      if (rows.length === 0) {
        throw new Error('Stall user not found');
      }
      
      const values = [rows[0].user_id];
      
      let query = `
        SELECT
          p.product_id,
          p.name AS product_name,
          p.description,
          p.stock,
          p.price,
          p.cost,
          c.category_id,
          c.name AS category_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.stall_id = $1
        ORDER BY p.name
      `;
      
      const result = await client.query(query, values);
      
      // Mapear resultados a estructura limpia
      const products = result.rows.map(row => ({
        productId: row.product_id,
        name: row.product_name,
        description: row.description,
        stock: row.stock,
        salePrice: row.price,
        cost: row.cost,
        categoryId: row.category_id,
      }));
      
      return products;
      
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error(`Failed to search products: ${error.message}`);
    }
  }

  static async getAllCategories ({ input }) {
    const client = await pool.connect();
    try {
      console.log(input)
      const { role, user } = input
      const { rows } = await client.query(
        'SELECT user_id FROM users WHERE name = $1 and role = $2',
        [user, role]
      );

      const stallId = rows[0].user_id
      const values = [stallId];

      let query = `
        SELECT
            c.category_id,
            c.name AS category_name
        FROM products p
        INNER JOIN categories c ON p.category_id = c.category_id
        WHERE p.stall_id = $1
        ORDER BY c.name ASC;
      `;

      const result = await pool.query(query, values);

      const categoriesObj = result.rows.map(row => ({
          categoryId: row.category_id,
          name: row.category_name
        }));

      return { categoriesObj, stallId }
    } catch (error) {
      console.error('Error in searching categorie:', error);
      throw error;
    }
  }

  static async addProduct({ input }) {
  const client = await pool.connect();
  try {
    const { role, user, category, name, description, salePrice, costPrice, stock } = input;
    
    const { rows: userRows } = await client.query(
      'SELECT user_id FROM users WHERE name = $1 AND role = $2',
      [user, role]
    );
    const stallId = userRows[0]?.user_id;

    if (!stallId) throw new Error('Usuario no encontrado');

    await client.query('BEGIN');

    let categoryId;
    if (/^\d+$/.test(category)) {
      categoryId = parseInt(category, 10);
      
      const { rowCount } = await client.query(
        'SELECT 1 FROM categories WHERE category_id = $1', 
        [categoryId]
      );
      if (rowCount === 0) throw new Error('Categoría no existe');
    } else {
      const { rows: categoryRows } = await client.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING category_id',
        [category]
      );
      categoryId = categoryRows[0].category_id;
    }

    const { rows: productRows } = await client.query(
      `INSERT INTO products 
       (name, description, stock, price, cost, stall_id, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING product_id`,
      [name, description, stock, salePrice, costPrice, stallId, categoryId]
    );

    await client.query('COMMIT');

    return { 
        productId: productRows[0].product_id,
        categoryId: categoryId
    }
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al agregar producto:', error);
    throw error;
  } finally {
    client.release();
  }
}
}
