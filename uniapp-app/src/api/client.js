// 统一的后端请求封装。
// H5 开发环境通过 Vite 代理访问 /api；小程序 / App 默认直连本机 3000 端口，
// 真机调试时请把 VITE_API_BASE 改成电脑的局域网地址（例如 http://192.168.1.10:3000/api）。

let base = (import.meta.env.VITE_API_BASE || '').trim()

if (!base) {
  // #ifdef H5
  base = '/api'
  // #endif
  // #ifndef H5
  base = 'http://localhost:3000/api'
  // #endif
}

export const API_BASE = base.replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(status, message, code = 'REQUEST_FAILED') {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

function request(path, { method = 'GET', data, headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE}${path}`,
      method,
      data,
      timeout: 8000,
      dataType: 'json',
      header: { 'Content-Type': 'application/json', ...headers },
      success(res) {
        const body = res.data || {}
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body)
          return
        }
        const message =
          (body.error && body.error.message) || `请求失败（HTTP ${res.statusCode}）`
        reject(new ApiError(res.statusCode, message, (body.error && body.error.code) || 'HTTP_ERROR'))
      },
      fail() {
        reject(
          new ApiError(
            0,
            '无法连接后端服务，请确认 server 已启动（默认 http://localhost:3000）',
            'NETWORK_ERROR'
          )
        )
      },
    })
  })
}

export const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: 'POST', data }),
  patch: (path, data) => request(path, { method: 'PATCH', data }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
