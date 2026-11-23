// App bootstrap — wires the 3D scene, world, simulation, camera director, interaction and UI.
// Contracts for every module are in docs/SPEC.md.
import './ui/styles.css'
import { createScene } from './three/scene.js'
import { createWorld } from './three/world.js'
import { createInteraction } from './three/interaction.js'
import { createCameraDirector } from './three/cameraDirector.js'
import { createSimulation } from './state/simulation.js'
import { mountUI } from './ui/index.js'
import { store, bus } from './state/store.js'
import { db } from './data/db.js'
import { loadState, applyState, scheduleSave, clearState, getSeed, setSeed } from './state/persist.js'
import { randomizeScenario } from './state/randomize.js'

// ── session: continue a saved run, or start a fresh randomized scenario ──
// (Bug B) Done BEFORE the world/sim are built so they read the restored db + clock.
const saved = loadState()
if (saved) {
  setSeed(saved.seed)      // keep the same sim seed for a continued session
  applyState(saved)        // restore trucks/forklifts/pallets/docks/shipments/chargers + simMinutes + store
} else {
  setSeed()                // fresh per-session seed → the sim's stochastic choices differ each open
  randomizeScenario()      // shuffle drivers + shipment customer/destinations so a fresh open reads differently
}

const app = createScene(document.getElementById('viewport'))
const world = createWorld(app)
const sim = createSimulation(world, getSeed())
const director = createCameraDirector(app, world)
const interaction = createInteraction(app, world)
mountUI(document.getElementById('ui'))

app.onFrame((dt, elapsed) => {
  sim.update(dt, elapsed)
  world.update(dt, elapsed)
  interaction.update(dt, elapsed)
  director.update(dt, elapsed)
})
app.start()

// persist the live state (throttled) on every simulation tick
bus.on('data:update', () => scheduleSave())

// "New scenario" (from the user menu) → drop the save and reload fresh + randomized
window.addEventListener('wt:new-scenario', () => { clearState(); location.reload() })

applyDeepLink(new URLSearchParams(location.search))

/** Shareable links: ?site=WH-04&select=truck:TRK-2205&tab=trucks */
function applyDeepLink(params) {
  const site = params.get('site')
  if (site && (site === 'ALL' || db.site(site))) store.setSite(site)
  const tab = params.get('tab')
  if (['docks', 'forklifts', 'trucks'].includes(tab)) store.set({ fleetTab: tab })
  const [type, id] = (params.get('select') ?? '').split(':')
  if (type && id && db.get(type, id)) store.select({ type, id })
}

// handy for debugging in the console
window.__waretrack = { app, world, sim, director, interaction }
