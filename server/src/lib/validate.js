import { badRequest } from './ApiError.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * 校验必填字符串，返回去掉首尾空白后的结果。
 */
export function requireString(value, field, { min = 1, max = 200 } = {}) {
  if (typeof value !== 'string') {
    throw badRequest(`请填写${field}`)
  }
  const text = value.trim()
  if (text.length < min) {
    throw badRequest(min > 1 ? `${field}至少需要 ${min} 个字符` : `请填写${field}`)
  }
  if (text.length > max) {
    throw badRequest(`${field}不能超过 ${max} 个字符`)
  }
  return text
}

/**
 * 校验可选字符串；未传或为空时返回 fallback。
 */
export function optionalString(value, field, { max = 200, fallback = '' } = {}) {
  if (value === undefined || value === null || value === '') return fallback
  return requireString(value, field, { min: 1, max })
}

export function requireEmail(value, field = '邮箱') {
  const email = requireString(value, field, { max: 120 })
  if (!EMAIL_RE.test(email)) {
    throw badRequest(`${field}格式不正确`)
  }
  return email
}

export function requireOneOf(value, field, allowed, fallback) {
  if ((value === undefined || value === null || value === '') && fallback !== undefined) {
    return fallback
  }
  if (!allowed.includes(value)) {
    throw badRequest(`${field}只能是：${allowed.join(' / ')}`)
  }
  return value
}

export function requirePositiveInt(value, field) {
  const n = Number(value)
  if (!Number.isInteger(n) || n <= 0) {
    throw badRequest(`${field}必须是正整数`)
  }
  return n
}

const OWNER_RE = /^[A-Za-z0-9_-]{8,64}$/

export function requireOwnerId(value) {
  if (typeof value !== 'string' || !OWNER_RE.test(value)) {
    throw badRequest('访客标识格式不正确（8–64 位字母、数字、下划线或连字符）', 'INVALID_OWNER')
  }
  return value
}

export function escapeLike(value) {
  return value.replace(/[\\%_]/g, '\\$&')
}
