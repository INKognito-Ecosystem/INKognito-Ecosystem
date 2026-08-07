import { Link, useLoaderData } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { MapPin, Users, Building2, ShoppingBag, Award } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'
import { idDesdeParam } from './artistaSlug'
import { urlGoogleMaps } from './mapaUrl'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const BTN = '#374151'

// Página pública de estudio (fase 3 del directorio, 2026-08-06) — mucho
// más simple que ArtistaLandingPage.jsx a propósito: sin diseños en
// venta, sin agenda, sin Mercado Pago — esas son funciones exclusivas del
// perfil individual del artista. Esta página es solo identidad + roster,
// cada card sigue enlazando al perfil completo real del artista.
export async function loader({ params }) {
  const id = idDesdeParam(params.id)
  try {
    const res = await fetch(`${PANEL_URL}/api/estudios/${id}`)
    if (!res.ok) return { estudio: null }
    return { estudio: await res.json() }
  } catch {
    return { estudio: null }
  }
}

export function meta({ data }) {
  const estudio = data?.estudio
  if (!estudio) return [{ title: 'Estudio no encontrado | Tattoo Artist Colombia' }]
  const title = `${estudio.nombre} — Estudio de tatuajes en ${estudio.municipio} | Tattoo Artist Colombia`
  const description = estudio.bio || `${estudio.nombre}, estudio de tatuajes en ${estudio.municipio}${estudio.departamento ? ', ' + estudio.departamento : ''}.`
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-colombia/estudio/${estudio.id}` },
  ]
}

export default function EstudioLandingPage() {
  const { estudio } = useLoaderData()

  if (!estudio) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <NavbarArtistas />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-gray-500 text-sm">No encontramos este estudio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* "Tattoo Studios Colombia" en vez del wordmark de artista
          individual (2026-08-07, Jose) — la insignia de abajo ya deja
          claro que es un estudio, así que el nombre del estudio en sí
          puede ser corto (ej. "INKognito") sin perder contexto. */}
      <NavbarArtistas titulo="Tattoo Studios Colombia" />

      <div className="flex-1 pt-16 md:pt-20">
        {/* h-40/56/64 con ancho completo — una foto que no sea
            panorámica (ej. una foto de celular en vertical u horizontal
            normal) se ve exageradamente recortada con object-cover acá.
            El aviso de formato ideal vive en el dashboard del estudio
            (donde se sube la foto), no en esta página pública. */}
        <div className="w-full h-40 sm:h-56 md:h-64 bg-gray-100 overflow-hidden">
          {estudio.foto_portada && <img src={estudio.foto_portada} alt="" className="w-full h-full object-cover" />}
        </div>

        <div className="max-w-3xl mx-auto px-4">
          <div className="relative min-h-16 sm:min-h-[85px]">
            <div className="absolute left-0 top-0 -translate-y-1/3">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
                {estudio.logo_url ? (
                  <img src={estudio.logo_url} alt={estudio.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl font-black">{estudio.nombre?.[0]?.toUpperCase() || '?'}</div>
                )}
              </div>
            </div>
            <div className="pt-3 pl-[108px] sm:pl-[144px] min-w-0">
              {/* v4 (2026-08-07, Jose: "el ícono iba antes del nombre, no
                  al frente" — corrige v3, que lo puso después) — ícono
                  primero, nombre después, mismo patrón inline (solo
                  ícono, sin texto, como VerifiedBadge en
                  ArtistasColombiaPage.jsx). text-base en vez de
                  text-lg/2xl + truncate (Jose: "el nombre del estudio
                  como es largo genera dos líneas de texto") — más chico
                  que el de artista a propósito, para que SIEMPRE quede en
                  una sola línea sin importar el largo. */}
              {/* fase 6.1 (2026-08-07, Jose) — una empresa proveedora
                  pura no es un estudio de tatuaje, la insignia/tooltip
                  cambia para reflejar eso ("Marca Profesional" en vez de
                  "Tattoo Studio"), mismo ícono-antes-del-nombre. */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span title={estudio.tipo === 'empresa' ? 'Marca Profesional' : 'Tattoo Studio'} className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-gray-600">
                  {estudio.tipo === 'empresa' ? <Award size={11} className="text-white" /> : <Building2 size={11} className="text-white" />}
                </span>
                <h1 className="text-base sm:text-xl font-black uppercase leading-tight truncate min-w-0">{estudio.nombre}</h1>
              </div>
              {/* Enlace real a Google Maps (2026-08-07, Jose) — v2:
                  "como botón no es claro... debería ser sensible" — el
                  texto subrayado no se leía como botón real y el área de
                  toque era muy chica en celular. Ahora es un botón con
                  fondo/borde visibles y feedback al tocar (active:), área
                  de toque más grande. Link propio si lo pegaron, si no el
                  punto exacto capturado, si no búsqueda por
                  nombre+municipio. */}
              <a
                href={urlGoogleMaps(estudio)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-95 transition-all border border-gray-300 rounded-full px-2.5 py-1 mt-1.5"
              >
                <MapPin size={11} className="flex-shrink-0" />
                {estudio.municipio}{estudio.departamento ? `, ${estudio.departamento}` : ''}
              </a>

              {/* Supply multitenant (fase 4/5/6.1, 2026-08-07) — v3 (Jose:
                  "alineado con el nombre y la ubicación, no debajo del
                  perfil") — DENTRO de la columna con pl-[108px]/[144px],
                  no como hermano del wrapper `relative` de arriba; así
                  hereda el mismo indent que nombre/ubicación en vez de
                  arrancar desde el borde izquierdo (debajo de la foto).
                  v4 (fase 6.1): ya no depende solo de vende_supply — una
                  marca con landing propia (catalogo_url, ver fase 6.1)
                  también debe mostrar el link aunque no suba inventario
                  acá. Parpadeo 3 veces al entrar (CSS puro sobre un solo
                  elemento, sin costo relacionado al tamaño del catálogo) —
                  respeta prefers-reduced-motion. */}
              {(estudio.catalogo_url || (estudio.vende_supply && estudio.n_productos_supply > 0)) && (() => {
                const base = estudio.catalogo_url || `/supply/estudio/${estudio.id}`
                const externo = /^https?:\/\//.test(base)
                // ?flechas=0 (fase 6.1) — quien entra desde este perfil no
                // debe poder saltar a otra marca sin relación vía las
                // flechas prev/next de marcasProfesionales/*.jsx.
                const destino = externo ? base : `${base}${base.includes('?') ? '&' : '?'}flechas=0`
                const texto = estudio.tipo === 'empresa' ? 'Ver su catálogo' : 'Mi Supply en línea'
                const claseComun = "catalogo-cta-blink flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white hover:opacity-90 active:scale-95 transition-all rounded-full px-2.5 py-1 mt-1.5 w-fit"
                return (
                  <>
                    <style>{`
                      @media (prefers-reduced-motion: no-preference) {
                        @keyframes catalogoCtaBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
                        .catalogo-cta-blink { animation: catalogoCtaBlink 0.45s ease-in-out 3; }
                      }
                    `}</style>
                    {externo ? (
                      <a href={destino} target="_blank" rel="noreferrer" className={claseComun} style={{ backgroundColor: BTN }}>
                        <ShoppingBag size={11} className="flex-shrink-0" /> {texto}
                      </a>
                    ) : (
                      <Link to={destino} className={claseComun} style={{ backgroundColor: BTN }}>
                        <ShoppingBag size={11} className="flex-shrink-0" /> {texto}
                      </Link>
                    )}
                  </>
                )
              })()}
            </div>
          </div>

          {estudio.bio && (
            <div className="mt-6 max-w-xl">
              <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3.5">
                <p className="text-gray-700 text-sm leading-relaxed">{estudio.bio}</p>
              </div>
            </div>
          )}

          {(estudio.instagram || estudio.facebook || estudio.whatsapp) && (
            <div className="flex items-center gap-3 mt-4">
              {estudio.whatsapp && (
                <a href={`https://wa.me/${estudio.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold" style={{ backgroundColor: '#25D366' }}>
                  <FaWhatsapp size={13} /> WhatsApp
                </a>
              )}
              {estudio.instagram && (
                <a href={estudio.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white" style={{ backgroundColor: BTN }}>
                  <FaInstagram size={14} />
                </a>
              )}
              {estudio.facebook && (
                <a href={estudio.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white" style={{ backgroundColor: BTN }}>
                  <FaFacebook size={14} />
                </a>
              )}
            </div>
          )}

          <div className="mt-8">
            {/* fase 6.1 (2026-08-07, Jose) — para una empresa (no un
                estudio real), este mismo vínculo/grid se reencuadra como
                patrocinio: una marca puede patrocinar a un tatuador real
                para que la promocione, reusando `artista.estudio_id` sin
                ningún cambio de datos, solo de copy. */}
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-1.5">
              <Users size={13} /> {estudio.tipo === 'empresa'
                ? `${estudio.artistas?.length || 0} artista${estudio.artistas?.length === 1 ? '' : 's'} patrocinado${estudio.artistas?.length === 1 ? '' : 's'}`
                : `${estudio.artistas?.length || 0} artista${estudio.artistas?.length === 1 ? '' : 's'} en este estudio`}
            </p>
            {!estudio.artistas || estudio.artistas.length === 0 ? (
              <p className="text-gray-400 text-sm">
                {estudio.tipo === 'empresa' ? 'Esta marca todavía no patrocina a ningún artista.' : 'Este estudio todavía no tiene artistas activos.'}
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5">
                {/* v3 (2026-08-07, Jose: revierte el tratamiento tipo
                    Facebook v2 — "donde se veía su foto de perfil
                    completa") — vuelve a la foto de perfil completa
                    (foto_url) a todo el ancho de la card, sin recorte
                    parcial ni avatar superpuesto. */}
                {estudio.artistas.map((a) => (
                  <Link key={a.id} to={`/artista/${a.id}`} className="block group rounded-xl border border-gray-200 group-hover:border-gray-400 overflow-hidden transition-colors bg-white">
                    <div className="w-full aspect-square bg-gray-100">
                      {a.foto_url ? (
                        <img src={a.foto_url} alt={a.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl font-black">{a.nombre?.[0]?.toUpperCase() || '?'}</div>
                      )}
                    </div>
                    <div className="px-2.5 py-2.5">
                      <p className="text-sm font-bold truncate">{a.nombre}</p>
                      {a.estilo && <p className="text-[11px] text-gray-500 truncate">{a.estilo}</p>}
                      {a.bio && <p className="text-gray-400 text-[10px] mt-0.5 leading-snug truncate">{a.bio}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 py-6 px-4 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/tattoo-artist-colombia/terminos" className="text-gray-400 hover:text-gray-700 transition-colors">Términos</Link>
            <Link to="/tattoo-artist-colombia/privacidad" className="text-gray-400 hover:text-gray-700 transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
