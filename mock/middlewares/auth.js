const crypto = require('node:crypto')

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/users']
const tokens = new Map()

function token(prefix, userId) {
  const value = `${prefix}.${userId}.${crypto.randomBytes(16).toString('hex')}`
  tokens.set(value, { userId, expires: Date.now() + (prefix === 'access' ? 60 * 60_000 : 24 * 60 * 60_000) })
  return value
}

module.exports = (request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  if (request.method === 'OPTIONS') return response.sendStatus(204)

  const delay = Number(request.query.delay) || 200 + Math.floor(Math.random() * 400)
  setTimeout(() => {
    const db = request.app.db
    if (request.path === '/auth/login' && request.method === 'POST') {
      const user = db.get('users').find({ email: request.body.email, password: request.body.password }).value()
      if (!user) return response.status(401).json({ message: 'Неверный email или пароль' })
      return response.json({ user: { id: user.id, name: user.name, email: user.email }, accessToken: token('access', user.id), refreshToken: token('refresh', user.id) })
    }
    if (request.path === '/auth/register' && request.method === 'POST') {
      if (db.get('users').find({ email: request.body.email }).value()) return response.status(409).json({ message: 'Email уже используется' })
      const user = { id: Date.now(), name: request.body.name, email: request.body.email, password: request.body.password, settings: { theme: 'light', compactMode: false } }
      db.get('users').push(user).write()
      return response.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, accessToken: token('access', user.id), refreshToken: token('refresh', user.id) })
    }
    if (request.path === '/auth/refresh' && request.method === 'POST') {
      const session = tokens.get(request.body.refreshToken)
      if (!session || session.expires < Date.now()) return response.status(401).json({ message: 'Сессия истекла' })
      return response.json({ accessToken: token('access', session.userId) })
    }

    const bearer = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '')
    const session = tokens.get(bearer)
    const publicRequest = PUBLIC_PATHS.some((path) => request.path.startsWith(path))
    if (!publicRequest && (!session || session.expires < Date.now())) return response.status(401).json({ message: 'Требуется авторизация' })

    if (request.path === '/profile' && request.method === 'GET') {
      const user = db.get('users').find({ id: session.userId }).value()
      return response.json({ id: user.id, name: user.name, email: user.email })
    }
    if (request.path === '/settings' && request.method === 'PATCH') {
      db.get('users').find({ id: session.userId }).assign({ settings: request.body }).write()
      return response.json(request.body)
    }
    next()
  }, delay)
}
