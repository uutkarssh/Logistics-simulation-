// Infinite procedural India map (Stage 1). A chunk-based generator that keeps a grid of chunks
// around the camera and recycles them as you pan — the map never ends. Each chunk carries a few
// white low-poly building blocks, simple road segments, and ONE real Indian place-name label
// (deterministic by chunk coords, so a given location always reads the same name).
//
// This layer wraps around the existing 5 warehouses (the simulation is untouched) so the world
// reads as an endless Indian landscape with real city/town names wherever you look.
import * as THREE from 'three'
import { C, mat, shadows } from './palette.js'
import { textTexture } from './canvasText.js'

const CHUNK = 720                 // metres per chunk (square)
const RADIUS = 3                  // chunks in each direction around the camera (7×7 = 49 visible)
const NAME_FONT = '600 64px Inter, sans-serif'

// Real Indian cities/towns spread across the country — a chunk maps to one of these deterministically.
const PLACE_NAMES = [
  'Varanasi', 'Prayagraj', 'Lucknow', 'Kanpur', 'Gorakhpur', 'Ayodhya', 'Bhadohi', 'Gopiganj',
  'Surat', 'Ahmedabad', 'Vadodara', 'Bhavnagar', 'Rajkot', 'Jamnagar', 'Gandhinagar', 'Bhiwandi',
  'Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Amravati', 'Aurangabad', 'Solapur', 'Thane',
  'Delhi', 'Agra', 'Jaipur', 'Udaipur', 'Ajmer', 'Jodhpur', 'Kota', 'Alwar',
  'Guwahati', 'Shillong', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Tinsukia', 'Nagaon',
  'Kolkata', 'Patna', 'Ranchi', 'Raipur', 'Bhilai', 'Jamshedpur', 'Dhanbad', 'Bokaro',
  'Hyderabad', 'Bengaluru', 'Chennai', 'Madurai', 'Sivakasi', 'Coimbatore', 'Salem', 'Tirupati',
  'Kochi', 'Trivandrum', 'Kozhikode', 'Mangaluru', 'Mysuru', 'Hubli', 'Belagavi', 'Vijayawada',
  'Amritsar', 'Chandigarh', 'Ludhiana', 'Jalandhar', 'Bhatinda', 'Shimla', 'Dehradun', 'Haridwar',
  'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Raipur', 'Bilaspur', 'Visakhapatnam', 'Bhubaneswar',
]

// deterministic hash → [0,1) so each chunk is stable and unique-ish
function hash2(cx, cz) {
  let h = (cx * 374761393 + cz * 668265263) | 0
  h = (h ^ (h >>> 13)) | 0
  h = (h * 1274126177) | 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

const ROAD_W = 11
const roadMat = mat('#dfe4ee', { flat: true })
const buildGeo = new THREE.BoxGeometry(1, 1, 1)
const buildMat = mat('#f4f6fb', { flat: true })

function makeRoadSegment(x1, z1, x2, z2) {
  const dx = x2 - x1, dz = z2 - z1
  const len = Math.hypot(dx, dz)
  if (len < 1) return null
  const g = new THREE.PlaneGeometry(len, ROAD_W).rotateX(-Math.PI / 2)
  const m = new THREE.Mesh(g, roadMat)
  m.position.set((x1 + x2) / 2, 0.02, (z1 + z2) / 2)
  m.rotation.y = Math.atan2(dx, dz)
  return m
}

function makeLabel(text) {
  const { texture, aspect } = textTexture(text, { color: '#9aa3b6', weight: 600, size: 64, bg: null })
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }))
  const h = 16
  spr.scale.set(h * aspect, h, 1)
  spr.position.set(0, 28, 0)
  return spr
}

// build one chunk's content (a Group) — deterministic by chunk coords
function buildChunk(cx, cz) {
  const g = new THREE.Group()
  g.name = `chunk:${cx}:${cz}`
  const ox = cx * CHUNK, oz = cz * CHUNK
  g.position.set(ox, 0, oz)

  // roads: a cross through the chunk centre + one offset spur (deterministic)
  const r = hash2(cx, cz)
  const off = (r - 0.5) * CHUNK * 0.4
  const roads = [
    makeRoadSegment(-CHUNK / 2, 0, CHUNK / 2, 0),                 // E–W through centre
    makeRoadSegment(0, -CHUNK / 2, 0, CHUNK / 2),                 // N–S through centre
    makeRoadSegment(-CHUNK / 2, off, CHUNK / 2, off),             // parallel E–W
    makeRoadSegment(off, -CHUNK / 2, off, CHUNK / 2),             // parallel N–S
  ]
  for (const rd of roads) if (rd) g.add(rd)

  // buildings: scattered white boxes, deterministic count/positions/sizes
  const n = 26 + Math.floor(hash2(cx + 7, cz - 3) * 30)
  const inst = new THREE.InstancedMesh(buildGeo, buildMat, n)
  inst.castShadow = false
  inst.receiveShadow = true
  const m = new THREE.Matrix4()
  const v = new THREE.Vector3()
  const q = new THREE.Quaternion()
  const s = new THREE.Vector3()
  for (let i = 0; i < n; i++) {
    const h = hash2(cx * 31 + i, cz * 17 + i * 7)
    const hx = hash2(i, cx + cz)
    const hz = hash2(i + 99, cx - cz)
    const x = (hx - 0.5) * (CHUNK - 40)
    const z = (hz - 0.5) * (CHUNK - 40)
    // keep buildings off the centre roads
    if (Math.abs(x) < ROAD_W + 8 || Math.abs(z) < ROAD_W + 8 || Math.abs(x - off) < ROAD_W + 8 || Math.abs(z - off) < ROAD_W + 8) continue
    const w = 10 + h * 22
    const d = 10 + hash2(h, i) * 22
    const ht = 8 + h * 46
    v.set(x, ht / 2, z)
    s.set(w, ht, d)
    m.compose(v, q, s)
    inst.setMatrixAt(i, m)
  }
  inst.instanceMatrix.needsUpdate = true
  g.add(inst)

  // place-name label (one per chunk, deterministic)
  const name = PLACE_NAMES[Math.floor(hash2(cx, cz) * PLACE_NAMES.length) % PLACE_NAMES.length]
  const lbl = makeLabel(name)
  g.add(lbl)

  return g
}

export function createIndiaMap(root, app) {
  const map = new THREE.Group()
  map.name = 'india-map'
  root.add(map)

  // a very large ground plane below everything so there is never a void
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20000, 20000).rotateX(-Math.PI / 2),
    mat(C.ground, { flat: true }),
  )
  ground.receiveShadow = true
  ground.position.y = -0.05
  map.add(ground)

  const chunks = new Map()       // "cx:cz" → Group
  const tmp = new THREE.Vector3()

  function ensure(cx, cz) {
    const key = `${cx}:${cz}`
    if (chunks.has(key)) return
    const c = buildChunk(cx, cz)
    chunks.set(key, c)
    map.add(c)
  }
  function drop(key) {
    const c = chunks.get(key)
    if (!c) return
    map.remove(c)
    c.traverse((o) => {
      if (o.isInstancedMesh) { o.dispose?.(); o.material?.dispose?.() }
      if (o.isMesh && o.geometry) o.geometry.dispose?.()
    })
    chunks.delete(key)
  }

  function update() {
    const t = app.controls?.target ?? app.camera.position
    tmp.copy(t)
    const cx = Math.floor(tmp.x / CHUNK)
    const cz = Math.floor(tmp.z / CHUNK)
    // ensure visible chunks
    for (let dz = -RADIUS; dz <= RADIUS; dz++)
      for (let dx = -RADIUS; dx <= RADIUS; dx++) ensure(cx + dx, cz + dz)
    // drop far chunks
    for (const key of [...chunks.keys()]) {
      const [kx, kz] = key.split(':').map(Number)
      if (Math.abs(kx - cx) > RADIUS + 1 || Math.abs(kz - cz) > RADIUS + 1) drop(key)
    }
  }

  update()
  return { group: map, update }
}
