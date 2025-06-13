import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function onlyUser(req, res, next) {
  try {
    // Obtener la cookie "user"
    const rawCookie = req.headers.cookie?.split('; ')
      .find(cookie => cookie.startsWith('user='));

    if (!rawCookie) return res.redirect('/');

    const token = rawCookie.slice(5);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validación básica
    if (!decoded || !decoded.name || !decoded.role) {
      return res.redirect('/');
    }

    // Verificar que el nombre coincide
    if (decoded.name !== req.params.name) {
      return res.redirect('/');
    }

    req.user = {
      name: decoded.name,
      role: decoded.role
    };

    next();

  } catch (error) {
    console.error('Error in onlyUser middleware:', error);
    return res.redirect('/');
  }
}


function userData (req, res, next) {
  try {
    const cookieJwt = req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('user='))

    if (!cookieJwt) {
      return res.redirect('/')
    }

    const cookieVerified = jwt.verify(cookieJwt.slice(5), process.env.JWT_SECRET)

    if (cookieVerified && Object.keys(cookieVerified).length === 4) {
      console.log(cookieVerified)
      const name = cookieVerified.name
      const role = cookieVerified.role
      req.body = {
        user: name,
        role: role
      }
      next()
    } else {
      return res.redirect('/')
    }
  } catch (error) {
    console.error('Error in userSong middleware:', error)
    return res.redirect('/')
  }
}
export const METHODS = {
  onlyUser,
  userData
}
