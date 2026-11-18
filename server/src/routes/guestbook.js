import { Router } from 'express'
import db, { mapGuestbookMessage } from '../db.js'
import { badRequest, notFound } from '../lib/ApiError.js'
import { rateLimit } from '../lib/rateLimit.js'
import { requirePositiveInt, requireString } from '../lib/validate.js'

const router = Router()

// GET /api/guestbook?limit=50&offset=0
router.get('/', (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200)
  const offset = Math.max(Number(req.query.offset) || 0, 0)

  const items = db
    .prepare(
      'SELECT * FROM guestbook_messages ORDER BY id DESC LIMIT ? OFFSET ?'
    )
    .all(limit, offset)
    .map(mapGuestbookMessage)

  const { total } = db.prepare('SELECT COUNT(*) AS total FROM guestbook_messages').get()
  res.json({ items, total, limit, offset })
})

// POST /api/guestbook
router.post('/', rateLimit({ windowMs: 60_000, max: 10 }), (req, res) => {
  const body = req.body || {}
  const name = requireString(body.name, '称呼', { max: 40 })
  const message = requireString(body.message, '留言', { max: 500 })

  const createdAt = new Date().toISOString()
  const result = db
    .prepare(
      'INSERT INTO guestbook_messages (name, message, created_at, ip) VALUES (?, ?, ?, ?)'
    )
    .run(name, message, createdAt, req.ip || '')

  const row = db
    .prepare('SELECT * FROM guestbook_messages WHERE id = ?')
    .get(result.lastInsertRowid)

  res.status(201).json({ item: mapGuestbookMessage(row) })
})

// DELETE /api/guestbook/:id
router.delete('/:id', (req, res, next) => {
  const id = requirePositiveInt(req.params.id, '留言 ID')
  const result = db.prepare('DELETE FROM guestbook_messages WHERE id = ?').run(id)
  if (result.changes === 0) return next(notFound('留言不存在'))
  res.json({ ok: true, id })
})

// DELETE /api/guestbook?confirm=all —— 需显式确认，避免误清空
router.delete('/', (req, res, next) => {
  if (req.query.confirm !== 'all') {
    return next(badRequest('清空留言需要携带 confirm=all', 'CONFIRM_REQUIRED'))
  }
  const result = db.prepare('DELETE FROM guestbook_messages').run()
  res.json({ ok: true, removed: result.changes })
})

export default router
