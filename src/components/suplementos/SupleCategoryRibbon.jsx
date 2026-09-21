import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { SUPLE_CATEGORIES_ORDER } from '../../data/supleCategoriesOrder'

// Listón grafito con las categorías (2026-09-19, Jose: "dentro de cada
// categoría no está el listón, con las categorías debajo del navbar como lo
// está en la page principal") — extraído de MobileHomeSuple.jsx para que el
// home y las 5 páginas de categoría usen exactamente el mismo.
//  - activeSlug: categoría actual (queda con la raya blanca debajo y, al
//    montar, se centra en el listón — cada categoría es su propia ruta, así
//    que el listón se vuelve a montar en cada cambio y arrancaba siempre en
//    "Todos", dejando la categoría actual fuera de vista).
//  - todosActivo: "Todos" resaltado (home sin búsqueda activa).
//  - todosComoLink: en las categorías "Todos" lleva al home; en el home es
//    solo un indicador visual (no navega), igual que en MobileHomeStore.
//  - onInfo: si se pasa, agrega al costado derecho (fijo, fuera del scroll
//    de las categorías) el ícono de libro que abre la descripción de la
//    categoría — así el nombre y el texto no se repiten en el cuerpo de la
//    página (2026-09-19, Jose). Mismo botón que ya usan Supply y Store en su
//    listón (círculo chico w-7 h-7, borde tenue, BookOpen 14) — Jose:
//    "en supply no está así, la idea es tener consistencia con el
//    ecosistema"; la primera versión era una franja alta con divisor.
export default function SupleCategoryRibbon({ activeSlug = null, todosActivo = false, todosComoLink = false, onInfo = null }) {
  const listRef = useRef(null)
  const nombreActivo = SUPLE_CATEGORIES_ORDER.find(c => c.slug === activeSlug)?.name
  const base = 'flex-shrink-0 text-[13px] font-extrabold pb-1.5 border-b-2 whitespace-nowrap'
  const on = 'text-white border-white'
  const off = 'text-white/70 border-transparent'

  useLayoutEffect(() => {
    const lista = listRef.current
    const activo = lista?.querySelector('[aria-current="page"]')
    if (!lista || !activo) return
    const izquierdaRelativa = activo.getBoundingClientRect().left - lista.getBoundingClientRect().left + lista.scrollLeft
    lista.scrollLeft = Math.max(0, izquierdaRelativa - (lista.clientWidth - activo.offsetWidth) / 2)
  }, [activeSlug])

  return (
    <div className="flex items-center gap-2 bg-zinc-700">
      <div
        ref={listRef}
        className="flex flex-1 min-w-0 gap-5 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {todosComoLink ? (
          <Link to="/suplementos" prefetch="viewport" className={`${base} ${off}`}>Todos</Link>
        ) : (
          <span className={`${base} ${todosActivo ? on : 'text-white/60 border-transparent'}`}>Todos</span>
        )}
        {SUPLE_CATEGORIES_ORDER.map(cat => (
          <Link
            key={cat.slug}
            to={cat.link}
            prefetch="viewport"
            aria-current={activeSlug === cat.slug ? 'page' : undefined}
            className={`${base} ${activeSlug === cat.slug ? on : off}`}
          >
            {cat.name}
          </Link>
        ))}
        {/* Enlace al módulo Gym System (2026-09-20, Jose: "en el listón de
            categorías de suple, agrega la ruta a gym system") — al final,
            después de las 5 categorías; no es una categoría, lleva a otro
            módulo (como "Suplementos" en el listón de Gym). */}
        <Link to="/gym" prefetch="viewport" className={`${base} ${off}`}>Gym System</Link>
      </div>
      {onInfo && (
        <button
          type="button"
          onClick={onInfo}
          aria-label={`Sobre ${(nombreActivo || 'la categoría').toLowerCase()}`}
          className="flex-shrink-0 mr-4 w-7 h-7 rounded-full border border-white/50 flex items-center justify-center text-white"
        >
          <BookOpen size={14} />
        </button>
      )}
    </div>
  )
}
