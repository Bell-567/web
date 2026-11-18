# 山海行记后端 · Express + SQLite

为 `vue-app/` 与 `uniapp-app/` 提供 REST API：目的地、行程清单、留言板、联系表单和站点内容。
零 ORM，直接用 `better-sqlite3` 同步 API；数据库文件在首次启动时自动创建并写入种子数据。

## 快速开始

```bash
cd server
npm install
npm start
```

启动后：

- 服务地址：<http://localhost:3000>
- 健康检查：<http://localhost:3000/api/health>
- 数据库文件：`server/data/wanderlog.db`（首次启动自动生成）

开发时使用热重载：

```bash
npm run dev
```

运行接口测试（使用临时数据库，不会影响开发数据）：

```bash
npm test
```

## 环境变量

项目不依赖 dotenv，推荐在启动命令前注入环境变量。也可以参考 `.env.example` 写一个 `.env`，
再用 Node 自带的环境变量文件支持（Node 22.9+）：

```bash
node --env-file=.env src/index.js
```

`.env` 已被 `.gitignore` 忽略。

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `PORT` | `3000` | HTTP 端口 |
| `DATABASE_FILE` | `server/data/wanderlog.db` | SQLite 文件路径 |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:5174,...` | 允许跨域的前端来源，逗号分隔；`*` 表示全部允许 |
| `ADMIN_TOKEN` | 空 | 查看联系表单记录所需令牌；不设置则管理接口返回 403 |

PowerShell 示例：

```powershell
$env:PORT = 3001
$env:ADMIN_TOKEN = "change-me"
npm start
```

> 数据库文件与 `-wal` / `-shm` 文件已加入 `.gitignore`。想重置数据，停止服务后删除 `server/data/` 即可。

## 目录结构

```
server/
├── src/
│   ├── index.js            # 启动入口与优雅退出
│   ├── app.js              # Express 装配：CORS、JSON、路由、错误处理
│   ├── config.js           # 端口、数据库路径、CORS、管理令牌
│   ├── db.js               # 建表、种子数据、行 → JSON 映射
│   ├── lib/
│   │   ├── ApiError.js     # 统一错误类型
│   │   ├── validate.js     # 参数校验与 LIKE 转义
│   │   └── rateLimit.js    # 进程内滑动窗口限流
│   ├── routes/
│   │   ├── health.js
│   │   ├── destinations.js
│   │   ├── trips.js
│   │   ├── guestbook.js
│   │   ├── contact.js
│   │   └── content.js
│   └── seed/               # 目的地、项目、文章、站点信息初始数据
├── test/api.test.js        # node:test 接口测试
└── data/                   # 运行时生成的 SQLite 文件（已忽略）
```

## API 一览

所有接口以 `/api` 开头，响应均为 JSON。失败时统一返回：

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "请填写称呼" } }
```

### 健康检查

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/health` | 返回服务状态、时间与运行时长 |

### 目的地

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/destinations` | 列表；支持 `region`、`q`、`featured=true`、`sort=rating\|name` |
| GET | `/api/destinations/meta/regions` | 大洲与数量统计 |
| GET | `/api/destinations/:id` | 单个目的地详情 |

```bash
curl "http://localhost:3000/api/destinations?region=欧洲&sort=rating"
curl "http://localhost:3000/api/destinations?q=冰川"
```

列表响应：

```json
{ "items": [ { "id": "fuji", "name": "富士山", "tags": ["自然"] } ], "total": 10 }
```

### 行程清单

以本地生成的 `ownerId`（8–64 位字母、数字、`_`、`-`）区分访客，无需注册登录。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/trips/:ownerId/items` | 获取该访客的清单 |
| POST | `/api/trips/:ownerId/items` | 新增，body：`{ text, priority }`，`priority` 为 高 / 中 / 低 |
| PATCH | `/api/trips/:ownerId/items/:itemId` | 更新 `text` / `priority` / `done` 中任意字段 |
| DELETE | `/api/trips/:ownerId/items/:itemId` | 删除单条 |
| DELETE | `/api/trips/:ownerId/items` | 清空该访客全部待办 |

```bash
curl -X POST http://localhost:3000/api/trips/u-demo-123456/items \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"兑换当地货币\",\"priority\":\"高\"}"
```

### 留言板

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/guestbook?limit=50&offset=0` | 按时间倒序分页 |
| POST | `/api/guestbook` | body：`{ name, message }`（各不超过 40 / 500 字） |
| DELETE | `/api/guestbook/:id` | 删除单条 |
| DELETE | `/api/guestbook?confirm=all` | 清空全部，必须显式带 `confirm=all` |

写入接口限制为每个 IP 每分钟 10 次。

### 联系表单

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/contact` | body：`{ name, email, subject?, message }`；留言至少 5 字 |
| GET | `/api/contact?limit=50` | 管理端查看提交记录 |

`GET /api/contact` 必须在请求头携带与 `ADMIN_TOKEN` 一致的 `x-admin-token`：

```bash
curl http://localhost:3000/api/contact \
  -H "x-admin-token: change-me"
```

### 站点内容

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/content/site` | 站点信息 + 实时统计（目的地 / 国家 / 大洲 / 平均分） |
| GET | `/api/content/projects?category=javascript` | 作品集项目，可按分类筛选 |
| GET | `/api/content/posts?q=grid` | 博客文章，按标题 / 摘要 / 标签搜索 |
| GET | `/api/content/posts/:id` | 单篇文章 |

## 数据库表

| 表 | 用途 |
| --- | --- |
| `destinations` | 目的地（标签、图集、实用信息以 JSON 文本存储；图片使用 Pixabay / picjumbo 的真实景点照片 URL） |
| `projects` / `posts` | 站点内容种子 |
| `guestbook_messages` | 留言板 |
| `contact_messages` | 联系表单提交 |
| `planner_items` | 行程待办，按 `owner_id` 隔离 |

所有查询均使用参数化 SQL；`LIKE` 查询对 `%`、`_`、`\` 做了转义。
返回给前端的是 JSON，前端使用文本插值渲染；如果以后要拼接 HTML，记得先做转义。

## 前端联调

### vue-app（Vue 3 + Vite）

```bash
# 终端 1
cd server && npm start

# 终端 2
cd vue-app && npm run dev
```

`vue-app/vite.config.js` 已把 `/api` 代理到 `http://localhost:3000`。
部署到静态托管时，可在构建前设置 `VITE_API_BASE=https://your-api.example.com/api`。

### uniapp-app（H5 / 微信小程序 / App）

```bash
cd server && npm start
cd uniapp-app && npm run dev:h5
```

- **H5**：同样通过 Vite 代理访问 `/api`。
- **微信小程序 / App**：默认请求 `http://localhost:3000/api`。真机调试时把
  `uniapp-app/.env` 中的 `VITE_API_BASE` 改成电脑的局域网地址（如
  `http://192.168.1.10:3000/api`），并在微信开发者工具中勾选「不校验合法域名」。
- 后端不可用时，目的地自动回退到本地种子数据，行程清单回退到本地存储，联系表单会提示连接失败。

## 安全与限制

- `express.json({ limit: '32kb' })` 限制请求体大小，超时与错误统一处理。
- CORS 默认只允许本机 Vite 端口，按需通过 `CORS_ORIGINS` 增加。
- 留言与联系表单有进程内限流；生产多实例部署时应换成 Redis 等共享限流。
- 本项目没有用户系统，`ownerId` 只是访客标识，不能当作身份认证。
