// Convierte las imágenes pesadas a WebP (los originales no se borran).
// Uso: node scripts/convert-images.mjs
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets')

// maxWidth según el tamaño máximo al que se muestra cada imagen
const JOBS = [
  // foto de perfil del hero (se muestra a 384px; 1000px cubre retina de sobra)
  { in: 'mifoto/josefoto.jpg', out: 'mifoto/josefoto.webp', maxWidth: 1000, quality: 80 },
  // versión JPEG liviana solo para og:image (los scrapers de WhatsApp/FB prefieren JPEG)
  { in: 'mifoto/josefoto.jpg', out: 'mifoto/josefoto-og.jpg', maxWidth: 1200, quality: 75, format: 'jpeg' },

  // fondos a pantalla completa
  { in: 'hero/hero-bg.png', out: 'hero/hero-bg.webp', maxWidth: 1920, quality: 75 },
  { in: 'footer/footer-bg.png', out: 'footer/footer-bg.webp', maxWidth: 1920, quality: 75 },
  { in: 'about/about-bg.png', out: 'about/about-bg.webp', maxWidth: 1920, quality: 75 },
  { in: 'reserva/reserva-bg.png', out: 'reserva/reserva-bg.webp', maxWidth: 1920, quality: 75 },

  // galería de portafolio (lightbox muestra hasta ~85vw)
  { in: 'portafolio/poseidon.jpg', out: 'portafolio/poseidon.webp', maxWidth: 1400, quality: 78 },
  { in: 'portafolio/poseidon2.jpg', out: 'portafolio/poseidon2.webp', maxWidth: 1400, quality: 78 },
  { in: 'portafolio/aguila.jpg', out: 'portafolio/aguila.webp', maxWidth: 1400, quality: 78 },
  { in: 'portafolio/angel-caido.jpg', out: 'portafolio/angel-caido.webp', maxWidth: 1400, quality: 78 },
  { in: 'portafolio/colibri.jpg', out: 'portafolio/colibri.webp', maxWidth: 1400, quality: 78 },
  { in: 'portafolio/ojoyfiligrana.jpg', out: 'portafolio/ojoyfiligrana.webp', maxWidth: 1400, quality: 78 },
  { in: 'portafolio/lineafina.jpg', out: 'portafolio/lineafina.webp', maxWidth: 1400, quality: 78 },
  { in: 'portafolio/representativo1.jpeg', out: 'portafolio/representativo1.webp', maxWidth: 1400, quality: 78 },
  { in: 'portafolio/representativo2.jpeg', out: 'portafolio/representativo2.webp', maxWidth: 1400, quality: 78 },
  { in: 'portafolio/representativo3.jpeg', out: 'portafolio/representativo3.webp', maxWidth: 1400, quality: 78 },

  // logo del navbar (se muestra a 56px; 300px cubre retina)
  { in: 'milogo/milogo.png', out: 'milogo/milogo.webp', maxWidth: 300, quality: 80 },

  // logos de Supply y Store (navbar a 56px + og:image; 600px cubre ambos usos)
  { in: 'milogo/supply.png', out: 'milogo/supply.webp', maxWidth: 600, quality: 80 },
  { in: 'milogo/store.png', out: 'milogo/store.webp', maxWidth: 600, quality: 80 },
]

for (const job of JOBS) {
  const inPath = path.join(root, job.in)
  const outPath = path.join(root, job.out)
  const pipeline = sharp(inPath).resize({ width: job.maxWidth, withoutEnlargement: true })
  if (job.format === 'jpeg') {
    await pipeline.jpeg({ quality: job.quality, mozjpeg: true }).toFile(outPath)
  } else {
    await pipeline.webp({ quality: job.quality }).toFile(outPath)
  }
  const before = (fs.statSync(inPath).size / 1024).toFixed(0)
  const after = (fs.statSync(outPath).size / 1024).toFixed(0)
  console.log(`${job.in}  ${before} KB -> ${job.out}  ${after} KB`)
}
