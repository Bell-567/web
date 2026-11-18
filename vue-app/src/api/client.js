// 统一的后端请求封装。
// 开发环境通过 Vite 代理访问 /api；部署时可设置 VITE_API_BASE 指向线上后端。
const BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(status, message, code = 'REQUEST_FAILED') {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  let response
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers: body === undefined ? headers : { 'Content-Type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(
      0,
      '无法连接后端服务，请确认 server 已启动（默认 http://localhost:3000）',
      'NETWORK_ERROR'
    )
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data && data.error && data.error.message) || `请求失败（HTTP ${response.status}）`,
      (data && data.error && data.error.code) || 'HTTP_ERROR'
    )
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
