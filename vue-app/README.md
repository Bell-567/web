# 山海行记 · 环球旅行手账

一个用 **Vue 3 + Vite + Vue Router** 从零构建的旅行主题单页应用，配套可选的 Express + SQLite 后端。用于演示 Vue 官方教程（https://cn.vuejs.org/tutorial/）的核心知识点。

## 技术栈

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| vue | 3.5.44 | 组合式 API 框架 |
| vue-router | 4.6.4 | 前端路由（Hash 模式） |
| vite | 6.4.5 | 构建工具 |
| @vitejs/plugin-vue | 5.2.4 | SFC 编译插件 |

## 页面（5 个）

1. **首页** `/` — Hero、数据统计、特色功能、精选目的地
2. **目的地** `/destinations` — 搜索 / 按大洲筛选 / 排序 / 收藏
3. **目的地详情** `/destinations/:id` — 图集、评分、实用信息（动态路由）
4. **行程规划** `/planner` — 待办清单、进度条、本地持久化 + 后端同步
5. **关于** `/about` — 项目介绍、知识点说明、留言表单校验与提交

## 组件（30 个 SFC = 24 组件 + 5 视图 + App）

`src/components/` 下 24 个：NavBar、AppFooter、ThemeToggle、BaseButton、SectionTitle、BackToTop、HeroBanner、StatsBar、FeatureCard、DestinationCard、DestinationList、SearchBar、FilterBar、TagBadge、RatingStars、FavoriteButton、EmptyState、PhotoGallery、FactList、PlannerForm、PlannerItem、ProgressBar、ContactForm、FormInput。

## 本地运行

```bash
cd vue-app
npm install
npm run dev        # 开发服务器
npm run build      # 生产构建，输出到 dist/
npm run preview    # 本地预览构建产物
```

### 连接 Express 后端

后端位于仓库的 `server/` 目录：

```bash
# 终端 1
cd ../server && npm install && npm start

# 终端 2
cd vue-app && npm run dev
```

`vite.config.js` 已把 `/api` 代理到 `http://localhost:3000`。部署到静态托管时可设置
`VITE_API_BASE=https://your-api.example.com/api`；后端不可用时，目的地与行程清单会自动回退到本地数据。

完整的接口清单见 [../server/README.md](../server/README.md)。

## 图片资源

10 个目的地的封面与图集均为**真实景点照片**，已下载到 `public/destinations/`（1280px 宽），
来源与许可见 [CREDITS.md](public/destinations/CREDITS.md)。页面不依赖外部图片 CDN，可离线运行。

## 部署到 Netlify

**方式一：Netlify Drop（无需注册，最快）**

1. 运行 `npm run build` 生成 `dist/` 目录；
2. 打开 <https://app.netlify.com/drop>；
3. 把整个 `dist/` 文件夹拖入页面，数秒后即得到一个公网链接（形如 `https://xxx.netlify.app`）。

**方式二：关联 Git 仓库（自动构建部署）**

1. 将本仓库推送到 GitHub / GitLab；
2. 在 Netlify 中「Import from Git」选择该仓库；
3. 若仓库根目录就是 `vue-app`：保持默认构建命令 `npm run build`、发布目录 `dist` 即可；
4. 若仓库根目录是 `D:\web`（上层仓库）：把 **Base directory** 设为 `vue-app`。

> 本项目路由使用 **Hash 模式**（`/#/destinations` 这类地址），因此无需配置 SPA 回退重写，Drop 部署或任意静态托管都能正常刷新/直达。

## 知识点覆盖对照

| Vue 教程知识点 | 主要体现位置 |
| --- | --- |
| 声明式渲染 `{{ }}` | 全部组件模板 |
| 属性绑定 `v-bind` | `:src` `:class` `:style`（DestinationCard、ProgressBar） |
| 事件监听 `v-on` | 各按钮、表单 |
| 表单绑定 `v-model` | SearchBar、FilterBar、FormInput、PlannerForm、ContactForm |
| 条件渲染 `v-if/v-show` | NavBar、EmptyState、ContactForm、PlannerItem |
| 列表渲染 `v-for` | DestinationList、StatsBar、NavBar、FilterBar |
| 计算属性 `computed` | StatsBar、DestinationsView、PlannerView、ContactForm |
| 侦听器 `watch` | useTheme、useFavorites、PlannerView 持久化 |
| 模板引用 / 生命周期 | SearchBar、PlannerForm（ref 聚焦）；BackToTop（onMounted/onBeforeUnmount） |
| Props / Emits / 插槽 | FeatureCard、BaseButton、FavoriteButton 等 |
| 组件 v-model `defineModel` | SearchBar、FilterBar、FormInput |
| 依赖注入 `provide/inject` | App → NavBar / AppFooter / AboutView |
| 组合式函数 | useTheme、useFavorites |
| 动态组件 + 过渡 | App.vue 的 `<Transition>` + `<RouterView>` |
| 路由 / 动态参数 | router/index.js、DestinationDetailView |
