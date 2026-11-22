// WareTrack — Help & Guidance overlay: onboarding steps + complete term glossary +
// warehouse-management tips, in English / Hindi (Devanagari) / Hinglish. Poppins font.
//
// Dismissible, shown on first load (localStorage), re-opened via the Help button
// (window event 'wt:tutorial'). Language state lives in guidance.js so the contextual
// tip popovers stay in sync with the same toggle.
import './tutorial.css'
import { icon } from './icons.js'
import {
  LANGS, LANG_LABEL, TITLE, STEPS, GLOSSARY, TIPS,
  getLang, setLang, subscribe, tr,
} from './guidance.js'

const SEEN_KEY = 'wt-tut-seen-v1'
const CTA = { en: 'Got it', hi: 'समझ गया', hg: 'Got it' }
const HELP_HINT = { en: 'Reopen anytime from the Help', hi: 'कभी भी Help से खोलें', hg: 'Dobara kholne ke liye Help button' }
const TAB_LABELS = {
  tour: { en: 'Quick tour', hi: 'झलक', hg: 'Quick tour' },
  glossary: { en: 'Glossary', hi: 'शब्दावली', hg: 'Glossary' },
  tips: { en: 'Tips', hi: 'सुझाव', hg: 'Tips' },
}

export function mountTutorial(root) {
  const overlay = document.createElement('div')
  overlay.className = 'wt-tut'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', 'WareTrack help & guidance')
  overlay.hidden = true
  root.appendChild(overlay)

  let tab = 'tour'
  let lang = getLang()

  function stepsHtml() {
    return `<ol class="wt-tut__steps">${STEPS.map((st) => `
      <li class="wt-tut__step">
        <span class="wt-tut__step-ico">${icon(st.ico, 20, { sw: 1.8 })}</span>
        <span class="wt-tut__step-body">
          <span class="wt-tut__step-t">${tr(st).t}</span>
          <span class="wt-tut__step-d">${tr(st).d}</span>
        </span>
      </li>`).join('')}</ol>`
  }

  function glossaryHtml() {
    return `<div class="wt-tut__groups">${GLOSSARY.map((g) => `
      <section class="wt-tut__group">
        <div class="wt-tut__group-head"><span class="wt-tut__group-ico">${icon(g.ico, 16, { sw: 1.8 })}</span><span class="wt-tut__group-t">${tr(g.title)}</span></div>
        <dl class="wt-tut__defs">${g.items.map((it) => `
          <div class="wt-tut__def">
            <dt class="wt-tut__term">${tr(it.t)}</dt>
            <dd class="wt-tut__desc">${tr(it.d)}</dd>
          </div>`).join('')}</dl>
      </section>`).join('')}</div>`
  }

  function tipsHtml() {
    return `<div class="wt-tut__tips">${TIPS.map((tp) => `
      <div class="wt-tut__tip">
        <span class="wt-tut__tip-ico">${icon(tp.ico, 18, { sw: 1.8 })}</span>
        <div class="wt-tut__tip-body">
          <div class="wt-tut__tip-t">${tr(tp.title)}</div>
          <div class="wt-tut__tip-d">${tr(tp.body)}</div>
        </div>
      </div>`).join('')}</div>`
  }

  function tabsHtml() {
    return ['tour', 'glossary', 'tips'].map((k) =>
      `<button type="button" class="wt-tut__tab${tab === k ? ' is-active' : ''}" data-tab="${k}" role="tab" aria-selected="${tab === k}">${tr(TAB_LABELS[k])}</button>`).join('')
  }

  function render() {
    const content = tab === 'glossary' ? glossaryHtml() : tab === 'tips' ? tipsHtml() : stepsHtml()
    overlay.innerHTML = `
      <div class="wt-tut__card" role="document">
        <div class="wt-tut__head">
          <span class="wt-tut__logo">${icon('logoCube', 30)}</span>
          <div class="wt-tut__title-block">
            <h2 class="wt-tut__title">${tr(TITLE).t}</h2>
            <p class="wt-tut__sub">${tr(TITLE).s}</p>
          </div>
          <button class="wt-tut__close" type="button" aria-label="Close help">${icon('close', 18)}</button>
        </div>
        <div class="wt-tut__lang" role="group" aria-label="Language">
          ${LANGS.map((l) => `<button type="button" data-lang="${l.key}" class="${lang === l.key ? 'is-active' : ''}">${LANG_LABEL[l.key]}</button>`).join('')}
        </div>
        <div class="wt-tut__tabs" role="tablist">${tabsHtml()}</div>
        <div class="wt-tut__content">${content}</div>
        <div class="wt-tut__foot">
          <span class="wt-tut__hint">${icon('help', 13, { sw: 1.8 })} ${tr(HELP_HINT)} (?)</span>
          <button class="wt-tut__cta" type="button">${tr(CTA)}</button>
        </div>
      </div>`
  }

  function show() { render(); overlay.hidden = false; document.body.classList.add('wt-tut-open') }
  function hide() {
    overlay.hidden = true
    document.body.classList.remove('wt-tut-open')
    try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
  }

  overlay.addEventListener('click', (e) => {
    if (e.target.closest('.wt-tut__close') || e.target.closest('.wt-tut__cta')) return hide()
    const langBtn = e.target.closest('[data-lang]')
    if (langBtn) { setLang(langBtn.dataset.lang); lang = langBtn.dataset.lang; render(); return }
    const tabBtn = e.target.closest('[data-tab]')
    if (tabBtn) { tab = tabBtn.dataset.tab; render(); return }
    if (!e.target.closest('.wt-tut__card')) hide() // backdrop dismiss
  })

  // stay in sync if the language is changed elsewhere (e.g. a future global toggle)
  const unsub = subscribe(() => { lang = getLang(); if (!overlay.hidden) render() })

  window.addEventListener('wt:tutorial', show)

  let seen = false
  try { seen = localStorage.getItem(SEEN_KEY) === '1' } catch { /* private mode */ }
  if (!seen) show()

  return { show, hide, destroy: unsub }
}
