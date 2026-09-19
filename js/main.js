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
     入口
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNavToggle();
    initTypewriter();
    initYear();
    renderSkills();
  });
})();
