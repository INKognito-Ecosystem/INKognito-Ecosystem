import { useState } from 'react'
import { useLoaderData } from 'react-router'
import { Download, ExternalLink, FileText, BadgeCheck, Eye, CheckCircle2 } from 'lucide-react'
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
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://inkognito-ecosystem.com'
  const title = 'Recursos Gratuitos para Tatuadores (PDF y Guías) | INKognito Supply'
  const description = 'Descarga gratis el Consentimiento Informado para Tatuaje en Colombia, el Manual de Bioseguridad PGIRASA (Res. 591/2024), la Tabla de Agujas y Voltajes, y guías oficiales verificadas.'

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Recursos Gratuitos y Descargables para Tatuadores — INKognito Supply',
    description,
    url: `${siteUrl}/supply/aprende/recursos`,
    numberOfItems: RECURSOS_PROPIOS_PDF.length + RECURSOS_EXTERNOS_VERIFICADOS.length,
    itemListElement: [
      ...RECURSOS_PROPIOS_PDF.map((pdf, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'DigitalDocument',
          name: pdf.title,
          description: pdf.description,
          encodingFormat: 'application/pdf',
          isAccessibleForFree: true,
          url: `${siteUrl}${pdf.href}`,
          author: { '@type': 'Organization', name: pdf.author },
        },
      })),
      ...RECURSOS_EXTERNOS_VERIFICADOS.map((ext, idx) => ({
        '@type': 'ListItem',
        position: RECURSOS_PROPIOS_PDF.length + idx + 1,
        item: {
          '@type': 'CreativeWork',
          name: ext.title,
          description: ext.description,
          isAccessibleForFree: true,
          url: ext.url,
          author: { '@type': 'Organization', name: ext.author },
        },
      })),
    ],
  }

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${siteUrl}/supply/aprende/recursos` },
    { 'script:ld+json': itemListLd },
  ]
}

const ACCENT_HEADER = {
  slate: 'from-slate-900 via-slate-800 to-slate-900 border-slate-700/60',
  emerald: 'from-emerald-950 via-emerald-900 to-slate-900 border-emerald-700/50',
  blue: 'from-blue-950 via-blue-900 to-slate-900 border-blue-700/50',
}

export default function RecursosPage() {
  const { recursos } = useLoaderData()
  const [filtro, setFiltro] = useState('todos')

  const showPdfs = filtro === 'todos' || filtro === 'pdfs'
  const showExternos = filtro === 'todos' || filtro === 'externos'

  return (
    <AprendePageShell
      slug="recursos"
      eyebrow="Descarga directa · Herramientas para tatuadores"
      titulo={<>Recursos para<br /><span className="text-zinc-500">pulir tu oficio</span></>}
      descripcion="Guías prácticas, hojas de ejercicios, checklists de bioseguridad y plantillas descargables creadas para ayudarte a mejorar tu precisión, organizar tus sesiones y llevar un estudio más profesional desde hoy."
    >
      {/* FILTRO RÁPIDO TIPO PILLS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-1 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            { id: 'todos', label: `Todos (${RECURSOS_PROPIOS_PDF.length + RECURSOS_EXTERNOS_VERIFICADOS.length})` },
            { id: 'pdfs', label: `PDFs INKognito (${RECURSOS_PROPIOS_PDF.length})` },
            { id: 'externos', label: `Autores verificados (${RECURSOS_EXTERNOS_VERIFICADOS.length})` },
          ].map((tab) => {
            const active = filtro === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFiltro(tab.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                  active
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 1. DESCARGABLES OFICIALES INKOGNITO (PORTADA EDITORIAL + CHIPS + 1-CLIC PDF) */}
      {showPdfs && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 md:pb-12">
          <div className="mb-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
              Descarga directa · PDF gratis
            </p>
            <h2 className="text-base sm:text-xl font-black uppercase text-zinc-900 leading-tight">
              Manuales y formatos INKognito
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECURSOS_PROPIOS_PDF.map((item) => (
              <article
                key={item.id}
                className="border border-zinc-200 hover:border-zinc-300 bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Portada editorial compacta del documento */}
                <div className={`bg-gradient-to-br ${ACCENT_HEADER[item.accent] || ACCENT_HEADER.slate} p-3.5 text-white relative overflow-hidden`}>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-xs border border-white/15 px-2 py-0.5 rounded-md text-white/90">
                      <FileText size={11} />
                      {item.code}
                    </span>
                    <span className="text-[9.5px] font-bold uppercase tracking-wide bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-[13px] sm:text-sm font-bold leading-snug text-white [text-wrap:pretty]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[10px] text-white/65 font-medium">
                    {item.format} · Listo para imprimir
                  </p>
                </div>

                {/* Cuerpo escaneable */}
                <div className="p-3.5 flex flex-col gap-2.5 flex-1">
                  <p className="text-[11.5px] text-zinc-600 leading-relaxed">
                    {item.description}
                  </p>

                  {item.highlights && (
                    <ul className="flex flex-col gap-1 pt-0.5">
                      {item.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-700">
                          <CheckCircle2 size={12} className="text-emerald-600 flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto pt-2.5 border-t border-zinc-100 flex items-center gap-2">
                    <a
                      href={item.href}
                      download={item.fileName}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                    >
                      <Download size={13} />
                      Descargar PDF
                    </a>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver ${item.title}`}
                      className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-zinc-200 hover:border-zinc-400 bg-zinc-50 text-zinc-700 text-[11px] font-bold uppercase tracking-wider transition-colors"
                    >
                      <Eye size={13} />
                      Ver
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 2. GUÍAS Y HERRAMIENTAS DE AUTORES VERIFICADOS */}
      {showExternos && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 md:pb-14">
          <div className={`${showPdfs ? 'pt-6 border-t border-zinc-100' : ''} mb-3.5`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
              Fuentes oficiales · Acceso libre
            </p>
            <h2 className="text-base sm:text-xl font-black uppercase text-zinc-900 leading-tight">
              Guías de autores verificados
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECURSOS_EXTERNOS_VERIFICADOS.map((ext) => (
              <article
                key={ext.id}
                className="border border-zinc-200 hover:border-blue-400 bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Portada editorial emparejada con los manuales INKognito */}
                <div className={`bg-gradient-to-br ${ACCENT_HEADER[ext.accent] || ACCENT_HEADER.blue} p-3.5 text-white relative overflow-hidden`}>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-xs border border-white/15 px-2 py-0.5 rounded-md text-white/95">
                      <BadgeCheck size={11} className="text-sky-300" />
                      {ext.author}
                    </span>
                    <span className="text-[9.5px] font-bold uppercase tracking-wide bg-blue-500/20 border border-blue-400/30 text-blue-200 px-2 py-0.5 rounded-full">
                      {ext.category}
                    </span>
                  </div>
                  <h3 className="text-[13px] sm:text-sm font-bold leading-snug text-white [text-wrap:pretty]">
                    {ext.title}
                  </h3>
                  <p className="mt-1.5 text-[10px] text-white/65 font-medium">
                    Fuente oficial verificada · Acceso gratuito
                  </p>
                </div>

                {/* Cuerpo escaneable */}
                <div className="p-3.5 flex flex-col gap-2.5 flex-1">
                  <p className="text-[11.5px] text-zinc-600 leading-relaxed">
                    {ext.description}
                  </p>

                  {ext.highlights && (
                    <ul className="flex flex-col gap-1 pt-0.5">
                      {ext.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-700">
                          <CheckCircle2 size={12} className="text-blue-600 flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto pt-2.5 border-t border-zinc-100">
                    <a
                      href={ext.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Abrir recurso oficial <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

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
