// WareTrack — contextual tip buttons + a shared popover.
// A lightbulb button (`tipButton(key)`) is placed next to a stat/panel; tapping it opens a
// short, practical warehouse-management tip (2–4 sentences) keyed to CONTEXT_TIPS in guidance.js.
// The popover tracks the current language (guidance.js subscribe) so it stays in EN / HI / Hing.
// Poppins font, consistent with the rest of the guidance system (tip.css).
import './tip.css'
import { getLang, subscribe, tr, CONTEXT_TIPS } from './guidance.js'
import { icon } from './icons.js'

let popover = null

function ensure() {
  if (popover) return popover
  popover = document.createElement('div')
  popover.className = 'wt-tip-pop'
  popover.setAttribute('role', 'tooltip')
  popover.hidden = true
  document.body.appendChild(popover)

  popover.addEventListener('click', (e) => {
    if (e.target.closest('.wt-tip-pop__close')) hide()
  })
  // dismiss on outside pointer / Esc
  document.addEventListener('pointerdown', (e) => {
    if (popover.hidden) return
    if (!popover.contains(e.target) && !e.target.closest('[data-tip]')) hide()
  }, true)
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !popover.hidden) hide() })
  window.addEventListener('scroll', () => { if (!popover.hidden && popover._anchor) position(popover._anchor) }, { passive: true })
  // live re-render on language change
  subscribe(() => { if (!popover.hidden && popover._key) paint() })
  return popover
}

function paint() {
  const key = popover._key
  const text = tr(CONTEXT_TIPS[key]) || ''
  popover.innerHTML =
    `<button class="wt-tip-pop__close" type="button" aria-label="Close tip">${icon('close', 14)}</button>` +
    `<div class="wt-tip-pop__head">${icon('tip', 14, { sw: 1.9 })}</div>` +
    `<div class="wt-tip-pop__text">${text}</div>`
  position(popover._anchor)
}

function position(anchor) {
  if (!anchor) return
  const r = anchor.getBoundingClientRect()
  const pw = Math.min(284, window.innerWidth - 16)
  popover.style.maxWidth = `${pw}px`
  let left = r.left
  let top = r.bottom + 6
  // measure after a paint
  const ph = popover.offsetHeight || 120
  if (left + pw > window.innerWidth - 8) left = window.innerWidth - 8 - pw
  if (left < 8) left = 8
  if (top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 6)
  popover.style.left = `${left}px`
  popover.style.top = `${top}px`
}

function show(anchor, key) {
  const p = ensure()
  p._key = key
  p._anchor = anchor
  paint()
  p.hidden = false
}

function hide() { if (popover) { popover.hidden = true; popover._anchor = null } }

// global click delegation — any [data-tip] button toggles its popover
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-tip]')
  if (!btn) return
  e.stopPropagation()
  if (popover && !popover.hidden && popover._anchor === btn) { hide(); return }
  show(btn, btn.dataset.tip)
})

/** Markup for a small lightbulb tip button. `key` must be a CONTEXT_TIPS key. */
export function tipButton(key, { size = 14, label = 'Tip' } = {}) {
  if (!CONTEXT_TIPS[key]) return '' // no tip for this key — render nothing
  return `<button type="button" class="wt-tip" data-tip="${key}" aria-label="${label}" title="${label}">${icon('tip', size, { sw: 1.8 })}</button>`
}
