import { pool } from './dbConnect.mjs'

export class OrderModel {
  static async getUserID (role, user, client) {
    try {
      const { rows } = await client.query(
        'SELECT user_id FROM users WHERE name = $1 AND role = $2',
        [user, role]
      );
      if (rows.length === 0) {
        throw new Error('Stall user not found');
      }
    return rows[0].user_id 
    } catch (err) {
      console.error('Error searching user:', err);
      throw new Error(`Failed to search user: ${err.message}`);
    }
  }
  
static async setOrder({ input }) {
  const client = await pool.connect();
  const { role, user, clientName, payMethod, products } = input;
  let clientId
  let stallId

  try {
    if (role == 'stall') {
      stallId = await this.getUserID(role, user, client);
      clientId = await this.getUserID('client', clientName, client);
    } else {
      stallId = await this.getUserID('stall', 'Alejandro', client);
      clientId = await this.getUserID(role, user, client);
    }

    await client.query('BEGIN');

    const { rows: saleRows } = await client.query(`
      INSERT INTO sales (client_id, stall_id, date_start, payment_method)
      VALUES ($1, $2, NOW(), $3)
      RETURNING sale_id, date_start
    `, [clientId, stallId, payMethod]);

    const saleId = saleRows[0].sale_id;
    const saleDate = saleRows[0].date_start;

    const query = `
      INSERT INTO concepts (sale_id, product_id, quantity, unit_price)
      SELECT $1, $2, $3, p.price FROM products p WHERE p.product_id = $2
    `;

    for (const [prodId, qty] of Object.entries(products)) {
      const productId = Number(prodId);
      const quantity = Number(qty);

      await client.query(query, [saleId, productId, quantity]);

      await client.query(`
        UPDATE products SET stock = stock - $1 WHERE product_id = $2
      `, [quantity, productId]);
    }

    const { rows } = await client.query(`
      SELECT SUM(quantity * unit_price) AS total_amount
      FROM concepts
      WHERE sale_id = $1
    `, [saleId]);

    const totalAmount = rows[0].total_amount ?? 0;

    await client.query(`
      UPDATE sales SET total_amount = $1 WHERE sale_id = $2
    `, [totalAmount, saleId]);

    const { rows: newQueue } = await client.query(`INSERT INTO queue_entries (client_id, stall_id, status, created_at, sale_id) VALUES ($1, $2, $3, $4, $5) RETURNING queue_id`, [clientId, stallId, 'serving', saleDate, saleId])
  
    const { rows: rowsQueues } = await client.query(`WITH ordered_queue AS (
    SELECT queue_id, ROW_NUMBER() OVER (ORDER BY created_at) AS position
    FROM queue_entries
    WHERE stall_id = $1 AND status != 'entregado'
  )
  SELECT *, (SELECT COUNT(*) FROM ordered_queue) AS total
  FROM ordered_queue
  WHERE queue_id = $2`, [stallId, newQueue[0].queue_id])
    const { position, total } = rowsQueues[0]
    console.log(rowsQueues)
    await client.query('COMMIT');
    return { success: true, position, totalOrder: total };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}

}
