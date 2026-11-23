// Session persistence (Bug B). Saves the live db state (the fields the simulation mutates) +
// simMinutes + store UI state + the sim seed to localStorage, throttled on `data:update`.
// On boot, main.js loads a saved snapshot and applies it (continue where left off); if none,
// it generates a fresh seed + randomizes the scenario (fresh open differs each time).
import { db } from '../data/db.js'
import { store } from './store.js'

const SAVE_KEY = 'wt-sim-state-v1'
const SAVE_THROTTLE = 2000

// only the mutable fields — everything else (id, siteId, slot, lot, world coords, capacity,
// model, variant, doors, routes, …) stays in mockData and is NOT saved
const FIELDS = {
  site: ['stock', 'stockDelta', 'outboundToday', 'putawaysToday', 'onTime'],
  truck: ['status', 'dockId', 'progress', 'etaMin', 'cargo', 'distanceLeftM', 'speedKmh', 'shipmentId', 'carrier', 'driver', 'plate', 'position', 'heading'],
  forklift: ['status', 'battery', 'movesToday', 'task', 'truckId', 'carryingPalletId', 'carryingKind', 'chargerId', 'operator', 'position', 'heading'],
  pallet: ['status', 'position', 'heading', 'carriedBy', 'pinned', 'sku', 'quantity', 'slot'],
  dock: ['status', 'truckId', 'bookedTruckId', 'bookedInMin', 'trucksToday'],
  shipment: ['customer', 'toLabel', 'times', 'eta'],
  charger: ['status', 'forkliftId', 'sessionsToday', 'energyKwh'],
}

function snapshot() {
  const pick = (type) => Object.fromEntries(
    db.list(type).map((e) => [e.id, Object.fromEntries(FIELDS[type].map((f) => [f, e[f] ?? null]))]),
  )
  return {
    v: 1,
    seed: seedValue,
    simMinutes: store.state.simMinutes,
    store: {
      siteId: store.state.siteId,
      selection: store.state.selection,
      fleetTab: store.state.fleetTab,
      trackedTruckId: store.state.trackedTruckId,
      followId: store.state.followId,
    },
    sites: pick('site'),
    trucks: pick('truck'),
    forklifts: pick('forklift'),
    pallets: pick('pallet'),
    docks: pick('dock'),
    shipments: pick('shipment'),
    chargers: pick('charger'),
  }
}

export function saveState() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot())) } catch { /* quota / private mode */ }
}

let lastSave = 0
let timer = null
/** Throttled save — call on every `data:update`. */
export function scheduleSave() {
  const now = Date.now()
  if (now - lastSave < SAVE_THROTTLE) {
    if (!timer) timer = setTimeout(() => { timer = null; lastSave = Date.now(); saveState() }, SAVE_THROTTLE)
    return
  }
  lastSave = now
  saveState()
}

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    if (!s || s.v !== 1) return null
    return s
  } catch { return null }
}

/** Restore a saved snapshot into the live db + store. Returns true if applied. */
export function applyState(s) {
  if (!s) return false
  for (const [type, rows] of Object.entries(s)) {
    if (type === 'seed') { seedValue = s.seed; continue }
    if (type === 'simMinutes' || type === 'store' || type === 'v') continue
    const fields = FIELDS[type]
    if (!fields || !rows) continue
    for (const [id, vals] of Object.entries(rows)) {
      const e = db.get(type, id)
      if (!e) continue
      for (const f of fields) if (f in vals) e[f] = vals[f]
    }
  }
  if (typeof s.simMinutes === 'number') store.set({ simMinutes: s.simMinutes })
  if (s.store) store.set(s.store)
  return true
}

export function clearState() {
  try { localStorage.removeItem(SAVE_KEY) } catch {}
}

// the sim seed is read by main.js before createSimulation(); defaults to a fresh random seed
let seedValue = (Math.random() * 0xffffffff) >>> 0
export function getSeed() { return seedValue }
export function setSeed(s) { seedValue = (s >>> 0) || (Math.random() * 0xffffffff) >>> 0 }
