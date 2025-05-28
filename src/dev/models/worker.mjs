import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from './dbConnect.mjs'
import dotenv from 'dotenv'


dotenv.config()
export class WorkerModel {
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
  
  static async create({ input }) {
    const { role } = input;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      if (role === 'client') {
        await this._createClient({ input, client });
      } else if (role === 'admin' || role === 'employee') {
        await this._createWorker({ input, client });
      } else {
        throw new Error('Invalid role');
      }

      await client.query('COMMIT');
      return { success: true, message: 'User created successfully' };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in createUser:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async _createClient({ input, client }) {
    const { email, user, pass, name, lastName, phone, role } = input;
    console.log('Insert: ')
    console.log(input)

    const salt = await bcryptjs.genSalt(7);
    const hashPass = await bcryptjs.hash(pass, salt);

    await client.query(`
      WITH new_user AS (
        INSERT INTO users (email, name, password, created_at, is_verified, status, role)
        VALUES ($1, $2, $3, NOW(), $4, $5, $6)
        RETURNING user_id
      )
      INSERT INTO clients (client_id, first_name, last_name, phone)
      SELECT user_id, $7, $8, $9 FROM new_user;
    `, [
      email,
      user,
      hashPass,
      false,           // is_verified
      "inActive",
      role,
      name,
      lastName,
      phone
    ]);
  }

  static async _createWorker({ input, client }) {
    const { email, user, pass, role } = input;

    const salt = await bcryptjs.genSalt(7);
    const hashPass = await bcryptjs.hash(pass, salt);

    await client.query(`
      WITH new_user AS (
        INSERT INTO users (email, name, password, created_at, is_verified, status, role)
        VALUES ($1, $2, $3, NOW(), $4, $5, $6)
        RETURNING user_id
      )
      INSERT INTO workers (worker_id, hire_date, is_active)
      SELECT user_id, NOW(), $7 FROM new_user;
    `, [
      email,
      user,
      hashPass,
      false,           // is_verified
      'inActive',
      role,
      false
    ]);
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

  
  static async verify({ input }) {
    try {
      // 1. Decodificar token
      const decoder = jwt.verify(input, process.env.JWT_SECRET);
      if (!decoder || !decoder.name || !decoder.mail) return true;

      const { name, mail } = decoder;
      const client = await pool.connect();

      try {
        // 2. Verificar si el usuario existe
        const result = await client.query(
          'SELECT user_id, is_verified, role FROM users WHERE name = $1 AND email = $2',
          [name, mail]
        );

        if (result.rows.length !== 1) return false;

        const { user_id, is_verified, role } = result.rows[0];

        // 3. Si ya está verificado, retornar éxito
        if (is_verified) return 1;

        // 4. Iniciar transacción
        await client.query('BEGIN');

        // 5. Marcar usuario como verificado
        await client.query(
          'UPDATE users SET is_verified = true WHERE user_id = $1',
          [user_id]
        );

        // 6. Activar según rol
        if (role === 'employee' || role === 'admin') {
          await client.query(
            'UPDATE workers SET is_active = true WHERE worker_id = $1',
            [user_id]
          );
        }

        // 7. Confirmar cambios
        await client.query('COMMIT');

        // 8. Generar nuevo token
        const token = jwt.sign(
          { user: name, role: role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );

        const cookieOption = {
          expiresIn: process.env.JWT_COOKIE_EXPIRATION,
          path: '/'
        };

        return { auth: token, cookie: cookieOption, user: name, role };

      } catch (err) {
        // Revertir si algo falla
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }

    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  }


  static async auth({ input }) {
    const client = await pool.connect();
    const { email, pass } = input;

    try {
      // Buscar usuario verificado
      const { rows } = await client.query(
        'SELECT user_id, password, name, role FROM users WHERE email = $1 AND is_verified = true',
        [email]
      );
      console.log(rows)

      if (rows.length !== 1) return false;

      console.log('nel')
      const { user_id, password: hash, name, role } = rows[0];

      // Comparar contraseñas
      const validPass = await bcryptjs.compare(pass, hash);
      console.log('passpassed')
      if (!validPass) return false;

      // Actualizar estado a "Active"
      const res = await client.query(
        'UPDATE users SET status = $1 WHERE user_id = $2',
        ['Active', user_id]
      );

      if (res.rowCount !== 1) return false;

      console.log('update')
      // Generar token JWT (solo con datos necesarios)
      const token = jwt.sign(
        { name, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      // Opciones de cookie
      const cookieOption = {
        maxAge: parseInt(process.env.JWT_COOKIE_EXPIRATION) * 24 * 60 * 60 * 1000, // en ms
        path: '/',
        httpOnly: true,     // evita acceso desde JS (más seguro)
        secure: true         // asegura que solo se envíe por HTTPS
      };

      return { auth: token, cookie: cookieOption, name, role };

    } catch (err) {
      console.error('Error during auth:', err);
      throw err;
    } finally {
      client.release();
    }
  }
}
