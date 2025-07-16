import { pool } from './dbConnect.mjs'

export class ClientModel {
  
static async getAllProducts({ input }) {
  const client = await pool.connect();

  try {
    const { user, role, str, categoryId } = input;

    // Obtener user_id del puesto
    const { rows } = await client.query(
      'SELECT user_id FROM users WHERE name = $1 AND role = $2',
      ['Alejandro', 'stall']
    );

    if (rows.length === 0) {
      throw new Error('Stall user not found');
    }

    const stallId = rows[0].user_id;

    // Parámetros para la consulta
    const values = [`%${str}%`, categoryId, stallId];

    const query = `
      SELECT
        p.product_id,
        p.name AS product_name,
        p.description,
        p.stock,
        p.price,
        c.category_id,
        c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.category_id
      
      WHERE 
          p.name ILIKE $1
      AND p.category_id = $2
      AND p.stall_id = $3
      AND p.stock > 0
      ORDER BY p.name
      LIMIT 10
    `;

    const result = await client.query(query, values);
    console.log(values)

    const products = result.rows.map(row => ({
      productId: row.product_id,
      name: row.product_name,
      description: row.description,
      stock: row.stock,
      price: row.price,
      categoryId: row.category_id,
    }));

    console.log(result)
    return products;

  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error(`Failed to search products: ${error.message}`);
  } finally {
    client.release();
  }
}

  static async getAllCategories ({ input }) {
    const client = await pool.connect();
    try {
      console.log(input)
      const { role, user } = input
      const { rows } = await client.query(
        'SELECT user_id FROM users WHERE name = $1 and role = $2',
        ["Alejandro", 'stall']
      );

      const values = [rows[0].user_id];

      let query = `
        SELECT DISTINCT
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

      console.log(result)
      return categoriesObj
    } catch (error) {
      console.error('Error in searching categorie:', error);
      throw error;
    }
  }

  // static async getAllProducts({ input }) {
  //   const client = await pool.connect();
  //
  //   try {
  //     const { searchString, categoryId } = input;
  //
  //     const values = [`%${searchString}%`, `%${searchString}%`, categoryId];
  //
  //     const query = `
  //       SELECT
  //         p.product_id,
  //         p.name AS product_name,
  //         p.description,
  //         p.stock,
  //         p.price,
  //         p.cost,
  //         c.category_id,
  //         c.name AS category_name,
  //         u.name AS stall_name
  //       FROM products p
  //       JOIN categories c ON p.category_id = c.category_id
  //       JOIN users u ON p.stall_id = u.user_id
  //       WHERE (
  //         p.name ILIKE $1 OR
  //         p.description ILIKE $2
  //       )
  //       AND p.category_id = $3
  //       ORDER BY p.name
  //     `;
  //
  //     const result = await client.query(query, values);
  //
  //     const products = result.rows.map(row => ({
  //       productId: row.product_id,
  //       name: row.product_name,
  //       description: row.description,
  //       stock: row.stock,
  //       salePrice: row.price,
  //       cost: row.cost,
  //       categoryId: row.category_id,
  //       stallName: row.stall_name
  //     }));
  //
  //     return products;
  //
  //   } catch (error) {
  //     console.error('Error searching products:', error);
  //     throw new Error(`Failed to search products: ${error.message}`);
  //   } finally {
  //     client.release();
  //   }
  // }
}

