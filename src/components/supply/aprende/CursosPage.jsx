import { useState, useMemo } from 'react'
import { useLoaderData } from 'react-router'
import { PANEL_URL, SeccionAfiliados, AprendePageShell } from './AprendeShared'

const normaliza = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const CURSO_FILTERS = [
  { id: 'todos', label: 'Todos', keywords: null },
  {
    id: 'principiantes',
    label: 'Principiantes',
    keywords: ['principiante', 'iniciante', 'pulso', 'autodidacta', 'desde cero', 'basico', 'fundamento'],
  },
  {
    id: 'sombras',
    label: 'Sombras',
    keywords: ['sombra', 'realismo', 'tecnico', 'hernan yepes', 'contraste', 'black and grey', 'negros solidos'],
  },
  {
    id: 'lettering',
    label: 'Lettering',
    keywords: ['lettering', 'caligraf', 'tipograf', 'reinvencion creativa'],
  },
  {
    id: 'color',
    label: 'Color',
    keywords: ['color', 'inkmersion', 'full color'],
    onlyIfMatches: true,
  },
]

function matchesCursoFilter(curso, filter) {
  if (!filter.keywords) return true
  const hay = normaliza(`${curso.name || ''} ${curso.descripcion || ''}`)
  return filter.keywords.some((kw) => hay.includes(kw))
}

export async function loader() {
  try {
    const res = await fetch(`${PANEL_URL}/api/catalog/supply`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const cursos = Object.values(data).flat()
      .filter(p => p.tipo === 'afiliado' && p.categoria === 'Cursos')
      .sort((a, b) => (b.descripcion?.length || 0) - (a.descripcion?.length || 0))
    return { cursos }
  } catch {
    return { cursos: [] }
  }
}

export function meta({ data }) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://inkognito-ecosystem.com'
  const title = 'Cursos de Tatuaje Profesionales | INKognito Supply'
  const description = 'Aprende directo de referentes del tatuaje en español: pulso, fundamentos, sombras saturadas, lettering y gestión de estudio. Acceso inmediato vía Hotmart.'
  const cursos = data?.cursos || []
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cursos Profesionales de Tatuaje — INKognito Supply',
    description,
    url: `${siteUrl}/supply/aprende/cursos`,
    numberOfItems: cursos.length,
    itemListElement: cursos.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        description: c.descripcion || description,
        url: c.variantes?.[0]?.id ? `${siteUrl}/supply/producto/${c.variantes[0].id}` : `${siteUrl}/supply/aprende/cursos`,
        provider: { '@type': 'Organization', name: 'Hotmart · INKognito Supply' },
      },
    })),
  }
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${siteUrl}/supply/aprende/cursos` },
    { 'script:ld+json': itemListLd },
  ]
}

export default function CursosPage() {
  const { cursos } = useLoaderData()
  const [filtro, setFiltro] = useState('todos')

  const filterTabs = useMemo(() => {
    return CURSO_FILTERS
      .map((f) => ({
        ...f,
        count: cursos.filter((c) => matchesCursoFilter(c, f)).length,
      }))
      .filter((f) => !f.onlyIfMatches || f.count > 0)
  }, [cursos])

  const cursosFiltrados = useMemo(() => {
    const active = CURSO_FILTERS.find((f) => f.id === filtro) || CURSO_FILTERS[0]
    return cursos.filter((c) => matchesCursoFilter(c, active))
  }, [cursos, filtro])

  return (
    <AprendePageShell
      slug="cursos"
      eyebrow="Hotmart · Formación verificada · Acceso inmediato"
      titulo={<>Domina la técnica y<br /><span className="text-zinc-500">escala tu estudio</span></>}
      descripcion="Aprende directo de referentes del tatuaje en español: desde pulso, trazos y fundamentos hasta sombras saturadas, lettering y gestión real de agenda. Clases grabadas a tu ritmo con respaldo seguro de Hotmart."
    >
      {/* FILTROS RÁPIDOS POR TEMÁTICA (igual que Recursos) */}
      {cursos.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-1 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filterTabs.map((tab) => {
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
                  {tab.label} ({tab.count})
                </button>
              )
            })}
          </div>
        </div>
      )}

      <SeccionAfiliados
        id="cursos"
        titulo="Cursos digitales"
        items={cursosFiltrados}
        color="orange"
        cols="lg:grid-cols-5"
        mostrarTitulo={false}
      />
      {/* Banner de confianza (2026-09-13, propuesta de Jose) — solo cuando
          hay cursos reales que comprar; texto genérico y verificable sobre
          Hotmart como procesador de pagos, sin inventar un número de
          reseñas/estrellas ni un plazo de garantía que no se ha confirmado
          que aplique a cada curso. */}
      {cursos.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-8 md:pb-12">
          <div className="border border-zinc-200 rounded-2xl px-6 py-5 text-center">
            <p className="text-zinc-600 text-xs md:text-sm leading-relaxed">
              Pagos 100% seguros. Accede a tu contenido desde cualquier dispositivo a través de la
              infraestructura de Hotmart.
            </p>
          </div>
        </div>
      )}
    </AprendePageShell>
  )
}
