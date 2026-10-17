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

  // Reading-progress rule under the navigation
  var bar = document.querySelector('.scroll-progress');
  if (bar) {
    var ticking = false;
    var updateBar = function () {
      var el = document.documentElement;
      var max = el.scrollHeight - el.clientHeight;
      bar.style.setProperty('--progress', max > 0 ? (el.scrollTop / max).toFixed(4) : '0');
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

  // Hero book follows the pointer (flat at rest; desktop pointers only)
  var tilt = document.querySelector('[data-tilt]');
  if (tilt && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var area = tilt.closest('header') || tilt;
    area.addEventListener('pointermove', function (e) {
      var r = tilt.getBoundingClientRect();
      var x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      var y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      tilt.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
      tilt.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
      tilt.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      tilt.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      tilt.classList.add('is-active');
    });
    area.addEventListener('pointerleave', function () {
      tilt.style.setProperty('--ry', '0deg');
      tilt.style.setProperty('--rx', '0deg');
      tilt.classList.remove('is-active');
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
