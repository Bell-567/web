import { Router } from 'express'
import db, { mapPlannerItem } from '../db.js'
import { badRequest, notFound } from '../lib/ApiError.js'
import { requireOneOf, requireOwnerId, requirePositiveInt, requireString } from '../lib/validate.js'

const router = Router()
const MAX_ITEMS_PER_OWNER = 200
const PRIORITIES = ['高', '中', '低']

function getItem(ownerId, itemId) {
  return db
    .prepare('SELECT * FROM planner_items WHERE id = ? AND owner_id = ?')
    .get(itemId, ownerId)
}

// GET /api/trips/:ownerId/items
router.get('/:ownerId/items', (req, res) => {
  const ownerId = requireOwnerId(req.params.ownerId)
  const rows = db
    .prepare('SELECT * FROM planner_items WHERE owner_id = ? ORDER BY position, id')
    .all(ownerId)
  res.json({ items: rows.map(mapPlannerItem), total: rows.length })
})

// POST /api/trips/:ownerId/items
router.post('/:ownerId/items', (req, res) => {
  const ownerId = requireOwnerId(req.params.ownerId)
  const body = req.body || {}
  const text = requireString(body.text, '待办内容', { max: 200 })
  const priority = requireOneOf(body.priority, '优先级', PRIORITIES, '中')

  const { count } = db
    .prepare('SELECT COUNT(*) AS count FROM planner_items WHERE owner_id = ?')
    .get(ownerId)
  if (count >= MAX_ITEMS_PER_OWNER) {
    throw badRequest(`每个访客最多保存 ${MAX_ITEMS_PER_OWNER} 条待办`, 'TOO_MANY_ITEMS')
  }

  const { next } = db
    .prepare(
      'SELECT COALESCE(MAX(position), 0) + 1 AS next FROM planner_items WHERE owner_id = ?'
    )
    .get(ownerId)

  const now = new Date().toISOString()
  const result = db
    .prepare(
      `INSERT INTO planner_items (owner_id, text, priority, done, position, created_at, updated_at)
       VALUES (?, ?, ?, 0, ?, ?, ?)`
    )
    .run(ownerId, text, priority, next, now, now)

  res.status(201).json({ item: mapPlannerItem(getItem(ownerId, result.lastInsertRowid)) })
})

// PATCH /api/trips/:ownerId/items/:itemId
router.patch('/:ownerId/items/:itemId', (req, res, next) => {
  const ownerId = requireOwnerId(req.params.ownerId)
  const itemId = requirePositiveInt(req.params.itemId, '待办 ID')
  const body = req.body || {}

  if (!getItem(ownerId, itemId)) return next(notFound('待办不存在'))

  const sets = []
  const params = { id: itemId, ownerId }

  if (Object.prototype.hasOwnProperty.call(body, 'text')) {
    sets.push('text = @text')
    params.text = requireString(body.text, '待办内容', { max: 200 })
  }
  if (Object.prototype.hasOwnProperty.call(body, 'priority')) {
    sets.push('priority = @priority')
    params.priority = requireOneOf(body.priority, '优先级', PRIORITIES)
  }
  if (Object.prototype.hasOwnProperty.call(body, 'done')) {
    if (typeof body.done !== 'boolean') throw badRequest('done 必须是布尔值')
    sets.push('done = @done')
    params.done = body.done ? 1 : 0
  }

  if (sets.length === 0) throw badRequest('没有需要更新的字段')
  sets.push('updated_at = @updatedAt')
  params.updatedAt = new Date().toISOString()

  db.prepare(
    `UPDATE planner_items SET ${sets.join(', ')} WHERE id = @id AND owner_id = @ownerId`
  ).run(params)

  res.json({ item: mapPlannerItem(getItem(ownerId, itemId)) })
})

// DELETE /api/trips/:ownerId/items/:itemId
router.delete('/:ownerId/items/:itemId', (req, res, next) => {
  const ownerId = requireOwnerId(req.params.ownerId)
  const itemId = requirePositiveInt(req.params.itemId, '待办 ID')
  const result = db
    .prepare('DELETE FROM planner_items WHERE id = ? AND owner_id = ?')
    .run(itemId, ownerId)
  if (result.changes === 0) return next(notFound('待办不存在'))
  res.json({ ok: true, id: itemId })
})

// DELETE /api/trips/:ownerId/items —— 清空该访客的全部待办
router.delete('/:ownerId/items', (req, res) => {
  const ownerId = requireOwnerId(req.params.ownerId)
  const result = db.prepare('DELETE FROM planner_items WHERE owner_id = ?').run(ownerId)
  res.json({ ok: true, removed: result.changes })
})

export default router
