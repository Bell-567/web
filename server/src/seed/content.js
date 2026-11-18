// 站点内容初始数据：站点信息、作品集项目与博客文章。
// 与根目录静态站 js/main.js 中的数据保持一致。

export const site = {
  name: '山海行记',
  slogan: '把世界，装进手账。',
  email: 'hello@wanderlog.dev',
  description: '一个用 Vue 3 + uni-app 构建的旅行主题多端应用，配套 Express + SQLite 后端。',
}

export const projects = [
  {
    id: 'responsive-homepage',
    title: '响应式个人主页',
    desc: '使用语义化标签与 Grid / Flexbox 布局搭建的个人主页，支持深浅色主题切换。',
    tags: ['HTML5', 'CSS3', '响应式'],
    category: 'web',
    link: '#',
  },
  {
    id: 'todo-list',
    title: '待办事项清单',
    desc: '纯原生 JavaScript 实现的增删改查工具，数据通过 localStorage 持久化保存。',
    tags: ['JavaScript', 'localStorage'],
    category: 'javascript',
    link: '#',
  },
  {
    id: 'css-animation-lab',
    title: 'CSS 动画实验室',
    desc: '汇总卡片翻转、加载进度、打字机等常见动效，全部基于 @keyframes 手写实现。',
    tags: ['CSS3', '动画'],
    category: 'css',
    link: '#',
  },
  {
    id: 'local-search-filter',
    title: '本地搜索与筛选',
    desc: '对数组数据做实时关键词过滤与分类筛选，练习数组方法与事件委托。',
    tags: ['JavaScript', '数组方法'],
    category: 'javascript',
    link: '#',
  },
  {
    id: 'mobile-first-blog',
    title: '移动优先的博客模板',
    desc: '采用移动优先策略编写的博客页面模板，断点覆盖 768px 与 480px。',
    tags: ['CSS3', '媒体查询'],
    category: 'css',
    link: '#',
  },
  {
    id: 'form-validation',
    title: '表单验证组件',
    desc: '包含正则邮箱校验与行内错误提示的表单验证方案，兼容键盘操作。',
    tags: ['JavaScript', '正则表达式'],
    category: 'javascript',
    link: '#',
  },
]

export const posts = [
  {
    id: 'css-grid-flexbox',
    title: '从零理解 CSS Grid 与 Flexbox 的分工',
    date: '2026-03-12',
    summary:
      'Grid 负责二维的页面骨架，Flexbox 负责一维的组件内部排列。本文通过实际布局案例说明两者的适用场景与组合方式。',
    tags: ['CSS3', '布局'],
  },
  {
    id: 'typewriter-effect',
    title: '原生 JavaScript 实现打字机效果',
    date: '2026-04-08',
    summary:
      '只用一个 setTimeout 递归就能做出流畅的打字机动画，关键是如何处理打字、停顿与删除三个状态的切换。',
    tags: ['JavaScript', '动画'],
  },
  {
    id: 'localstorage-persistence',
    title: '用 localStorage 给静态页面加上持久化',
    date: '2026-05-21',
    summary:
      '静态站点没有后端，但 localStorage 足以支撑留言板、主题偏好这类轻量数据的持久化，本文总结常见坑点。',
    tags: ['JavaScript', '存储'],
  },
  {
    id: 'form-regex',
    title: '前端表单验证的正则表达式实践',
    date: '2026-06-15',
    summary:
      '从邮箱校验出发，讲解如何组织逐项验证逻辑、把错误信息精确显示在对应输入框下方，并兼顾无障碍。',
    tags: ['JavaScript', '正则表达式'],
  },
  {
    id: 'mobile-first-responsive',
    title: '移动优先的响应式设计笔记',
    date: '2026-07-02',
    summary:
      '先写移动端样式再逐级增强，比从桌面端做减法更容易维护。记录了断点选取与汉堡菜单的实现思路。',
    tags: ['CSS3', '响应式'],
  },
]
