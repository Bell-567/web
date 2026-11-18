import app from './app.js'
import db from './db.js'
import { DB_FILE, PORT } from './config.js'

const server = app.listen(PORT, () => {
  console.log(`\n山海行记后端已启动：http://localhost:${PORT}`)
  console.log(`健康检查：http://localhost:${PORT}/api/health`)
  console.log(`数据库：${DB_FILE}\n`)
})

function shutdown(signal) {
  console.log(`\n收到 ${signal}，正在关闭服务...`)
  server.close(() => {
    try {
      db.close()
    } catch {
      // 忽略关闭异常
    }
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
