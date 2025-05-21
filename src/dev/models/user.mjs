import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from './dbConnect.mjs'
import dotenv from 'dotenv'


dotenv.config()
export class UserModel {
  static async check ({ input }) {
    const {
      urlhost,
      user,
      email
    } = input
  const client = await pool.connect();
    try {
      const { rows } = await client.query(
        'SELECT user_id FROM users WHERE name = $1 OR email = $2',
        [user, email]
      );

      if (rows.length === 0) {
        // Crear el JWT
        const verifyToken = jwt.sign(
          { name: user, mail: email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );

        const result = {
          url: urlhost,
          name: user,
          mail: email,
          token: verifyToken
        };
        return result;
      }

      // Si ya existe, puedes devolver un error o true
      return true;
    } catch (error) {
      console.error('Error in checking:', error);
      throw error;
    }
  }

  static async createWorker({ input }) {
    const {
      user,
      email,
      role,
      pass
    } = input;

    const client = await pool.connect();
    // Hash the pass
    const salt = await bcryptjs.genSalt(7);
    const hashPass = await bcryptjs.hash(pass, salt);

    try {
      await client.query('BEGIN');

      await client.query(`
        WITH new_user AS (
          INSERT INTO users (email, name, password, created_at, is_verified, status)
          VALUES ($1, $2, $3, NOW(), $4, $5)
          RETURNING user_id
        )
        INSERT INTO workers (worker_id, role, hire_date, is_active)
        SELECT user_id, $6, NOW(), $7 FROM new_user;
      `, [
        email,
        user,
        hashPass,
        false,     // is_verified
        'inActive',
        role,
        false,
      ]);

      await client.query('COMMIT');
      return { success: true, message: 'Worker created successfully' };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in createWorker:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  static async verify ({ input }) {
    try {
      const decoder = jwt.verify(input, process.env.JWT_SECRET);

      if (!decoder || !decoder.name || !decoder.mail) {
        return true;
      }
      const client = await pool.connect();

      const { name, mail } = decoder;

      const result = await client.query(
        'SELECT is_verified FROM users WHERE name = $1 AND email = $2 AND is_verified = true',
        [name, mail]
      );

      if (result.rows.length === 1) {
        return 1;
      }

      const updateResult = await pool.query(`
      WITH updated_user AS (
        UPDATE users
        SET is_verified = true
        WHERE name = $1 AND email = $2
        RETURNING user_id
      )
      UPDATE workers
      SET is_active = true
      WHERE worker_id IN (SELECT user_id FROM updated_user);`,
        [name, mail]
      );

      if (updateResult.rowCount === 1) {
        const token = jwt.sign(
          { user: name },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );

        const cookieOption = {
          expiresIn: process.env.JWT_COOKIE_EXPIRATION,
          path: '/'
        };

        return { auth: token, cookie: cookieOption, user: name };
      }

      return false;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  }

  static async auth ({ input }) {
    const client = await pool.connect();
    const { email, pass } = input

    const { rows } = await client.query('SELECT password, name FROM users WHERE email = $1 AND is_verified = true', [email])
    const passUser = rows[0].password
    const comparerPass = await bcryptjs.compare(pass, passUser)
    const user = rows[0].name

    if (!comparerPass) {
      return false
    }

    const res = await client.query(
      'UPDATE users SET status = $1 WHERE email = $2',
      ['Active', email]
    )
    if (res.rowCount === 1) {
      const token = jwt.sign({ name: user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
      const cookieOption = {
        expiresIn: process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 10000,
        path: '/'
      }
      return { auth: token, cookie: cookieOption, name: user }
    }
  }
}
