import crypto from 'node:crypto'
import { Router } from 'express'
import db from '../db.js'
import { ApiError } from '../lib/ApiError.js'
import { rateLimit } from '../lib/rateLimit.js'
import { optionalString, requireEmail, requireString } from '../lib/validate.js'
import { ADMIN_TOKEN } from '../config.js'

const router = Router()

function safeEqual(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

function adminGuard(req, res, next) {
  if (!ADMIN_TOKEN) {
    return next(new ApiError(403, '服务端未配置 ADMIN_TOKEN，无法查看联系表单记录', 'ADMIN_DISABLED'))
  }
  if (!safeEqual(req.get('x-admin-token') || '', ADMIN_TOKEN)) {
    return next(new ApiError(401, '管理令牌无效', 'UNAUTHORIZED'))
  }
  next()
}

// POST /api/contact —— 联系表单提交
router.post('/', rateLimit({ windowMs: 60_000, max: 10 }), (req, res) => {
  const body = req.body || {}
  const name = requireString(body.name, '称呼', { max: 40 })
  const email = requireEmail(body.email)
  const subject = optionalString(body.subject, '主题', { max: 80 })
  const message = requireString(body.message, '留言内容', { min: 5, max: 1000 })

  const createdAt = new Date().toISOString()
  const result = db
    .prepare(
      `INSERT INTO contact_messages (name, email, subject, message, ip, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(name, email, subject, message, req.ip || '', req.get('user-agent') || '', createdAt)

  res.status(201).json({
    item: { id: Number(result.lastInsertRowid), createdAt },
    message: '留言已保存，我们会尽快回复。',
  })
})

// GET /api/contact —— 管理端查看提交记录（需 x-admin-token）
router.get('/', adminGuard, (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200)
  const rows = db
    .prepare(
      `SELECT id, name, email, subject, message, created_at
       FROM contact_messages ORDER BY id DESC LIMIT ?`
    )
    .all(limit)

  res.json({
    items: rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      createdAt: row.created_at,
    })),
  })
})

export default router
