// Generates the PWA icon set (PNG + SVG) from the WareTrack brand cube.
// Run: node scripts/gen-icons.mjs  (sharp is a devDependency)
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public')
await mkdir(out, { recursive: true })

// brand cube (isometric, 3-tone) drawn in a 512 box; scaled + translated to centre.
function cubeSvg({ bg, top, left, right, outline, cubeScale = 16, dy = 36 }) {
  const s = cubeScale
  const tx = 256 - 16 * s
  const ty = dy
  const full = `M16 2 29 9v14l-13 7-13-7V9z`
  const topF = `M16 2 29 9 16 16 3 9z`
  const rightF = `M16 16v14l13-7V9z`
  const leftF = `M3 9 16 16v14L3 23z`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${bg}"/>
  <g transform="translate(${tx} ${ty}) scale(${s})">
    <path d="${full}" fill="${outline}" stroke="none"/>
    <path d="${topF}" fill="${top}"/>
    <path d="${leftF}" fill="${left}"/>
    <path d="${rightF}" fill="${right}"/>
    <path d="${full}" fill="none" stroke="#ffffff" stroke-width="0.6" stroke-linejoin="round" opacity="0.5"/>
  </g>
</svg>`
}

const regular = cubeSvg({ bg: '#ffffff', top: '#7d97f7', left: '#2f5bea', right: '#2347c9', outline: '#2f5bea', cubeScale: 15, dy: 60 })
const maskable = cubeSvg({ bg: '#2f5bea', top: '#dbe4ff', left: '#7d97f7', right: '#4a6cf0', outline: '#3b66f0', cubeScale: 11, dy: 110 })
const apple = cubeSvg({ bg: '#ffffff', top: '#7d97f7', left: '#2f5bea', right: '#2347c9', outline: '#2f5bea', cubeScale: 14, dy: 70 })

await sharp(Buffer.from(regular)).resize(192, 192).png().toFile(join(out, 'icon-192.png'))
await sharp(Buffer.from(regular)).resize(512, 512).png().toFile(join(out, 'icon-512.png'))
await sharp(Buffer.from(maskable)).resize(512, 512).png().toFile(join(out, 'icon-maskable-512.png'))
await sharp(Buffer.from(apple)).resize(180, 180).png().toFile(join(out, 'apple-touch-icon.png'))

await writeFile(join(out, 'icon.svg'), regular, 'utf8')
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2 29 9v14l-13 7-13-7V9z" fill="#2f5bea"/><path d="M16 2 29 9 16 16 3 9z" fill="#7d97f7"/><path d="M16 16v14l13-7V9z" fill="#2347c9"/></svg>`
await writeFile(join(out, 'favicon.svg'), favicon, 'utf8')

console.log('icons generated in', out)
