import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import CoverflowRow from '../CoverflowRow'

// Exportados (2026-09-13) para que BrandsMarquee.jsx (prueba en el hero,
// mismo scroll infinito que TechMarquee.jsx pero con logos de marcas) los
// reuse sin duplicar la lista — sin cambios de comportamiento acá.
export const brandKey = (name) => 'supply_brand_' + name.toLowerCase()
  .replace(/[áéíóú]/g, c => ({á:'a',é:'e',í:'i',ó:'o',ú:'u'})[c])
  .replace(/[^a-z0-9]/g, '_').replace(/_+/g,'_').replace(/^_|_$/g,'')

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

// Mismo patrón de aparición al hacer scroll que StorePage.jsx — Jose notó
// que Supply se quedó sin esto mientras Store sí lo tenía (2026-09-12).
const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
}

// Decisión de Jose (2026-07-30): reducir a estas 7 marcas destacadas en el
// hub — las otras 6 (EZ Tattoo, Eternal, Intenze, Fusion, World Famous,
// Solid Ink) siguen existiendo como páginas reales, ya conectadas a
// inventario real y sin productos/precios inventados, solo que no se listan
// acá. Si se necesitan de nuevo, sus rutas ya funcionan.
// Orden (2026-09-15, Jose: "pon heaven pro al lado izquierdo de tattoo
// vision, y a wjx al lado derecho de tattoo vision") — Heaven Pro se
// movió de su lugar viejo (después de Dynamic) a primero; el resto
// conserva su orden relativo de siempre.
export const brands = [
  { name: 'HEAVEN PRO', to: '/supply/brands/heaven-pro' },
  { name: 'TATTOO VISION', to: '/supply/brands/tattoo-vision' },
  { name: 'WJX', to: '/supply/cartridges/wjx' },
  // Antes era Kwadron (cartuchos) — reemplazada por Industrias Warlock
  // (mobiliario), decisión de Jose (2026-08-01). imgKey se fija a mano
  // porque el logo ya se subió en el panel bajo la clave vieja
  // (supply_brand_kwadron) — si dejáramos que brandKey() la recalculara
  // del nombre nuevo, apuntaría a una clave distinta y el logo
  // desaparecería. Ruta movida a /supply/mobiliario/warlock (antes
  // /supply/cartridges/kwadron — no tenía sentido para una marca de
  // mobiliario, ver KwadronCartridgesPage.jsx movido a marcasProfesionales/).
  // imgFit:'cover' porque el archivo subido tiene fondo negro sólido (no
  // transparente) alrededor del logo — con object-contain (el patrón de
  // todas las demás) se veía chico dentro de la misma caja h-36. cover
  // recorta un poco el piñón del diseño pero llena el espacio parejo con
  // las demás marcas — decisión de Jose, prefiere esto a que se vea chico.
  { name: 'INDUSTRIAS WARLOCK', to: '/supply/mobiliario/warlock', imgKey: 'supply_brand_kwadron', imgFit: 'cover' },
  { name: 'VICE COLORS', to: '/supply/ink/vice-colors' },
  { name: 'DYNAMIC', to: '/supply/ink/dynamic' },
  { name: 'ROYAL THREE', to: '/supply/brands/royal-three' },
  // Don Melo y Difuso Galeria (2026-09-15, Jose) — todavía sin página
  // propia ni logo cargado en el panel (sin fila en `settings`, así que
  // `imgs[key]` nunca las va a encontrar) — `to: null` hasta que se les
  // construya su página como al resto; mientras tanto solo se exhiben, sin
  // ser clicables (ver `brand.to` en el render de abajo y en
  // BrandsMarquee.jsx). `img` es un archivo local propio (no viene de
  // Cloudinary/settings todavía) — mismo public/marcas-marquee/ que ya usa
  // el recorte a mano de otras marcas en BrandsMarquee.jsx, reusado acá
  // también para que la sección "Marcas" de escritorio (que solo lee
  // `imgs[key]`) las muestre igual.
  { name: 'DON MELO', to: null, img: '/marcas-marquee/don-melo.png' },
  { name: 'DIFUSO GALERIA', to: null, img: '/marcas-marquee/difuso-galeria.png' },
]

// imgs viene del loader de SupplyPage.jsx (2026-09-13, Jose: "al volver
// atrás... espabila primero sin imagen luego aparece") — antes este
// componente pedía `/api/visual/supply` por su cuenta; al remontarse en
// cada navegación de vuelta arrancaba en `{}` antes de que llegara la
// respuesta, mostrando la marca sin logo un instante. Ahora llega ya
// resuelto desde el loader, sin parpadeo.
export default function BrandsSupply({ imgs = {} }) {
  return (
    <motion.section
      {...REVEAL}
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
            Reunimos las marcas más reconocidas del sector en un solo lugar. Consulta la oferta
            de distintos proveedores nacionales, compara alternativas y selecciona los productos
            ideales para tu trabajo.
          </p>
          <div className="clear-both" />
        </div>

        <CoverflowRow desktopClassName="md:grid md:grid-cols-4 lg:grid-cols-7 gap-4" autoplay={false}>
          {brands.map((brand, i) => {
            const key = brand.imgKey || brandKey(brand.name)
            // Cloudinary/settings (imgs[key]) manda si existe; si no, cae al
            // archivo local propio de la marca (brand.img, ver arriba) —
            // así Don Melo/Difuso Galeria se ven sin depender de que ya se
            // hayan subido al panel.
            const src = imgs[key] || brand.img
            const Wrapper = brand.to ? Link : 'div'
            const wrapperProps = brand.to
              ? { to: brand.to }
              : { 'aria-label': `${brand.name} — próximamente` }
            return (
            <div key={brand.name} className="w-full">
            <Wrapper
              {...wrapperProps}
              className="relative h-36 w-full border border-blue-500 md:border-blue-500/30 bg-black flex items-center justify-center overflow-hidden transition-all duration-300 md:hover:border-blue-500 md:hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]"
            >
              {src
                ? <img src={src} alt={brand.name}
                    className={brand.imgFit === 'cover'
                      ? 'w-full h-full object-cover'
                      : 'max-h-full max-w-full object-contain p-3'} />
                : <p className="text-zinc-500 font-black tracking-[0.15em] text-[10px] md:text-xs text-center px-2">
                    {brand.name}
                  </p>
              }
            </Wrapper>
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
    </motion.section>
  )
}
