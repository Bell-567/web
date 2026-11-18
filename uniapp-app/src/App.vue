<script>
export default {
  onLaunch() {
    console.log('山海行记 App Launch')
  },
  onShow() {
    console.log('山海行记 App Show')
  },
  onHide() {
    console.log('山海行记 App Hide')
  },
}
</script>

<style>
/* ============================================================
   全局样式（uni-app 中 App.vue 的样式作用于所有页面）
   ============================================================ */
page {
  background-color: #f7f3ec;
  color: #2a241d;
  font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

view,
text,
button,
input,
textarea,
image {
  box-sizing: border-box;
}

text {
  color: inherit;
}

image {
  display: block;
}

/* 重置小程序 button 的默认样式 */
button {
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}
button::after {
  border: none;
}

/* ---------- 主题变量：由 AppShell 根节点上的 class 切换 ---------- */
.app {
  --bg: #f7f3ec;
  --bg-soft: #efe7db;
  --surface: #ffffff;
  --text: #2a241d;
  --text-muted: #776c5e;
  --border: #e4dccd;
  --accent: #d96c4b;
  --accent-hover: #c25a3b;
  --accent-2: #2f5d62;
  --accent-3: #e9c46a;
  --accent-soft: #f7e0d7;
  --success: #2f9e6e;
  --danger: #c0392b;
  --shadow-sm: 0 1px 3px rgba(46, 38, 26, 0.08);
  --shadow: 0 6px 24px rgba(46, 38, 26, 0.08);
  --shadow-lg: 0 16px 48px rgba(46, 38, 26, 0.14);
  --radius: 16px;
  --radius-sm: 10px;
  --maxw: 1120px;
  --font-head: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
  transition: background 0.3s ease, color 0.3s ease;
}

.app.theme-dark {
  --bg: #171410;
  --bg-soft: #201b15;
  --surface: #221d17;
  --text: #f0e9dd;
  --text-muted: #a99d8b;
  --border: #382f24;
  --accent: #e8855f;
  --accent-hover: #f29a76;
  --accent-2: #74a7a6;
  --accent-3: #e9c46a;
  --accent-soft: #3a251c;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
  --shadow-lg: 0 18px 52px rgba(0, 0, 0, 0.55);
}

.page {
  flex: 1;
}

.container {
  width: 92%;
  max-width: 1120px;
  margin: 0 auto;
}

.section {
  padding: 56px 0;
}

/* ---------- 区块标题 ---------- */
.section-head {
  text-align: center;
  margin-bottom: 40px;
}
.section-head .eyebrow {
  color: var(--accent);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
}
.section-head .section-head__title {
  display: block;
  font-family: var(--font-head);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  margin-top: 6px;
}
.section-head .section-head__sub {
  display: block;
  color: var(--text-muted);
  margin-top: 10px;
  font-size: 15px;
}

/* ---------- 按钮 ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.2;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}
.btn--primary {
  background: var(--accent);
  color: #fff;
}
.btn--ghost {
  background: transparent;
  color: var(--text);
  border-color: var(--border);
}
.btn--soft {
  background: var(--accent-soft);
  color: var(--accent);
}
.btn--light {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
}
.btn--block {
  display: flex;
  width: 100%;
}

/* ---------- 卡片 ---------- */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

/* ---------- 徽章 / 标签 ---------- */
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.4;
  transition: all 0.15s ease;
}
.chip--active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.6;
}

/* ---------- 表单 ---------- */
.field {
  display: block;
  margin-bottom: 18px;
}
.field__label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}
.field__input {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  font-size: 15px;
}
.field__textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  font-size: 15px;
}
.field__error {
  display: block;
  color: var(--danger);
  font-size: 12px;
  margin-top: 4px;
}

/* ---------- 页面标题 ---------- */
.page-head {
  text-align: center;
  margin-bottom: 32px;
}
.page-head .eyebrow {
  display: block;
  color: var(--accent);
  letter-spacing: 0.18em;
  font-weight: 600;
  font-size: 12px;
}
.page-head .page-head__title {
  display: block;
  font-family: var(--font-head);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  margin-top: 6px;
}
.page-head .page-head__sub {
  display: block;
  color: var(--text-muted);
  margin-top: 8px;
  font-size: 14px;
}
</style>
