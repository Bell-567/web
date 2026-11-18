# 实验报告：Vue 项目迁移 uni-app 与多端运行发布

> 实验项目：山海行记 · 环球旅行手账
> 迁移来源：`D:\web\vue-app`（Vue 3 + Vite + Vue Router）
> 迁移目标：`D:\web\uniapp-app`（uni-app Vue 3 + Vite）
> 实验日期：2026-11-03

## 一、实验目的

1. 参考 uni-app 官方快速上手文档，下载并配置 HBuilderX。
2. 把上次实验完成的 Vue 3 单页应用迁移为 uni-app 工程，一套代码多端复用。
3. 尝试在 H5、微信小程序、Android App 等不同终端编译运行。
4. 完成 uni-app 的发布（本次完成 H5 线上发布）。

## 二、实验环境

| 项目 | 版本 / 路径 |
| --- | --- |
| 操作系统 | Windows 11（10.0.26200） |
| Node.js | 已安装（npm 可用） |
| HBuilderX | 5.34.2026102909，解压版 |
| HBuilderX 路径 | `D:\HBuilderX\HBuilderX\HBuilderX.exe` |
| HBuilderX CLI | `D:\HBuilderX\HBuilderX\cli.exe` |
| 微信开发者工具 | 2.02.2609240（`C:\Program Files (x86)\Tencent\微信web开发者工具`） |
| uni-app 编译器 | 5.34（vue3） |
| 项目路径 | `D:\web\uniapp-app` |

依赖安装：

```bash
cd D:/web/uniapp-app
npm install
```

共安装 540 个依赖包，安装成功。

## 三、HBuilderX 的下载与导入

1. 从 DCloud 官方下载页获取 HBuilderX 5.34 Windows 解压版：
   `hbuilderx-5.34.zip`，解压到 `D:\HBuilderX\HBuilderX`。
2. 启动 `HBuilderX.exe`。
3. 使用 HBuilderX CLI 导入项目：

   ```bash
   cd D:/HBuilderX/HBuilderX
   ./cli.exe project open --path "D:/web/uniapp-app"
   ```

   输出：

   ```text
   正在导入项目...
   项目导入成功
   ```

4. 查看项目列表，确认 HBuilderX 已把工程识别为 uni-app Vue 项目：

   ```bash
   ./cli.exe project list
   # 1 - uniapp-app(UniApp_VUE)
   ```

> 说明：本项目采用 **CLI 工程结构**（根目录有 `package.json`、`vite.config.js`，源码在 `src/`），
> 与 HBuilderX 默认创建的 HBuilderX 工程结构不同，但 HBuilderX 能正确识别为 `UniApp_VUE`。

## 四、从 Vue 项目迁移到 uni-app

### 4.1 工程结构对照

| Vue Web 版 | uni-app 版 |
| --- | --- |
| `src/main.js`（`createApp` + `router`） | `src/main.js`（`createSSRApp`） |
| `src/router/index.js` | `src/pages.json`（页面路由 + 原生 tabBar） |
| `src/views/*.vue`（5 个视图） | `src/pages/*/*.vue`（5 个页面） |
| `src/components/*.vue`（24 个组件） | 原样迁移 24 个组件，替换为 uni-app 标签 |
| `src/composables/*.js` | 原样迁移 4 个组合式函数 |
| `src/assets/styles.css` | 拆分为 `App.vue` 全局样式 + 各组件 `scoped` 样式 |
| `index.html` | `index.html`（H5 入口）+ `src/manifest.json` |

### 4.2 关键改造点

1. **页面路由**：Vue Router 的 5 条路由改为 `pages.json` 的 5 个页面；
   详情页参数由 `route.params.id` 改为 `onLoad(options)` 读取 query。
2. **页面跳转**：`<RouterLink>` / `router.push` 改为 `uni.navigateTo`；
   tab 页之间改用 `uni.switchTab`；返回改用 `uni.navigateBack`。
3. **标签替换**：`div/p/span/h1` → `view/text`；`img` → `image mode="aspectFill"`；
   `select` → `picker mode="selector"`；`form` → `view` + 手动校验。
4. **本地存储**：`localStorage` → `uni.getStorageSync` / `uni.setStorageSync`
   （主题、收藏、行程数据均持久化）。
5. **页面滚动**：`window.scrollY` → `onPageScroll`（`@dcloudio/uni-app`）；
   `window.scrollTo` → `uni.pageScrollTo`。
6. **主题切换**：Web 版的 `<html data-theme>` 在小程序中不存在，
   改为页面根节点 `.app.theme-dark` class，并在非 H5 端调用
   `uni.setNavigationBarColor`、`uni.setBackgroundColor`、`uni.setTabBarStyle`
   同步原生导航栏与 tabBar（条件编译 `// #ifndef H5`）。
7. **表单聚焦**：无 DOM API，改用 `<input :focus="focused">` 控制聚焦。
8. **样式兼容**：移除 `color-mix()`、`aspect-ratio`、`backdrop-filter` 等
   WXSS 兼容性差的写法，改用固定 rgba 与固定高度。
9. **过渡动画**：移除 Vue `<Transition>`（小程序不支持）。
10. **tabBar**：使用 `pages.json` 原生 tabBar（首页 / 目的地 / 行程规划 / 关于），
    顶部 NavBar 保留品牌、收藏入口与主题切换。

### 4.3 迁移结果

- 源码文件：40 个（5 个页面 + 24 个组件 + 4 个组合式函数 + 数据/入口/配置）。
- 原 Web 版功能全部保留：明暗主题、收藏、搜索筛选、目的地详情、行程清单、留言表单。

## 五、多端编译与运行

### 5.1 H5

构建命令：

```bash
cd D:/web/uniapp-app
npm run build:h5
```

输出：

```text
Compiler version: 5.34（vue3）
Compiling...
DONE  Build complete.
```

产物：`dist/build/h5`（约 374 KB），使用 Hash 路由，静态托管无需 SPA 回退配置。

本地验证：用静态服务器托管构建产物，再用无头 Edge 打开 5 条路由，
页面标题、导航、目的地列表、行程规划等中文内容均正常渲染。

### 5.2 微信小程序

构建命令：

```bash
npm run build:mp-weixin
```

产物：`dist/build/mp-weixin`（约 393 KB）。生成的 `app.json` 已确认包含 5 个页面与原生 tabBar：

```json
{
  "pages": [
    "pages/index/index",
    "pages/destinations/index",
    "pages/destination/detail",
    "pages/planner/index",
    "pages/about/index"
  ],
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "首页" },
      { "pagePath": "pages/destinations/index", "text": "目的地" },
      { "pagePath": "pages/planner/index", "text": "行程规划" },
      { "pagePath": "pages/about/index", "text": "关于" }
    ]
  }
}
```

`project.config.json` 中 `appid` 为测试号 `touristappid`，`urlCheck` 为 `false`。

微信开发者工具已下载并安装（2.02.2609240），启动成功（项目列表窗口）。
但**命令行自动打开项目**被开发者工具自身的安全设置拦截：

```text
IDE service port disabled. To use CLI Call, open IDE: menu - setting - security - service port.
```

该「服务端口」是开发者工具的显式授权开关，需要用户在图形界面中手动开启，
本次未绕过该安全设置。因此微信端的**实际预览**需要在微信开发者工具中手动完成：

1. 打开微信开发者工具 → 设置 → 安全设置 → 开启「服务端口」；
2. 「导入项目」选择 `D:\web\uniapp-app\dist\build\mp-weixin`；
3. AppID 使用测试号（`touristappid`）即可预览；
4. 或先在 HBuilderX 中配置微信开发者工具路径，再执行
   `运行 → 运行到小程序模拟器 → 微信开发者工具`。

### 5.3 Android App

构建命令：

```bash
npm run build:app
```

输出 `DONE Build complete.`，产物 `dist/build/app`（约 965 KB，App 资源包）。

Android 真机运行需要以下前置条件，本机当前均不具备：

1. HBuilderX 登录 DCloud 账号；
2. `manifest.json` 填写 DCloud appid（当前为空）；
3. Android 手机开启 USB 调试并连接电脑，或启动 Android 模拟器；
4. 本机未安装 adb，也未连接任何 Android 设备。

因此本次完成的是 **App 资源编译验证**，真机运行步骤为：

1. HBuilderX 打开 `D:\web\uniapp-app`；
2. `manifest.json` 可视化界面点击「重新获取 appid」；
3. `运行 → 运行到手机或模拟器 → 运行到 Android App 基座`；
4. 选择已连接设备，等待标准基座安装并启动。

## 六、发布

### 6.1 H5 发布（已完成）

已发布到现有 GitHub Pages 仓库的子路径：

**<https://bell-567.github.io/web/uniapp/>**

发布步骤：

```bash
# 1. 将 src/manifest.json 的 h5.router.base 改为 /web/uniapp/
cd D:/web/uniapp-app
npm run build:h5

# 2. 复制构建产物到仓库根目录的 uniapp/
cd D:/web
cp -r uniapp-app/dist/build/h5/. uniapp/

# 3. 提交并推送，GitHub Pages 自动更新
git add uniapp
git commit -m "feat: 发布 uni-app 多端版 H5 预览页"
git push github master:main
```

推送后约 1 分钟 GitHub Pages 完成构建，访问该地址返回 HTTP 200；
使用无头 Edge 渲染页面，能正确显示「山海行记」「目的地」「行程规划」等内容，
静态资源（JS/CSS）同样返回 200。

> 本地开发时应把 `h5.router.base` 改回 `/`，避免开发服务器也带 `/web/uniapp/` 前缀。

### 6.2 微信小程序发布（未完成，需账号）

微信小程序上传/发布必须使用**已注册的小程序 AppID**，并在微信公众平台提交审核。
当前工程使用测试号 `touristappid`，只能本地预览，不能上传发布。
后续步骤：替换 `manifest.json` 中的 `mp-weixin.appid` → 开发者工具「上传」→ 公众平台提交审核。

### 6.3 Android App 发布（未完成，需 DCloud 账号）

APK 需要通过 HBuilderX「发行 → 原生 App-云打包」生成，需要登录 DCloud 账号并配置
应用 appid、图标、证书。本次未执行云打包。

## 七、遇到的问题与解决

| 问题 | 原因 | 解决 |
| --- | --- | --- |
| HBuilderX CLI 首次运行 H5 长时间无输出 | HBuilderX 首次运行需下载 `launcher`、`amazon-corretto` 等插件 | 等待插件安装完成；插件安装成功后 `launcher` 激活 |
| 微信开发者工具启动后立即退出 | 系统存在全局环境变量 `ELECTRON_RUN_AS_NODE=1` | 启动前清除该环境变量，开发者工具正常启动 |
| 微信 CLI 提示 `IDE service port disabled` | 开发者工具默认关闭服务端口 | 需用户在「设置 → 安全设置」中手动开启，未绕过 |
| GitHub Pages 刚推送后返回 404 | Pages 构建有延迟 | 等待约 1 分钟后返回 200 |
| 小程序无法使用 `color-mix()` 等 CSS | WXSS 兼容性限制 | 改用固定 rgba / 固定高度 |
| 小程序不支持 `<Transition>` 与 DOM API | 运行时无 DOM | 移除过渡动画，改用组件属性与 uni API |

## 八、实验结果

| 任务 | 状态 | 说明 |
| --- | --- | --- |
| 下载 HBuilderX | 已完成 | 5.34 解压版，`D:\HBuilderX\HBuilderX` |
| 迁移 Vue 项目 | 已完成 | `vue-app` → `uniapp-app`，40 个源码文件，功能保留 |
| H5 编译运行 | 已完成 | `npm run build:h5` 成功，本地渲染验证通过 |
| 微信小程序编译 | 已完成 | `npm run build:mp-weixin` 成功，产物结构校验通过 |
| 微信小程序实际预览 | 待手动操作 | 需开启开发者工具「服务端口」后导入项目 |
| Android 资源编译 | 已完成 | `npm run build:app` 成功 |
| Android 真机运行 | 未完成 | 无 Android 设备/模拟器、无 DCloud appid |
| H5 发布 | 已完成 | <https://bell-567.github.io/web/uniapp/> |
| 微信小程序发布 | 未完成 | 需正式 AppID 与审核 |
| Android APK 发布 | 未完成 | 需 DCloud 账号与云打包 |

## 九、结论

本次实验完成了从 Vue 3 Web 项目到 uni-app 多端工程的完整迁移，一套源码成功编译出
H5、微信小程序、Android App 三种产物；H5 版本已部署到 GitHub Pages 并在线可用。
微信小程序与 Android 的**真机运行/发布**受账号、设备与工具安全设置限制，
需在具备条件后按报告中的步骤手动完成。
