import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wanderlog-test-'))
process.env.NODE_ENV = 'test'
process.env.DATABASE_FILE = path.join(tmpDir, 'test.db')
process.env.ADMIN_TOKEN = 'test-admin-token'

const { default: app } = await import('../src/app.js')
const { default: db } = await import('../src/db.js')

let server
let base

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve)
  })
  base = `http://127.0.0.1:${server.address().port}/api`
})

after(async () => {
  await new Promise((resolve) => server.close(resolve))
  db.close()
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

async function call(pathname, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${base}${pathname}`, {
    method,
    headers: body === undefined ? headers : { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  return { status: res.status, body: text ? JSON.parse(text) : null, headers: res.headers }
}

test('健康检查', async () => {
  const { status, body } = await call('/health')
  assert.equal(status, 200)
  assert.equal(body.ok, true)
  assert.equal(body.service, 'wanderlog-server')
})

test('目的地列表、筛选、搜索与详情', async () => {
  const all = await call('/destinations')
  assert.equal(all.status, 200)
  assert.equal(all.body.total, 10)

  const europe = await call('/destinations?region=' + encodeURIComponent('欧洲'))
  assert.equal(europe.body.total, 3)
  assert.ok(europe.body.items.every((d) => d.region === '欧洲'))

  const search = await call('/destinations?q=' + encodeURIComponent('冰川'))
  assert.ok(search.body.total >= 1)
  assert.ok(search.body.items.some((d) => d.id === 'iceland'))

  const sorted = await call('/destinations?sort=rating')
  const ratings = sorted.body.items.map((d) => d.rating)
  assert.deepEqual(ratings, [...ratings].sort((a, b) => b - a))

  const detail = await call('/destinations/fuji')
  assert.equal(detail.status, 200)
  assert.equal(detail.body.item.name, '富士山')
  assert.ok(Array.isArray(detail.body.item.gallery))
  assert.equal(detail.body.item.facts.语言, '日语')

  const missing = await call('/destinations/not-exist')
  assert.equal(missing.status, 404)
  assert.equal(missing.body.error.code, 'NOT_FOUND')
})

test('留言板增删查与清空确认', async () => {
  const created = await call('/guestbook', {
    method: 'POST',
    body: { name: '  测试用户  ', message: '  后端留言测试  ' },
  })
  assert.equal(created.status, 201)
  assert.equal(created.body.item.name, '测试用户')
  assert.equal(created.body.item.message, '后端留言测试')

  const list = await call('/guestbook')
  assert.ok(list.body.total >= 1)
  assert.ok(list.body.items.some((m) => m.id === created.body.item.id))

  const removed = await call(`/guestbook/${created.body.item.id}`, { method: 'DELETE' })
  assert.equal(removed.status, 200)
  assert.equal(removed.body.ok, true)

  const refuseClear = await call('/guestbook', { method: 'DELETE' })
  assert.equal(refuseClear.status, 400)
  assert.equal(refuseClear.body.error.code, 'CONFIRM_REQUIRED')

  const invalid = await call('/guestbook', { method: 'POST', body: { name: '', message: '' } })
  assert.equal(invalid.status, 400)
})

test('联系表单校验、落库与管理端鉴权', async () => {
  const invalid = await call('/contact', {
    method: 'POST',
    body: { name: '小明', email: 'not-an-email', message: '你好你好' },
  })
  assert.equal(invalid.status, 400)
  assert.match(invalid.body.error.message, /邮箱/)

  const created = await call('/contact', {
    method: 'POST',
    body: {
      name: '小明',
      email: 'ming@example.com',
      subject: '合作咨询',
      message: '想了解一下这个项目的实现方式。',
    },
  })
  assert.equal(created.status, 201)
  assert.ok(created.body.item.id > 0)

  const denied = await call('/contact')
  assert.equal(denied.status, 401)

  const allowed = await call('/contact', { headers: { 'x-admin-token': 'test-admin-token' } })
  assert.equal(allowed.status, 200)
  assert.equal(allowed.body.items[0].email, 'ming@example.com')
})

test('行程清单 CRUD', async () => {
  const owner = 'test-owner-123'

  const created = await call(`/trips/${owner}/items`, {
    method: 'POST',
    body: { text: '兑换当地货币', priority: '高' },
  })
  assert.equal(created.status, 201)
  assert.equal(created.body.item.done, false)
  const itemId = created.body.item.id

  const patched = await call(`/trips/${owner}/items/${itemId}`, {
    method: 'PATCH',
    body: { done: true, text: '兑换日元' },
  })
  assert.equal(patched.status, 200)
  assert.equal(patched.body.item.done, true)
  assert.equal(patched.body.item.text, '兑换日元')

  const list = await call(`/trips/${owner}/items`)
  assert.equal(list.body.total, 1)

  const otherOwner = await call(`/trips/other-owner-456/items/${itemId}`, { method: 'DELETE' })
  assert.equal(otherOwner.status, 404)

  const removed = await call(`/trips/${owner}/items/${itemId}`, { method: 'DELETE' })
  assert.equal(removed.status, 200)

  const badOwner = await call('/trips/short/items')
  assert.equal(badOwner.status, 400)
  assert.equal(badOwner.body.error.code, 'INVALID_OWNER')
})

test('内容接口与统计', async () => {
  const site = await call('/content/site')
  assert.equal(site.status, 200)
  assert.equal(site.body.item.stats.destinations, 10)
  assert.equal(site.body.item.name, '山海行记')

  const projects = await call('/content/projects?category=javascript')
  assert.ok(projects.body.total >= 1)
  assert.ok(projects.body.items.every((p) => p.category === 'javascript'))

  const posts = await call('/content/posts?q=' + encodeURIComponent('Grid'))
  assert.equal(posts.body.total, 1)
  assert.equal(posts.body.items[0].id, 'css-grid-flexbox')

  const post = await call('/content/posts/css-grid-flexbox')
  assert.equal(post.status, 200)
  assert.ok(post.body.item.tags.includes('布局'))
})

test('CORS 白名单与 JSON 解析错误', async () => {
  const blocked = await call('/destinations', { headers: { Origin: 'https://evil.example' } })
  assert.equal(blocked.status, 403)
  assert.equal(blocked.body.error.code, 'CORS_DENIED')

  const res = await fetch(`${base}/guestbook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5173' },
    body: '{bad json',
  })
  assert.equal(res.status, 400)
  const body = await res.json()
  assert.equal(body.error.code, 'INVALID_JSON')
})
