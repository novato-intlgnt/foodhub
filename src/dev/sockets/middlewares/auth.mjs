import jwt from 'jsonwebtoken'

export const onlyUser = (socket, next) => {
  const rawCookie = socket.handshake.headers.cookie .split('; ')
      .find(cookie => cookie.startsWith('user='));

  if (!rawCookie) return next(new Error('No cookie found'))

  const token = rawCookie.slice(5);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    socket.body = {
      user: payload.name,
      role: payload.role
    }
    next()
  } catch (err) {
    next(new Error('Invalid token'))
  }
}
