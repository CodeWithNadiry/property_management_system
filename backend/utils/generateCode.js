import crypto from 'crypto'

export function generateCode() {
  return crypto.randomBytes(3).toString('hex')
}