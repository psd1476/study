(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};
  var links = cfg.links || {};
  var toast = document.getElementById('toast');
  var toastTimer;

  // 접수폼 주소는 https 만 허용 (http, javascript: 등은 무시하고 콘솔에 경고)
  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      var url = new URL(value.trim());
      if (url.protocol === 'https:') return url.href;
    } catch (e) { /* 아래에서 경고 */ }
    if (window.console) console.warn('[config.js] https:// 로 시작하는 올바른 주소만 사용할 수 있습니다:', value);
    return null;
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 6000);
  }

  var cards = document.querySelectorAll('a[data-reg]');
  Array.prototype.forEach.call(cards, function (card) {
    var url = safeUrl(links[card.getAttribute('data-reg')]);
    if (url) {
      card.href = url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      var hint = document.createElement('span');
      hint.className = 'sr-only';
      hint.textContent = ' (새 창으로 열림)';
      card.appendChild(hint);
    } else {
      card.classList.add('is-pending');
      card.addEventListener('click', function (event) {
        event.preventDefault();
        showToast('사전신청 접수 링크는 추후 안내할 예정입니다.');
      });
    }
  });

  var contact = document.getElementById('contact');
  if (contact && typeof cfg.contact === 'string' && cfg.contact.trim()) {
    contact.textContent = cfg.contact.trim();
    contact.hidden = false;
  }
})();
