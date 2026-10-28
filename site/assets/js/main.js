(function () {
  document.documentElement.classList.add('js');

  // Mobile navigation — the menu shows when it carries [data-open]
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.toggleAttribute('data-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.hasAttribute('data-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 48rem)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // Highlight the nav link for the section in view
  var links = document.querySelectorAll('#nav-menu a[href^="#"]');
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = byId[en.target.id];
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navIo.observe(el);
    });
  }

  // Scroll reveal (CSS only animates when prefers-reduced-motion is not set)
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var revealIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          revealIo.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { revealIo.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reading-progress rule + header that turns solid once the page scrolls
  var bar = document.querySelector('.scroll-progress');
  var siteNav = document.querySelector('.site-nav');
  if (bar || siteNav) {
    var ticking = false;
    var updateBar = function () {
      var el = document.documentElement;
      var max = el.scrollHeight - el.clientHeight;
      if (bar) bar.style.setProperty('--progress', max > 0 ? (el.scrollTop / max).toFixed(4) : '0');
      if (siteNav) siteNav.toggleAttribute('data-scrolled', el.scrollTop > 24);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateBar); }
    }, { passive: true });
    updateBar();
  }

  // Count the hero figures up when they come into view (final value is already in the HTML)
  var counters = document.querySelectorAll('[data-count]');
  if (!reduceMotion && 'IntersectionObserver' in window && counters.length) {
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countIo.unobserve(en.target);
        var el = en.target, target = parseInt(el.getAttribute('data-count'), 10), start = null;
        var step = function (t) {
          if (start === null) start = t;
          var p = Math.min((t - start) / 1600, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIo.observe(el); });
  }

  // Book tabs (Inside the book): ARIA tab pattern; without JS both panels stay visible
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[data-tab]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var select = function (i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[n].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowRight') n = (i + 1) % tabs.length;
        if (k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (k === 'Home') n = 0;
        if (k === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });
    select(0);
  });

  // Gallery lightbox (native <dialog>: Esc closes, focus returns to the photo that opened it)
  var box = document.getElementById('lightbox');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  if (box && items.length && typeof box.showModal === 'function') {
    var lbImg = box.querySelector('.lb-img');
    var lbText = box.querySelector('.lb-text');
    var lbCount = box.querySelector('.lb-count');
    var current = 0, opener = null;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var show = function (i) {
      current = (i + items.length) % items.length;
      var it = items[current], img = it.querySelector('img'), cap = it.parentNode.querySelector('figcaption');
      lbImg.src = it.getAttribute('data-full');
      lbImg.alt = img.alt;
      lbText.textContent = cap ? cap.textContent : '';
      lbCount.textContent = pad(current + 1) + ' / ' + pad(items.length);
    };
    items.forEach(function (it, i) {
      it.setAttribute('aria-label', 'Open photo ' + (i + 1) + ' of ' + items.length + ' in viewer');
      it.addEventListener('click', function () {
        opener = it;
        show(i);
        box.showModal();
        document.documentElement.style.overflow = 'hidden';
      });
    });
    box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lb-stage')) box.close();
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
    box.addEventListener('close', function () {
      document.documentElement.style.overflow = '';
      if (opener) opener.focus();
    });
  }

  // Copy the library request note — the button shows a tick while it carries [data-done]
  var btn = document.getElementById('copybtn');
  if (btn) {
    var note = document.getElementById('libnote');
    var msg = document.getElementById('copymsg');
    var label = btn.querySelector('.label-text');
    var selectNote = function () {
      var r = document.createRange();
      r.selectNodeContents(note);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      msg.textContent = 'Selected. Press Ctrl+C (or ⌘C) to copy.';
    };
    var done = function () {
      btn.setAttribute('data-done', '');
      label.textContent = 'Copied';
      msg.textContent = 'Note copied to your clipboard.';
      setTimeout(function () {
        btn.removeAttribute('data-done');
        label.textContent = 'Copy note';
      }, 2500);
    };
    btn.addEventListener('click', function () {
      try {
        navigator.clipboard.writeText(note.textContent).then(done, selectNote);
      } catch (e) {
        selectNote();
      }
    });
  }
})();
