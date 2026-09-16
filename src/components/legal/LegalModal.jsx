import { X } from 'lucide-react'
import { TerminosContent, TERMINOS_TITLE, TERMINOS_UPDATED } from './TerminosPage'
import { PrivacidadContent, PRIVACIDAD_TITLE, PRIVACIDAD_UPDATED } from './PrivacidadPage'
import { TerminosArtistasContent, TERMINOS_ARTISTAS_TITLE, TERMINOS_ARTISTAS_UPDATED } from '../artistas/TerminosArtistasPage'
import { PrivacidadArtistasContent, PRIVACIDAD_ARTISTAS_TITLE, PRIVACIDAD_ARTISTAS_UPDATED } from '../artistas/PrivacidadArtistasPage'

// Modal de Términos/Privacidad, en vez de navegar a /terminos o /privacidad
// (2026-09-15, Jose: "cuando le doy a políticas o privacidad, estando en
// algún navbar este se sale y abre un modal negro, la idea es que sea como
// lo que ya solucionamos [el modal de "Sobre INKognito" en
// EcosystemNavbar.jsx] — el modal abre directo donde estoy... ahora es
// blanco... ocupa toda la pantalla, lo mismo si le doy desde el copyright").
// Reusa el MISMO contenido/título/fecha que ya viven en TerminosPage.jsx /
// PrivacidadPage.jsx / TerminosArtistasPage.jsx / PrivacidadArtistasPage.jsx
// (esas rutas siguen existiendo tal cual, para quien llega por link directo
// o buscador) — acá solo cambia el contenedor: overlay blanco siempre (a
// diferencia de la ruta /terminos y /privacidad genéricas, que son de tema
// oscuro), en vez de una página nueva que reemplaza todo.
// z-[95]: por encima de cualquier otro overlay del sitio (menús z-50/70,
// modal "Sobre INKognito" z-80, drawers de carrito).
const CONTENT = {
  ecosystem: {
    terminos: { Content: TerminosContent, title: TERMINOS_TITLE, updated: TERMINOS_UPDATED },
    privacidad: { Content: PrivacidadContent, title: PRIVACIDAD_TITLE, updated: PRIVACIDAD_UPDATED },
  },
  artistas: {
    terminos: { Content: TerminosArtistasContent, title: TERMINOS_ARTISTAS_TITLE, updated: TERMINOS_ARTISTAS_UPDATED },
    privacidad: { Content: PrivacidadArtistasContent, title: PRIVACIDAD_ARTISTAS_TITLE, updated: PRIVACIDAD_ARTISTAS_UPDATED },
  },
}

export default function LegalModal({ type, variant = 'ecosystem', onClose }) {
  if (!type) return null
  const { Content, title, updated } = CONTENT[variant][type]

  return (
    <div className="fixed inset-0 z-[95] bg-white overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-4 py-4 flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      <section className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-2 text-gray-900">
          {title}
        </h1>
        <p className="text-gray-400 text-sm mb-10">Última actualización: {updated}</p>

        <div
          className="space-y-8 text-gray-600 font-light leading-relaxed
            [&_h2]:text-gray-900 [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-lg [&_h2]:mb-3
            [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-gray-700 [&_a]:underline
            [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse
            [&_th]:text-left [&_th]:border-b [&_th]:border-gray-200 [&_th]:pb-2 [&_th]:pr-4
            [&_td]:border-b [&_td]:border-gray-100 [&_td]:py-2 [&_td]:pr-4"
        >
          <Content />
        </div>
      </section>
    </div>
  )
}
