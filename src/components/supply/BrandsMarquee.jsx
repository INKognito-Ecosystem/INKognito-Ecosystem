import { useCallback, useEffect, useRef } from 'react'
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
// Recorte local de fondo/padding (2026-09-13/15) — SOLO para esta prueba,
// el archivo real en Cloudinary/settings no se toca; la sección "Marcas"
// de escritorio (BrandsSupply.jsx) no usa este mapa y sigue igual.
// HEAVEN PRO ya NO está acá (2026-09-15, Jose: "actualicé la foto de la
// marca Heaven... ahora usa una donde el logo y letras son negras con
// fondo blanco") — Jose subió un archivo nuevo directo en el panel (mismo
// endpoint /api/visual/supply de siempre) que ya llena casi toda su caja
// (sin padding sobrante), así que cae directo al `img` real como Tattoo
// Vision/WJX, sin recorte.
// DYNAMIC, INDUSTRIAS WARLOCK y ROYAL THREE sí siguen acá, pero con
// archivos NUEVOS (2026-09-15, Jose reemplazó los tres en el panel —
// Dynamic y Warlock ya en negro/color real, ya no hacía falta el truco de
// recolor de antes). Los tres nuevos vienen en un lienzo cuadrado con
// mucho margen alrededor (para verse bien como ícono de perfil), lo que
// los dejaba chiquitos dentro de la misma caja de alto fijo que los demás
// — recortados a mano al bounding box real del contenido (script de
// Playwright/canvas: detecta dónde empieza/termina el logo por color
// "casi blanco" + un margen de respiro del 6%) para que se vean al mismo
// tamaño que antes, no más chicos (Jose: "procura que cuando actualices
// no los dejes más pequeños").
const RECORTE_LOCAL = {
  'ROYAL THREE': '/marcas-marquee/royal-three.png',
  DYNAMIC: '/marcas-marquee/dynamic.png',
  'INDUSTRIAS WARLOCK': '/marcas-marquee/warlock.png',
  // Solo "COLORS" (el texto fantasma de arriba) recoloreado a negro sólido
  // — "VICE" abajo queda exactamente igual, con su degradado rojo propio
  // (2026-09-15, Jose: "conviértelo a que se vea negro... pero solo el
  // texto de arriba no el texto vice"). Recorte hecho con un canvas
  // (Playwright headless): se ubicó la primera fila con píxel rojizo
  // (ahí empieza VICE) y todo lo de arriba con algo de alfa (por tenue
  // que fuera) se volvió negro opaco — VICE no se tocó en absoluto.
  'VICE COLORS': '/marcas-marquee/vice-colors.png',
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
// alto sobre la base de arriba, sin tocar el resto. Warlock/Dynamic ya NO
// necesitan un override acá (2026-09-15) — el recorte a bounding box de
// arriba ya los deja al tamaño correcto dentro de la caja default.
const ALTO_EXTRA = {
  'ROYAL THREE': 'h-12 md:h-14',
}

// Recolor forzado en light (2026-09-15, Jose: "wjx a color azul") — WJX
// sigue siendo line-art blanco sobre transparente en el archivo real (a
// diferencia de Dynamic, que Jose ya reemplazó por uno en negro real — ver
// RECORTE_LOCAL arriba, ya no necesita este truco). En el marquee oscuro
// se veía bien (grayscale + opacity-50 lo dejaba como silueta gris), pero
// en el marquee blanco a color completo queda invisible (blanco sobre
// blanco) si no se fuerza un color.
const RECOLOR_LIGHT = {
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

// Auto-avance con control real del usuario (2026-09-15, Jose primero:
// "el usuario debería poder tener control de ese carrusel... mover atrás
// o adelante para elegir y darle clic a la marca que quiera" — y luego,
// corrigiendo: "no quites el carrusel... yo podré moverlo, pero al
// soltarlo, el carrusel deberá seguir"). Antes era una animación CSS
// pura (transform) sobre un contenedor sin scroll real — tocarla solo la
// pausaba (:hover se dispara con el primer toque en móvil) y quedaba
// congelada, sin forma de moverla a mano. Ahora es scroll nativo de
// verdad (el usuario arrastra con el dedo, como cualquier lista) y el
// auto-avance mueve `scrollLeft` directamente por rAF — misma propiedad
// que toca un arrastre real, así que no compiten entre sí. pointerdown
// pausa, pointerup/cancel programa la reanudación ~1.5s después (tiempo
// para que se note que "uno soltó" antes de que retome solo).
function useAutoScrollCarousel(active, speedPxPerSec = 26) {
  const trackRef = useRef(null)
  const pausedRef = useRef(false)
  const resumeTimeoutRef = useRef(null)
  // Posición propia, NO releída de el.scrollLeft cada frame (2026-09-15,
  // bug real encontrado con Playwright: el.scrollLeft entero descarta el
  // sub-píxel de cada frame — a 26px/s y 60fps el avance por frame es
  // ~0.43px, que el navegador redondea a 0 al escribir; leer-sumar-
  // escribir sobre la propiedad del DOM nunca acumula, queda congelado
  // para siempre). Mientras está en pausa (arrastre manual del usuario),
  // esta posición se resincroniza con el scrollLeft real en cada frame,
  // para que al reanudar retome exactamente donde el usuario la soltó.
  const posRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const el = trackRef.current
    if (!el) return
    if (posRef.current == null) posRef.current = el.scrollLeft
    let rafId
    let lastTs = null
    const step = (ts) => {
      if (lastTs == null) lastTs = ts
      const dt = (ts - lastTs) / 1000
      lastTs = ts
      if (!pausedRef.current) {
        const half = el.scrollWidth / 2
        posRef.current += speedPxPerSec * dt
        if (half > 0 && posRef.current >= half) posRef.current -= half
        el.scrollLeft = posRef.current
      } else {
        posRef.current = el.scrollLeft
      }
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [active, speedPxPerSec])

  useEffect(() => () => { if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current) }, [])

  const pause = useCallback(() => {
    pausedRef.current = true
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
  }, [])

  const scheduleResume = useCallback(() => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => { pausedRef.current = false }, 1500)
  }, [])

  return { trackRef, pause, scheduleResume }
}

// imgs viene del loader de SupplyPage.jsx vía HeroSupply.jsx (2026-09-13,
// Jose: "al volver atrás... espabila primero sin imagen luego aparece")
// — antes este componente pedía `/api/visual/supply` por su cuenta (un
// tercer fetch idéntico al de BrandsSupply.jsx y CategoriesSupply.jsx en
// la misma página); ahora las 3 comparten el mismo dato ya resuelto,
// sin parpadeo ni fetches duplicados.
export default function BrandsMarquee({ imgs = {}, light = false }) {
  const { trackRef, pause, scheduleResume } = useAutoScrollCarousel(light)

  // Solo light — HeroSupply.jsx/BrandsSupply.jsx (escritorio) siguen con
  // el marquee animado por CSS de siempre, sin cambios (ver abajo).
  if (light) {
    return (
      <div
        className="relative mt-6 md:mt-10"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        }}
      >
        {/* Sin gap acá (2026-09-15, bug real: "la separación entre Royal
            Three y Heaven Pro está un poco más separada") — cada copia de
            abajo ya trae su propio gap + pr al final (mismo mecanismo que
            el marquee animado de escritorio); un gap ACÁ TAMBIÉN se
            sumaba al pr de la copia, duplicando el espacio justo en la
            costura entre el último logo de una copia (Royal Three) y el
            primero de la siguiente (Heaven Pro) — invisible en el
            marquee animado de siempre porque nadie podía pararse justo
            ahí, pero sí en este que se puede arrastrar a mano. */}
        <div
          ref={trackRef}
          className="flex items-center overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onPointerDown={pause}
          onPointerUp={scheduleResume}
          onPointerCancel={scheduleResume}
          onWheel={() => { pause(); scheduleResume() }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8 md:gap-12 pr-8 md:pr-12 flex-shrink-0">
              {brands.map((brand) => (
                <BrandLogo key={brand.name} brand={brand} img={imgs[brand.imgKey || brandKey(brand.name)]} light />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

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
