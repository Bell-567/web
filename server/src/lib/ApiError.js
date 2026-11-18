export class ApiError extends Error {
  /**
   * @param {number} status HTTP 状态码
   * @param {string} message 面向调用方的中文提示
   * @param {string} code 稳定的错误码，便于前端分支处理
   * @param {unknown} [details] 额外调试信息（不会默认返回给前端）
   */
  constructor(status, message, code = 'BAD_REQUEST', details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export function notFound(message = '资源不存在') {
  return new ApiError(404, message, 'NOT_FOUND')
}

export function badRequest(message, code = 'VALIDATION_ERROR') {
  return new ApiError(400, message, code)
}
