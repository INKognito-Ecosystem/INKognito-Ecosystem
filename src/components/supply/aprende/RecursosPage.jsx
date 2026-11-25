import { useLoaderData } from 'react-router'
import { Download, ExternalLink, FileText, BadgeCheck } from 'lucide-react'
import { PANEL_URL, SeccionAfiliados, AprendePageShell } from './AprendeShared'
import { RECURSOS_PROPIOS_PDF, RECURSOS_EXTERNOS_VERIFICADOS } from '../../../data/supplyRecursos'

export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/catalog/supply`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const recursos = Object.values(data).flat()
      .filter(p => p.tipo === 'afiliado' && p.categoria === 'Recursos')
    return { recursos }
  } catch {
    return { recursos: [] }
  }
}

export function meta() {
  const title = 'Recursos para Tatuadores | INKognito Supply'
  const description = 'Guías prácticas, hojas de ejercicios, checklists de bioseguridad y plantillas descargables para mejorar tu precisión y profesionalizar tu estudio.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/aprende/recursos` },
  ]
}

export default function RecursosPage() {
  const { recursos } = useLoaderData()

  return (
    <AprendePageShell
      slug="recursos"
      eyebrow="Descarga directa · Herramientas para tatuadores"
      titulo={<>Recursos para<br /><span className="text-zinc-500">pulir tu oficio</span></>}
      descripcion="Guías prácticas, hojas de ejercicios, checklists de bioseguridad y plantillas descargables creadas para ayudarte a mejorar tu precisión, organizar tus sesiones y llevar un estudio más profesional desde hoy."
    >
      {/* 1. DESCARGABLES PROPIOS OFICIALES DE INKOGNITO SUPPLY (ALOJADOS EN /public/recursos/*.pdf) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-8 md:pb-12">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
            Descarga directa · PDF gratis
          </p>
          <h2 className="text-lg md:text-2xl font-black uppercase text-zinc-900 leading-tight">
            Descargables oficiales INKognito
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4">
          {RECURSOS_PROPIOS_PDF.map((item) => (
            <div
              key={item.id}
              className="border border-emerald-500/30 bg-emerald-500/[0.04] hover:border-emerald-500/60 rounded-2xl p-4 flex flex-col gap-2.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="w-9 h-9 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <FileText size={18} />
                </span>
                <span className="text-[9.5px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug [text-wrap:pretty]">
                {item.title}
              </h3>

              <p className="text-[11px] sm:text-xs text-zinc-600 leading-relaxed flex-1">
                {item.description}
              </p>

              <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-500 pt-1 border-t border-emerald-500/15">
                <span className="inline-flex items-center gap-1 font-semibold text-zinc-700">
                  <BadgeCheck size={12} className="text-emerald-600" />
                  {item.author}
                </span>
                <span>{item.format}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={item.href}
                  download={item.fileName}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  <Download size={13} />
                  Descargar PDF
                </a>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center py-2.5 px-3 rounded-xl border border-zinc-300 hover:border-zinc-400 bg-white text-zinc-700 text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  Ver
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. RECURSOS EXTERNOS DE AUTORES E INSTITUCIONES VERIFICADAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 md:pb-14">
        <div className="pt-6 border-t border-zinc-100 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
            Fuentes oficiales · Acceso libre
          </p>
          <h2 className="text-lg md:text-2xl font-black uppercase text-zinc-900 leading-tight">
            Guías de autores verificados
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:gap-4">
          {RECURSOS_EXTERNOS_VERIFICADOS.map((ext) => (
            <a
              key={ext.id}
              href={ext.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-zinc-200 hover:border-blue-400 bg-white rounded-2xl p-4 flex flex-col gap-2 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  <BadgeCheck size={11} className="text-blue-600" />
                  {ext.author}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                  {ext.category}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-blue-600 leading-snug [text-wrap:pretty] transition-colors">
                {ext.title}
              </h3>

              <p className="text-[11px] sm:text-xs text-zinc-600 leading-relaxed flex-1">
                {ext.description}
              </p>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 pt-1">
                Abrir recurso oficial <ExternalLink size={12} />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 3. RECURSOS ADICIONALES SUBIDOS DESDE EL PANEL (SI EXISTEN) */}
      {recursos.length > 0 && (
        <SeccionAfiliados
          id="recursos"
          titulo="Más recursos"
          items={recursos}
          color="green"
          cols="lg:grid-cols-4"
          mostrarTitulo={false}
        />
      )}
    </AprendePageShell>
  )
}
