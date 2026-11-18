import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'wanderlog-server',
    time: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
  })
})

export default router
