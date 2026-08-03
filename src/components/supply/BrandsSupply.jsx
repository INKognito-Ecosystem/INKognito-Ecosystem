import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CoverflowRow from '../CoverflowRow'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

const brandKey = (name) => 'supply_brand_' + name.toLowerCase()
  .replace(/[áéíóú]/g, c => ({á:'a',é:'e',í:'i',ó:'o',ú:'u'})[c])
  .replace(/[^a-z0-9]/g, '_').replace(/_+/g,'_').replace(/^_|_$/g,'')

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

// Decisión de Jose (2026-07-30): reducir a estas 7 marcas destacadas en el
// hub — las otras 6 (EZ Tattoo, Eternal, Intenze, Fusion, World Famous,
// Solid Ink) siguen existiendo como páginas reales, ya conectadas a
// inventario real y sin productos/precios inventados, solo que no se listan
// acá. Si se necesitan de nuevo, sus rutas ya funcionan.
const brands = [
  { name: 'TATTOO VISION', to: '/supply/brands/tattoo-vision' },
  // Antes era Kwadron (cartuchos) — reemplazada por Industrias Warlock
  // (mobiliario), decisión de Jose (2026-08-01). Ubicada de segunda a
  // pedido suyo. imgKey se fija a mano porque el logo ya se subió en el
  // panel bajo la clave vieja (supply_brand_kwadron) — si dejáramos que
  // brandKey() la recalculara del nombre nuevo, apuntaría a una clave
  // distinta y el logo desaparecería. Ruta movida a /supply/mobiliario/warlock
  // (antes /supply/cartridges/kwadron — no tenía sentido para una marca de
  // mobiliario, ver KwadronCartridgesPage.jsx movido a marcasProfesionales/).
  // imgFit:'cover' porque el archivo subido tiene fondo negro sólido (no
  // transparente) alrededor del logo — con object-contain (el patrón de
  // todas las demás) se veía chico dentro de la misma caja h-36. cover
  // recorta un poco el piñón del diseño pero llena el espacio parejo con
  // las demás marcas — decisión de Jose, prefiere esto a que se vea chico.
  { name: 'INDUSTRIAS WARLOCK', to: '/supply/mobiliario/warlock', imgKey: 'supply_brand_kwadron', imgFit: 'cover' },
  { name: 'WJX', to: '/supply/cartridges/wjx' },
  { name: 'VICE COLORS', to: '/supply/ink/vice-colors' },
  { name: 'DYNAMIC', to: '/supply/ink/dynamic' },
  { name: 'HEAVEN PRO', to: '/supply/brands/heaven-pro' },
  { name: 'ROYAL THREE', to: '/supply/brands/royal-three' },
]

export default function BrandsSupply() {
  const [imgs, setImgs] = useState({})

  useEffect(() => {
    fetch(`${PANEL_URL}/api/visual/supply`)
      .then(r => r.json())
      .then(data => setImgs(data || {}))
      .catch(() => {})
  }, [])

  return (
    <section
      id="marcas"
      className="relative overflow-hidden pt-3 md:pt-6 pb-8 md:pb-12 px-6 bg-gray-950 border-t border-zinc-900"
    >
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="mb-4 md:mb-8">
          <h2 className="float-left mr-6 md:mr-8 mb-2 text-2xl md:text-4xl font-black uppercase leading-none">
            Marcas
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed text-justify [hyphens:auto]">
            Marcas reconocidas en la industria del tatuaje. Esta sección es una guía de
            referencia, no un catálogo cerrado: reunimos nombres que ya se ganaron su lugar
            entre tatuadores dentro y fuera de Colombia, para ayudarte a identificar qué buscar
            según tu estilo y necesidad. Escríbenos si quieres orientación sobre alguna en
            particular.
          </p>
          <div className="clear-both" />
        </div>

        <CoverflowRow desktopClassName="md:grid md:grid-cols-4 lg:grid-cols-7 gap-4" autoplay={false}>
          {brands.map((brand, i) => {
            const key = brand.imgKey || brandKey(brand.name)
            return (
            <div key={brand.name} className="w-full">
            <Link
              to={brand.to}
              className="relative h-36 w-full border border-blue-500 md:border-blue-500/30 bg-black flex items-center justify-center overflow-hidden transition-all duration-300 md:hover:border-blue-500 md:hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]"
            >
              {imgs[key]
                ? <img src={imgs[key]} alt={brand.name}
                    className={brand.imgFit === 'cover'
                      ? 'w-full h-full object-cover'
                      : 'max-h-full max-w-full object-contain p-3'} />
                : <p className="text-zinc-500 font-black tracking-[0.15em] text-[10px] md:text-xs text-center px-2">
                    {brand.name}
                  </p>
              }
            </Link>
            {i === 0 && (
              <div className="md:hidden mt-1.5 flex items-center justify-end gap-1 text-zinc-500 text-[9px] font-bold uppercase tracking-widest">
                <span>Desliza</span>
                <span className="animate-bounce">→</span>
              </div>
            )}
            </div>
            )
          })}
        </CoverflowRow>

      </div>
    </section>
  )
}
