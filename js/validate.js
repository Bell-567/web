/* =========================================================
   validate.js — 联系页表单验证
   逐项校验姓名、邮箱、主题与留言内容，
   错误信息显示在对应输入框下方，全部通过后给出成功提示。
   ========================================================= */

(function () {
  'use strict';

  // 邮箱正则：要求 @ 前无空白、@ 后无空白，且域名部分含至少一个点
  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var MIN_MESSAGE_LENGTH = 5;
  var MAX_MESSAGE_LENGTH = 500;

  /* ---------------------------------------------------------
     错误提示的显示与清除
     --------------------------------------------------------- */

  function setFieldError(inputId, errorId, message) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);

    if (error) {
      error.textContent = message || '';
    }
    if (input) {
      // invalid 类控制红框样式
      input.classList.toggle('invalid', Boolean(message));
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
  }

  function clearAllErrors() {
    setFieldError('name', 'nameError', '');
    setFieldError('email', 'emailError', '');
    setFieldError('subject', 'subjectError', '');
    setFieldError('message', 'messageError', '');
  }

  /* ---------------------------------------------------------
     单项校验规则：返回错误信息，通过则返回空字符串
     --------------------------------------------------------- */

  function validateName(value) {
    if (!value) {
      return '姓名不能为空';
    }
    if (value.length > 20) {
      return '姓名不能超过 20 个字符';
    }
    return '';
  }

  function validateEmail(value) {
    if (!value) {
      return '邮箱不能为空';
    }
    if (!EMAIL_REGEX.test(value)) {
      return '邮箱格式不正确，例如：name@example.com';
    }
    return '';
  }

  function validateSubject(value) {
    // 主题为选填项，但填了就要符合长度要求
    if (value && value.length > 50) {
      return '主题不能超过 50 个字符';
    }
    return '';
  }

  function validateMessage(value) {
    if (!value) {
      return '留言内容不能为空';
    }
    if (value.length < MIN_MESSAGE_LENGTH) {
      return '留言内容至少需要 ' + MIN_MESSAGE_LENGTH + ' 个字符，当前 ' + value.length + ' 个';
    }
    if (value.length > MAX_MESSAGE_LENGTH) {
      return '留言内容不能超过 ' + MAX_MESSAGE_LENGTH + ' 个字符';
    }
    return '';
  }

  /* ---------------------------------------------------------
     整表校验
     --------------------------------------------------------- */

  function validateForm() {
    var nameField = document.getElementById('name');
    var emailField = document.getElementById('email');
    var subjectField = document.getElementById('subject');
    var messageField = document.getElementById('message');

    var nameError = validateName(nameField.value.trim());
    var emailError = validateEmail(emailField.value.trim());
    var subjectError = validateSubject(subjectField.value.trim());
    var messageError = validateMessage(messageField.value.trim());

    setFieldError('name', 'nameError', nameError);
    setFieldError('email', 'emailError', emailError);
    setFieldError('subject', 'subjectError', subjectError);
    setFieldError('message', 'messageError', messageError);

    // 返回第一个出错的字段，便于聚焦
    var firstInvalid = [
      { id: 'name', error: nameError },
      { id: 'email', error: emailError },
      { id: 'subject', error: subjectError },
      { id: 'message', error: messageError }
    ].filter(function (field) {
      return field.error;
    })[0];

    return { valid: !firstInvalid, firstInvalidId: firstInvalid ? firstInvalid.id : null };
  }

  /* ---------------------------------------------------------
     事件处理
     --------------------------------------------------------- */

  function handleSubmit(event) {
    // 阻止默认提交：本页没有后端，验证通过后仅做前端提示
    event.preventDefault();

    var successMsg = document.getElementById('successMsg');
    var result = validateForm();

    if (!result.valid) {
      if (successMsg) {
        successMsg.hidden = true;
      }
      // 把焦点移到第一个出错的输入框，方便用户直接修改
      var firstInvalid = document.getElementById(result.firstInvalidId);
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // 先重置表单并清除旧提示，最后再显示成功信息，
    // 这样即使 reset() 触发了 reset 事件也不会把成功提示覆盖掉
    event.target.reset();
    clearAllErrors();

    if (successMsg) {
      successMsg.hidden = false;
      successMsg.textContent = '✅ 消息已提交成功！感谢你的留言，我会尽快回复你。';
    }
  }

  /* ---------------------------------------------------------
     输入时的即时反馈：已出错的字段在用户修正后立即清除提示
     --------------------------------------------------------- */

  function bindLiveValidation() {
    var rules = [
      { id: 'name', errorId: 'nameError', fn: validateName },
      { id: 'email', errorId: 'emailError', fn: validateEmail },
      { id: 'subject', errorId: 'subjectError', fn: validateSubject },
      { id: 'message', errorId: 'messageError', fn: validateMessage }
    ];

    rules.forEach(function (rule) {
      var input = document.getElementById(rule.id);
      if (!input) {
        return;
      }

      input.addEventListener('input', function () {
        // 仅在字段已标记为出错时才实时更新，避免用户刚开始输入就报错
        if (!input.classList.contains('invalid')) {
          return;
        }
        setFieldError(rule.id, rule.errorId, rule.fn(input.value.trim()));
      });
    });
  }

  /* ---------------------------------------------------------
     入口
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    if (!form) {
      return;
    }

    form.addEventListener('submit', handleSubmit);

    // 重置时一并清除所有错误提示与成功提示
    form.addEventListener('reset', function () {
      clearAllErrors();
      var successMsg = document.getElementById('successMsg');
      if (successMsg) {
        successMsg.hidden = true;
      }
    });

    bindLiveValidation();
  });
})();
