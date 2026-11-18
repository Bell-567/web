import { ApiError } from './ApiError.js'

/**
 * 进程内滑动窗口限流。用于留言 / 联系表单等写入接口，
 * 避免公开部署时被简单刷屏。生产环境可换成 Redis 等共享存储。
 */
export function rateLimit({ windowMs = 60_000, max = 20 } = {}) {
  /** @type {Map<string, number[]>} */
  const hits = new Map()

  const timer = setInterval(() => {
    const now = Date.now()
    for (const [key, timestamps] of hits) {
      const alive = timestamps.filter((t) => now - t < windowMs)
      if (alive.length) hits.set(key, alive)
      else hits.delete(key)
    }
  }, windowMs)
  timer.unref?.()

  return function rateLimitMiddleware(req, res, next) {
    const key = `${req.ip}|${req.baseUrl}${req.path}`
    const now = Date.now()
    const timestamps = (hits.get(key) || []).filter((t) => now - t < windowMs)

    if (timestamps.length >= max) {
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000))
      return next(new ApiError(429, '请求太频繁，请稍后再试', 'RATE_LIMITED'))
    }

    timestamps.push(now)
    hits.set(key, timestamps)
    next()
  }
}
