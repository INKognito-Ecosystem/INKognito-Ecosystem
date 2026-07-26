import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import imgPoseidon from '../../assets/portafolio/poseidon.webp';
import imgPoseidon2 from '../../assets/portafolio/poseidon2.webp';
import imgAguila from '../../assets/portafolio/aguila.webp';
import imgAngelCaido from '../../assets/portafolio/angel-caido.webp';
import imgColibri from '../../assets/portafolio/colibri.webp';
import Ojoyfiligrana from '../../assets/portafolio/ojoyfiligrana.webp';
import imgLineafina from '../../assets/portafolio/lineafina.webp';
import imgRepresentativo1 from '../../assets/portafolio/representativo1.webp';
import imgRepresentativo2 from '../../assets/portafolio/representativo2.webp';
import imgRepresentativo3 from '../../assets/portafolio/representativo3.webp';

// Respaldo — se muestra mientras carga o si el panel aún no tiene fotos cargadas
const FALLBACK_ITEMS = [
  { id: 1, title: 'Sombras', img: imgPoseidon, category: 'Realismo' },
  { id: 2, title: 'Sombras', img: imgPoseidon2, category: 'Realismo' },
  { id: 3, title: 'Sombras', img: imgAguila, category: 'Realismo' },
  { id: 4, title: 'Minimalista', img: imgAngelCaido, category: 'Línea fina' },
  { id: 5, title: 'Sombras', img: imgColibri, category: 'Realismo' },
  { id: 6, title: 'Sombras', img: Ojoyfiligrana, category: 'Realismo' },
  { id: 7, title: 'Minimalista', img: imgLineafina, category: 'Línea fina' },
  { id: 8, title: 'Sombras', img: imgRepresentativo1, category: 'Realismo' },
  { id: 9, title: 'Sombras', img: imgRepresentativo2, category: 'Realismo' },
  { id: 10, title: 'Sombras', img: imgRepresentativo3, category: 'Realismo' },
]

// items llega resuelto por el loader de la ruta (src/routes/PortfolioPage.jsx)
// — ya no se hace fetch acá adentro. Si el panel no tenía nada cargado (o
// falló), el loader devuelve null y acá se usa el respaldo del código.
// `compact`: usado por la landing de pauta (JhumaneztattooAgenda.jsx), donde
// la galería va pegada al hero en vez de debajo de un navbar completo como en
// /portafolio — reduce espaciados y mete más miniaturas por fila sin tocar
// cómo se ve /portafolio (que sigue usando los valores por defecto).
// 4 en móvil/tablet, 5 en desktop (grid compacto es lg:grid-cols-5 — con 5
// la última fila queda completa en vez de dejar un hueco). La 5ta se oculta
// con CSS bajo lg: en vez de manejar el conteo en JS, así no hace falta
// escuchar resize.
const INICIALES = 5

export default function Gallery({ items: itemsFromLoader, onLightboxChange = () => {}, compact = false }) {
  const [selected, setSelected] = useState(null)
  const [mostrarTodas, setMostrarTodas] = useState(false)
  const items = itemsFromLoader && itemsFromLoader.length > 0 ? itemsFromLoader : FALLBACK_ITEMS
  // Muestra solo las primeras 4-5 hasta que pidan ver más — el índice de cada
  // una coincide con su posición real en `items` (el slice siempre arranca
  // en 0), así que el lightbox no necesita ningún ajuste de índice.
  const visibles = mostrarTodas ? items : items.slice(0, INICIALES)

  const openLightbox = (index) => { setSelected(index); onLightboxChange(true) }
  const closeLightbox = () => { setSelected(null); onLightboxChange(false) }

  // Si la lista cambia de tamaño (llegan las fotos reales del panel) mientras
  // el lightbox está abierto en un índice que ya no existe, lo cierra.
  useEffect(() => {
    if (selected !== null && selected >= items.length) closeLightbox()
  }, [items])

  // Cierra con Escape y bloquea scroll
  useEffect(() => {
    if (selected === null) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected])

  const goNext = () => {
    setSelected((prev) => (prev + 1) % items.length)
  }

  const goPrev = () => {
    setSelected((prev) => (prev - 1 + items.length) % items.length)
  }

  return (
    <section id="galeria" className={compact ? 'pt-6 pb-8 md:pt-10 md:pb-12 bg-black' : 'pt-24 pb-12 md:py-24 bg-black'}>
      <div className="max-w-7xl mx-auto px-4">

        {/* TITULO */}
        <div className={compact ? 'text-center mb-4 md:mb-6' : 'text-center mb-8 md:mb-16'}>
          <h2 className={compact ? 'text-2xl md:text-4xl font-black mb-2 tracking-tighter uppercase' : 'text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase'}>
            Portafolio
          </h2>
          {!compact && <div className="h-1 w-20 bg-zinc-600 mx-auto mb-6"></div>}
          <p className={compact ? 'text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light' : 'text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light'}>
            {compact
              ? 'Una muestra real de mi trabajo'
              : 'Cada tatuaje cuenta una historia distinta. Esta es una muestra real de mi trabajo en realismo, sombras y línea fina, tal como queda después de cada sesión — sin filtros ni retoques.'}
          </p>
        </div>

        {/* GRID */}
        <div className={compact ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3' : 'grid grid-cols-2 lg:grid-cols-3 gap-4'}>
          {visibles.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className={[
                !mostrarTodas && index === 4 ? 'hidden lg:block' : '',
                compact ? 'group relative overflow-hidden rounded aspect-square bg-gray-900 cursor-pointer' : 'group relative overflow-hidden rounded-lg aspect-square bg-gray-900 cursor-pointer',
              ].join(' ')}
            >
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                className="object-cover w-full h-full"
                style={{ filter: 'contrast(1.12) saturate(1.15)' }}
              />
              {/* opacity-100 por defecto: en móvil no hay :hover, así que sin
                  esto el botón "Ver" nunca se veía (aunque el click en la
                  imagen sí abría el lightbox, por estar en el div padre).
                  Desde md: vuelve a depender de group-hover como en PC. */}
              <div className="absolute inset-0 bg-black/25 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest">
                  <Eye size={11} />
                  Ver
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* En móvil/tablet solo se ven 4 (la 5ta está con hidden lg:block) —
            el botón debe aparecer desde que sobra una más allá de esas 4,
            aunque items.length sea apenas 5 (ahí la 5ta ya es visible en
            desktop pero seguiría escondida en móvil sin este botón). */}
        {!mostrarTodas && items.length > 4 && (
          <div className="text-center mt-5 md:mt-6">
            <button
              type="button"
              onClick={() => setMostrarTodas(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest hover:border-zinc-500 hover:text-white transition-colors"
            >
              Ver más ({items.length - INICIALES})
            </button>
          </div>
        )}

        {/* CIERRE ESTRATEGICO — en compact (landing de pauta) esto vive
            fusionado con el formulario en AgendaPublica.jsx, no acá. */}
        {!compact && (
          <div className="text-center mt-12 md:mt-20 max-w-2xl mx-auto px-2">
            <div className="h-1 w-20 bg-zinc-600 mx-auto mb-6"></div>
            <h3 className="text-2xl md:text-3xl font-black uppercase italic mb-4">
              ¿Ya tienes una idea en mente?
            </h3>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light">
              Cada proyecto empieza con una buena conversación. Cuéntame qué quieres tatuarte
              y trabajemos juntos en una pieza que se vea tan bien en años como el día que saliste del estudio.
            </p>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {selected !== null && (
        <div
          onClick={() => closeLightbox()}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* X CERRAR */}
          <button
            onClick={() => closeLightbox()}
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '32px',
              cursor: 'pointer',
              lineHeight: 1,
              zIndex: 101,
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* FLECHA IZQUIERDA */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            style={{
              position: 'absolute',
              left: '16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '24px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 101,
            }}
            aria-label="Anterior"
          >
            ‹
          </button>

          {/* IMAGEN */}
          <img
            src={items[selected].img}
            alt={items[selected].title}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: '85vh',
              maxWidth: '85vw',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />

          {/* FLECHA DERECHA */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            style={{
              position: 'absolute',
              right: '16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '24px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 101,
            }}
            aria-label="Siguiente"
          >
            ›
          </button>

          {/* CONTADOR */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '13px',
            letterSpacing: '0.2em',
            userSelect: 'none',
          }}>
            {selected + 1} / {items.length}
          </div>
        </div>
      )}
    </section>
  )
}