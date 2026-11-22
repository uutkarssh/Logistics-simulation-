// WareTrack — onboarding/tutorial overlay (SPEC step 4).
// Dismissible, shown on first load (localStorage), re-opened via the Help button
// (window event 'wt:tutorial'). Hindi + English toggle. Poppins font (tutorial.css).
//
// Every instruction is derived from the ACTUAL controls:
//  - one-finger pan / two-finger pinch + twist / + − ⟲ ⟳ ⌂  (scene.js OrbitControls + mapControls.js)
//  - site switcher WH-0x / ⌄ / › / 'ALL · Network overview'               (topbar.js)
//  - hover/tap labels + detail panel, ✕ / tap-empty-ground to close        (interaction.js + detailPanel.js)
//  - search: '/' on desktop, search icon on mobile                          (topbar.js)
//  - Docks / Forklifts / Trucks tabs + row → fly-to                         (fleetPanel.js)
//  - ⌖ locate / ↗ follow in truck & forklift panels                         (detailPanel.js)
//  - live clock + trucks/forklifts/pallets/batteries                        (simulation.js)
import './tutorial.css'
import { icon } from './icons.js'

const SEEN_KEY = 'wt-tut-seen-v1'

// kbd hints reused inside the strings
const K = (k) => `<span class="wt-tut__kbd">${k}</span>`

// step icons + per-language text. icons are existing icon names from icons.js.
const STEPS = [
  {
    ico: 'cube',
    en: { t: 'Move the 3D map', d: `Desktop: drag to pan, right-drag to rotate, scroll to zoom. Mobile: one finger to pan, two fingers to pinch-zoom and twist to orbit.` },
    hi: { t: '3D मैप घुमाएँ', d: `डेस्कटॉप: खींचें (पैन), राइट-ड्रैग से घुमाएँ, स्क्रॉल से ज़ूम। मोबाइल: एक उंगली से पैन, दो उंगलियों से पिंच-ज़ूम और घुमाकर ऑर्बिट।` },
  },
  {
    ico: 'plus',
    en: { t: 'Zoom & reset', d: `Use ${K('+')} / ${K('−')} to zoom, ${K('⟲')} / ${K('⟳')} to rotate, and ${K('⌂')} to reset the view to the current site.` },
    hi: { t: 'ज़ूम और रीसेट', d: `${K('+')} / ${K('−')} से ज़ूम, ${K('⟲')} / ${K('⟳')} से घुमाएँ, और ${K('⌂')} से व्यू मौजूदा साइट पर रीसेट करें।` },
  },
  {
    ico: 'warehouse',
    en: { t: 'Switch sites', d: `Tap the WH-0x badge (or ${K('⌄')}) to choose a site; pick “ALL · Network overview” to zoom out to all five sites. Tap ${K('›')} for the next site.` },
    hi: { t: 'साइट बदलें', d: `WH-0x बैज (या ${K('⌄')}) टैप करके साइट चुनें; सभी पाँच साइट देखने के लिए “ALL · Network overview” चुनें। अगली साइट के लिए ${K('›')} टैप करें।` },
  },
  {
    ico: 'mapPin',
    en: { t: 'Inspect anything', d: 'Tap (or hover, on desktop) a truck, forklift, pallet, dock, charger or building to see its label. Tap again to open its detail panel.' },
    hi: { t: 'कुछ भी देखें', d: 'ट्रक, फोर्कलिफ्ट, पैलेट, डॉक, चार्जर या बिल्डिंग को टैप (डेस्कटॉप पर होवर) करके लेबल देखें। विवरण पैनल खोलने के लिए फिर से टैप करें।' },
  },
  {
    ico: 'close',
    en: { t: 'Close a panel', d: `Tap ${K('✕')} in the panel, or — on mobile — tap empty ground.` },
    hi: { t: 'पैनल बंद करें', d: `पैनल में ${K('✕')} टैप करें, या — मोबाइल पर — खाली जगह टैप करें।` },
  },
  {
    ico: 'search',
    en: { t: 'Search', d: `On desktop, press ${K('/')} to search. On mobile, tap the search icon. Search sites, trucks, forklifts, pallets and shipments.` },
    hi: { t: 'खोज', d: `डेस्कटॉप पर ${K('/')} दबाकर खोजें। मोबाइल पर खोज आइकन टैप करें। साइट, ट्रक, फोर्कलिफ्ट, पैलेट और शिपमेंट खोजें।` },
  },
  {
    ico: 'dock',
    en: { t: 'Fleet tabs', d: 'Use the Docks / Forklifts / Trucks tabs to browse the fleet; tap a row to fly the camera to that entity.' },
    hi: { t: 'फ्लीट टैब', d: 'फ्लीट ब्राउज़ करने के लिए Docks / Forklifts / Trucks टैब इस्तेमाल करें; किसी एंटिटी तक जाने के लिए रो (row) टैप करें।' },
  },
  {
    ico: 'crosshair',
    en: { t: 'Locate & follow', d: `In a truck or forklift panel, tap ${K('⌖')} to locate it, or ${K('↗')} to make the camera follow it as it moves.` },
    hi: { t: 'लोकेट और फॉलो', d: `ट्रक या फोर्कलिफ्ट पैनल में ${K('⌖')} से लोकेट करें, या ${K('↗')} से कैमरा उसका फॉलो करे।` },
  },
  {
    ico: 'clock',
    en: { t: 'Live simulation', d: 'The clock ticks, trucks drive and dock, forklifts shuttle pallets, and batteries charge — all in real time.' },
    hi: { t: 'लाइव सिमुलेशन', d: 'घड़ी चलती है, ट्रक चलते-डॉक होते हैं, फोर्कलिफ्ट पैलेट खिसकाते हैं, बैटरी चार्ज होती है — सब कुछ रियल-टाइम में।' },
  },
]

const TITLE = {
  en: { t: 'Welcome to WareTrack 3D', s: 'A 3D control tower for your warehouse network.' },
  hi: { t: 'WareTrack 3D में आपका स्वागत है', s: 'आपके गोदाम नेटवर्क के लिए 3D कंट्रोल टावर।' },
}
const CTA = { en: 'Got it', hi: 'समझ गया' }
const HELP_HINT = { en: 'Reopen anytime from the Help', hi: 'कभी भी Help से खोलें' }
const LANG_LABEL = { en: 'EN', hi: 'हिं' }

export function mountTutorial(root) {
  const overlay = document.createElement('div')
  overlay.className = 'wt-tut'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', 'WareTrack tutorial')
  overlay.hidden = true
  root.appendChild(overlay)

  let lang = 'en'

  function render() {
    const L = (s) => s[lang]
    overlay.innerHTML = `
      <div class="wt-tut__card" role="document">
        <div class="wt-tut__head">
          <span class="wt-tut__logo">${icon('logoCube', 30)}</span>
          <div class="wt-tut__title-block">
            <h2 class="wt-tut__title">${L(TITLE).t}</h2>
            <p class="wt-tut__sub">${L(TITLE).s}</p>
          </div>
          <button class="wt-tut__close" type="button" aria-label="Close tutorial">${icon('close', 18)}</button>
        </div>
        <div class="wt-tut__lang" role="group" aria-label="Language">
          <button type="button" data-lang="en" class="${lang === 'en' ? 'is-active' : ''}">${LANG_LABEL.en}</button>
          <button type="button" data-lang="hi" class="${lang === 'hi' ? 'is-active' : ''}">${LANG_LABEL.hi}</button>
        </div>
        <ol class="wt-tut__steps">
          ${STEPS.map((st) => `
            <li class="wt-tut__step">
              <span class="wt-tut__step-ico">${icon(st.ico, 20, { sw: 1.8 })}</span>
              <span class="wt-tut__step-body">
                <span class="wt-tut__step-t">${L(st).t}</span>
                <span class="wt-tut__step-d">${L(st).d}</span>
              </span>
            </li>`).join('')}
        </ol>
        <div class="wt-tut__foot">
          <span class="wt-tut__hint">${icon('help', 13, { sw: 1.8 })} ${L(HELP_HINT)} (?)</span>
          <button class="wt-tut__cta" type="button">${L(CTA)}</button>
        </div>
      </div>`
  }

  function show() {
    render()
    overlay.hidden = false
    document.body.classList.add('wt-tut-open')
  }
  function hide() {
    overlay.hidden = true
    document.body.classList.remove('wt-tut-open')
    try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
  }

  overlay.addEventListener('click', (e) => {
    if (e.target.closest('.wt-tut__close') || e.target.closest('.wt-tut__cta')) return hide()
    if (e.target.closest('[data-lang]')) {
      lang = e.target.closest('[data-lang]').dataset.lang
      render()
      return
    }
    // backdrop click (outside the card) dismisses
    if (!e.target.closest('.wt-tut__card')) hide()
  })

  window.addEventListener('wt:tutorial', show)

  // first load: show unless the user has already dismissed it
  let seen = false
  try { seen = localStorage.getItem(SEEN_KEY) === '1' } catch { /* private mode */ }
  if (!seen) show()

  return { show, hide }
}
