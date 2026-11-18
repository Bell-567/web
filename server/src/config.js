import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const ROOT_DIR = path.resolve(here, '..')

export const PORT = Number(process.env.PORT || 3000)

export const DB_FILE = process.env.DATABASE_FILE
  ? path.resolve(process.env.DATABASE_FILE)
  : path.join(ROOT_DIR, 'data', 'wanderlog.db')

export const CORS_ORIGINS = (
  process.env.CORS_ORIGINS ||
  'http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

export const IS_TEST = process.env.NODE_ENV === 'test'
