import { createHash, randomBytes, timingSafeEqual } from 'crypto'

export function randomId(length = 40) {
  const bytes = Math.ceil(length * 3 / 4)
  return randomBytes(bytes).toString('base64url').slice(0, length)
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function hashPassword(password: string) {
  const salt = randomId(16)
  const digest = createHash('sha256').update(salt + password).digest('hex')
  return `${salt}:${digest}`
}

export function verifyPassword(plain: string, hashed: string) {
  if (!hashed) return false
  const index = hashed.indexOf(':')
  const digest = index >= 0
    ? createHash('sha256').update(hashed.slice(0, index) + plain).digest('hex')
    : createHash('sha256').update(plain).digest('hex')
  return safeEqual(digest, index >= 0 ? hashed.slice(index + 1) : hashed)
}
