import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

// El meta() de SEO ya no se maneja acá — cada página que usa LegalPage
// (PrivacidadPage/TerminosPage/EnviosPage) exporta su propio meta() de ruta,
// para SSR real sin mezclar con <Seo>/Helmet (ver nota en HomePage.jsx sobre
// por qué mezclar ambos rompe la hidratación).
// theme="light" (2026-08-06, Jose: "la page de políticas del directorio
// debe ser de fondo blanco y no de negro") — el resto del ecosistema usa
// el fondo negro de siempre; el módulo de artistas es blanco/rojo/gris
// en todas sus otras pantallas, así que sus páginas legales pasan
// theme="light" para no ser la única pantalla oscura de ese módulo.
export default function LegalPage({ title, updated, children, theme = 'dark' }) {
  const navigate = useNavigate()
  // "Volver" con historial (2026-08-06, Jose: "cuando le doy volver a
  // INKognito me lleva a la página principal del ecosystem, y no donde
  // estaba antes de entrar a términos") — antes era un link fijo a "/",
  // sin importar desde qué módulo (Supply, un perfil de artista, etc.)
  // se hubiera llegado acá. navigate(-1) regresa exactamente a esa
  // página, y solo cae a "/" si no hay historial previo (ej. alguien
  // entra por un link directo a /terminos, sin haber navegado antes).
  const volver = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }
  const light = theme === 'light'
  return (
    <div className={light ? 'min-h-screen bg-white text-gray-900' : 'min-h-screen bg-black text-white'}>
      <div className="pt-8 px-4 max-w-3xl mx-auto">
        <button
          type="button"
          onClick={volver}
          className={
            light
              ? 'inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 text-xs font-bold uppercase tracking-widest transition-colors'
              : 'inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors'
          }
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      <section className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-2">
          {title}
        </h1>
        <p className={light ? 'text-gray-400 text-sm mb-10' : 'text-zinc-500 text-sm mb-10'}>Última actualización: {updated}</p>

        <div className={
          light
            ? `space-y-8 text-gray-600 font-light leading-relaxed
                [&_h2]:text-gray-900 [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-lg [&_h2]:mb-3
                [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-gray-700 [&_a]:underline
                [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse
                [&_th]:text-left [&_th]:border-b [&_th]:border-gray-200 [&_th]:pb-2 [&_th]:pr-4
                [&_td]:border-b [&_td]:border-gray-100 [&_td]:py-2 [&_td]:pr-4`
            : `space-y-8 text-gray-300 font-light leading-relaxed
                [&_h2]:text-white [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-lg [&_h2]:mb-3
                [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-zinc-300 [&_a]:underline
                [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse
                [&_th]:text-left [&_th]:border-b [&_th]:border-zinc-700 [&_th]:pb-2 [&_th]:pr-4
                [&_td]:border-b [&_td]:border-zinc-800 [&_td]:py-2 [&_td]:pr-4`
        }>
          {children}
        </div>
      </section>
    </div>
  )
}
