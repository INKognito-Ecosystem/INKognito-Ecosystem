import { useLoaderData, redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { CheckCircle2, MapPin, Share2 } from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import NavbarGym from './NavbarGym'
import FooterGym from './FooterGym'
import GymMobileNav from './GymMobileNav'
import GymMaquinaCard from './GymMaquinaCard'
import { fetchCatalogPage } from '../../hooks/useCatalog'
import { urlGoogleMaps } from '../artistas/mapaUrl'
import logoGym from '../../assets/milogo/gym.webp'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const OG_GYM = '/og/gym.webp'

// Página pública de la TIENDA de Gym (2026-09-21, Jose: "solo habrá una
// tienda en este módulo, y será la mía... así podría compartir directamente
// la tienda y no todo el ecosistema completo"). Mismo formato que la página
// de vendedor de Suple/Store (logo + nombre en burbuja, ubicación montada en
// el borde, bio, WhatsApp) pero SIN panel de dueño ni botón de gestión: esta
// tienda se administra solo desde el panel admin.
//
// Las máquinas son las MISMAS de "Máquinas bajo pedido" (mismo fetch, las
// que se suben desde el panel) — mientras haya una sola tienda no se filtra
// por dueño; cuando Gym sea multitenant, pasar a fetchCatalogEstudio.
export async function loader({ params, request }) {
  const url = new URL(request.url)
  let estudio = null
  let maquinas = []
  try {
    const estudioRes = params.slug
      ? await fetch(`${PANEL_URL}/api/estudios-por-slug/${encodeURIComponent(params.slug)}`)
      : await fetch(`${PANEL_URL}/api/estudios/${params.id}`)
    estudio = estudioRes.ok ? await estudioRes.json() : null
  } catch {
    estudio = null
  }
  // Solo tiendas de Gym: /gym/<slug de un vendedor de otro módulo> no debe
  // mostrar a ese vendedor bajo Gym.
  if (estudio && estudio.tipo !== 'gym') estudio = null
  // Link con id numérico — la URL canónica es la del slug.
  if (params.id && estudio?.slug) {
    throw redirect(`/gym/${estudio.slug}${url.search}`)
  }
  if (estudio) {
    try {
      const page = await fetchCatalogPage('gym', { tipo: 'fisico', limit: 100, orden: 'antiguos' })
      maquinas = page.items
    } catch {}
  }
  return { estudio, maquinas }
}

export function meta({ data }) {
  const estudio = data?.estudio
  if (!estudio) return [{ title: 'Tienda no encontrada | INKognito Gym System' }]
  const site = import.meta.env.VITE_SITE_URL
  const title = `${estudio.nombre} | INKognito Gym System`
  const description = estudio.bio || `Máquinas de gym de ${estudio.nombre}, fabricadas con soldadura profesional en Urabá, con envíos a toda Colombia.`
  const canonical = `${site}/gym/${estudio.slug || `estudio/${estudio.id}`}`
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: estudio.logo_url || `${site}${OG_GYM}` },
    { tagName: 'link', rel: 'canonical', href: canonical },
  ]
}

export default function EstudioGymPage() {
  const { estudio, maquinas } = useLoaderData()
  const [shareMsg, setShareMsg] = useState(null)

  if (!estudio) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-zinc-500 text-sm">No encontramos esta tienda.</p>
        <Link to="/gym" className="font-bold underline underline-offset-2 text-zinc-700 text-sm">Ir a Gym System</Link>
      </div>
    )
  }

  // Comparte la tienda (su URL pública) — Web Share API; sin ella, copia el link.
  const compartir = async () => {
    const base = import.meta.env.VITE_SITE_URL || window.location.origin
    const url = `${base}/gym/${estudio.slug || `estudio/${estudio.id}`}`
    if (navigator.share) {
      try { await navigator.share({ title: estudio.nombre, url }) } catch {}
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setShareMsg('Link copiado')
      setTimeout(() => setShareMsg(null), 2000)
    } catch {}
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavbarGym shareTitle={estudio.nombre} />

      <div className="bg-zinc-50 pt-20 md:pt-24 pb-4 px-4 md:px-6">
        <div className="max-w-3xl mx-auto flex items-start gap-3 sm:gap-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex-shrink-0">
            {/* El logo local de Gym viene en un lienzo ancho con mucho aire a los
                lados: sin ampliarlo se ve chico dentro del círculo (Jose:
                "el logo se ve muy pequeño") — se escala para que el ícono llene. */}
            <img
              src={estudio.logo_url || logoGym}
              alt={estudio.nombre}
              className={`w-full h-full ${estudio.logo_url ? 'object-cover' : 'object-contain scale-[1.6]'}`}
            />
          </div>

          <div className="relative max-w-md pb-4 min-w-0 flex-1">
            <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3.5">
              <p className="uppercase tracking-[0.25em] text-zinc-400 text-[10px] font-black mb-1">Tienda de máquinas de gym</p>
              <h1 className="text-lg sm:text-2xl font-black uppercase leading-tight">{estudio.nombre}</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest bg-green-600 mt-2">
                <CheckCircle2 size={12} /> Tienda oficial
              </span>
            </div>
            {estudio.municipio && (
              <a
                href={urlGoogleMaps(estudio)}
                target="_blank"
                rel="noreferrer"
                className="absolute -bottom-1 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-zinc-300 shadow-md text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-900 active:scale-95 transition-all whitespace-nowrap"
              >
                <MapPin size={11} className="flex-shrink-0" />
                {estudio.municipio}{estudio.departamento ? `, ${estudio.departamento}` : ''}
              </a>
            )}
          </div>
        </div>

        {estudio.bio && (
          <div className="max-w-3xl mx-auto mt-6">
            <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3.5">
              <p className="text-zinc-700 text-sm leading-relaxed">{estudio.bio}</p>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto flex items-center gap-3 mt-4 flex-wrap">
          {estudio.whatsapp && (
            <a href={`https://wa.me/${estudio.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold" style={{ backgroundColor: '#25D366' }}>
              <FaWhatsapp size={13} /> WhatsApp
            </a>
          )}
          {estudio.instagram && (
            <a href={estudio.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white bg-zinc-900">
              <FaInstagram size={14} />
            </a>
          )}
          {estudio.facebook && (
            <a href={estudio.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white bg-zinc-900">
              <FaFacebook size={14} />
            </a>
          )}
          <div className="relative">
            <button
              type="button"
              onClick={compartir}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-300 bg-white text-zinc-700 hover:text-zinc-900 hover:border-zinc-500 text-xs font-bold transition-colors"
            >
              <Share2 size={13} /> Compartir tienda
            </button>
            {shareMsg && (
              <p className="absolute left-0 top-full mt-2 bg-zinc-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap z-10">
                {shareMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 pt-4 pb-16 md:pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {maquinas.length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-16">Esta tienda todavía no tiene máquinas cargadas.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {maquinas.map((item) => (
                <GymMaquinaCard key={item.name} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      <FooterGym />

      <div className="h-16 md:hidden bg-white" />

      <GymMobileNav active={null} />
    </div>
  )
}
