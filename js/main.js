/* =========================================================
   main.js — 全站通用脚本
   包含：暗色模式切换与持久化、移动端汉堡菜单、首页打字机效果、
         页脚年份自动更新、技能卡片渲染
   ========================================================= */

(function () {
  'use strict';

  var THEME_KEY = 'theme';

  /* ---------------------------------------------------------
     1. 暗色模式切换与持久化
     --------------------------------------------------------- */
  function initTheme() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) {
      return;
    }

    // 若 <head> 内联脚本未设置，这里补一次，保证 data-theme 一定有值
    if (!document.documentElement.getAttribute('data-theme')) {
      var saved = localStorage.getItem(THEME_KEY);
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
    }

    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
    });

    // 用户尚未手动选择过主题时，跟随系统设置的实时变化
    var media = window.matchMedia('(prefers-color-scheme: dark)');
    var onSystemChange = function (event) {
      if (localStorage.getItem(THEME_KEY)) {
        return;
      }
      document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
    };

    // 兼容旧版浏览器：addListener 为过时 API，但仍有环境需要
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onSystemChange);
    } else if (typeof media.addListener === 'function') {
      media.addListener(onSystemChange);
    }
  }

  /* ---------------------------------------------------------
     2. 移动端汉堡菜单
     --------------------------------------------------------- */
  function initNavToggle() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      // 同步无障碍属性
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? '关闭导航菜单' : '打开导航菜单');
    });

    // 点击菜单项后自动收起，提升移动端体验
    menu.addEventListener('click', function (event) {
      if (event.target.tagName === 'A' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------------------------------------
     3. 首页打字机效果
     --------------------------------------------------------- */
  function initTypewriter() {
    var target = document.getElementById('typed');
    if (!target) {
      return;
    }

    var words = ['HTML5 语义化', 'CSS3 响应式布局', '原生 JavaScript', '前端工程化'];
    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var word = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      target.textContent = word.slice(0, charIndex);

      var delay = deleting ? 60 : 130;

      if (!deleting && charIndex === word.length) {
        // 完整显示后停顿，再开始删除
        delay = 1600;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }

      setTimeout(tick, delay);
    }

    tick();
  }

  /* ---------------------------------------------------------
     4. 页脚年份自动更新
     --------------------------------------------------------- */
  function initYear() {
    var yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /* ---------------------------------------------------------
     5. 首页技能卡片渲染
     --------------------------------------------------------- */
  var SKILLS = [
    { icon: '📄', name: 'HTML5', desc: '语义化标签、表单、无障碍属性，构建结构清晰的页面骨架。' },
    { icon: '🎨', name: 'CSS3', desc: 'Flexbox / Grid 布局、变量、过渡与关键帧动画。' },
    { icon: '⚡', name: 'JavaScript', desc: 'DOM 操作、事件处理、数组渲染与本地存储。' },
    { icon: '📱', name: '响应式设计', desc: '媒体查询与移动优先，适配手机、平板与桌面。' },
    { icon: '🔧', name: 'Git', desc: '版本控制、分支管理与规范的提交信息。' },
    { icon: '♿', name: 'Web 无障碍', desc: '语义化结构、键盘可访问与焦点可见性设计。' }
  ];

  function renderSkills() {
    var grid = document.getElementById('skillGrid');
    if (!grid) {
      return;
    }

    var fragment = document.createDocumentFragment();

    SKILLS.forEach(function (skill) {
      var card = document.createElement('article');
      card.className = 'card skill-card';

      var iconEl = document.createElement('div');
      iconEl.className = 'skill-icon';
      iconEl.setAttribute('aria-hidden', 'true');
      iconEl.textContent = skill.icon;

      var titleEl = document.createElement('h3');
      titleEl.className = 'skill-name';
      titleEl.textContent = skill.name;

      var descEl = document.createElement('p');
      descEl.className = 'skill-desc';
      descEl.textContent = skill.desc;

      card.appendChild(iconEl);
      card.appendChild(titleEl);
      card.appendChild(descEl);
      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  /* ---------------------------------------------------------
     6. 项目展示页：数据、渲染与分类筛选
     --------------------------------------------------------- */
  var PROJECTS = [
    {
      title: '响应式个人主页',
      desc: '使用语义化标签与 Grid / Flexbox 布局搭建的个人主页，支持深浅色主题切换。',
      tags: ['HTML5', 'CSS3', '响应式'],
      category: 'web',
      link: '#'
    },
    {
      title: '待办事项清单',
      desc: '纯原生 JavaScript 实现的增删改查工具，数据通过 localStorage 持久化保存。',
      tags: ['JavaScript', 'localStorage'],
      category: 'javascript',
      link: '#'
    },
    {
      title: 'CSS 动画实验室',
      desc: '汇总卡片翻转、加载进度、打字机等常见动效，全部基于 @keyframes 手写实现。',
      tags: ['CSS3', '动画'],
      category: 'css',
      link: '#'
    },
    {
      title: '本地搜索与筛选',
      desc: '对数组数据做实时关键词过滤与分类筛选，练习数组方法与事件委托。',
      tags: ['JavaScript', '数组方法'],
      category: 'javascript',
      link: '#'
    },
    {
      title: '移动优先的博客模板',
      desc: '采用移动优先策略编写的博客页面模板，断点覆盖 768px 与 480px。',
      tags: ['CSS3', '媒体查询'],
      category: 'css',
      link: '#'
    },
    {
      title: '表单验证组件',
      desc: '包含正则邮箱校验与行内错误提示的表单验证方案，兼容键盘操作。',
      tags: ['JavaScript', '正则表达式'],
      category: 'javascript',
      link: '#'
    }
  ];

  function renderProjects(filter) {
    var grid = document.getElementById('projectGrid');
    if (!grid) {
      return;
    }

    var emptyTip = document.getElementById('projectEmpty');
    // 传入 'all' 或空值时展示全部项目
    var list = (!filter || filter === 'all')
      ? PROJECTS
      : PROJECTS.filter(function (project) {
          return project.category === filter;
        });

    grid.textContent = '';

    list.forEach(function (project) {
      var card = document.createElement('article');
      card.className = 'card project-card';

      var titleEl = document.createElement('h3');
      titleEl.className = 'project-title';
      titleEl.textContent = project.title;

      var descEl = document.createElement('p');
      descEl.className = 'project-desc';
      descEl.textContent = project.desc;

      var tagList = document.createElement('ul');
      tagList.className = 'tag-list';
      project.tags.forEach(function (tag) {
        var li = document.createElement('li');
        li.className = 'tag';
        li.textContent = tag;
        tagList.appendChild(li);
      });

      var linkEl = document.createElement('a');
      linkEl.className = 'project-link';
      linkEl.href = project.link;
      linkEl.textContent = '查看源码 →';

      card.appendChild(titleEl);
      card.appendChild(descEl);
      card.appendChild(tagList);
      card.appendChild(linkEl);
      grid.appendChild(card);
    });

    // 空结果提示
    if (emptyTip) {
      emptyTip.hidden = list.length > 0;
    }
  }

  function initProjectFilter() {
    var filterBar = document.getElementById('filterBar');
    if (!filterBar) {
      return;
    }

    renderProjects('all');

    filterBar.addEventListener('click', function (event) {
      var btn = event.target.closest('.filter-btn');
      if (!btn) {
        return;
      }

      // 切换按钮高亮状态
      Array.prototype.forEach.call(filterBar.querySelectorAll('.filter-btn'), function (item) {
        item.classList.toggle('active', item === btn);
      });

      renderProjects(btn.dataset.filter);
    });
  }

  /* ---------------------------------------------------------
     7. 博客页：数据、渲染与实时搜索
     --------------------------------------------------------- */
  var POSTS = [
    {
      title: '从零理解 CSS Grid 与 Flexbox 的分工',
      date: '2026-03-12',
      summary: 'Grid 负责二维的页面骨架，Flexbox 负责一维的组件内部排列。本文通过实际布局案例说明两者的适用场景与组合方式。',
      tags: ['CSS3', '布局']
    },
    {
      title: '原生 JavaScript 实现打字机效果',
      date: '2026-04-08',
      summary: '只用一个 setTimeout 递归就能做出流畅的打字机动画，关键是如何处理打字、停顿与删除三个状态的切换。',
      tags: ['JavaScript', '动画']
    },
    {
      title: '用 localStorage 给静态页面加上持久化',
      date: '2026-05-21',
      summary: '静态站点没有后端，但 localStorage 足以支撑留言板、主题偏好这类轻量数据的持久化，本文总结常见坑点。',
      tags: ['JavaScript', '存储']
    },
    {
      title: '前端表单验证的正则表达式实践',
      date: '2026-06-15',
      summary: '从邮箱校验出发，讲解如何组织逐项验证逻辑、把错误信息精确显示在对应输入框下方，并兼顾无障碍。',
      tags: ['JavaScript', '正则表达式']
    },
    {
      title: '移动优先的响应式设计笔记',
      date: '2026-07-02',
      summary: '先写移动端样式再逐级增强，比从桌面端做减法更容易维护。记录了断点选取与汉堡菜单的实现思路。',
      tags: ['CSS3', '响应式']
    }
  ];

  function createPostCard(post) {
    var article = document.createElement('article');
    article.className = 'card post-card';

    var header = document.createElement('div');
    header.className = 'post-header';

    var titleEl = document.createElement('h3');
    titleEl.className = 'post-title';
    titleEl.textContent = post.title;

    var dateEl = document.createElement('time');
    dateEl.className = 'post-date';
    dateEl.dateTime = post.date;
    dateEl.textContent = post.date;

    header.appendChild(titleEl);
    header.appendChild(dateEl);

    var summaryEl = document.createElement('p');
    summaryEl.className = 'post-summary';
    summaryEl.textContent = post.summary;

    var footer = document.createElement('div');
    footer.className = 'post-footer';

    var tagList = document.createElement('ul');
    tagList.className = 'tag-list';
    post.tags.forEach(function (tag) {
      var li = document.createElement('li');
      li.className = 'tag';
      li.textContent = tag;
      tagList.appendChild(li);
    });

    var readMore = document.createElement('a');
    readMore.className = 'post-link';
    readMore.href = '#';
    readMore.textContent = '阅读更多 →';

    footer.appendChild(tagList);
    footer.appendChild(readMore);

    article.appendChild(header);
    article.appendChild(summaryEl);
    article.appendChild(footer);

    return article;
  }

  function renderPosts(keyword) {
    var list = document.getElementById('postList');
    if (!list) {
      return;
    }

    var emptyTip = document.getElementById('postEmpty');
    var query = (keyword || '').trim().toLowerCase();

    // 关键词同时匹配标题与摘要
    var filtered = query
      ? POSTS.filter(function (post) {
          var title = post.title.toLowerCase();
          var summary = post.summary.toLowerCase();
          return title.indexOf(query) !== -1 || summary.indexOf(query) !== -1;
        })
      : POSTS;

    list.textContent = '';
    filtered.forEach(function (post) {
      list.appendChild(createPostCard(post));
    });

    if (emptyTip) {
      emptyTip.hidden = filtered.length > 0;
    }
  }

  function initPostSearch() {
    var input = document.getElementById('searchInput');
    if (!input) {
      return;
    }

    renderPosts('');

    // input 事件实现实时过滤，无需点击按钮
    input.addEventListener('input', function () {
      renderPosts(input.value);
    });
  }

  /* ---------------------------------------------------------
     入口
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNavToggle();
    initTypewriter();
    initYear();
    renderSkills();
    initProjectFilter();
    initPostSearch();
  });
})();
