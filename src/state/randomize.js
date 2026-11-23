// Fresh-start scenario randomization (Bug B). Called once on boot when there is NO saved
// session, so two fresh opens show different drivers / customers / destinations (the sim's
// own seeded RNG is also re-seeded per session — see main.js). Does NOT touch pallet SKUs
// (they stay regionally accurate per the localization pass); only shuffles the people + the
// shipment customer/destination so each fresh scenario reads differently.
import { db } from '../data/db.js'
import { DRIVER_POOL, randomRoute, pick } from './pools.js'

export function randomizeScenario(rng = Math.random) {
  // shuffle driver + plate suffix per truck (keep the state prefix so plates stay valid)
  for (const t of db.list('truck')) {
    t.driver = pick(DRIVER_POOL, rng)
    // jiggle the plate's last 4 digits so the same truck id shows a different plate
    const m = /^(.*?)(\d{1,4})$/.exec(t.plate || '')
    if (m) {
      const n = String(1000 + Math.floor(rng() * 9000))
      t.plate = m[1] + n
    }
  }
  // shuffle each shipment's customer + destination (regional pool, correct origin→dest logic)
  for (const shp of db.list('shipment')) {
    const r = randomRoute(shp.siteId, rng)
    if (r) {
      shp.customer = r[0]
      // inbound shipments deliver TO the site; outbound go TO the destination city
      if (shp.direction === 'outbound') shp.toLabel = r[1]
      else {
        const site = db.site(shp.siteId)
        shp.toLabel = site?.name ?? shp.toLabel
        shp.customer = r[0]
      }
    }
  }
}
