import { useLoaderData } from 'react-router-dom'
import { PANEL_URL, SeccionAfiliados, AprendePageShell } from './AprendeShared'

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

export function meta() {
  const title = 'Cursos de Tatuaje | INKognito Supply'
  const description = 'Cursos grabados para tatuadores en cualquier etapa: desde fundamentos hasta especialización en realismo, sombras y color. Acceso de por vida, a tu ritmo.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/aprende/cursos` },
  ]
}

export default function CursosPage() {
  const { cursos } = useLoaderData()

  return (
    <AprendePageShell
      slug="cursos"
      eyebrow="Hotmart · Cursos digitales"
      titulo={<>Formación profesional para<br /><span className="text-zinc-500">elevar tu nivel</span></>}
      descripcion="Cursos seleccionados para dominar técnicas avanzadas, gestionar tu estudio y escalar tu marca personal."
    >
      <SeccionAfiliados
        id="cursos"
        titulo="Cursos digitales"
        items={cursos}
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
