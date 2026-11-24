import { useLoaderData, redirect, Link } from 'react-router'
import { useState } from 'react'
import { CheckCircle2, MapPin, Share2, ShieldCheck, Clock, Truck } from 'lucide-react'
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

const FALLBACK_TIENDA_OFICIAL = {
  id: 120,
  nombre: 'INKognito Gym Equipment',
  departamento: 'Antioquia',
  municipio: 'Chigorodó',
  bio: 'Máquinas de gym fabricadas a mano con soldadura profesional en Chigorodó, Urabá, con envíos a toda Colombia.',
  logo_url: null,
  instagram: 'https://www.instagram.com/jhumaneztattoo',
  facebook: 'https://www.facebook.com/jhumaneztattoo',
  whatsapp: '573207911013',
  tipo: 'gym',
  slug: 'inkognito-gym-equipment',
}

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
  if (estudio && estudio.tipo !== 'gym') estudio = null
  // Si el API no responde temporalmente pero es la tienda oficial, mostramos su perfil base
  if (!estudio && (params.slug === 'inkognito-gym-equipment' || String(params.id) === '120')) {
    estudio = FALLBACK_TIENDA_OFICIAL
  }
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

      {/* PERFIL DE TIENDA */}
      <section className="bg-zinc-50 border-b border-zinc-200 pt-20 md:pt-28 pb-8 md:pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-zinc-200 rounded-3xl p-5 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Identidad y bio */}
              <div className="lg:col-span-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-zinc-100 bg-white shadow-sm overflow-hidden flex-shrink-0">
                  <img
                    src={estudio.logo_url || logoGym}
                    alt={estudio.nombre}
                    className={`w-full h-full ${estudio.logo_url ? 'object-cover' : 'object-contain scale-[1.6]'}`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="uppercase tracking-[0.22em] text-zinc-400 text-[10px] font-black">
                      Tienda de máquinas de gym
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest bg-emerald-600">
                      <CheckCircle2 size={11} /> Tienda oficial
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight text-zinc-900">
                    {estudio.nombre}
                  </h1>

                  {estudio.municipio && (
                    <a
                      href={urlGoogleMaps(estudio)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      <MapPin size={13} className="flex-shrink-0" />
                      {estudio.municipio}{estudio.departamento ? `, ${estudio.departamento}` : ''}
                    </a>
                  )}

                  {estudio.bio && (
                    <p className="text-zinc-600 text-sm leading-relaxed mt-3 max-w-2xl">
                      {estudio.bio}
                    </p>
                  )}

                  {/* Acciones de contacto y compartir */}
                  <div className="flex items-center gap-2.5 mt-5 flex-wrap">
                    {estudio.whatsapp && (
                      <a
                        href={`https://wa.me/${estudio.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold uppercase tracking-[0.12em] transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#25D366' }}
                      >
                        <FaWhatsapp size={14} /> WhatsApp
                      </a>
                    )}
                    {estudio.instagram && (
                      <a
                        href={estudio.instagram}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white bg-zinc-900 hover:bg-zinc-700 transition-colors"
                      >
                        <FaInstagram size={15} />
                      </a>
                    )}
                    {estudio.facebook && (
                      <a
                        href={estudio.facebook}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Facebook"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white bg-zinc-900 hover:bg-zinc-700 transition-colors"
                      >
                        <FaFacebook size={15} />
                      </a>
                    )}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={compartir}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-300 bg-white text-zinc-700 hover:text-zinc-900 hover:border-zinc-900 text-xs font-bold uppercase tracking-[0.12em] transition-colors"
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
              </div>

              {/* Resumen de fabricación en desktop */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 border-t lg:border-t-0 lg:border-l border-zinc-100 pt-5 lg:pt-0 lg:pl-7">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={17} className="text-zinc-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase text-zinc-900">Acero Cal. 14</p>
                    <p className="text-xs text-zinc-500">Soldadura profesional y pintura negro o gris.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={17} className="text-zinc-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase text-zinc-900">~30 días de fabricación</p>
                    <p className="text-xs text-zinc-500">Cada máquina se construye bajo pedido.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck size={17} className="text-zinc-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase text-zinc-900">Envío a toda Colombia</p>
                    <p className="text-xs text-zinc-500">Armadas en Urabá · Desarmadas al resto del país.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE LA TIENDA */}
      <section className="bg-white py-10 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 md:mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">Catálogo oficial</p>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-900 mt-1">
                Máquinas disponibles
              </h2>
            </div>
            {maquinas.length > 0 && (
              <span className="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-700">
                {maquinas.length} {maquinas.length === 1 ? 'modelo' : 'modelos'}
              </span>
            )}
          </div>

          {maquinas.length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-16">Esta tienda todavía no tiene máquinas cargadas.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {maquinas.map((item) => (
                <GymMaquinaCard key={item.name} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterGym />
      <div className="h-16 md:hidden bg-white" />
      <GymMobileNav active={null} />
    </div>
  )
}
