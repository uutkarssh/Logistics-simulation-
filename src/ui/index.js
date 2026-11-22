// Overlay entry point: builds the fixed UI regions and mounts every UI module into them.
// Layout + tokens live in styles.css (SPEC §2). The overlay root has pointer-events:none;
// only the cards inside the regions catch the mouse, so the 3D view stays draggable.
import { mountTopbar } from './topbar.js'
import { mountKpis } from './kpis.js'
import { mountMapControls } from './mapControls.js'
import { mountDetailPanel } from './detailPanel.js'
import { mountShipmentTracker } from './shipmentTracker.js'
import { mountFleetPanel } from './fleetPanel.js'
import { mountTutorial } from './tutorial.js'
import { store } from '../state/store.js'
import { icon } from './icons.js'

/** Design viewport of the overlay (SPEC §2); smaller windows scale the whole overlay down. */
export const DESIGN_WIDTH = 1440
export const DESIGN_HEIGHT = 830
const MIN_SCALE = 0.7
/** Below this width the overlay switches to a native mobile/portrait layout (no down-scaling). */
export const MOBILE_BP = 820

const REGIONS = [
  ['header', 'wt-topbar'],
  ['div', 'wt-kpis'],
  ['div', 'wt-map-controls'],
  ['aside', 'wt-detail'],
  ['section', 'wt-tracker'],
  ['section', 'wt-fleet'],
]

/** Scale factor so the 1440×830 layout fits the window (never upscales). Mobile = native (1). */
export function uiScale(width = window.innerWidth, height = window.innerHeight) {
  if (width <= MOBILE_BP) return 1
  const s = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT, 1)
  return Math.max(MIN_SCALE, Math.round(s * 1000) / 1000)
}

/** Keeps `--ui-scale` (used as `zoom` on #ui) in sync with the window size. Returns a disposer. */
export function bindUiScale(target = document.documentElement) {
  const apply = () => {
    const mobile = window.innerWidth <= MOBILE_BP
    target.style.setProperty('--ui-scale', String(uiScale()))
    target.classList.toggle('is-mobile', mobile)
    document.body.classList.toggle('is-mobile', mobile)
  }
  apply()
  window.addEventListener('resize', apply)
  window.matchMedia(`(max-width: ${MOBILE_BP}px)`).addEventListener('change', apply)
  return () => window.removeEventListener('resize', apply)
}

/** Create the region containers inside `root`; returns { [id]: element }. */
export function createRegions(root, ids = REGIONS.map(([, id]) => id)) {
  const els = {}
  for (const [tag, id] of REGIONS) {
    if (!ids.includes(id)) continue
    const el = root.querySelector(`#${id}`) ?? document.createElement(tag)
    el.id = id
    el.classList.add('wt-region')
    root.appendChild(el)
    els[id] = el
  }
  return els
}

/**
 * Mobile bottom sheet: on phones the detail / fleet / tracker panels live in one tabbed sheet
 * anchored to the bottom of the screen. On desktop the wrapper is a transparent full-screen layer
 * (so the three panels keep their original absolute positions) and the tab bar is hidden.
 */
function setupMobileSheet(root, regions) {
  const sheet = document.createElement('div')
  sheet.id = 'wt-sheet'
  sheet.className = 'wt-region'
  sheet.setAttribute('data-mp', 'detail')
  // tab bar (hidden on desktop via CSS)
  const tabs = document.createElement('div')
  tabs.id = 'wt-sheet-tabs'
  tabs.setAttribute('role', 'tablist')
  tabs.innerHTML = `
    <button type="button" class="wt-sheet__tab" data-mp="detail" role="tab" aria-selected="true">Details</button>
    <button type="button" class="wt-sheet__tab" data-mp="fleet" role="tab" aria-selected="false">Fleet</button>
    <button type="button" class="wt-sheet__tab" data-mp="tracker" role="tab" aria-selected="false">Shipment</button>
    <button type="button" class="wt-sheet__collapse" aria-label="Collapse panel">${icon('chevronDown', 18, { sw: 2 })}</button>`
  sheet.append(regions['wt-detail'], regions['wt-fleet'], regions['wt-tracker'], tabs)
  root.appendChild(sheet)

  const setPanel = (mp, expand = true) => {
    if (sheet.getAttribute('data-mp') !== mp) sheet.setAttribute('data-mp', mp)
    tabs.querySelectorAll('[data-mp]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mp === mp)))
    if (expand) sheet.classList.remove('is-collapsed')
  }

  tabs.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-mp]')
    if (tab) { setPanel(tab.dataset.mp); return }
    if (e.target.closest('.wt-sheet__collapse')) sheet.classList.toggle('is-collapsed')
  })

  // selecting an entity (from the 3D view, search or a fleet row) jumps to the detail tab
  store.subscribe((s, _prev, changed) => {
    if (!changed.includes('selection')) return
    const sel = s.selection
    if (!sel || sel.type === 'site') return
    if (sheet.getAttribute('data-mp') !== 'detail') setPanel('detail')
    else sheet.classList.remove('is-collapsed')
  })

  return sheet
}

export function mountUI(root) {
  root.classList.add('wt-ui')
  bindUiScale()
  const r = createRegions(root)
  // the three bottom panels go into the mobile sheet wrapper (transparent on desktop)
  setupMobileSheet(root, r)
  mountTopbar(r['wt-topbar'])
  mountKpis(r['wt-kpis'])
  mountMapControls(r['wt-map-controls'])
  mountDetailPanel(r['wt-detail'])
  mountShipmentTracker(r['wt-tracker'])
  mountFleetPanel(r['wt-fleet'])
  mountTutorial(root)
  return r
}
