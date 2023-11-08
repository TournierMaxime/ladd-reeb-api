import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

function generateKey (size = 32, format = 'base64') {
  const buffer = randomBytes(size)
  return buffer.toString(format)
}

function generateKeyHash (key) {
  const salt = randomBytes(16).toString('hex')
  const buffer = scryptSync(key, salt, 64)
  return `${buffer.toString('hex')}.${salt}`
}

function compareKeyWithKeyHash (key, storedKeyHash) {
  const [hashedKey, salt] = storedKeyHash.split('.')

  return timingSafeEqual(
    Buffer.from(hashedKey, 'hex'),
    scryptSync(key, salt, 64)
  )
}

export { generateKey, generateKeyHash, compareKeyWithKeyHash }
