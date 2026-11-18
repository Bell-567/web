# 山海行记 · uni-app 多端版

把 `vue-app/` 中的 **Vue 3 + Vite + Vue Router** 网站迁移为 **uni-app（Vue 3 + Vite）** 工程。一套源码可编译到：

- **H5**（浏览器 / 静态网站托管）
- **微信小程序**（微信开发者工具）
- **Android App**（HBuilderX 标准基座 / 云打包）

原 Web 版的功能（5 个页面、24 个业务组件、明暗主题、收藏、行程清单、留言表单）全部保留。

**在线预览（H5）**：<https://bell-567.github.io/web/uniapp/>

**对照学习**：[uni-app对照学习笔记.ipynb](uni-app对照学习笔记.ipynb)——按「配置 → 入口 → 共享逻辑 → 页面 → 组件」的顺序逐个文件讲解，可直接在 VS Code / Jupyter 中打开阅读。

## 一、运行方式

### 方式 A：HBuilderX（图形界面，推荐课堂演示）

1. 下载并解压 HBuilderX（免安装 zip）：<https://www.dcloud.io/hbuilderx.html>
   - 本机已下载 **HBuilderX 5.34** 到 `D:\HBuilderX\HBuilderX`，双击 `HBuilderX.exe` 启动。
   - 安装路径不要含中文或空格。
2. 首次在 HBuilderX 中打开本目录：`文件 → 导入 → 从本地目录导入`，选择 `D:\web\uniapp-app`。
   - 这是 **uni-app Vue3 + Vite CLI 项目**（存在 `package.json` 与 `src/`），HBuilderX 会识别为 CLI 工程。
3. 若 `node_modules/` 不存在，先在项目根目录执行 `npm install`（HBuilderX 内置终端或系统终端均可）。
4. 运行：
   - **H5**：`运行 → 运行到浏览器 → Chrome/Edge`
   - **微信小程序**：`运行 → 运行到小程序模拟器 → 微信开发者工具`
   - **Android**：`运行 → 运行到手机或模拟器 → 运行到 Android App 基座`

### 方式 B：命令行（CI / 日常开发）

```bash
cd uniapp-app
npm install

npm run dev:h5          # H5 开发服务器
npm run dev:mp-weixin   # 监听编译到 dist/dev/mp-weixin
npm run dev:app         # 编译 App 资源到 dist/dev/app

npm run build:h5        # 生产构建 → dist/build/h5
npm run build:mp-weixin # 小程序生产构建 → dist/build/mp-weixin
npm run build:app       # App 资源构建 → dist/build/app
```

> 小程序 / App 的 `build` 产物只是**编译结果**：小程序需用微信开发者工具打开并上传，App 需用 HBuilderX 云打包生成 APK。

### 连接 Express 后端

后端位于仓库的 `server/` 目录：

```bash
cd ../server
npm install
npm start        # http://localhost:3000/api/health
```

- **H5**：`vite.config.js` 已把 `/api` 代理到 `http://localhost:3000`，直接 `npm run dev:h5` 即可。
- **微信小程序 / App**：默认请求 `http://localhost:3000/api`。真机调试时复制 `.env.example` 为 `.env`，
  把 `VITE_API_BASE` 改成电脑的局域网地址（如 `http://192.168.1.10:3000/api`），
  并在微信开发者工具中勾选「不校验合法域名」。
- 后端不可用时，目的地会自动回退到 `src/data/destinations.js`，行程清单回退到 `uni` 本地存储，
  联系表单会给出连接失败提示。

## 图片资源

10 个目的地的封面与图集均为**真实景点照片**，已下载到 `src/static/destinations/`，来源与许可
见 [CREDITS.md](src/static/destinations/CREDITS.md)。为满足微信小程序主包 2MB 限制，目的地图片
压缩到 560px 宽、Hero 压缩到 1280px 宽，当前 `mp-weixin` 构建产物约 1.64MB。

## 二、微信小程序运行

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. HBuilderX：`工具 → 设置 → 运行配置 → 小程序运行配置`，填写微信开发者工具的安装路径。
3. 本项目 `src/manifest.json` 中 `mp-weixin.appid` 使用测试号 **`touristappid`**，可直接在开发者工具中预览。
4. 运行后 HBuilderX 会自动打开 `dist/dev/mp-weixin`；也可手动用开发者工具「导入项目」，选择该目录。
5. 图片来自 `picsum.photos`。`manifest.json` 已设置 `urlCheck: false`（开发者工具「不校验合法域名」），本地预览可正常加载；**正式发布**需在小程序后台配置 `downloadFile` 合法域名，或把图片下载到 `src/static/` 改为本地路径。

## 三、Android 运行 / 打包

### 运行到 Android App 基座（真机 / 模拟器）

1. HBuilderX 登录 DCloud 账号（`运行到手机或模拟器` 需要）。
2. 在 `manifest.json` 可视化界面点击「重新获取 appid」，把 DCloud appid 写入 `appid` 字段。
3. 手机开启「开发者选项 → USB 调试」，用数据线连接电脑；或启动 Android 模拟器。
4. `运行 → 运行到手机或模拟器 → 运行到 Android App 基座`，选择设备。

> 本机当前没有 Android 设备/模拟器，也未配置 DCloud 账号，因此本次只完成 `npm run build:app` 的资源构建验证；真机步骤需在设备上执行。

### 云打包 APK（发布）

1. `manifest.json → App 图标` 配置图标（可选）。
2. HBuilderX：`发行 → 原生App-云打包`。
3. 选择 Android、使用 DCloud 公共证书（测试）或自有证书，提交云端打包。
4. 打包完成后下载 APK，安装到手机。

## 四、发布

| 终端 | 产物 | 发布方式 |
| --- | --- | --- |
| H5 | `dist/build/h5` | 任意静态托管：Netlify Drop、Cloudflare Pages、GitHub Pages、Nginx |
| 微信小程序 | `dist/build/mp-weixin` | 微信开发者工具「上传」→ 小程序后台提交审核 |
| Android App | 云打包 APK | 应用商店 / 官网下载 / 直接安装 |

H5 使用 **Hash 路由**（`/#/pages/destination/detail?id=fuji`），静态托管无需配置 SPA 回退。部署到子路径时，修改 `src/manifest.json` 的 `h5.router.base` 为对应子路径后重新构建。

本次已部署到现有 GitHub Pages 仓库的子路径 <https://bell-567.github.io/web/uniapp/>：

```bash
# 1. 临时把 src/manifest.json 的 h5.router.base 改为 /web/uniapp/
npm run build:h5

# 2. 把构建产物复制到仓库根目录的 uniapp/ 下并推送
cp -r dist/build/h5/. ../uniapp/
git add uniapp && git commit -m "build: 更新 uni-app H5 页面" && git push
```

> 本地开发时请把 `h5.router.base` 改回 `/`，否则开发服务器也会带子路径前缀。

## 五、迁移对照表

| Web 版（vue-app） | uni-app 版 | 说明 |
| --- | --- | --- |
| `<div> <p> <span> <h1>` | `<view> <text>` | 小程序无 HTML 标签 |
| `<img>` | `<image mode="aspectFill">` | 必须显式设置宽高 |
| `<a>` / `<RouterLink>` | `uni.navigateTo` / `uni.switchTab` | 页面跳转 API |
| Vue Router 配置 | `src/pages.json` + `onLoad(options)` | 动态参数改为 query |
| `localStorage` | `uni.getStorageSync` / `uni.setStorageSync` | 跨端存储 |
| `window.scrollY` | `onPageScroll` | 页面生命周期 |
| `window.scrollTo` | `uni.pageScrollTo` | |
| `<html data-theme>` | 根节点 `.theme-dark` + `uni.setNavigationBarColor` | 小程序无 html 节点 |
| `<select>` | `<picker mode="selector">` | |
| `inputRef.focus()` | `input :focus` 属性 | 无 DOM API |
| CSS `color-mix()` / `aspect-ratio` / `backdrop-filter` | 固定 rgba / 固定高度 | 小程序 WXSS 兼容性 |
| `<Transition>` 页面过渡 | 移除 | 小程序不支持 Vue Transition |

## 六、目录结构

```
uniapp-app
├── index.html                 # H5 入口
├── package.json
├── vite.config.js
└── src
    ├── main.js                # createSSRApp 入口
    ├── App.vue                # 全局样式 + 应用生命周期
    ├── manifest.json          # 各端配置（appid、权限、H5 路由）
    ├── pages.json             # 页面路由 + tabBar + 导航栏
    ├── uni.scss
    ├── data/destinations.js   # 模拟数据
    ├── composables/           # useTheme / useFavorites / usePageScroll / useSite
    ├── components/            # 24 个业务组件（含 AppShell 布局外壳）
    └── pages/
        ├── index/index.vue            # 首页（tab）
        ├── destinations/index.vue     # 目的地（tab）
        ├── destination/detail.vue     # 目的地详情（navigateTo）
        ├── planner/index.vue          # 行程规划（tab）
        └── about/index.vue            # 关于（tab）
```

## 七、已知差异与说明

- **tabBar**：uni-app 使用 `pages.json` 原生 tabBar 代替原 NavBar 的顶部链接；NavBar 保留品牌、收藏入口与主题切换。
- **主题**：小程序没有 `data-theme`，改为页面根节点 class + 原生导航栏/状态栏同步；H5 行为与原版一致。
- **页面过渡**：小程序不支持 Vue `<Transition>`，已移除，其余交互一致。
- **图片**：仍使用 `picsum.photos` 在线图；正式发布建议本地化。
- **App appid**：`manifest.json` 的 `appid` 需在 HBuilderX 登录后获取，仓库中留空。
