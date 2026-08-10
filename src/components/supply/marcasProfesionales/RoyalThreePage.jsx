import { Link, useLoaderData } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Award } from 'lucide-react'
import FooterSupply from '../FooterSupply'
import NavbarCategory from '../NavbarCategory'
import BrandCatalogSection from '../BrandCatalogSection'
import SupplyFAQ from '../SupplyFAQ'
import { getAdjacentBrands } from '../../../data/supplyBrandsOrder'
import { useSupplyVisual } from '../../../hooks/useSupplyVisual'
import { useScrolled } from '../../../hooks/useScrolled'
import { fetchCatalogMarca, fetchSupplyFaq } from '../../../hooks/useCatalog'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
// fase 6.1 (2026-08-07) — id real en `estudios` vinculado a esta marca,
// solo para leer distribuidor_oficial (la insignia paga). Si el fetch
// falla, simplemente no se muestra insignia — no rompe la página.
const ESTUDIO_ID = 7

export async function loader({ request }) {
  const [catalogo, estudioRes, faqItems] = await Promise.all([
    fetchCatalogMarca('supply', 'royal-three'),
    fetch(`${PANEL_URL}/api/estudios/${ESTUDIO_ID}`).catch(() => null),
    fetchSupplyFaq({ marca: 'royal-three' }),
  ])
  const estudio = estudioRes && estudioRes.ok ? await estudioRes.json() : null
  // ?flechas=0 (fase 6.1, bug real de Jose) — quien llega acá desde el
  // perfil de un estudio en el buscador no debe poder saltar a otra
  // marca sin relación; navegando normal desde el menú de Supply, el
  // parámetro no viene y las flechas se ven como siempre.
  const mostrarFlechas = new URL(request.url).searchParams.get('flechas') !== '0'
  return { ...catalogo, distribuidorOficial: estudio?.distribuidor_oficial || false, mostrarFlechas, faqItems }
}

export function meta() {
  const title = 'Royal Three | Insumos para tatuadores — INKognito Supply'
  const description = 'Cremas, jabones y productos de bioseguridad Royal Three para estudios de tatuaje profesionales. Disponibles en Urabá, Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/supply/brands/royal-three` },
  ]
}

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

function InsigniaDistribuidorOficial() {
  return (
    <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-black text-[9px] font-black uppercase tracking-widest bg-amber-400">
      <Award size={10} /> Distribuidor Oficial
    </span>
  )
}

export default function RoyalThreePage() {
  const { products, distribuidorOficial, mostrarFlechas, faqItems } = useLoaderData()
  const logoUrl = useSupplyVisual('supply_brand_royal_three')
  const { prev, next } = getAdjacentBrands(6)
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarCategory pageName="Royal Three" />

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
            <div className="h-24 md:h-40" />
          ) : logoUrl ? (
            <div>
              <div className="float-left w-[180px] mr-6 md:mr-8 mb-2 flex flex-col items-center">
                <img
                  src={logoUrl}
                  alt="Royal Three"
                  className="h-24 md:h-40 w-auto max-w-full object-contain"
                />
                {distribuidorOficial && <InsigniaDistribuidorOficial />}
              </div>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed text-justify [hyphens:auto]">
                Cremas, jabones y productos de bioseguridad desarrollados para estudios
                de tatuaje profesionales. Royal Three combina eficacia clínica con
                formulaciones pensadas para la rutina diaria del tatuador.
              </p>
              <div className="clear-both" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <div className="flex-shrink-0">
                <h1 className="text-4xl md:text-7xl font-black uppercase leading-none">
                  Royal Three
                </h1>
                {distribuidorOficial && <InsigniaDistribuidorOficial />}
              </div>
              <p className="max-w-xl text-zinc-400 text-sm md:text-base leading-relaxed text-justify [hyphens:auto] sm:border-l sm:border-zinc-800 sm:pl-8">
                Cremas, jabones y productos de bioseguridad desarrollados para estudios
                de tatuaje profesionales. Royal Three combina eficacia clínica con
                formulaciones pensadas para la rutina diaria del tatuador.
              </p>
            </div>
          )}

          </div>
        </div>

        <BrandCatalogSection brandName="Royal Three" products={products} />

        <SupplyFAQ items={faqItems} nombre="Royal Three" />

      </div>

      <FooterSupply />
    </div>
  )
}
