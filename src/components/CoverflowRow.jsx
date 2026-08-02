import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Autoplay } from 'swiper/modules'
import { Children, useRef } from 'react'
import 'swiper/css'
import 'swiper/css/effect-coverflow'

// Reemplazo de ScrollFocusRow.jsx usando Swiper (módulo EffectCoverflow) en
// vez de la implementación a mano — el hand-rolled recalculaba
// getBoundingClientRect() de todas las cards clonadas en cada frame de
// scroll y actualizaba filter:blur() vía React state, lo que en celular se
// sentía tosco por lo caro que es repintar blur en varios elementos a la
// vez. Swiper hace lo mismo (loop infinito, card central grande y nítida,
// las de al lado más chicas/opacas/borrosas) con CSS + transform
// compuestos por el navegador, mucho más liviano (2026-08-02, reemplaza el
// prototipo anterior tras reportarse como "brusco y veloz").
//
// Solo aplica en móvil — en desktop se oculta y se muestra `desktopChildren`
// (el grid normal de siempre) sin ningún efecto, igual que antes.
//
// `stopAtIndex` (opcional): si se pasa, el autoplay no gira infinito para
// siempre — avanza exactamente una vuelta completa (items.length pasos)
// más el offset necesario para terminar posado en ese índice real, y ahí se
// detiene solo (swiper.autoplay.stop()), dejando la card elegida al centro.
// Pasa una sola vez por sesión de la página porque el contador vive en un
// ref que nace en 0 en cada montaje del componente — "el usuario entra,
// ve la vuelta una sola vez" (2026-08-02, pedido para Categorías→Cartuchos y
// Marcas→Warlock, "no sería justo tenerlo girando todo el tiempo").
//
// El conteo de pasos usa `swiper.realIndex` (deduplicado contra el último
// valor visto) en vez de contar eventos `slideChange` en crudo — con
// `loop:true` Swiper dispara `slideChange` de más al hacer el salto interno
// entre el set real y los clones, así que contar eventos crudos infla el
// contador y hace que se detenga antes de tiempo, en una card equivocada
// (bug real reportado: en Marcas paraba en WJX en vez de Warlock). Al
// comparar contra el índice real anterior, esos eventos duplicados se
// ignoran y el conteo queda fiel a los avances visuales de verdad.
//
// `onAutoplayStop` (opcional): se llama una vez, justo cuando el autoplay
// se detiene — así el padre puede mostrar la flechita de "Desliza" recién
// en ese momento en vez de desde el primer render.
//
// `autoplay` (default true): en `false` el carrusel no se mueve solo al
// entrar — queda estático, controlado 100% por el usuario (swipe/drag),
// pedido explícito para las card de categorías de Gym, a diferencia de
// Categorías/Marcas de Supply que sí hacen su vuelta automática
// (2026-08-02).
export default function CoverflowRow({ children, desktopClassName = '', slidesPerView = 1.6, autoplayDelay = 2800, autoplay = true, stopAtIndex, onAutoplayStop }) {
  const items = Children.toArray(children)
  const stepsRef = useRef(0)
  const lastRealIndexRef = useRef(0)
  const stoppedRef = useRef(false)
  const targetSteps = stopAtIndex != null ? items.length + stopAtIndex : null

  const handleSlideChange = (swiper) => {
    if (targetSteps == null || stoppedRef.current) return
    if (swiper.realIndex === lastRealIndexRef.current) return
    lastRealIndexRef.current = swiper.realIndex
    stepsRef.current += 1
    if (stepsRef.current >= targetSteps) {
      stoppedRef.current = true
      swiper.autoplay.stop()
      onAutoplayStop?.()
    }
  }

  return (
    <>
      <Swiper
        modules={autoplay ? [EffectCoverflow, Autoplay] : [EffectCoverflow]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        slidesPerView={slidesPerView}
        spaceBetween={16}
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 140, modifier: 1.4, slideShadows: false }}
        autoplay={autoplay ? { delay: autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
        speed={700}
        onSlideChange={handleSlideChange}
        className="coverflow-row md:hidden"
      >
        {items.map((child, i) => (
          <SwiperSlide key={i} className="!h-auto">{child}</SwiperSlide>
        ))}
      </Swiper>

      {/* Desktop — mismo contenido, sin Swiper ni efecto, como grid normal */}
      <div className={`hidden ${desktopClassName}`}>
        {items}
      </div>
    </>
  )
}
