(function () {
  var burger = document.querySelector('[data-m="burger"]');
  var nav = document.querySelector('[data-m="nav"]');
  if (burger && nav) {
    var setOpen = function (o) {
      nav.setAttribute('data-open', o ? 'true' : 'false');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
      burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
      burger.textContent = o ? '\u2715' : '\u2630';
    };
    burger.addEventListener('click', function () { setOpen(nav.getAttribute('data-open') !== 'true'); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  }

  var dots = [].slice.call(document.querySelectorAll('button[aria-label^="Show image"]'));
  if (dots.length) {
    var sec = dots[0].closest('section');
    var slides = [].slice.call(sec.children).filter(function (el) { return el.hasAttribute('aria-hidden'); });
    var cur = 0, timer;
    var show = function (i) {
      cur = i;
      slides.forEach(function (s, j) { s.style.opacity = j === i ? '1' : '0'; s.setAttribute('aria-hidden', j === i ? 'false' : 'true'); });
      dots.forEach(function (d, j) { d.style.background = j === i ? 'var(--gold-500)' : 'rgba(246,244,239,0.35)'; });
    };
    var start = function () { clearInterval(timer); timer = setInterval(function () { show((cur + 1) % slides.length); }, 6000); };
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); start(); }); });
    var loadRest = function () {
      slides.forEach(function (s) { var im = s.querySelector('img[data-src]'); if (!im) return; if (im.dataset.srcset) { im.srcset = im.dataset.srcset; im.sizes = '100vw'; } im.src = im.dataset.src; im.removeAttribute('data-src'); });
    };
    if (document.readyState === 'complete') loadRest(); else window.addEventListener('load', loadRest);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();
  }

  var job = document.querySelector('[data-q="thanks-job"]');
  if (job) {
    try { var j = sessionStorage.getItem('taaffe-job'); if (j) { job.textContent = j; job.style.display = 'block'; sessionStorage.removeItem('taaffe-job'); } } catch (e) {}
  }

  var q = function (k) { return document.querySelector('[data-q="' + k + '"]'); };
  var send = q('send');
  if (send) {
    var mat = q('material'), ton = q('tonnes'), site = q('site'), phone = q('phone'), name = q('name'), honey = q('honey'), details = q('details'), dateIn = q('date');
    if (dateIn) { var t = new Date(); dateIn.min = t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2); }
    var niceDate = function () { if (!dateIn || !dateIn.value) return ''; var p = dateIn.value.split('-'); return new Date(+p[0], p[1] - 1, +p[2]).toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); };
    var sum = q('sum'), siteSum = q('site-sum'), sizeSum = q('size-sum'), msg = q('err'), wa = q('wa');
    var fieldset = function (start) { return [].slice.call(document.querySelectorAll('fieldset')).filter(function (f) { var l = f.querySelector('legend'); return l && l.textContent.indexOf(start) === 0; })[0]; };
    var fsSize = fieldset('How much'), fsWhen = fieldset('When');
    var val = function (f) { var c = f && f.querySelector('input:checked'); return c ? c.value : ''; };
    var paint = function (f) {
      f.querySelectorAll('label').forEach(function (l) {
        var i = l.querySelector('input'), dot = l.firstElementChild;
        dot.style.borderColor = i.checked ? 'var(--brand-primary)' : 'var(--border-strong)';
        dot.innerHTML = i.checked ? '<span style="width:9px;height:9px;border-radius:50%;background:var(--brand-primary)"></span>' : '';
      });
    };
    var update = function () {
      sum.textContent = (ton.value || '0') + ' t ' + mat.value;
      siteSum.textContent = site.value || 'Site address not set';
      sizeSum.textContent = val(fsSize).toUpperCase();
      wa.href = 'https://wa.me/353876471438?text=' + encodeURIComponent('Hi Taaffe Sand & Gravel, I am looking for a price on ' + (ton.value || '?') + ' t of ' + mat.value + ' delivered to ' + (site.value || '[site address / Eircode]') + '. Thanks.');
    };
    var sizeTon = { '1 tonne bag': '1', 'Small load (2–5 t)': '5', 'Full load (up to 20 t)': '20', 'Artic load (approx. 29–30 t)': '30' };
    if (fsSize) fsSize.addEventListener('change', function () { var v = sizeTon[val(fsSize)]; if (v) ton.value = v; });
    [fsSize, fsWhen].forEach(function (f) { if (f) f.addEventListener('change', function () { paint(f); update(); }); });
    [ton, site, phone].forEach(function (el) { el.addEventListener('input', update); });
    mat.addEventListener('change', update);
    var say = function (text, ok) { msg.style.display = 'block'; msg.style.color = ok ? 'var(--green-700, #1d5a3a)' : 'var(--danger-600, #b42318)'; msg.textContent = text; };
    send.addEventListener('click', function () {
      if (!name.value.trim() || !site.value.trim() || !phone.value.trim()) { say('Please fill in your name, the site address and a phone number.'); (!name.value.trim() ? name : !site.value.trim() ? site : phone).focus(); return; }
      send.disabled = true; send.textContent = 'Sending\u2026';
      var tonnes = ton.value || '?';
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
      fetch('https://formsubmit.co/ajax/taaffesandgravelltd@gmail.com', {
        method: 'POST', signal: ctl ? ctl.signal : undefined,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Website price request: ' + tonnes + ' t ' + mat.value,
          _template: 'table', _captcha: 'false', _honey: honey ? honey.value : '',
          Name: name.value, Material: mat.value, Amount: val(fsSize), Tonnage: tonnes + ' t',
          'Site address': site.value, Phone: phone.value, 'When needed': val(fsWhen), 'Exact date': niceDate(), Details: details ? details.value : ''
        })
      }).then(function (r) {
        if (!r.ok) throw new Error('bad');
        return r.json();
      }).then(function (d) {
        if (d && (d.success === false || d.success === 'false')) throw new Error(d.message || 'bad');
        try { sessionStorage.setItem('taaffe-job', tonnes + ' t ' + mat.value + ' \u00b7 ' + val(fsSize)); } catch (e) {}
        window.location.href = 'thanks.html';
      }).catch(function () {
        say('That did not send. Please ring the yard on 045 430 536 or use WhatsApp.');
      }).then(function () { clearTimeout(timer); send.disabled = false; send.textContent = 'Send request'; });
    });
  }
})();
