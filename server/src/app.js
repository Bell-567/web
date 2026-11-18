import express from 'express'
import cors from 'cors'
import { CORS_ORIGINS, IS_TEST } from './config.js'
import { ApiError } from './lib/ApiError.js'
import healthRouter from './routes/health.js'
import destinationsRouter from './routes/destinations.js'
import tripsRouter from './routes/trips.js'
import guestbookRouter from './routes/guestbook.js'
import contactRouter from './routes/contact.js'
import contentRouter from './routes/content.js'

const app = express()
app.disable('x-powered-by')

app.use(
  cors({
    origin(origin, callback) {
      // 无 Origin 的请求（curl、小程序、App）直接放行
      if (!origin) return callback(null, true)
      if (CORS_ORIGINS.includes('*') || CORS_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
      return callback(new ApiError(403, `跨域来源未被允许：${origin}`, 'CORS_DENIED'))
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Admin-Token'],
    maxAge: 86_400,
  })
)

app.use(express.json({ limit: '32kb' }))

if (!IS_TEST) {
  app.use((req, res, next) => {
    const start = process.hrtime.bigint()
    res.on('finish', () => {
      const ms = Number(process.hrtime.bigint() - start) / 1e6
      console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} ${ms.toFixed(1)}ms`)
    })
    next()
  })
}

app.use('/api/health', healthRouter)
app.use('/api/destinations', destinationsRouter)
app.use('/api/trips', tripsRouter)
app.use('/api/guestbook', guestbookRouter)
app.use('/api/contact', contactRouter)
app.use('/api/content', contentRouter)

// /api 下的未匹配路由统一返回 JSON 404，避免落到 SPA 的 HTML
app.use('/api', (req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `接口不存在：${req.method} ${req.originalUrl}` },
  })
})

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message },
    })
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: { code: 'INVALID_JSON', message: '请求体不是合法的 JSON' },
    })
  }

  console.error('[server] 未处理的异常:', err)
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: '服务器内部错误，请稍后再试' },
  })
})

export default app
