/* =========================================================
   guestbook.js — 留言板逻辑
   基于 localStorage 实现留言的增、删、查、清空，
   并在渲染时对用户输入做转义，防止 XSS 注入。
   ========================================================= */

(function () {
  'use strict';

  var STORAGE_KEY = 'guestbook-messages';

  /* ---------------------------------------------------------
     工具函数
     --------------------------------------------------------- */

  /**
   * HTML 转义：把用户输入中的特殊字符替换为实体。
   * 渲染用户内容前必须先调用，避免 XSS。
   */
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * 生成一个足够唯一的 id（时间戳 + 随机数）。
   * 用于删除时精确定位某条留言。
   */
  function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /**
   * 把时间戳格式化为「YYYY-MM-DD HH:mm」。
   */
  function formatTime(timestamp) {
    var d = new Date(timestamp);
    var pad = function (n) {
      return n < 10 ? '0' + n : String(n);
    };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  /* ---------------------------------------------------------
     数据层：读取 / 保存
     --------------------------------------------------------- */

  /**
   * 读取全部留言。localStorage 中的数据可能损坏，需要容错。
   */
  function loadMessages() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      // 数据损坏时重置，保证页面可用
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }

  function saveMessages(messages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }

  /* ---------------------------------------------------------
     视图层：渲染
     --------------------------------------------------------- */

  function renderMessages() {
    var list = document.getElementById('guestList');
    if (!list) {
      return;
    }

    var emptyTip = document.getElementById('guestEmpty');
    var countBadge = document.getElementById('guestCount');
    var messages = loadMessages();

    list.textContent = '';

    // 最新的留言排在最前面
    messages.slice().reverse().forEach(function (msg) {
      var li = document.createElement('li');
      li.className = 'card guest-item';

      var head = document.createElement('div');
      head.className = 'guest-head';

      var nameEl = document.createElement('strong');
      nameEl.className = 'guest-name';
      // 经 escapeHTML 转义后再插入，用户写 <script> 也只会被当成纯文本
      nameEl.innerHTML = escapeHTML(msg.name);

      var timeEl = document.createElement('time');
      timeEl.className = 'guest-time';
      // 兼容历史数据缺失或损坏 time 字段的情况
      var time = Number(msg.time) || 0;
      timeEl.dateTime = new Date(time).toISOString();
      timeEl.textContent = formatTime(time);

      head.appendChild(nameEl);
      head.appendChild(timeEl);

      var body = document.createElement('p');
      body.className = 'guest-body';
      // 同样先转义，防止留言内容中的标签被浏览器解析执行
      body.innerHTML = escapeHTML(msg.content);

      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'guest-delete';
      delBtn.textContent = '删除';
      delBtn.setAttribute('aria-label', '删除 ' + msg.name + ' 的留言');
      delBtn.dataset.id = msg.id;

      li.appendChild(head);
      li.appendChild(body);
      li.appendChild(delBtn);
      list.appendChild(li);
    });

    if (countBadge) {
      countBadge.textContent = String(messages.length);
    }
    if (emptyTip) {
      emptyTip.hidden = messages.length > 0;
    }
  }

  /* ---------------------------------------------------------
     校验
     --------------------------------------------------------- */

  function showError(inputId, errorId, message) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (error) {
      error.textContent = message;
    }
    if (input) {
      input.classList.toggle('invalid', Boolean(message));
    }
  }

  function validateForm(name, content) {
    var valid = true;

    if (!name) {
      showError('guestName', 'guestNameError', '请填写昵称');
      valid = false;
    } else if (name.length > 20) {
      showError('guestName', 'guestNameError', '昵称不能超过 20 个字符');
      valid = false;
    } else {
      showError('guestName', 'guestNameError', '');
    }

    if (!content) {
      showError('guestMessage', 'guestMessageError', '请填写留言内容');
      valid = false;
    } else if (content.length > 200) {
      showError('guestMessage', 'guestMessageError', '留言内容不能超过 200 个字符');
      valid = false;
    } else {
      showError('guestMessage', 'guestMessageError', '');
    }

    return valid;
  }

  /* ---------------------------------------------------------
     事件处理
     --------------------------------------------------------- */

  function handleSubmit(event) {
    // 阻止表单默认提交（本页面没有后端）
    event.preventDefault();

    var nameInput = document.getElementById('guestName');
    var contentInput = document.getElementById('guestMessage');
    var name = nameInput.value.trim();
    var content = contentInput.value.trim();

    if (!validateForm(name, content)) {
      return;
    }

    var messages = loadMessages();
    messages.push({
      id: createId(),
      name: name,
      content: content,
      time: Date.now()
    });
    saveMessages(messages);

    // 提交成功后清空表单并重新渲染
    nameInput.value = '';
    contentInput.value = '';
    showError('guestName', 'guestNameError', '');
    showError('guestMessage', 'guestMessageError', '');
    renderMessages();
    nameInput.focus();
  }

  function handleListClick(event) {
    var btn = event.target.closest('.guest-delete');
    if (!btn) {
      return;
    }

    var id = btn.dataset.id;
    var messages = loadMessages();
    var next = messages.filter(function (msg) {
      return msg.id !== id;
    });

    saveMessages(next);
    renderMessages();
  }

  function handleClearAll() {
    var messages = loadMessages();
    if (messages.length === 0) {
      return;
    }

    // 清空属于不可逆操作，先让用户确认
    if (!window.confirm('确定要清空全部 ' + messages.length + ' 条留言吗？此操作不可恢复。')) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    renderMessages();
  }

  /* ---------------------------------------------------------
     入口
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('guestbookForm');
    var list = document.getElementById('guestList');
    var clearBtn = document.getElementById('clearAllBtn');

    if (!form) {
      return;
    }

    renderMessages();

    form.addEventListener('submit', handleSubmit);
    list.addEventListener('click', handleListClick);

    if (clearBtn) {
      clearBtn.addEventListener('click', handleClearAll);
    }
  });
})();
