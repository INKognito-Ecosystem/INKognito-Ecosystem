import { Link, useLoaderData } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Award } from 'lucide-react'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import AccordionCard from '../AccordionCard'
import { getAdjacentBrands } from '../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../hooks/useSupplyVisual'
import { useScrolled } from '../../../hooks/useScrolled'
import { fetchCatalogMarca } from '../../../hooks/useCatalog'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// fase 6.1 (2026-08-07) — id real en `estudios` vinculado a esta marca,
// solo para leer distribuidor_oficial (la insignia paga). Si el fetch
// falla, simplemente no se muestra insignia — no rompe la página.
const ESTUDIO_ID = 5

// Antes esta página era de Kwadron (cartuchos, /supply/cartridges/kwadron,
// components/supply/categories/Cartridges/KwadronCartridgesPage.jsx).
// Reemplazada por Industrias Warlock (mobiliario) y movida acá — decisión
// de Jose (2026-08-01). El slug de marca interno sigue siendo 'kwadron' a
// propósito: el logo ya se subió en el panel bajo esa misma clave
// (supply_brand_kwadron) y cambiarla rompería esa imagen.
export async function loader({ request }) {
  const [catalogo, estudioRes] = await Promise.all([
    fetchCatalogMarca('supply', 'kwadron'),
    fetch(`${PANEL_URL}/api/estudios/${ESTUDIO_ID}`).catch(() => null),
  ])
  const estudio = estudioRes && estudioRes.ok ? await estudioRes.json() : null
  // ?flechas=0 (fase 6.1, bug real de Jose) — quien llega acá desde el
  // perfil de un estudio en el buscador no debe poder saltar a otra
  // marca sin relación; navegando normal desde el menú de Supply, el
  // parámetro no viene y las flechas se ven como siempre.
  const mostrarFlechas = new URL(request.url).searchParams.get('flechas') !== '0'
  return { ...catalogo, distribuidorOficial: estudio?.distribuidor_oficial || false, mostrarFlechas }
}

export function meta() {
  const title = 'Industrias Warlock | INKognito Supply — Colombia'
  const description = 'Industrias Warlock: mobiliario profesional para estudios de tatuaje — camillas, sillas y equipamiento para tu espacio de trabajo. Disponible en Urabá, Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/mobiliario/warlock` },
  ]
}

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

const faq = [
  {
    question: '¿Qué tipo de mobiliario ofrece Industrias Warlock?',
    answer:
      'Mobiliario profesional para estudios de tatuaje — camillas, sillas y equipamiento pensado para el flujo real de trabajo de un tatuador.'
  },
  {
    question: '¿Cómo pido una cotización?',
    answer:
      'Agenda online o Escríbenos por WhatsApp contándonos qué necesitas para tu estudio y te ayudamos a coordinar el pedido con Industrias Warlock.'
  },
  {
    question: '¿De dónde es la marca Industrias Warlock?',
    answer:
      'Industrias Warlock fabrica su mobiliario en Bogotá y envía a toda Colombia — no es un proveedor local de Urabá como el resto del catálogo Supply.'
  },
]

function InsigniaDistribuidorOficial() {
  return (
    <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-black text-[9px] font-black uppercase tracking-widest bg-amber-400">
      <Award size={10} /> Distribuidor Oficial
    </span>
  )
}

export default function IndustriasWarlockPage() {
  const { products, distribuidorOficial, mostrarFlechas } = useLoaderData()
  const logoUrl = useSupplyVisual('supply_brand_kwadron')
  const { prev, next } = getAdjacentBrands(1)
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="Industrias Warlock" />

      {mostrarFlechas && scrolled && (
        <>
          <Link
            to={prev.path} replace
            aria-label={`Ver ${prev.name}`}
            className="fixed top-16 md:top-20 left-2 md:left-4 z-40 text-zinc-400 hover:text-white bg-black/60 backdrop-blur-sm border border-zinc-800 rounded-full p-2 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <Link
            to={next.path} replace
            aria-label={`Ver ${next.name}`}
            className="fixed top-16 md:top-20 right-2 md:right-4 z-40 text-zinc-400 hover:text-white bg-black/60 backdrop-blur-sm border border-zinc-800 rounded-full p-2 transition-colors"
          >
            <ArrowRight size={20} />
          </Link>
        </>
      )}

      <div className="pt-20 md:pt-24 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="relative overflow-hidden mb-6 md:mb-8">
          <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
          <div className="relative z-10">

          <div className="flex items-center justify-between gap-3 mb-3">
            {mostrarFlechas ? (
              <Link to={prev.path} replace aria-label={`Ver ${prev.name}`} className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft size={18} />
              </Link>
            ) : <span />}
            <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm text-center flex-1">
              Marca Profesional
            </p>
            {mostrarFlechas ? (
              <Link to={next.path} replace aria-label={`Ver ${next.name}`} className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors">
                <ArrowRight size={18} />
              </Link>
            ) : <span />}
          </div>

          {logoUrl === undefined ? (
            <div className="h-20 md:h-32" />
          ) : logoUrl ? (
            <div className="text-zinc-400 leading-relaxed text-justify [hyphens:auto] space-y-2">
              {/* Mismo tamaño de caja que el resto de marcas (w-180px,
                  h-20/h-32) — el archivo subido tiene fondo negro sólido (no
                  transparente) alrededor del logo. object-cover recorta un
                  poco el piñón del diseño pero llena el espacio parejo con
                  las demás marcas — decisión de Jose, prefiere esto a que
                  se vea chico con object-contain. */}
              <div className="float-left w-[180px] mr-6 md:mr-8 mb-2 flex flex-col items-start">
                <div className="w-full h-20 md:h-32 overflow-hidden">
                  <img
                    src={logoUrl}
                    alt="Industrias Warlock"
                    className="w-full h-full object-cover"
                  />
                </div>
                {distribuidorOficial && <InsigniaDistribuidorOficial />}
              </div>

              <p>
                Industrias Warlock es un fabricante de mobiliario profesional para
                estudios de tatuaje — camillas, sillas y equipamiento pensado para
                el trabajo diario de un tatuador.
              </p>

              <p>
                Un buen mobiliario no solo es comodidad para el cliente: también es
                postura, resistencia y durabilidad para quien trabaja horas seguidas
                en cada sesión.
              </p>

              <p>
                En esta sección encontrarás el mobiliario disponible de Industrias
                Warlock para equipar tu estudio.
              </p>

              <div className="clear-both" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <div className="flex-shrink-0">
                <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
                  Industrias Warlock
                </h1>
                {distribuidorOficial && <InsigniaDistribuidorOficial />}
              </div>

              <div className="max-w-xl text-zinc-400 leading-relaxed text-justify [hyphens:auto] space-y-2 sm:border-l sm:border-zinc-800 sm:pl-8">

                <p>
                  Industrias Warlock es un fabricante de mobiliario profesional para
                  estudios de tatuaje — camillas, sillas y equipamiento pensado para
                  el trabajo diario de un tatuador.
                </p>

                <p>
                  Un buen mobiliario no solo es comodidad para el cliente: también es
                  postura, resistencia y durabilidad para quien trabaja horas seguidas
                  en cada sesión.
                </p>

                <p>
                  En esta sección encontrarás el mobiliario disponible de Industrias
                  Warlock para equipar tu estudio.
                </p>

              </div>
            </div>
          )}

          </div>
        </div>

        <BrandCatalogSection
          brandName="Industrias Warlock"
          products={products}
          supplierBadge="Productos fabricados por Industrias Warlock — mobiliario para estudios de tatuaje"
        />

        <section className="mt-10 md:mt-14">
          <AccordionCard
            icon="❓"
            title="Preguntas frecuentes"
            subtitle="Todo lo que necesitas saber sobre Industrias Warlock antes de tu pedido. Toca para ver las respuestas."
          >
            <div className="flex flex-col gap-5">
              {faq.map((item, i) => (
                <div key={i} className={i < faq.length - 1 ? 'pb-5 border-b border-zinc-800' : ''}>
                  <p className="font-bold text-white text-sm mb-2">{item.question}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </AccordionCard>
        </section>

      </div>

      <FooterSupply />

    </div>
  )
}
