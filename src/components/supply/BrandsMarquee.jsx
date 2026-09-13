import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { brands, brandKey } from './BrandsSupply'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

// Prueba (2026-09-13, Jose: "tomar los logos de las marcas de Supply y
// hacer un carrusel como el que hacen las tecnologías usadas") — mismo
// truco de "duplicar la lista y deslizar -50%" que ya usa TechMarquee.jsx
// (ver esa nota para el porqué del padding-derecho por copia en vez de
// gap entre copias), pero con los logos reales de marcas (mismo endpoint
// `/api/visual/supply` y misma lista `brands` que BrandsSupply.jsx, ahora
// exportados desde ahí) en vez de íconos de stack técnico. No reemplaza
// la sección "Marcas" existente — vive aparte, en el hero.
//
// Recorte local de fondo (2026-09-13, Jose: "quitar el fondo DENTRO de
// Heaven Pro, Royal Three y demás" — las que sí tienen un fondo sólido
// negro incrustado, a diferencia de Tattoo Vision/Vice Colors/WJX que ya
// eran transparentes de origen, aunque el visor las mostrara con matiz
// blanco). Versión recortada a mano (detección de color de fondo por
// esquina + degradado de alpha), guardada en public/marcas-marquee/ SOLO
// para esta prueba — el archivo real en Cloudinary/settings no se toca
// todavía, así que la sección "Marcas" (BrandsSupply.jsx) sigue igual.
const RECORTE_LOCAL = {
  'HEAVEN PRO': '/marcas-marquee/heaven-pro.png',
  'ROYAL THREE': '/marcas-marquee/royal-three.png',
  DYNAMIC: '/marcas-marquee/dynamic.png',
  'INDUSTRIAS WARLOCK': '/marcas-marquee/warlock.png',
}

// Alto fijo, ancho libre (2026-09-13, Jose: "Warlock, Royal Three y Heaven
// Pro quedaron muy pequeños, hazlos del tamaño de los otros") — la caja
// anterior era w-28/h-12 con object-contain: un logo cuadrado (Warlock) o
// más alto que ancho (Heaven Pro, Royal Three) queda acotado por el ALTO
// de esa caja mucho antes de llenar el ancho, así que se ve chico al lado
// de wordmarks anchos como Tattoo Vision/WJX que sí llenan el ancho
// completo. Mismo alto para los 7 (ancho automático según su propia
// proporción) es el patrón real de una franja de logos de marca — cada
// uno pesa visualmente igual sin importar si es cuadrado o alargado.
// Royal Three un poco más grande (2026-09-13, Jose) — override puntual de
// alto sobre la base de arriba, sin tocar el resto.
const ALTO_EXTRA = {
  'ROYAL THREE': 'h-12 md:h-14',
}

function BrandLogo({ brand, img }) {
  const local = RECORTE_LOCAL[brand.name]
  const src = local || img
  const alto = ALTO_EXTRA[brand.name] || 'h-10 md:h-12'
  return (
    <Link to={brand.to} className={`group flex items-center justify-center flex-shrink-0 ${alto}`}>
      {src ? (
        <img
          src={src}
          alt={brand.name}
          className="h-full w-auto max-w-[9rem] md:max-w-[11rem] object-contain transition-all duration-300 opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0"
        />
      ) : (
        <span className="text-zinc-600 group-hover:text-white text-[9px] font-black uppercase tracking-widest text-center px-2 transition-colors duration-300">
          {brand.name}
        </span>
      )}
    </Link>
  )
}

export default function BrandsMarquee() {
  const [imgs, setImgs] = useState({})

  useEffect(() => {
    fetch(`${PANEL_URL}/api/visual/supply`)
      .then((r) => r.json())
      .then((data) => setImgs(data || {}))
      .catch(() => {})
  }, [])

  return (
    <div
      className="relative mt-6 md:mt-10"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div className="brands-marquee-track flex items-center w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8 md:gap-12 pr-8 md:pr-12 flex-shrink-0">
            {brands.map((brand) => (
              <BrandLogo key={brand.name} brand={brand} img={imgs[brand.imgKey || brandKey(brand.name)]} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
