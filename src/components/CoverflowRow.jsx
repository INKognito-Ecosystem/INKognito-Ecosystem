import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Autoplay } from 'swiper/modules'
import { Children } from 'react'
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
// `autoplay` (default true): en `false` el carrusel no se mueve solo al
// entrar — queda estático, controlado 100% por el usuario (swipe/drag).
// Destacados en Store sigue con autoplay en loop continuo; Categorías y
// Marcas de Supply y las card de categorías de Gym quedaron estáticas
// (2026-08-02 — se probó primero con autoplay + parada automática en una
// card específica ahí, pero se descartó por pedido explícito de Jose a
// favor de dejarlas siempre estáticas, igual que Gym).
export default function CoverflowRow({ children, desktopClassName = '', slidesPerView = 1.6, autoplayDelay = 2800, autoplay = true }) {
  const items = Children.toArray(children)

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
