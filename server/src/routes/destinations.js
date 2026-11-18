import { Router } from 'express'
import db, { mapDestination } from '../db.js'
import { notFound } from '../lib/ApiError.js'
import { escapeLike } from '../lib/validate.js'

const router = Router()

// GET /api/destinations?region=欧洲&q=冰川&featured=true&sort=rating|name
router.get('/', (req, res) => {
  const { region, q, featured, sort } = req.query
  const clauses = []
  const params = {}

  if (typeof region === 'string' && region && region !== '全部') {
    clauses.push('region = @region')
    params.region = region
  }

  if (featured === 'true') {
    clauses.push('featured = 1')
  }

  if (typeof q === 'string' && q.trim()) {
    clauses.push(
      "(name LIKE @q ESCAPE '\\' OR country LIKE @q ESCAPE '\\' OR region LIKE @q ESCAPE '\\'" +
        " OR tags LIKE @q ESCAPE '\\' OR summary LIKE @q ESCAPE '\\')"
    )
    params.q = `%${escapeLike(q.trim())}%`
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const rows = db
    .prepare(`SELECT * FROM destinations ${where} ORDER BY sort_order, id`)
    .all(params)

  let items = rows.map(mapDestination)
  if (sort === 'rating') items = [...items].sort((a, b) => b.rating - a.rating)
  if (sort === 'name') items = [...items].sort((a, b) => a.name.localeCompare(b.name, 'zh'))

  res.json({ items, total: items.length, source: 'sqlite' })
})

// GET /api/destinations/meta/regions —— 供筛选栏使用
router.get('/meta/regions', (req, res) => {
  const rows = db
    .prepare('SELECT region, COUNT(*) AS count FROM destinations GROUP BY region ORDER BY MIN(sort_order)')
    .all()
  res.json({ items: rows })
})

// GET /api/destinations/:id
router.get('/:id', (req, res, next) => {
  const row = db.prepare('SELECT * FROM destinations WHERE id = ?').get(req.params.id)
  if (!row) return next(notFound('目的地不存在'))
  res.json({ item: mapDestination(row) })
})

export default router
