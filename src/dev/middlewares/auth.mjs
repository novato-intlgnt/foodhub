import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
function onlyUser (req, res, next) {
  const cookieJwt = req.headers.cookie.split('; ').find(cookie => cookie.startsWith('user=')).slice(5)
  const cookieVerified = jwt.verify(cookieJwt, process.env.JWT_SECRET)

  if (Object.keys(cookieVerified).length === 3) {
    if (cookieVerified.name === req.params.name) {
      return next()
    }
    return res.redirect('/')
  }
  return res.redirect('/')
}

function userSong (req, res, next) {
  try {
    const cookieJwt = req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('user='))

    if (!cookieJwt) {
      return res.redirect('/')
    }

    const cookieVerified = jwt.verify(cookieJwt.slice(5), process.env.JWT_SECRET)

    if (cookieVerified && Object.keys(cookieVerified).length === 3) {
      const name = cookieVerified.name
      req.body = {
        user: name
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
  userSong
}
