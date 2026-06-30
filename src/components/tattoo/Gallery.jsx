import React, { useState, useEffect } from 'react';
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

const GALLERY_ITEMS = [
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

export default function Gallery({ onLightboxChange = () => {} }) {
  const [selected, setSelected] = useState(null)

  const openLightbox = (index) => { setSelected(index); onLightboxChange(true) }
  const closeLightbox = () => { setSelected(null); onLightboxChange(false) }

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
    setSelected((prev) => (prev + 1) % GALLERY_ITEMS.length)
  }

  const goPrev = () => {
    setSelected((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)
  }

  return (
    <section id="galeria" className="pt-24 pb-12 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4">

        {/* TITULO */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase">
            Portafolio
          </h2>
          <div className="h-1 w-20 bg-zinc-600 mx-auto mb-6"></div>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light">
            Cada tatuaje cuenta una historia distinta. Esta es una muestra real de mi trabajo
            en realismo, sombras y línea fina, tal como queda después de cada sesión — sin filtros ni retoques.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {GALLERY_ITEMS.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative overflow-y-auto scrollbar-hide rounded-lg aspect-square bg-gray-900 cursor-pointer"
            >
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                className="block w-full h-auto"
                style={{ filter: 'contrast(1.12) saturate(1.15)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none">
                <p className="text-zinc-300 text-sm font-bold uppercase tracking-widest mb-1">
                  {item.category}
                </p>
                <h3 className="text-white text-2xl font-black italic">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* CIERRE ESTRATEGICO */}
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
            src={GALLERY_ITEMS[selected].img}
            alt={GALLERY_ITEMS[selected].title}
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
            {selected + 1} / {GALLERY_ITEMS.length}
          </div>
        </div>
      )}
    </section>
  )
}