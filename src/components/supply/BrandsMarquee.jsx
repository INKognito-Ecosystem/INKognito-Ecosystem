import { Link } from 'react-router-dom'
import { brands, brandKey } from './BrandsSupply'

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

// Recolor forzado en light (2026-09-15, Jose: "si hay logos totalmente
// blancos, pásalos a negro como en el caso de dynamic, y wjx a color
// azul") — Dynamic y WJX son line-art blanco sobre transparente: en el
// marquee oscuro se veían bien (grayscale + opacity-50 los dejaba como
// silueta gris), pero al pasar a color completo sobre fondo blanco
// (arriba, "devuévele el color a las marcas") quedaron invisibles
// (blanco sobre blanco). Solo estos dos — el resto de logos ya tiene
// color propio visible (Heaven Pro cian, Royal Three rojo, Warlock
// azul/negro, Tattoo Vision/Vice rojo).
const RECOLOR_LIGHT = {
  DYNAMIC: 'bg-zinc-900',
  WJX: 'bg-blue-500',
}

// light (2026-09-15, piloto en MobileHomeSupply: "convierte la page
// principal, en formato blanco") — default false para no tocar
// HeroSupply.jsx/BrandsSupply.jsx (desktop, siguen oscuros). Sin esto el
// texto de respaldo (marca sin logo) quedaba blanco-sobre-blanco al hacer
// hover en fondo claro. A color completo desde el inicio en light (Jose:
// "devuévele el color a las marcas") — el gris/opacidad-hasta-hover era
// para que resaltaran sobre fondo negro; en blanco no hace falta ese
// truco y los logos se ven mejor con su color real siempre.
function BrandLogo({ brand, img, light = false }) {
  const local = RECORTE_LOCAL[brand.name]
  const src = local || img
  const alto = ALTO_EXTRA[brand.name] || 'h-10 md:h-12'
  const recolor = light ? RECOLOR_LIGHT[brand.name] : null
  return (
    <Link to={brand.to} className={`group flex items-center justify-center flex-shrink-0 ${alto}`}>
      {src ? recolor ? (
        // Recorte a color sólido vía CSS mask (2026-09-15, ver
        // RECOLOR_LIGHT arriba) — el <img> real queda invisible pero
        // define el tamaño real (relación de aspecto propia de cada
        // logo, w-auto sobre h-full); el <span> de encima usa esa misma
        // imagen como máscara de alfa y la rellena con un color sólido.
        <span className="relative inline-flex items-center justify-center h-full">
          <img src={src} alt={brand.name} className="h-full w-auto max-w-[9rem] md:max-w-[11rem] object-contain opacity-0" />
          <span
            aria-hidden="true"
            className={`absolute inset-0 ${recolor}`}
            style={{
              WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
              WebkitMaskSize: 'contain', maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center', maskPosition: 'center',
            }}
          />
        </span>
      ) : (
        <img
          src={src}
          alt={brand.name}
          className={`h-full w-auto max-w-[9rem] md:max-w-[11rem] object-contain transition-all duration-300 ${light ? '' : 'opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0'}`}
        />
      ) : (
        <span className={`text-zinc-600 ${light ? 'group-hover:text-zinc-900' : 'group-hover:text-white'} text-[9px] font-black uppercase tracking-widest text-center px-2 transition-colors duration-300`}>
          {brand.name}
        </span>
      )}
    </Link>
  )
}

// imgs viene del loader de SupplyPage.jsx vía HeroSupply.jsx (2026-09-13,
// Jose: "al volver atrás... espabila primero sin imagen luego aparece")
// — antes este componente pedía `/api/visual/supply` por su cuenta (un
// tercer fetch idéntico al de BrandsSupply.jsx y CategoriesSupply.jsx en
// la misma página); ahora las 3 comparten el mismo dato ya resuelto,
// sin parpadeo ni fetches duplicados.
export default function BrandsMarquee({ imgs = {}, light = false }) {
  return (
    <div
      className="relative mt-6 md:mt-10 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div className="brands-marquee-track flex items-center w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8 md:gap-12 pr-8 md:pr-12 flex-shrink-0">
            {brands.map((brand) => (
              <BrandLogo key={brand.name} brand={brand} img={imgs[brand.imgKey || brandKey(brand.name)]} light={light} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
