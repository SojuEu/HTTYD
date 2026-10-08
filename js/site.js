/* HTTYD · site.js — tema claro/escuro, navbar, carousel e painéis dos dragões */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const KEY = 'hx-theme';
  const LABEL = { auto: 'Automático', light: 'Claro', dark: 'Escuro' };
  const ICON = { auto: '◐', light: '☀', dark: '☾' };

  /* ---------- Tema (auto / claro / escuro) ---------- */
  const saved = () => { try { return localStorage.getItem(KEY) || 'auto'; } catch { return 'auto'; } };
  function applyTheme(t) {
    const eff = t === 'auto' ? (mq.matches ? 'dark' : 'light') : t;
    root.dataset.bsTheme = eff;
    $('meta[name="theme-color"]')?.setAttribute('content', eff === 'dark' ? '#0b0d12' : '#f3eee6');
    $$('[data-hx-theme]').forEach(b => {
      const on = b.dataset.hxTheme === t;
      b.classList.toggle('active', on);
      on ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current');
    });
    const i = $('[data-hx-icon]'); if (i) i.textContent = ICON[t];
  }
  const setTheme = t => { try { localStorage.setItem(KEY, t); } catch { /* modo privado */ } applyTheme(t); };
  mq.addEventListener('change', () => saved() === 'auto' && applyTheme('auto'));

  /* ---------- Navbar: link ativo, seletor de tema, esconder ao rolar ---------- */
  function buildNav() {
    const nav = $('.navbar'); if (!nav) return;
    nav.classList.add('hx-navbar');
    const here = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link[href], .dropdown-item[href]', nav).forEach(a => {
      const h = a.getAttribute('href');
      if (h === here) {
        a.classList.add('active'); a.setAttribute('aria-current', 'page');
        a.closest('.dropdown')?.querySelector('.dropdown-toggle')?.classList.add('active');
      } else if (h !== '#' && a.classList.contains('nav-link')) a.classList.remove('active');
    });
    const host = $('.navbar-collapse', nav); if (!host) return;
    const d = document.createElement('div');
    d.className = 'dropdown hx-theme ms-lg-auto mt-2 mt-lg-0';
    d.innerHTML = `<button class="btn btn-sm hx-theme-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Tema do site"><span data-hx-icon aria-hidden="true"></span> <span class="d-lg-none">Tema</span></button>` +
      `<ul class="dropdown-menu dropdown-menu-end">${Object.keys(LABEL).map(k => `<li><button type="button" class="dropdown-item" data-hx-theme="${k}">${ICON[k]} ${LABEL[k]}</button></li>`).join('')}</ul>`;
    host.append(d);
    d.addEventListener('click', e => { const b = e.target.closest('[data-hx-theme]'); if (b) setTheme(b.dataset.hxTheme); });
  }
  let last = 0, busy = false;
  addEventListener('scroll', () => {
    if (busy) return; busy = true;
    requestAnimationFrame(() => {
      const y = scrollY, nav = $('.hx-navbar');
      if (nav) {
        const open = $('.navbar-collapse.show', nav) || $('.dropdown-menu.show', nav);
        nav.classList.toggle('is-hidden', !open && y > last && y > 140);
        nav.classList.toggle('is-scrolled', y > 10);
      }
      last = y; busy = false;
    });
  }, { passive: true });

  /* ---------- Carousel: contador, pausa acessível, progresso, vídeos ---------- */
  function enhanceCarousels() {
    if (!window.bootstrap) return;
    $$('.carousel').forEach(el => {
      const items = $$('.carousel-item', el);
      const auto = el.hasAttribute('data-bs-ride');
      const c = bootstrap.Carousel.getOrCreateInstance(el);
      el.setAttribute('aria-roledescription', 'carousel');
      items.forEach((it, i) => { it.setAttribute('role', 'group'); it.setAttribute('aria-roledescription', 'slide'); it.setAttribute('aria-label', `${i + 1} de ${items.length}`); });
      const bar = document.createElement('div'); bar.className = 'hx-bar';
      bar.innerHTML = (auto ? '<button type="button" class="hx-pp" aria-label="Pausar rotação automática">❚❚</button>' : '') + '<span class="hx-count" aria-hidden="true"></span>';
      el.append(bar);
      const cnt = $('.hx-count', bar), pp = $('.hx-pp', bar), prog = $('.hx-progress', el);
      let paused = false;
      const restart = () => { if (!prog) return; prog.classList.remove('run'); void prog.offsetWidth; prog.classList.add('run'); };
      const sync = () => {
        const i = Math.max(0, items.findIndex(x => x.classList.contains('active')));
        cnt.textContent = `${String(i + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
        $$('[data-bs-slide-to]', el).forEach(b => { const on = +b.dataset.bsSlideTo === i; b.classList.toggle('active', on); on ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'); });
        $$('video', el).forEach(v => { v.pause(); v.currentTime = 0; });
        restart();
      };
      el.addEventListener('slid.bs.carousel', sync); sync();
      if (!auto) return;
      const setPaused = p => {
        paused = p; el.classList.toggle('is-paused', p);
        if (p) c.pause(); else { c.cycle(); restart(); }
        pp.textContent = p ? '▶' : '❚❚';
        pp.setAttribute('aria-label', p ? 'Retomar rotação automática' : 'Pausar rotação automática');
      };
      pp.addEventListener('click', () => setPaused(!paused));
      const hold = h => { if (paused) return; el.classList.toggle('is-hover', h); if (h) c.pause(); else { c.cycle(); restart(); } };
      ['mouseenter', 'focusin'].forEach(ev => el.addEventListener(ev, () => hold(true)));
      ['mouseleave', 'focusout'].forEach(ev => el.addEventListener(ev, () => hold(false)));
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true);
    });
  }

  /* ---------- Painéis dos dragões (dados em js/dragons.js) ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const TITLE = { feat: 'Características', abil: 'Habilidades' };
  function render(d, v) {
    if (v === 'alert' && d.alert) return `<div class="alert alert-${esc(d.alert.tone)}" role="alert">${esc(d.alert.text)}</div>`;
    if (v === 'desc' && d.desc) return `<h3 class="h4">Descrição</h3><blockquote>${esc(d.desc)}</blockquote>`;
    if (TITLE[v] && d[v]) return `<h3 class="h4">${TITLE[v]}</h3><ul>${d[v].map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
    return '';
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-panel]'); if (!b) return;
    const id = b.dataset.panel, p = document.getElementById(id); if (!p) return;
    const v = p.dataset.view === b.dataset.view ? 'hide' : b.dataset.view;     // clicar de novo recolhe
    p.dataset.view = v;
    p.innerHTML = render((window.HTTYD_DRAGONS || {})[id] || {}, v);
    $$(`[data-panel="${id}"]`).forEach(x => { const on = x.dataset.view === v && v !== 'hide'; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
  });

  /* ---------- Pequenos reparos globais ---------- */
  function init() {
    buildNav(); applyTheme(saved()); enhanceCarousels();
    $$('table').filter(t => !t.closest('.table-responsive')).forEach(t => { const w = document.createElement('div'); w.className = 'table-responsive'; t.replaceWith(w); w.append(t); });
    $$('img').forEach(i => { if (i.complete && !i.naturalWidth) i.classList.add('is-broken'); });
  }
  addEventListener('error', e => { if (e.target instanceof HTMLImageElement) e.target.classList.add('is-broken'); }, true);
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
