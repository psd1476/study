(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};
  var links = cfg.links || {};
  var toast = document.getElementById('toast');
  var toastTimer;

  // 도메인 형태(점으로 구분된 호스트명) 검사. 한글 도메인은 url.hostname 에서 punycode 로 변환됨
  var HOST_RE = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9-]{2,}$/i;

  // 접수폼 주소는 https 만 허용 (http, javascript:, 자리표시자 "https://..." 등은 무시하고 콘솔에 경고)
  function safeUrl(value) {
    if (value == null || (typeof value === 'string' && !value.trim())) return null;  // 값 없음: 조용히 '준비 중'
    if (typeof value === 'string' && !/\s/.test(value.trim())) {                      // 중간 공백·줄바꿈이 있으면 거부
      try {
        var url = new URL(value.trim());
        if (url.protocol === 'https:' && HOST_RE.test(url.hostname)) return url.href;
      } catch (e) { /* 아래에서 경고 */ }
    }
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
      // 페이드아웃(.2s) 후 문구를 비워, 사라진 안내가 보조기기에 남지 않게 함
      toastTimer = setTimeout(function () { toast.textContent = ''; }, 300);
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
