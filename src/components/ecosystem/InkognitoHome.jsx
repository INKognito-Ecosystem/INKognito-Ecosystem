import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Keyboard, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import { PenTool, Package, ShoppingBag, Dumbbell, Pill, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import EcosystemNavbar from './EcosystemNavbar'
import LegalModal from '../legal/LegalModal'
import ecosystemBg from '../../assets/ecosystem/ecosystem-bg.jpg'
// Imagen nueva subida a Obsidian (2026-09-15, Jose: "esta imagen la usarás
// para el fondo del home del ecosistema... solo para móvil de momento") —
// retrato (encaja mejor en pantalla de celular que el hoyo negro panorámico
// de ecosystemBg); desktop se queda con el fondo de siempre hasta que Jose
// decida algo para esa vista.
import ecosystemBgMobile from '../../assets/ecosystem/ecosystem-bg-mobile.jpg'
// Máscara de las líneas del fondo móvil (2026-11-21, Jose: "que esas texturas
// parecidas a neuronas se iluminen también, del color de la card que esté al
// frente") — mismo dibujo que ecosystem-bg-mobile.jpg pero solo el trazo:
// blanco con transparencia donde hay línea y transparente en el resto (sin el
// blob turquesa ni la marca de agua). Se usa como mask-image de las capas de
// color de abajo, así el color solo se ve sobre las líneas.
import ecosystemLinesMobile from '../../assets/ecosystem/ecosystem-lines-mobile.png'
// Monograma "INK" del banner del módulo INK (mismo asset vertical 398×824
// que usa ArtistasColombiaPage.jsx en el hero del directorio). En el home
// reemplaza el ícono + la palabra "INK" dentro de la card del carrusel.
import inkMark from '../../assets/artistas-ink-mark.png'

export function meta() {
  const title = 'INKognito | Tattoo, Supply y Store en Urabá, Colombia'
  const description = 'Ecosistema de servicios en Chigorodó, Urabá: estudio de tatuajes, insumos profesionales para tatuadores y tienda deportiva. Conoce todos nuestros módulos.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:site_name', content: 'INKognito Ecosystem' },
    { property: 'og:url', content: `${import.meta.env.VITE_SITE_URL}/` },
    { property: 'og:image', content: `${import.meta.env.VITE_SITE_URL}/og/ecosystem-og.png` },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/` },
  ]
}

// Tipografía propia para "INK" en el home (2026-11-21, Jose: "deja las
// letras como estaban antes, pero usando una tipografía diferente a la que
// tiene ognito"). Cinzel es una serif de inscripción romana —el aire de
// letra grabada/tatuaje— y contrasta con el sans itálico pesado de OGNITO.
// Se carga solo en esta ruta para no tocar el resto del ecosistema.
export function links() {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap',
    },
  ]
}

// Carrusel de módulos (2026-11-20) — reemplaza la lista vertical de 5
// botones. Mismas 5 rutas, mismo orden. `color` sale de los hover que ya
// tenía cada botón (rojo INK, azul Supply, dorado #C9A84C Store, gris Gym,
// gris claro Suple) y se usa para: borde de la card activa, botón "Entrar",
// punto de la paginación y tinte del fondo. `on` = color del texto sobre ese
// color (negro sobre dorado/gris claro, igual que el hover viejo de Store).
//
// TODO Jose: los textos de `tagline` y `facts` de INK/Supply/Store salen de
// lo que ya dice el sitio (menú, "Sobre INKognito", meta). Los de Gym y Suple
// son provisionales — cámbialos por lo que realmente ofrece cada módulo.
const MODULES = [
  {
    id: 'ink',
    to: '/tattoo-artist-colombia',
    eyebrow: 'INK',
    name: 'Encuentra tu tatuador',
    Icon: PenTool,
    color: '#dc2626',
    on: '#ffffff',
    tagline: 'El directorio de artistas y estudios de tatuaje de Colombia.',
    facts: ['Artistas y estudios', 'Perfil de cada artista', 'Registro para artistas'],
  },
  {
    id: 'supply',
    to: '/supply',
    eyebrow: 'Supply',
    name: 'Tattoo supply',
    Icon: Package,
    color: '#2563eb',
    on: '#ffffff',
    tagline: 'Insumos profesionales para tatuadores, de proveedores verificados.',
    facts: ['Proveedores verificados', 'Locales y nacionales', 'Catálogo en línea'],
  },
  {
    id: 'store',
    to: '/store',
    eyebrow: 'Store',
    name: 'Moda & estilo',
    Icon: ShoppingBag,
    color: '#C9A84C',
    on: '#000000',
    tagline: 'Ropa y calzado de tiendas aliadas.',
    facts: ['Ropa y calzado', 'Tiendas aliadas', 'Catálogo en línea'],
  },
  {
    id: 'gym',
    to: '/gym',
    eyebrow: 'Gym',
    name: 'Gym systems',
    Icon: Dumbbell,
    color: '#6b7280',
    on: '#ffffff',
    tagline: 'Disciplina que se entrena.',
    facts: ['Entrenamiento', 'Disciplina', 'Constancia'],
  },
  {
    id: 'suple',
    to: '/suplementos',
    eyebrow: 'Suple',
    name: 'Suplementación',
    Icon: Pill,
    color: '#9E9E9E',
    on: '#000000',
    tagline: 'Suplementos de proveedores aliados.',
    facts: ['Proveedores aliados', 'Catálogo en línea', 'Tu tienda: Mi Suple'],
  },
]

export default function InkognitoHome() {
  // legalOpen (2026-09-15, Jose: "lo mismo si le doy desde el copyright" —
  // mismo modal blanco a pantalla completa que EcosystemNavbar.jsx usa
  // desde su propio menú, ver LegalModal.jsx) — estado propio, independiente
  // del de EcosystemNavbar (el copyright vive fuera de ese componente).
  const [legalOpen, setLegalOpen] = useState(null)
  // Índice del módulo que está al centro del carrusel.
  const [active, setActive] = useState(0)
  const swiperRef = useRef(null)
  const bgRef = useRef(null)

  // "Zoom de cámara" del fondo: cada vez que cambia el módulo, la imagen
  // arranca un poco más grande y se asienta en 1. Va por ref/estilo directo
  // (no por estado) para no re-renderizar ni parpadear las imágenes.
  useEffect(() => {
    const el = bgRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.style.transition = 'none'
    el.style.transform = 'scale(1.07)'
    void el.offsetWidth
    el.style.transition = 'transform 1400ms cubic-bezier(0.2, 0.7, 0.2, 1)'
    el.style.transform = 'scale(1)'
  }, [active])

  const goTo = (i) => swiperRef.current?.slideTo(i)

  return (
    <section className="relative h-dvh bg-black text-white flex flex-col items-center px-6 overflow-hidden">

      {/* meta() arriba ya cubre SSR — no se renderiza <Seo>/<Helmet> para
          evitar que las dos mecánicas escriban <head> a la vez (rompía la
          hidratación, ver nota en HomePage.jsx). */}

      {/* El CSS va como texto crudo (dangerouslySetInnerHTML) a propósito:
          React escapa las comillas de los nodos de texto en el SSR
          (" → &quot;), pero <style> es un elemento de texto crudo donde el
          navegador NO decodifica esas entidades. El comentario que dice
          la "corriente" llegaba al cliente como &quot;corriente&quot; y React
          abortaba la hidratación del home entero (errores #418/#425/#423 en
          producción). Con texto crudo, servidor y cliente coinciden. */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes inkFloat { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
        .ink-float { animation: inkFloat 4.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .ink-float { animation: none; } }

        /* Corrientazo del fondo móvil (2026-11-21). Tailwind no cubre las
           máscaras, por eso viven acá. La textura se usa SOLO como máscara:
           el fondo queda negro como antes y lo único que se enciende es la
           luz que la recorre (--corriente). */
        .ink-lines { mix-blend-mode: screen; }
        .ink-mod { position: absolute; inset: 0; }
        .ink-ln {
          position: absolute; inset: 0;
          -webkit-mask: var(--ink-lines) center / cover no-repeat;
          mask: var(--ink-lines) center / cover no-repeat;
        }
        /* Banda de luz ancha: blanca al centro y del color del módulo hacia
           los bordes. El color solo se ve a través de las líneas.
           La hoja de luz va DENTRO de la máscara y se mueve con transform
           (translateY), no con background-position: así el navegador solo
           desliza una capa ya dibujada en la GPU y no repinta la pantalla
           en cada cuadro. Ver .ink-core-light. */
        .ink-core { opacity: 0; }
        .ink-core-light {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 68% 32% at 50% 50%, #fff 0%, var(--m) 58%, transparent 80%);
          transform: translateY(130%);
        }
        /* Un solo corrientazo por módulo: entra al pararse en la card y no
           se repite. Los módulos pares (INK, Store, Suple) lo suben de abajo
           hacia arriba; los impares (Supply, Gym) lo bajan. La hoja arranca
           y termina a 130% (totalmente fuera de pantalla), por eso no se
           queda a medio salir en los bordes. */
        .ink-mod.is-on .ink-core { opacity: 1; }
        .ink-mod.is-on .ink-core-light {
          animation: inkSurgeUp 2000ms cubic-bezier(0.45, 0, 0.3, 1) 1 both;
          will-change: transform;
        }
        .ink-mod.is-on.ink-down .ink-core-light { animation-name: inkSurgeDown; }
        @keyframes inkSurgeUp {
          from { transform: translateY(130%); }
          to { transform: translateY(-130%); }
        }
        @keyframes inkSurgeDown {
          from { transform: translateY(-130%); }
          to { transform: translateY(130%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ink-mod.is-on .ink-core { opacity: 0; }
          .ink-mod.is-on .ink-core-light { animation: none; }
        }
      ` }} />

      {/* NAVBAR — mobileLight (2026-09-15, ver EcosystemNavbar.jsx) SOLO
          afecta la hamburguesa en móvil ahora (caja blanca + barras
          negras) — el logo se revirtió a blanco (Jose: "que el logo sea
          blanco y no negro"). */}
      <EcosystemNavbar mobileLight />

      {/* FONDO — imagen distinta en móvil (ver import arriba), desktop se
          queda con el hoyo negro de siempre. opacity-80 de vuelta en móvil
          (2026-09-15, Jose: "revierte los cambios, deja la opacidad" —
          deshace el "quítale la opacidad" de un mensaje anterior).
          2026-11-20: las dos imágenes van dentro de un div con ref (bgRef)
          para poder hacerles el zoom de cada cambio de módulo.
          2026-11-21: ese mismo div ahora también lleva adentro el overlay
          oscuro, el tinte por módulo y las líneas iluminadas. Así todo hace
          el zoom a la vez y las líneas siguen pegadas a los trazos de la
          imagen; si estuvieran afuera, durante el zoom se separarían de ella. */}
      <div ref={bgRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
        <img
          src={ecosystemBgMobile}
          alt=""
          className="md:hidden absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <img
          src={ecosystemBg}
          alt=""
          className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-80"
        />

        {/* OVERLAY OSCURO — de vuelta en móvil también (2026-09-15, Jose:
            "revierte los cambios, deja la opacidad"). Con la opacidad
            restaurada, los colores originales (blancos) de "Disciplina · Arte
            · Identidad" y "Select Module" vuelven a leerse bien — por eso
            esos dos textos también vuelven a su color de siempre más abajo.
            2026-11-21: móvil baja de /45 a /35 (Jose, probando la vista
            previa del brillo de líneas: "oscurecer fondo lo dejé en 35");
            escritorio se queda en /60. */}
        <div className="absolute inset-0 bg-black/35 md:bg-black/60"></div>

        {/* CORRIENTAZO (2026-11-21) — SOLO móvil, que es donde el fondo es la
            imagen de líneas; el de escritorio es otra imagen y no tiene
            líneas. El fondo ya no se tiñe ni se ilumina con el color del
            módulo: queda negro como antes. La textura (ecosystemLinesMobile)
            se usa solo como máscara y lo único que se enciende es una banda
            de luz que la recorre de un borde al otro.
            Dirección: los módulos pares (INK, Store, Suple) la suben de
            abajo hacia arriba; los impares (Supply, Gym) la bajan. Pasa una
            sola vez al pararse en cada módulo, no en bucle.
            La luz es una hoja (.ink-core-light) dentro de la máscara y se
            mueve con transform: la GPU la desliza sin repintar el fondo.
            mix-blend-mode: screen suma la luz a la imagen oscurecida en vez
            de taparla. */}
        <div
          aria-hidden="true"
          className="md:hidden absolute inset-0 pointer-events-none ink-lines"
          style={{ '--ink-lines': `url("${ecosystemLinesMobile}")` }}
        >
          {MODULES.map((m, i) => (
            <div
              key={m.id}
              className={`ink-mod ${i === active ? 'is-on' : ''} ${i % 2 === 0 ? 'ink-up' : 'ink-down'}`}
              style={{ '--m': m.color }}
            >
              <div className="ink-ln ink-core">
                <div className="ink-core-light" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENIDO — ocupa todo el espacio disponible entre navbar y copyright.
          Todo compactado (paddings/gaps/tamaños de letra reducidos) para que
          la pantalla completa (logo + módulos + copyright) quepa en un solo
          viewport sin scroll (reportado 2026-08-02).
          2026-11-20: pt-[84px] deja libre la altura del navbar fijo (52px de
          logo + py-4), porque ahora el carrusel se estira (flex-1) y ya no
          queda aire arriba que lo separe. */}
      <div className="relative z-10 flex flex-col items-center w-full flex-1 min-h-0 pt-[84px] pb-1">

        {/* INK en negro (2026-09-15, Jose lo pidió mantener incluso tras
            revertir el resto) — el resto del bloque (OGNITO, tagline,
            "Select module") vuelve a su color original de siempre, ahora
            que la opacidad/overlay de arriba está de vuelta y ya no hace
            falta oscurecerlos a mano.
            2026-11-21: "INK" se queda como texto (la idea de meter la
            caligrafía del banner acá quedó descartada: "la imagen la vamos
            a ubicar en otro lugar"), pero con una tipografía propia,
            Cinzel 700, para que no sea exactamente la misma letra de
            "OGNITO". La fuente se carga solo en esta ruta — ver links().
            2026-11-20: md:text-6xl lg:text-7xl (antes md:text-7xl
            lg:text-8xl) para que el carrusel quepa sin scroll en laptops. */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase italic tracking-[0.12em] text-center">
          <span
            className="text-black md:text-white not-italic"
            style={{ fontFamily: "'Cinzel', ui-serif, Georgia, serif", fontWeight: 700 }}
          >
            INK
          </span>
          <span className="text-zinc-300">OGNITO</span>
        </h1>

        <p className="mt-1 mb-1 sm:mb-2 text-zinc-300 uppercase tracking-[0.15em] sm:tracking-[0.5em] text-sm md:text-base font-semibold text-center whitespace-nowrap px-2">
          Disciplina • Arte • Identidad
        </p>

        <p className="text-white uppercase tracking-[0.45em] text-sm text-center mb-1 sm:mb-2 font-medium">
          Select Module
        </p>

        {/* CARRUSEL (2026-11-20) — w-screen: sale del padding lateral del
            section para que las cards de los lados lleguen al borde. */}
        <div className="relative w-screen flex-1 min-h-0 max-h-[430px]">
          <Swiper
            modules={[EffectCoverflow, Keyboard, A11y]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            slideToClickedSlide
            speed={550}
            keyboard={{ enabled: true }}
            a11y={{ prevSlideMessage: 'Módulo anterior', nextSlideMessage: 'Módulo siguiente' }}
            coverflowEffect={{ rotate: 14, stretch: 0, depth: 140, modifier: 1, scale: 0.86, slideShadows: false }}
            onSwiper={(s) => { swiperRef.current = s }}
            onSlideChange={(s) => setActive(s.activeIndex)}
            style={{ width: '100%', height: '100%', padding: '14px 0' }}
          >
            {MODULES.map((m, i) => {
              const isActive = i === active
              const Icon = m.Icon
              return (
                <SwiperSlide
                  key={m.id}
                  aria-label={`${m.name}, ${i + 1} de ${MODULES.length}`}
                  style={{ width: 'min(74vw, 300px)', height: '100%' }}
                >
                  {/* Flotar solo la activa — ver @keyframes inkFloat arriba. */}
                  <div className={`h-full ${isActive ? 'ink-float' : ''}`}>
                    <article
                      className="relative h-full overflow-hidden rounded-lg border p-5 flex flex-col justify-between backdrop-blur-md transition-[border-color,box-shadow] duration-500"
                      style={{
                        background: `linear-gradient(160deg, ${m.color}33 0%, rgba(0,0,0,0.58) 62%)`,
                        borderColor: isActive ? m.color : 'rgba(255,255,255,0.14)',
                        boxShadow: isActive ? `0 18px 40px -18px ${m.color}` : 'none',
                      }}
                    >
                      {/* Ícono grande de fondo — es lo que se ve en las cards
                          de los lados, como el póster de un catálogo. */}
                      <Icon
                        aria-hidden="true"
                        size={190}
                        strokeWidth={1}
                        className="absolute -right-5 -bottom-5 pointer-events-none"
                        style={{ opacity: 0.1, color: m.color }}
                      />

                      <div className="relative">
                        {/* Card de INK: la caligrafía del banner reemplaza el
                            ícono y la palabra "INK" (2026-11-21, Jose: "la
                            imagen... va a reemplazar el icono y la palabra
                            ink").
                            Corrección (2026-11-21, Jose: "el título de la
                            card del módulo INK está quedando encima del logo
                            INK"): antes el logo era absoluto (arriba a la
                            izquierda, h-20) y el título lo cruzaba por
                            delante, con contorno y sombra para leerse sobre
                            el arte blanco. Ahora los dos van en el flujo
                            normal y en la MISMA fila (2026-11-21, Jose:
                            "ponlo al frente del logo, para que logo y título
                            ocupen una misma fila, así ganar espacio" — el
                            botón "Entrar" se cortaba abajo): logo a la
                            izquierda, título a su lado. Ocupan una sola
                            altura en vez de dos, y al ir cada uno en su
                            propia columna nunca se tocan. Sin superposición
                            ya no hacen falta el contorno ni la sombra: el
                            título queda igual que el de las otras cards.
                            flex-shrink-0 evita que el título aplaste el
                            logo. El logo mide h-16 y sube a h-20 en
                            pantallas altas. */}
                        {m.id === 'ink' ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={inkMark}
                              alt={m.eyebrow}
                              className="block h-16 w-auto flex-shrink-0 pointer-events-none [@media(min-height:760px)]:h-20"
                            />
                            <h2 className="min-w-0 text-2xl font-bold leading-tight tracking-wide text-white">
                              {m.name}
                            </h2>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <Icon size={16} aria-hidden="true" style={{ color: m.color }} />
                              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
                                {m.eyebrow}
                              </span>
                            </div>
                            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-wide text-white">
                              {m.name}
                            </h2>
                          </>
                        )}
                      </div>

                      {/* Información extra: solo visible y enfocable en la
                          card activa. */}
                      <div
                        className="relative transition-all duration-500"
                        style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'none' : 'translateY(8px)' }}
                        aria-hidden={!isActive}
                      >
                        <p className="text-sm leading-relaxed text-white/80 [@media(max-height:700px)]:hidden">
                          {m.tagline}
                        </p>
                        <ul className="mt-3 flex flex-col gap-1.5">
                          {m.facts.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-[13px] text-white/90">
                              <span
                                aria-hidden="true"
                                className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full"
                                style={{ backgroundColor: m.color }}
                              />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Link
                          to={m.to}
                          tabIndex={isActive ? 0 : -1}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded py-3 text-center font-medium uppercase tracking-wide transition-opacity duration-300 hover:opacity-90"
                          style={{ backgroundColor: m.color, color: m.on }}
                        >
                          Entrar <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>

          {/* Flechas — solo desktop; en móvil se desliza con el dedo. */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={active === 0}
            aria-label="Módulo anterior"
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm cursor-pointer transition-opacity hover:bg-white/20 disabled:opacity-30 disabled:cursor-default"
          >
            <ChevronLeft size={20} aria-hidden="true" />
 </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={active === MODULES.length - 1}
            aria-label="Módulo siguiente"
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm cursor-pointer transition-opacity hover:bg-white/20 disabled:opacity-30 disabled:cursor-default"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Paginación — un punto por módulo, el activo se alarga y toma el
            color del módulo. */}
        <div className="mt-1 flex items-center gap-2.5" role="group" aria-label="Elegir módulo">
          {MODULES.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir a ${m.name}`}
              aria-current={i === active}
              className="h-2 rounded-full border-none p-0 cursor-pointer transition-all duration-300"
              style={{ width: i === active ? 24 : 8, backgroundColor: i === active ? m.color : 'rgba(255,255,255,0.35)' }}
            />
          ))}
        </div>

      </div>

      {/* COPYRIGHT — mismo tamaño/estilo que los footers de los módulos
          (2026-09-16, Jose: "que sea consistente con los que ya están
          dentro de los módulos" — el texto acá era text-xs uppercase
          tracking-widest, mucho más grande/pesado que el
          text-[9.5px] sm:text-[12px] en frase normal que ya usan
          FooterSupply.jsx y el resto). */}
      {/* Texto blanco (2026-09-21, Jose: "el copyright en la home del
          ecosistema debería ser más claro, o blanco, para que se pueda
          entender") — era text-zinc-600, casi invisible sobre la imagen
          oscura del fondo. Con una sombra suave para que también se lea
          donde la imagen tiene zonas claras (el fondo de móvil). Los links
          de Términos/Privacidad ya no pueden usar "hover:text-white" como
          señal (ahora son blancos de base): subrayan al pasar el mouse. */}
      <div className="relative z-10 w-full text-center pb-2 sm:pb-3 shrink-0" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.75)' }}>
        <p className="text-white text-[9.5px] sm:text-[12px]">
          © 2026 INKognito. Todos los derechos reservados.
        </p>
        <div className="flex justify-center items-center gap-6 mt-2 text-[12px]">
          {/* Botones, no Links (2026-09-15) — abren el modal en vez de
              navegar a /terminos //privacidad, ver comentario de estado
              arriba. */}
          <button type="button" onClick={() => setLegalOpen('terminos')} className="text-white hover:underline underline-offset-2 transition-colors">
            Términos
          </button>
          <button type="button" onClick={() => setLegalOpen('privacidad')} className="text-white hover:underline underline-offset-2 transition-colors">
            Privacidad
          </button>
        </div>
      </div>

      <LegalModal type={legalOpen} variant="ecosystem" onClose={() => setLegalOpen(null)} />
    </section>
  )
}