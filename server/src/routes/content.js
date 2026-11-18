import { Router } from 'express'
import db, { mapPost, mapProject } from '../db.js'
import { notFound } from '../lib/ApiError.js'
import { escapeLike } from '../lib/validate.js'
import { site } from '../seed/content.js'

const router = Router()

// GET /api/content/site —— 站点信息 + 由数据库实时计算的统计
router.get('/site', (req, res) => {
  const destinationStats = db
    .prepare(
      `SELECT COUNT(*) AS total,
              COUNT(DISTINCT country) AS countries,
              COUNT(DISTINCT region) AS regions,
              ROUND(AVG(rating), 1) AS avgRating
       FROM destinations`
    )
    .get()
  const { projects } = db.prepare('SELECT COUNT(*) AS projects FROM projects').get()
  const { posts } = db.prepare('SELECT COUNT(*) AS posts FROM posts').get()

  res.json({
    item: {
      ...site,
      stats: {
        destinations: destinationStats.total,
        countries: destinationStats.countries,
        regions: destinationStats.regions,
        avgRating: destinationStats.avgRating,
        projects,
        posts,
      },
    },
  })
})

// GET /api/content/projects?category=javascript
router.get('/projects', (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : ''
  const rows =
    category && category !== 'all'
      ? db.prepare('SELECT * FROM projects WHERE category = ? ORDER BY sort_order, id').all(category)
      : db.prepare('SELECT * FROM projects ORDER BY sort_order, id').all()

  res.json({ items: rows.map(mapProject), total: rows.length })
})

// GET /api/content/posts?q=grid
router.get('/posts', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const rows = q
    ? (() => {
        const like = `%${escapeLike(q)}%`
        return db
          .prepare(
            "SELECT * FROM posts WHERE title LIKE ? ESCAPE '\\' OR summary LIKE ? ESCAPE '\\' OR tags LIKE ? ESCAPE '\\' ORDER BY sort_order, id"
          )
          .all(like, like, like)
      })()
    : db.prepare('SELECT * FROM posts ORDER BY sort_order, id').all()

  res.json({ items: rows.map(mapPost), total: rows.length })
})

// GET /api/content/posts/:id
router.get('/posts/:id', (req, res, next) => {
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  if (!row) return next(notFound('文章不存在'))
  res.json({ item: mapPost(row) })
})

export default router
