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

      const productsObj = {}

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
        const { rows } = await client.query(`SELECT name FROM products WHERE product_id = $1`, [productId]);
        productsObj[rows[0].name] = qty


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

      const { rows: newQueue } = await client.query(`INSERT INTO queue_entries (client_id, stall_id, status, created_at, sale_id) VALUES ($1, $2, $3, $4, $5) RETURNING queue_id`, [clientId, stallId, 'pendiente', saleDate, saleId])
    
      const { rows: rowsQueues } = await client.query(`WITH ordered_queue AS (
      SELECT queue_id, status, ROW_NUMBER() OVER (ORDER BY created_at) AS position
      FROM queue_entries
      WHERE stall_id = $1 AND status != 'completed'
    )
    SELECT *, (SELECT COUNT(*) FROM ordered_queue) AS total
    FROM ordered_queue
    WHERE queue_id = $2`, [stallId, newQueue[0].queue_id])
      const { position, total, status } = rowsQueues[0]
      await client.query('COMMIT');
      const userName = role == 'client' ? user : "Varios"
      const data = { totalAmount, userName, status, saleId}
      if (role == 'client') {
       data['products'] = productsObj
      }
      return { success: true, data};
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  }

  
  static async getAllOrders({ input }) {
    const client = await pool.connect();
    
    try {
      const { role, user } = input;

      const { rows } = await client.query(
        'SELECT user_id FROM users WHERE name = $1 AND role = $2',
        [user, role]
      );

      if (rows.length === 0) {
        throw new Error('User not found');
      }

      const userId = rows[0].user_id;

      const values = [userId, role];

      const query = `
        SELECT
          s.sale_id,
          p.name AS product_name,
          cc.quantity,
          s.total_amount,
          s.payment_method
        FROM sales s
        JOIN concepts cc ON s.sale_id = cc.sale_id
        JOIN products p ON cc.product_id = p.product_id
        WHERE 
          CASE 
            WHEN $2 = 'stall' THEN s.stall_id = $1
            WHEN $2 = 'client' THEN s.client_id = $1
          END
        ORDER BY s.sale_id DESC
      `;

      const result = await client.query(query, values);

      // Agrupar productos por sale_id
      const ordersMap = {};

      result.rows.forEach(row => {
        const saleId = row.sale_id;
        if (!ordersMap[saleId]) {
          ordersMap[saleId] = {
            saleId: saleId,
            total: row.total_amount,
            payMethod: row.payment_method,
            products: []
          };
        }
        ordersMap[saleId].products.push({
          name: row.product_name,
          quantity: row.quantity
        });
      });

      return Object.values(ordersMap);

    } catch (error) {
      console.error('Error searching orders:', error);
      throw new Error(`Failed to get orders: ${error.message}`);
    } finally {
      client.release();
    }
  }
  static async updateStatus({ input }) {
    const client = await pool.connect();
    const { orderId, newStatus } = input
    try {
      const query = `
        UPDATE sales
        SET status = $1
        WHERE sale_id = $2
      `;

      const values = [newStatus, orderId];

      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw new Error('No se encontró el pedido para actualizar.');
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating sale status:', error);
      throw new Error(`Failed to update sale status: ${error.message}`);
    } finally {
      client.release();
    }
  }
}
