// WareTrack — shared guidance model: language state + onboarding steps + a complete
// term glossary + warehouse-management tips + contextual tip snippets.
//
// Three language modes, all rendered in Poppins (tutorial.css / tip.css):
//   en = English · hi = Hindi (Devanagari) · hg = Hinglish (Hindi in Roman letters)
//
// Every term and tip is plain-language and derived from the ACTUAL app (mockData.js /
// selectors.js / format.js / the panels). The contextual tips map to real stats/panels.
import { K } from './kbd.js'

// ───────────────────────────── language state ─────────────────────────────
let lang = 'en'
const subs = new Set()
export function getLang() { return lang }
export function setLang(l) {
  if (!LANG_LABEL[l] || l === lang) return
  lang = l
  subs.forEach((fn) => fn(lang))
}
export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn) }
export const tr = (obj) => obj?.[lang] ?? obj?.en ?? ''

export const LANGS = [
  { key: 'en', label: 'EN' },
  { key: 'hi', label: 'हिं' },
  { key: 'hg', label: 'Hing' },
]
export const LANG_LABEL = { en: 'EN', hi: 'हिं', hg: 'Hing' }

// ───────────────────────────── onboarding steps (the controls) ─────────────────────────────
export const TITLE = {
  en: { t: 'Welcome to WareTrack 3D', s: 'A 3D control tower for your warehouse network.' },
  hi: { t: 'WareTrack 3D में आपका स्वागत है', s: 'आपके गोदाम नेटवर्क के लिए 3D कंट्रोल टावर।' },
  hg: { t: 'WareTrack 3D mein aapka swagat hai', s: 'Aapke godaam network ke liye 3D control tower.' },
}
export const STEPS = [
  {
    ico: 'cube',
    en: { t: 'Move the 3D map', d: `Desktop: drag to pan, right-drag to rotate, scroll to zoom. Mobile: one finger to pan, two fingers to pinch-zoom and twist to orbit.` },
    hi: { t: '3D मैप घुमाएँ', d: `डेस्कटॉप: खींचें (पैन), राइट-ड्रैग से घुमाएँ, स्क्रॉल से ज़ूम। मोबाइल: एक उंगली से पैन, दो उंगलियों से पिंच-ज़ूम और घुमाकर ऑर्बिट।` },
    hg: { t: '3D map ghumao', d: `Desktop: kheecho (pan), right-drag se ghumao, scroll se zoom. Mobile: ek ungli se pan, do ungliyon se pinch-zoom aur ghumakar orbit.` },
  },
  {
    ico: 'plus',
    en: { t: 'Zoom & reset', d: `Use ${K('+')} / ${K('−')} to zoom, ${K('⟲')} / ${K('⟳')} to rotate, and ${K('⌂')} to reset the view to the current site.` },
    hi: { t: 'ज़ूम और रीसेट', d: `${K('+')} / ${K('−')} से ज़ूम, ${K('⟲')} / ${K('⟳')} से घुमाएँ, और ${K('⌂')} से व्यू मौजूदा साइट पर रीसेट करें।` },
    hg: { t: 'Zoom aur reset', d: `${K('+')} / ${K('−')} se zoom, ${K('⟲')} / ${K('⟳')} se ghumao, aur ${K('⌂')} se view maujooda site pe reset karo.` },
  },
  {
    ico: 'warehouse',
    en: { t: 'Switch sites', d: `Tap the WH-0x badge (or ${K('⌄')}) to choose a site; pick “ALL · Network overview” to zoom out to all five sites. Tap ${K('›')} for the next site.` },
    hi: { t: 'साइट बदलें', d: `WH-0x बैज (या ${K('⌄')}) टैप करके साइट चुनें; सभी पाँच साइट देखने के लिए “ALL · Network overview” चुनें। अगली साइट के लिए ${K('›')} टैप करें।` },
    hg: { t: 'Site badlo', d: `WH-0x badge (ya ${K('⌄')}) tap karke site chuno; saari paanch site dekhne ke liye “ALL · Network overview” chuno. Agle site ke liye ${K('›')} tap karo.` },
  },
  {
    ico: 'mapPin',
    en: { t: 'Inspect anything', d: 'Tap (or hover, on desktop) a truck, forklift, pallet, dock, charger or building to see its label. Tap again to open its detail panel.' },
    hi: { t: 'कुछ भी देखें', d: 'ट्रक, फोर्कलिफ्ट, पैलेट, डॉक, चार्जर या बिल्डिंग को टैप (डेस्कटॉप पर होवर) करके लेबल देखें। विवरण पैनल खोलने के लिए फिर से टैप करें।' },
    hg: { t: 'Kuch bhi dekho', d: 'Truck, forklift, pallet, dock, charger ya building ko tap (desktop pe hover) karke label dekho. Detail panel kholne ke liye phir se tap karo.' },
  },
  {
    ico: 'close',
    en: { t: 'Close a panel', d: `Tap ${K('✕')} in the panel, or — on mobile — tap empty ground.` },
    hi: { t: 'पैनल बंद करें', d: `पैनल में ${K('✕')} टैप करें, या — मोबाइल पर — खाली जगह टैप करें।` },
    hg: { t: 'Panel band karo', d: `Panel mein ${K('✕')} tap karo, ya — mobile pe — khali jagah tap karo.` },
  },
  {
    ico: 'search',
    en: { t: 'Search', d: `On desktop, press ${K('/')} to search. On mobile, tap the search icon. Search sites, trucks, forklifts, pallets and shipments.` },
    hi: { t: 'खोज', d: `डेस्कटॉप पर ${K('/')} दबाकर खोजें। मोबाइल पर खोज आइकन टैप करें। साइट, ट्रक, फोर्कलिफ्ट, पैलेट और शिपमेंट खोजें।` },
    hg: { t: 'Khoj', d: `Desktop pe ${K('/')} dabaakar khojo. Mobile pe search icon tap karo. Site, truck, forklift, pallet aur shipment khojo.` },
  },
  {
    ico: 'dock',
    en: { t: 'Fleet tabs', d: 'Use the Docks / Forklifts / Trucks tabs to browse the fleet; tap a row to fly the camera to that entity.' },
    hi: { t: 'फ्लीट टैब', d: 'फ्लीट ब्राउज़ करने के लिए Docks / Forklifts / Trucks टैब इस्तेमाल करें; किसी एंटिटी तक जाने के लिए रो टैप करें।' },
    hg: { t: 'Fleet tabs', d: 'Fleet browse karne ke liye Docks / Forklifts / Trucks tabs use karo; kisi entity tak jaane ke liye row tap karo.' },
  },
  {
    ico: 'crosshair',
    en: { t: 'Locate & follow', d: `In a truck or forklift panel, tap ${K('⌖')} to locate it, or ${K('↗')} to make the camera follow it as it moves.` },
    hi: { t: 'लोकेट और फॉलो', d: `ट्रक या फोर्कलिफ्ट पैनल में ${K('⌖')} से लोकेट करें, या ${K('↗')} से कैमरा उसका फॉलो करे।` },
    hg: { t: 'Locate aur follow', d: `Truck ya forklift panel mein ${K('⌖')} se locate karo, ya ${K('↗')} se camera uska follow kare.` },
  },
  {
    ico: 'clock',
    en: { t: 'Live simulation', d: 'The clock ticks, trucks drive and dock, forklifts shuttle pallets, and batteries charge — all in real time.' },
    hi: { t: 'लाइव सिमुलेशन', d: 'घड़ी चलती है, ट्रक चलते-डॉक होते हैं, फोर्कलिफ्ट पैलेट खिसकाते हैं, बैटरी चार्ज होती है — सब कुछ रियल-टाइम में।' },
    hg: { t: 'Live simulation', d: 'Ghadi chalti hai, truck chalte-dock hote hain, forklift pallet khisakate hain, battery charge hoti hai — sab kuch real-time mein.' },
  },
]

// ───────────────────────────── glossary (every real term) ─────────────────────────────
// Each group: { ico, title:{en,hi,hg}, items: [{ t:{en,hi,hg}, d:{en,hi,hg} }] }
export const GLOSSARY = [
  {
    ico: 'warehouse',
    title: { en: 'Sites & network', hi: 'साइट और नेटवर्क', hg: 'Site aur network' },
    items: [
      { t: { en: 'Depot (WH-01)', hi: 'डिपो (WH-01)', hg: 'Depot (WH-01)' },
        d: { en: 'A warehouse that stores goods and ships them out to customers.', hi: 'ऐसा गोदाम जो माल रखता है और ग्राहकों को भेजता है।', hg: 'Aisa godaam jo maal rakhta hai aur customers ko bhejta hai.' } },
      { t: { en: 'Distribution Center (WH-02)', hi: 'डिस्ट्रीब्यूशन सेंटर (WH-02)', hg: 'Distribution Center (WH-02)' },
        d: { en: 'A hub that receives goods from many suppliers and quickly sends them onward to stores or customers.', hi: 'हब जो कई सप्लायर से माल लेता है और जल्दी आगे स्टोर या ग्राहक तक भेजता है।', hg: 'Hub jo kayi supplier se maal leta hai aur jaldi aage store ya customer tak bhejta hai.' } },
      { t: { en: 'Cold Store (WH-03)', hi: 'कोल्ड स्टोर (WH-03)', hg: 'Cold Store (WH-03)' },
        d: { en: 'A refrigerated warehouse for perishable goods (frozen food, dairy); keeps temperature low so goods do not spoil.', hi: 'खराब होने वाले माल (फ्रोजन फूड, डेयरी) के लिए ठंडा गोदाम; तापमान कम रखता है।', hg: 'Kharab hone wale maal (frozen food, dairy) ke liye thanda godaam; temperature kam rakhta hai.' } },
      { t: { en: 'Cross-dock (WH-04)', hi: 'क्रॉस-डॉक (WH-04)', hg: 'Cross-dock (WH-04)' },
        d: { en: 'A warehouse where incoming goods go almost straight to outgoing trucks, with very little storage.', hi: 'गोदाम जहाँ आने वाला माल लगभग सीधे जाने वाले ट्रक में चला जाता है, ज़्यादा स्टोर नहीं होता।', hg: 'Godaam jahan aane wala maal lagbhag seedhe jaane wale truck mein chala jaata hai, zyada store nahi hota.' } },
      { t: { en: 'Automated DC (WH-05)', hi: 'ऑटोमेटेड DC (WH-05)', hg: 'Automated DC (WH-05)' },
        d: { en: 'A warehouse that uses robots/automation to move goods around, with little manual forklift work.', hi: 'गोदाम जो माल खिसकाने के लिए रोबोट/ऑटोमेशन इस्तेमाल करता है, कम हाथ से काम।', hg: 'Godaam jo maal khisakane ke liye robot/automation use karta hai, kam haath se kaam.' } },
      { t: { en: 'Network overview', hi: 'नेटवर्क ओवरव्यू', hg: 'Network overview' },
        d: { en: 'A bird’s-eye view of all five warehouses together — pick “ALL” in the site selector to see it.', hi: 'सभी पाँच गोदामों का ऊपर से नज़ारा — साइट सिलेक्टर में “ALL” चुनें।', hg: 'Saari paanch godaamon ka upar se nazara — site selector mein “ALL” chuno.' } },
      { t: { en: 'Operational', hi: 'ऑपरेशनल', hg: 'Operational' },
        d: { en: 'The site is running normally — not down or broken.', hi: 'साइट सामान्य रूप से चल रही है — बंद या खराब नहीं।', hg: 'Site normal chal rahi hai — band ya kharab nahi.' } },
    ],
  },
  {
    ico: 'cube',
    title: { en: 'Site metrics', hi: 'साइट आंकड़े', hg: 'Site metrics' },
    items: [
      { t: { en: 'Stock on hand', hi: 'स्टॉक ऑन हैंड', hg: 'Stock on hand' },
        d: { en: 'Total units (pallets/bags) currently stored in the warehouse.', hi: 'गोदाम में अभी मौजूद कुल यूनिट (पैलेट/बोरी)।', hg: 'Godaam mein abhi maujood total units (pallet/bori).' } },
      { t: { en: 'Capacity', hi: 'क्षमता', hg: 'Capacity' },
        d: { en: 'The maximum units the warehouse can hold.', hi: 'गोदाम में रखे जा सकने वाले अधिकतम यूनिट।', hg: 'Godaam mein rakhe ja sakte wale max units.' } },
      { t: { en: '% full', hi: '% भरा', hg: '% full' },
        d: { en: 'Stock divided by capacity — how full the warehouse is.', hi: 'स्टॉक को क्षमता से भाग — गोदाम कितना भरा है।', hg: 'Stock ko capacity se bhaag — godaam kitna bhara hai.' } },
      { t: { en: 'Truck bays (e.g. 2/2 busy)', hi: 'ट्रक बे (जैसे 2/2 बिज़ी)', hg: 'Truck bays (jaise 2/2 busy)' },
        d: { en: 'How many loading bays are occupied by trucks, out of the total bays.', hi: 'कुल बे में से कितने बे में ट्रक खड़े हैं।', hg: 'Total bay mein se kitne bay mein truck khade hain.' } },
      { t: { en: 'Outbound today', hi: 'आउटबाउंड आज', hg: 'Outbound today' },
        d: { en: 'Number of trucks that left (or will leave) today carrying goods out.', hi: 'आज माल लेकर निकलने वाले (या निकले) ट्रकों की संख्या।', hg: 'Aaj maal lekar nikalne wale (ya nikle) trucks ki sankhya.' } },
      { t: { en: 'Put-aways today', hi: 'पुट-अवे आज', hg: 'Put-aways today' },
        d: { en: 'Incoming pallets that were moved from the dock to their storage slot today.', hi: 'आज डॉक से स्टोर जगह तक खिसकाए गए आने वाले पैलेट।', hg: 'Aaj dock se store jagah tak khisakaye gaye aane wale pallet.' } },
      { t: { en: 'On-time delivery %', hi: 'ऑन-टाइम डिलीवरी %', hg: 'On-time delivery %' },
        d: { en: 'Share of shipments delivered by their promised time — the key health metric.', hi: 'वादा किए समय पर डिलीवर हुए शिपमेंट का हिस्सा — मुख्य सेहत आंकड़ा।', hg: 'Wada kiye time pe deliver hue shipment ka hissa — main health metric.' } },
      { t: { en: 'Forklift fleet (e.g. 1/2 working)', hi: 'फोर्कलिफ्ट फ्लीट (जैसे 1/2 काम कर रहे)', hg: 'Forklift fleet (jaise 1/2 working)' },
        d: { en: 'How many forklifts are actively working, out of the total available.', hi: 'कुल उपलब्ध में से कितने फोर्कलिफ्ट असल में काम कर रहे हैं।', hg: 'Total available mein se kitne forklift asal mein kaam kar rahe hain.' } },
      { t: { en: 'docked', hi: 'डॉक्ड', hg: 'docked' },
        d: { en: 'Trucks currently parked at a bay loading or unloading.', hi: 'ऐसे ट्रक जो अभी किसी बे में लोड/अनलोड हो रहे हैं।', hg: 'Aise truck jo abhi kisi bay mein load/unload ho rahe hain.' } },
      { t: { en: 'arriving', hi: 'आ रहा', hg: 'arriving' },
        d: { en: 'Trucks on their way to the warehouse — en route, at the gate, or reversing in.', hi: 'गोदाम की ओर आ रहे ट्रक — रास्ते में, गेट पर, या लौट रहे।', hg: 'Godaam ki ore aate truck — raste mein, gate pe, ya laut rahe.' } },
      { t: { en: 'staged', hi: 'स्टेज्ड', hg: 'staged' },
        d: { en: 'Pallets sitting in the yard, waiting to be put away or loaded.', hi: 'ऐसे पैलेट जो बाहर खड़े हैं, स्टोर या लोड होने का इंतज़ार।', hg: 'Aise pallet jo bahar khade hain, store ya load hone ka intezaar.' } },
    ],
  },
  {
    ico: 'box',
    title: { en: 'Inventory', hi: 'इन्वेंटरी', hg: 'Inventory' },
    items: [
      { t: { en: 'SKU', hi: 'SKU', hg: 'SKU' },
        d: { en: 'A unique code for one type of product (e.g. CEM-UT-50 = UltraTech cement 50 kg bag).', hi: 'एक तरह के माल का विशेष कोड (जैसे CEM-UT-50 = अल्ट्राटेक सीमेंट 50 किलो बोरी)।', hg: 'Ek tarah ke maal ka code (jaise CEM-UT-50 = UltraTech cement 50 kg bori).' } },
      { t: { en: 'Pallet (LPN)', hi: 'पैलेट (LPN)', hg: 'Pallet (LPN)' },
        d: { en: 'A wooden base stacked with goods, moved as one unit. LPN is its tracking number.', hi: 'लकड़ी का आधार जिस पर माल रखा हो, एक इकाई की तरह खिसकता है। LPN उसका ट्रैकिंग नंबर।', hg: 'Lakdi ka aadhar jispe maal rakha ho, ek unit ki tarah khisakta hai. LPN uska tracking number.' } },
      { t: { en: 'Quantity', hi: 'मात्रा', hg: 'Quantity' },
        d: { en: 'Number of units/bags on a pallet.', hi: 'एक पैलेट पर यूनिट/बोरियों की संख्या।', hg: 'Ek pallet pe units/boriyon ki sankhya.' } },
      { t: { en: 'Gross weight', hi: 'सकल वज़न', hg: 'Gross weight' },
        d: { en: 'Total weight of the pallet — goods + packaging + the pallet itself.', hi: 'पैलेट का कुल वज़न — माल + पैकेजिंग + पैलेट।', hg: 'Pallet ka total weight — maal + packaging + pallet.' } },
      { t: { en: 'Lot', hi: 'लॉट', hg: 'Lot' },
        d: { en: 'A batch number for tracing goods of the same production run.', hi: 'एक ही बैच के माल को पहचानने का नंबर।', hg: 'Ek hi batch ke maal ko pehchanne ka number.' } },
      { t: { en: 'In Stock', hi: 'इन स्टॉक', hg: 'In Stock' },
        d: { en: 'Enough quantity of that SKU is available.', hi: 'उस SKU की काफी मात्रा उपलब्ध है।', hg: 'Us SKU ki kaafi maatra available hai.' } },
      { t: { en: 'Low Stock', hi: 'लो स्टॉक', hg: 'Low Stock' },
        d: { en: 'Quantity is below the minimum level — reorder soon, before it runs out.', hi: 'मात्रा न्यूनतम से कम है — खत्म होने से पहले जल्दी ऑर्डर करें।', hg: 'Maatra minimum se kam hai — khatam hone se pehle jaldi order karo.' } },
    ],
  },
  {
    ico: 'dock',
    title: { en: 'Docks', hi: 'डॉक', hg: 'Docks' },
    items: [
      { t: { en: 'Dock bay', hi: 'डॉक बे', hg: 'Dock bay' },
        d: { en: 'A loading door where a truck parks to load or unload goods.', hi: 'लोडिंग दरवाज़ा जहाँ ट्रक खड़ा होकर माल ले/दे।', hg: 'Loading darwaza jahan truck khada hokar maal le/de.' } },
      { t: { en: 'Bay 1 / Bay 2 / In 1 / Out 1', hi: 'Bay 1 / Bay 2 / In 1 / Out 1', hg: 'Bay 1 / Bay 2 / In 1 / Out 1' },
        d: { en: 'Names of specific dock doors. “In” = inbound (unloading), “Out” = outbound (loading).', hi: 'खास डॉक दरवाज़ों के नाम। “In” = आने वाला (अनलोड), “Out” = जाने वाला (लोड)।', hg: 'Khaas dock darwazon ke naam. “In” = aane wala (unload), “Out” = jaane wala (load).' } },
      { t: { en: 'Available', hi: 'अवेलेबल', hg: 'Available' },
        d: { en: 'The bay is free and ready for a truck.', hi: 'बे खाली है, ट्रक के लिए तैयार।', hg: 'Bay khali hai, truck ke liye taiyaar.' } },
      { t: { en: 'Booked', hi: 'बुक्ड', hg: 'Booked' },
        d: { en: 'A truck is expected to arrive at this bay soon.', hi: 'कोई ट्रक जल्द इस बे पर आने वाला है।', hg: 'Koi truck jald is bay pe aane wala hai.' } },
      { t: { en: 'Docking', hi: 'डॉकिंग', hg: 'Docking' },
        d: { en: 'A truck is reversing into the bay right now.', hi: 'ट्रक अभी बे में पीछे आ रहा है।', hg: 'Truck abhi bay mein peeche aa raha hai.' } },
      { t: { en: 'Loading / Unloading', hi: 'लोडिंग / अनलोडिंग', hg: 'Loading / Unloading' },
        d: { en: 'A truck is at the bay being filled (loading) or emptied (unloading).', hi: 'ट्रक बे पर भरा (लोड) या खाली (अनलोड) हो रहा है।', hg: 'Truck bay pe bhara (load) ya khali (unload) ho raha hai.' } },
      { t: { en: 'Rear doors', hi: 'रियर डोर', hg: 'Rear doors' },
        d: { en: 'Whether the truck’s back doors are open (so a forklift can load it).', hi: 'ट्रक के पिछले दरवाज़े खुल हैं या नहीं (ताकि फोर्कलिफ्ट लोड कर सके)।', hg: 'Truck ke pichhle darwaze khule hain ya nahi (taaki forklift load kar sake).' } },
      { t: { en: 'Trucks today', hi: 'आज के ट्रक', hg: 'Trucks today' },
        d: { en: 'How many trucks used this bay today.', hi: 'आज इस बे पर कितने ट्रक आए।', hg: 'Aaj is bay pe kitne truck aaye.' } },
    ],
  },
  {
    ico: 'forklift',
    title: { en: 'Forklifts', hi: 'फोर्कलिफ्ट', hg: 'Forklifts' },
    items: [
      { t: { en: 'Forklift', hi: 'फोर्कलिफ्ट', hg: 'Forklift' },
        d: { en: 'A small powered vehicle that lifts and moves pallets around the yard.', hi: 'छोटा वाहन जो पैलेट उठाकर आंगन में खिसकाता है।', hg: 'Chhota vehicle jo pallet uthaakar aangan mein khisakata hai.' } },
      { t: { en: 'Loading / Unloading truck', hi: 'ट्रक लोड / अनलोड', hg: 'Loading / Unloading truck' },
        d: { en: 'The forklift is moving pallets onto (loading) or off (unloading) a truck.', hi: 'फोर्कलिफ्ट पैलेट ट्रक पर रख (लोड) या उतार (अनलोड) रहा है।', hg: 'Forklift pallet truck pe rakh (load) ya utaar (unload) raha hai.' } },
      { t: { en: 'Charging', hi: 'चार्जिंग', hg: 'Charging' },
        d: { en: 'The forklift is plugged in to recharge its battery — it is offline while charging.', hi: 'फोर्कलिफ्ट बैटरी भरने के लिए लगा है — चार्ज होने तक बंद।', hg: 'Forklift battery bharne ke liye laga hai — charge hone tak band.' } },
      { t: { en: 'Idle', hi: 'आइडल', hg: 'Idle' },
        d: { en: 'The forklift is available but not currently doing a job.', hi: 'फोर्कलिफ्ट उपलब्ध है पर अभी काम नहीं कर रहा।', hg: 'Forklift available hai par abhi kaam nahi kar raha.' } },
      { t: { en: 'Battery %', hi: 'बैटरी %', hg: 'Battery %' },
        d: { en: 'How much charge is left. Below ~25% the forklift should go charge.', hi: 'कितना चार्ज बचा। ~25% से कम पर फोर्कलिफ्ट चार्ज होने जाना चाहिए।', hg: 'Kitna charge bacha. ~25% se kam par forklift charge hone jaana chahiye.' } },
      { t: { en: 'Moves today', hi: 'आज के मूव्स', hg: 'Moves today' },
        d: { en: 'How many pallet moves this forklift has done today.', hi: 'इस फोर्कलिफ्ट ने आज कितने पैलेट खिसकाए।', hg: 'Is forklift ne aaj kitne pallet khisakaye.' } },
      { t: { en: 'Charger', hi: 'चार्जर', hg: 'Charger' },
        d: { en: 'The station where a forklift plugs in to recharge.', hi: 'वह जगह जहाँ फोर्कलिफ्ट चार्ज होने के लिए लगता है।', hg: 'Woh jagah jahan forklift charge hone ke liye lagta hai.' } },
    ],
  },
  {
    ico: 'truck',
    title: { en: 'Trucks', hi: 'ट्रक', hg: 'Trucks' },
    items: [
      { t: { en: 'Truck', hi: 'ट्रक', hg: 'Truck' },
        d: { en: 'A vehicle that carries goods between the warehouse and customers or suppliers.', hi: 'वाहन जो गोदाम और ग्राहक/सप्लायर के बीच माल ले जाता है।', hg: 'Vehicle jo godaam aur customer/supplier ke beech maal le jaata hai.' } },
      { t: { en: 'Carrier', hi: 'कैरियर', hg: 'Carrier' },
        d: { en: 'The transport company running the truck (e.g. VRL Logistics, TCI Express, Blue Dart, Allcargo).', hi: 'ट्रक चलाने वाली ट्रांसपोर्ट कंपनी (जैसे VRL Logistics, TCI Express, Blue Dart, Allcargo)।', hg: 'Truck chalane wali transport company (jaise VRL Logistics, TCI Express, Blue Dart, Allcargo).' } },
      { t: { en: 'En route', hi: 'एन रूट', hg: 'En route' },
        d: { en: 'The truck is driving toward the warehouse.', hi: 'ट्रक गोदाम की ओर चल रहा है।', hg: 'Truck godaam ki ore chal raha hai.' } },
      { t: { en: 'At gate', hi: 'गेट पर', hg: 'At gate' },
        d: { en: 'The truck has arrived at the warehouse gate and is waiting to enter.', hi: 'ट्रक गोदाम के गेट पर पहुँच गया है, अंदर जाने का इंतज़ार।', hg: 'Truck godaam ke gate pe pahunch gaya, andar jaane ka intezaar.' } },
      { t: { en: 'Docking', hi: 'डॉकिंग', hg: 'Docking' },
        d: { en: 'The truck is reversing into a dock bay.', hi: 'ट्रक बे में पीछे घुस रहा है।', hg: 'Truck bay mein peeche ghus raha hai.' } },
      { t: { en: 'Unloading / Loading', hi: 'अनलोडिंग / लोडिंग', hg: 'Unloading / Loading' },
        d: { en: 'The truck is at a bay being emptied (unloading) or filled (loading).', hi: 'ट्रक बे पर खाली (अनलोड) या भरा (लोड) हो रहा है।', hg: 'Truck bay pe khali (unload) ya bhara (load) ho raha hai.' } },
      { t: { en: 'Departing', hi: 'डिपार्टिंग', hg: 'Departing' },
        d: { en: 'The truck has finished at the dock and is leaving.', hi: 'ट्रक ने काम पूरा किया और निकल रहा है।', hg: 'Truck ne kaam poora kiya aur nikal raha hai.' } },
      { t: { en: 'ETA', hi: 'ETA', hg: 'ETA' },
        d: { en: 'Estimated time of arrival — how many minutes until the truck arrives or finishes.', hi: 'अनुमानित आने का समय — ट्रक के आने या काम पूरा होने के मिनट।', hg: 'Estimated aane ka time — truck ke aane ya kaam poore hone ke minutes.' } },
      { t: { en: 'Shipment', hi: 'शिपमेंट', hg: 'Shipment' },
        d: { en: 'The order being carried by this truck.', hi: 'इस ट्रक से जा रहा ऑर्डर।', hg: 'Is truck se ja raha order.' } },
      { t: { en: 'Customer', hi: 'ग्राहक', hg: 'Customer' },
        d: { en: 'Who the goods are going to (outbound) or coming from (inbound).', hi: 'जिसे माल जा रहा है (आउटबाउंड) या जिससे आ रहा है (इनबाउंड)।', hg: 'Jise maal ja raha hai (outbound) ya jis se aa raha hai (inbound).' } },
      { t: { en: 'Destination', hi: 'गंतव्य', hg: 'Destination' },
        d: { en: 'Where the shipment is headed (a city or site).', hi: 'शिपमेंट जहाँ जाना है (शहर या साइट)।', hg: 'Shipment jahan jaana hai (sheher ya site).' } },
      { t: { en: 'Cargo (e.g. 3/7 pallets · 1.2 t)', hi: 'कार्गो (जैसे 3/7 पैलेट · 1.2 t)', hg: 'Cargo (jaise 3/7 pallet · 1.2 t)' },
        d: { en: 'Pallets on the truck now, out of its capacity, and total weight in tonnes.', hi: 'ट्रक पर अभी पैलेट, क्षमता के मुकाबले, और कुल वज़न टन में।', hg: 'Truck pe abhi pallet, capacity ke mukable, aur total weight ton mein.' } },
      { t: { en: 'Progress (e.g. 2/6)', hi: 'प्रोग्रेस (जैसे 2/6)', hg: 'Progress (jaise 2/6)' },
        d: { en: 'Pallets moved so far, out of the total to move for this truck.', hi: 'अभी तक खिसकाए पैलेट, कुल खिसकाने वालों में से।', hg: 'Abhi tak khisakaye pallet, total khisakane walon mein se.' } },
    ],
  },
  {
    ico: 'route',
    title: { en: 'Shipments', hi: 'शिपमेंट', hg: 'Shipments' },
    items: [
      { t: { en: 'Order Confirmed', hi: 'ऑर्डर कन्फर्मड', hg: 'Order Confirmed' },
        d: { en: 'The order was received and accepted.', hi: 'ऑर्डर मिला और स्वीकार हुआ।', hg: 'Order mila aur accept hua.' } },
      { t: { en: 'Picked', hi: 'पिक्ड', hg: 'Picked' },
        d: { en: 'The goods were collected from storage.', hi: 'माल स्टोर से निकाल लिया गया।', hg: 'Maal store se nikaal liya gaya.' } },
      { t: { en: 'Loading', hi: 'लोडिंग', hg: 'Loading' },
        d: { en: 'Goods are being loaded onto the truck.', hi: 'माल ट्रक पर लादा जा रहा है।', hg: 'Maal truck pe laada ja raha hai.' } },
      { t: { en: 'In Transit', hi: 'इन ट्रांज़िट', hg: 'In Transit' },
        d: { en: 'The truck is on its way to the destination.', hi: 'ट्रक गंतव्य की ओर रास्ते में है।', hg: 'Truck destination ki ore raste mein hai.' } },
      { t: { en: 'Delivered', hi: 'डिलीवर्ड', hg: 'Delivered' },
        d: { en: 'The goods reached the destination.', hi: 'माल गंतव्य पर पहुँच गया।', hg: 'Maal destination pe pahunch gaya.' } },
      { t: { en: 'Inbound', hi: 'इनबाउंड', hg: 'Inbound' },
        d: { en: 'Goods coming INTO the warehouse (a truck unloading here).', hi: 'गोदाम में आने वाला माल (यहाँ अनलोड होता ट्रक)।', hg: 'Godaam mein aane wala maal (yahan unload hota truck).' } },
      { t: { en: 'Outbound', hi: 'आउटबाउंड', hg: 'Outbound' },
        d: { en: 'Goods going OUT of the warehouse (a truck loading here).', hi: 'गोदाम से जाने वाला माल (यहाँ लोड होता ट्रक)।', hg: 'Godaam se jaane wala maal (yahan load hota truck).' } },
    ],
  },
  {
    ico: 'info',
    title: { en: 'Interface', hi: 'इंटरफ़ेस', hg: 'Interface' },
    items: [
      { t: { en: 'Live clock', hi: 'लाइव घड़ी', hg: 'Live clock' },
        d: { en: 'The simulation’s current time (runs faster than real time). ETAs and statuses update against it.', hi: 'सिमुलेशन का मौजूदा समय (असली समय से तेज़)। ETA और स्टेटस इसी पर अपडेट होते हैं।', hg: 'Simulation ka current time (asli time se tez). ETA aur status isi pe update hote hain.' } },
      { t: { en: 'Site selector', hi: 'साइट सिलेक्टर', hg: 'Site selector' },
        d: { en: 'The WH-0x badge in the top bar — tap it to switch warehouses.', hi: 'टॉप बार में WH-0x बैज — साइट बदलने के लिए टैप करें।', hg: 'Top bar mein WH-0x badge — site badalne ke liye tap karo.' } },
      { t: { en: 'Search', hi: 'खोज', hg: 'Search' },
        d: { en: 'Find any site, truck, forklift, pallet or shipment by name or code.', hi: 'नाम या कोड से कोई भी साइट, ट्रक, फोर्कलिफ्ट, पैलेट या शिपमेंट खोजें।', hg: 'Naam ya code se koi bhi site, truck, forklift, pallet ya shipment khojo.' } },
      { t: { en: 'Notifications', hi: 'नोटिफिकेशन', hg: 'Notifications' },
        d: { en: 'Alerts about low stock, arriving trucks, deliveries and battery warnings — the bell icon.', hi: 'लो स्टॉक, आते ट्रक, डिलीवरी और बैटरी चेतावनी — घंटी आइकन।', hg: 'Low stock, aate truck, delivery aur battery warning — bell icon.' } },
      { t: { en: 'Profile', hi: 'प्रोफ़ाइल', hg: 'Profile' },
        d: { en: 'The signed-in user (Alex Chen, Operations Manager) — tap the avatar to see account info.', hi: 'साइन-इन यूज़र (Alex Chen, Operations Manager) — जानकारी के लिए अवतार टैप करें।', hg: 'Sign-in user (Alex Chen, Operations Manager) — info ke liye avatar tap karo.' } },
      { t: { en: 'Map controls (+ − ⟲ ⟳ ⌂)', hi: 'मैप कंट्रोल (+ − ⟲ ⟳ ⌂)', hg: 'Map controls (+ − ⟲ ⟳ ⌂)' },
        d: { en: 'Zoom in/out, rotate left/right, and reset the 3D view to the current site.', hi: 'ज़ूम इन/आउट, रोटेट लेफ्ट/राइट, और व्यू मौजूदा साइट पर रीसेट।', hg: 'Zoom in/out, rotate left/right, aur view maujooda site pe reset.' } },
      { t: { en: 'Details / Fleet / Shipment tabs', hi: 'Details / Fleet / Shipment टैब', hg: 'Details / Fleet / Shipment tabs' },
        d: { en: 'The three sections of the overlay: the current entity’s detail, the fleet list, and shipment tracking.', hi: 'ओवरले के तीन हिस्से: मौजूदा एंटिटी का विवरण, फ्लीट लिस्ट, और शिपमेंट ट्रैकिंग।', hg: 'Overlay ke teen hisse: current entity ka detail, fleet list, aur shipment tracking.' } },
      { t: { en: 'Locate (⌖)', hi: 'लोकेट (⌖)', hg: 'Locate (⌖)' },
        d: { en: 'Fly the camera to focus on an entity.', hi: 'कैमरा किसी एंटिटी पर ले जाएँ।', hg: 'Camera kisi entity pe le jaaye.' } },
      { t: { en: 'Follow (↗)', hi: 'फॉलो (↗)', hg: 'Follow (↗)' },
        d: { en: 'Make the camera track a moving truck or forklift as it drives around.', hi: 'कैमरा किसी चलते ट्रक/फोर्कलिफ्ट का फॉलो करे।', hg: 'Camera kisi chalte truck/forklift ka follow kare.' } },
    ],
  },
]

// ───────────────────────────── general warehouse-management tips ─────────────────────────────
export const TIPS = [
  {
    ico: 'alert',
    title: { en: 'Reorder before it hits zero', hi: 'खत्म होने से पहले ऑर्डर करें', hg: 'Khatam hone se pehle order karo' },
    body: { en: 'Low Stock means a SKU is below its minimum. Reorder now, before it hits zero — a stockout stops outbound shipments and breaks on-time delivery. A good rule: set the reorder point at about 1.5× the usage during supplier lead time.', hi: 'लो स्टॉक का मतलब SKU न्यूनतम से नीचे है। खत्म होने से पहले ऑर्डर करें — स्टॉकआउट आउटबाउंड रोकता है और ऑन-टाइम डिलीवरी खराब करता है। नियम: सप्लायर लीड-टाइम के इस्तेमाल का ~1.5 गुना पर रीऑर्डर पॉइंट रखें।', hg: 'Low stock matlab SKU minimum se neeche hai. Khatam hone se pehle order karo — stockout outbound rokta hai aur on-time delivery kharab karta hai. Rule: supplier lead-time ke use ka ~1.5 guna pe reorder point rakho.' },
  },
  {
    ico: 'dock',
    title: { en: 'Watch bay utilization', hi: 'बे इस्तेमाल पर नज़र रखें', hg: 'Bay use par nazar rakho' },
    body: { en: 'If all bays stay busy for long, incoming trucks queue at the gate and outbound trucks wait to load. A bay occupied more than ~45 minutes is a warning sign — find out why (slow forklift, paperwork, partial load) and clear it.', hi: 'अगर सभी बे लंबे समय बिज़ी रहें, तो आने वाले ट्रक गेट पर लाइन और आउटबाउंड लोड का इंतज़ार। कोई बे ~45 मिनट से ज़्यादा भरा चेतावनी है — कारण खोजें (धीमा फोर्कलिफ्ट, कागज़ी काम, आधा-लोड) और खाली करें।', hg: 'Agar saare bay lambe samay busy rahe, toh aane wale truck gate pe line aur outbound load ka intezaar. Koi bay ~45 min se zyada bhara warning hai — kaaran khojo (dheema forklift, kaagazi kaam, aadha-load) aur khali karo.' },
  },
  {
    ico: 'forklift',
    title: { en: 'Forklift count = throughput', hi: 'फोर्कलिफ्ट संख्या = थ्रूपुट', hg: 'Forklift sankhya = throughput' },
    body: { en: '“1/2 working” means half your pallet-moving capacity is gone (charging, idle, broken). During peak loading you want every forklift moving — dead forklifts mean trucks waiting at bays.', hi: '“1/2 काम कर रहे” का मतलब आधी पैलेट-मूव क्षमता गई (चार्ज, आइडल, खराब)। पीक लोडिंग में हर फोर्कलिफ्ट चलना चाहिए — बंद फोर्कलिफ्ट मतलब बे पर ट्रक इंतज़ार।', hg: '“1/2 working” matlab aadhi pallet-move capacity gayi (charge, idle, kharab). Peak loading mein har forklift chalna chahiye — band forklift matlab bay pe truck intezaar.' },
  },
  {
    ico: 'cube',
    title: { en: 'Balance put-aways vs outbound', hi: 'पुट-अवे और आउटबाउंड संतुलन', hg: 'Put-away aur outbound balance' },
    body: { en: 'If put-aways fall behind, pallets pile up in staging and get lost or damaged. If outbound runs ahead of put-aways, you may ship stock you have not recorded — causing inventory errors. Keep the two roughly matched through the day.', hi: 'अगर पुट-अवे पीछे रहें, पैलेट स्टेजिंग में जमेंगे और खो/खराब होंगे। अगर आउटबाउंट पुट-अवे से आगे, तो बिना रिकॉर्ड माल भेज सकते हैं — इन्वेंटरी गलती। दोनों दिन भर करीब मैच रखें।', hg: 'Agar put-away peeche rahe, pallet staging mein jammenge aur kho/kharab honge. Agar outbound put-away se aage, toh bina record maal bhej sakte hain — inventory galti. Dono din bhar kareeb match rakho.' },
  },
  {
    ico: 'clock',
    title: { en: 'On-time % is overall health', hi: 'ऑन-टाइम % पूरी सेहत', hg: 'On-time % poori health' },
    body: { en: 'On-time delivery % drops when docks are slow, forklifts are down, or stock runs out. Track it daily — a sudden dip usually traces back to one of those three root causes.', hi: 'ऑन-टाइम डिलीवरी % गिरता है जब डॉक धीमे, फोर्कलिफ्ट बंद, या स्टॉक खत्म। रोज़ देखें — अचानक गिरावट आमतौर पर इन्हीं तीन कारणों में से।', hg: 'On-time delivery % girta hai jab dock dheeme, forklift band, ya stock khatam. Roz dekho — achanak giravat aamtaur par inhi teen kaaron mein se.' },
  },
  {
    ico: 'mapPin',
    title: { en: 'Staging is a pulse', hi: 'स्टेजिंग एक नब्ज़', hg: 'Staging ek nabz' },
    body: { en: 'A rising staged count means inbound is not keeping up with arrivals — pallets wait in the yard instead of going to storage. Clear staging before it spills into aisles and slows everything down.', hi: 'बढ़ता स्टेज्ड काउंट मतलब इनबाउंड आने से पीछे — पैलेट आंगन में ठहरें, स्टोर नहीं जाते। बढ़ने से पहले स्टेजिंग खाली करें, वरना गलियारा जाम।', hg: 'Badhata staged count matlab inbound aane se peeche — pallet aangan mein thehre, store nahi jaate. Badhne se pehle staging khali karo, warna galiyaara jaam.' },
  },
  {
    ico: 'bolt',
    title: { en: 'Prioritize when everything breaks at once', hi: 'सब एक साथ खराब हो तो प्राथमिकता', hg: 'Sab ek saath kharab ho toh priority' },
    body: { en: 'Fix a stuck dock first (it blocks every truck behind it), then a low-stock item that blocks outbound, then a single delayed truck. One stuck dock can cascade into ten late deliveries.', hi: 'पहले अटके डॉक को ठीक करें (हर पीछे वाले ट्रक को रोकता है), फिर आउटबाउंड रोकने वाला लो स्टॉक, फिर एक लेट ट्रक। एक अटका डॉक दस लेट डिलीवरी बन सकता है।', hg: 'Pehle atke dock ko theek karo (har peeche wale truck ko rokta hai), phir outbound rokne wala low stock, phir ek late truck. Ek atka dock das late delivery ban sakta hai.' },
  },
  {
    ico: 'battery',
    title: { en: 'Charge between peaks', hi: 'पीक के बीच चार्ज करें', hg: 'Peak ke beech charge karo' },
    body: { en: 'Send forklifts to charge during lulls, not during peak loading. A flat battery at peak is a bottleneck that ripples to every truck at the bays.', hi: 'फोर्कलिफ्ट को फुर्सत में चार्ज करें, पीक लोडिंग में नहीं। पीक पर खाली बैटरी एक बाधा जो हर बे वाले ट्रक तक फैलती है।', hg: 'Forklift ko fursat mein charge karo, peak loading mein nahi. Peak pe khali battery ek baadha jo har bay wale truck tak failti hai.' },
  },
]

// ───────────────────────────── contextual tips (keyed, short) ─────────────────────────────
// Rendered by the lightbulb buttons next to specific stats/panels (tip.js).
export const CONTEXT_TIPS = {
  stock: {
    en: 'Stock on hand is everything currently in the warehouse. Compare it to capacity to see how full you are — too full means slow put-aways, too empty means stockouts. Keep it between the safety floor and the slot limit.',
    hi: 'स्टॉक ऑन हैंड गोदाम में अभी मौजूद सारा माल है। क्षमता से तुलना करें — बहुत भरा मतलब धीमे पुट-अवे, बहुत खाली मतलब स्टॉकआउट। सेफ्टी लेवल और स्लॉट लिमिट के बीच रखें।',
    hg: 'Stock on hand godaam mein abhi maujood saara maal hai. Capacity se tulna karo — bahut bhara matlab dheeme put-away, bahut khali matlab stockout. Safety level aur slot limit ke beech rakho.',
  },
  truck_bays: {
    en: '“2/2 busy” means every loading door is occupied — no truck can enter until one frees up. If this lasts, trucks queue at the gate. Keep one bay free during peak arrival windows if you can.',
    hi: '“2/2 बिज़ी” मतलब हर लोडिंग दरवाज़ा भरा — एक खाली होने तक कोई ट्रक नहीं आ सकता। लंबे समय तक ट्रक गेट पर लाइन। पीक आने के समय एक बे खाली रखें।',
    hg: '“2/2 busy” matlab har loading darwaza bhara — ek khali hone tak koi truck nahi aa sakta. Lambe samay tak truck gate pe line. Peak aane ke samay ek bay khali rakho.',
  },
  outbound: {
    en: 'Outbound today counts trucks leaving with goods. A drop versus the usual usually means a dock or forklift bottleneck, not low demand.',
    hi: 'आउटबाउंड आज माल ले जाने वाले ट्रक गिनता है। आम से कम आमतौर पर डॉक या फोर्कलिफ्ट बाधा है, मांग कम नहीं।',
    hg: 'Outbound today maal le jaane wale truck ginti hai. Aam se kam aamtaur par dock ya forklift baadha hai, demand kam nahi.',
  },
  putaways: {
    en: 'Put-aways today = incoming pallets moved to storage. If this lags arrivals, staging fills up. Catch up before the yard blocks aisles.',
    hi: 'पुट-अवे आज = स्टोर में खिसकाए आने वाले पैलेट। अगर आने से पीछे, तो स्टेजिंग भरती है। आंगन गलियारा जाम करने से पहले पकड़ें।',
    hg: 'Put-away aaj = store mein khisakaye aane wale pallet. Agar aane se peeche, toh staging bharti hai. Aangan galiyaara jaam karne se pehle pakdo.',
  },
  on_time: {
    en: 'On-time delivery % is the share of shipments delivered when promised. It is the single best health metric — a drop points straight to dock, forklift, or stock problems.',
    hi: 'ऑन-टाइम डिलीवरी % वादा के समय पर डिलीवर हुए शिपमेंट का हिस्सा। यह सबसे अच्छा सेहत आंकड़ा है — गिरावट सीधे डॉक, फोर्कलिफ्ट या स्टॉक समस्या बताती है।',
    hg: 'On-time delivery % wada ke time pe deliver hue shipment ka hissa. Yeh sabse achha health metric hai — giravat seedhe dock, forklift ya stock samasya batati hai.',
  },
  low_stock: {
    en: 'Low Stock = a SKU below its minimum. Reorder now, before it hits zero — a stockout stops outbound and breaks on-time delivery.',
    hi: 'लो स्टॉक = SKU न्यूनतम से नीचे। अभी ऑर्डर करें, खत्म होने से पहले — स्टॉकआउट आउटबाउंड रोकता है और ऑन-टाइम डिलीवरी खराब करता है।',
    hg: 'Low stock = SKU minimum se neeche. Abhi order karo, khatam hone se pehle — stockout outbound rokta hai aur on-time delivery kharab karta hai.',
  },
  forklifts: {
    en: '“1/2 working” means half your pallet-moving power is offline (charging/idle). During peak loading every forklift should be moving — dead forklifts mean waiting trucks.',
    hi: '“1/2 काम कर रहे” मतलब आधी पैलेट-मूव शक्ति बंद (चार्ज/आइडल)। पीक लोडिंग में हर फोर्कलिफ्ट चलना चाहिए — बंद फोर्कलिफ्ट मतलब इंतज़ार करते ट्रक।',
    hg: '“1/2 working” matlab aadhi pallet-move shakti band (charge/idle). Peak loading mein har forklift chalna chahiye — band forklift matlab intezaar karte truck.',
  },
  staged: {
    en: 'Staged pallets are sitting in the yard waiting to be put away or loaded. A rising count means inbound processing is behind — clear it before it spills.',
    hi: 'स्टेज्ड पैलेट आंगन में पुट-अवे या लोड का इंतज़ार कर रहे। बढ़ता काउंट मतलब इनबाउंड पीछे — फैलने से पहले खाली करें।',
    hg: 'Staged pallet aangan mein put-away ya load ka intezaar kar rahe. Badhata count matlab inbound peeche — failne se pehle khali karo.',
  },
  dock_busy: {
    en: 'A busy dock with slow progress (e.g. 2/6 after a long time) signals a bottleneck — slow forklift, paperwork, or partial load. Unblock it before other trucks queue.',
    hi: 'बिज़ी डॉक धीमे प्रोग्रेस (जैसे लंबे समय बाद 2/6) बाधा का संकेत — धीमा फोर्कलिफ्ट, कागज़ी काम, या आधा लोड। अनब्लॉक करें, वरना और ट्रक लाइन।',
    hg: 'Busy dock dheeme progress (jaise lambe samay baad 2/6) baadha ka sanket — dheema forklift, kaagazi kaam, ya aadha load. Unblock karo, warna aur truck line.',
  },
  shipment: {
    en: 'The stepper shows this truck’s order from Confirmed to Delivered. The bigger circle is where it is now; blue = done, grey = still pending.',
    hi: 'स्टेपर इस ट्रक के ऑर्डर को कन्फर्मड से डिलीवर्ड तक दिखाता है। बड़ा घेरा अभी कहाँ है; नीला = हो गया, ग्रे = बाकी।',
    hg: 'Stepper is truck ke order ko Confirmed se Delivered tak dikhata hai. Bada ghaira abhi kahan hai; neela = ho gaya, grey = baaki.',
  },
  charging: {
    en: 'Charging forklifts are offline. Schedule charging in lulls, not at peak — a flat battery during loading is a bottleneck.',
    hi: 'चार्ज होते फोर्कलिफ्ट बंद हैं। फुर्सत में चार्ज करें, पीक पर नहीं — लोडिंग में खाली बैटरी बाधा है।',
    hg: 'Charge hote forklift band hain. Fursat mein charge karo, peak pe nahi — loading mein khali battery baadha hai.',
  },
  search: {
    en: 'Search any entity by code or name — e.g. TRK-2205, FL-12, cement, PAL-1026. On desktop press / to open it.',
    hi: 'कोड या नाम से कुछ भी खोजें — जैसे TRK-2205, FL-12, cement, PAL-1026। डेस्कटॉप पर / दबाएँ।',
    hg: 'Code ya naam se kuch bhi khojo — jaise TRK-2205, FL-12, cement, PAL-1026. Desktop pe / dabao.',
  },
  network: {
    en: 'Network overview zooms out to all five sites. Use it to spot which site is fullest or busiest before drilling into one.',
    hi: 'नेटवर्क ओवरव्यू सभी पाँच साइट पर ज़ूम आउट करता है। कौन-सी साइट सबसे भरी या व्यस्त है, पहले देखें।',
    hg: 'Network overview saari paanch site pe zoom out karta hai. Kaun-si site sabse bhari ya vyast hai, pehle dekho.',
  },
}
