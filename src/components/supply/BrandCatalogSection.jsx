import { FaWhatsapp } from 'react-icons/fa'
import { ShieldCheck } from 'lucide-react'
import SupplyProductCard from './SupplyProductCard'

const WA = '573207911013'

// Reescrito 2026-07-30 — antes era 100% estático, nunca leía inventario real
// sin importar lo que Jose cargara en el panel (o, en otras páginas de marca,
// mostraba productos y precios inventados tipo "$XX.XXX" con un botón que sí
// agregaba al carrito real). Ahora recibe `products` ya filtrados por marca
// desde el loader() de cada página — ver cómo cada archivo en
// marcasProfesionales/ y categories/{ink,Cartridges}/ llama fetchCatalogFull
// y filtra por `p.marca === '<slug>'`.
// supplierBadge: texto de la insignia de confianza sobre el proveedor —
// cada página de marca puede pasar la suya (ver IndustriasWarlockPage.jsx).
// Por defecto asume Tommy Tattoo Supply porque hoy todas las marcas de
// ink/cartuchos vienen de ahí; pasar null para no mostrar ninguna insignia.
const TOMMY_BADGE = 'Suministrado por Tommy Tattoo Supply — marca reconocida en Urabá'

// whatsapp (2026-08-07, bug real reportado por Jose): antes SIEMPRE usaba
// el WhatsApp de INKognito acá, aunque la página fuera de un proveedor con
// su propio número real (estudio.whatsapp) — alguien preguntando por un
// producto sin stock de un "Distribuidor Oficial" terminaba escribiéndole
// a INKognito en vez de al proveedor. Opcional, cae al número de INKognito
// si no se pasa (las 4 páginas de marcasProfesionales/ no tienen un
// WhatsApp propio registrado, siguen igual que siempre).
export default function BrandCatalogSection({ brandName, products = [], supplierBadge = TOMMY_BADGE, whatsapp = WA, showEstudioBadge = true }) {
  if (products.length === 0) {
    return (
      <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-10 md:p-16 text-center">
        <p className="text-zinc-500 uppercase tracking-[0.25em] text-xs md:text-sm mb-4">
          Marca de referencia
        </p>
        <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          Aún no tenemos catálogo activo de {brandName}. Si buscas algo puntual
          de esta marca, escríbenos y te orientamos.
        </p>
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola, quiero orientación sobre productos ${brandName}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:opacity-90 transition"
        >
          <FaWhatsapp size={16} />
          Escribir por WhatsApp →
        </a>
      </div>
    )
  }

  return (
    <>
      {supplierBadge && (
        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2 w-fit mb-4">
          <ShieldCheck size={14} className="shrink-0 text-blue-400" />
          <span>{supplierBadge}</span>
        </div>
      )}
      <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-3 md:pb-0 scrollbar-hide">
        {products.map(item => (
          <div key={`${item.name}-${item.estudio_id ?? 'x'}`} className="snap-start flex-shrink-0 w-[44vw] md:w-auto">
            <SupplyProductCard item={item} categoria={item.categoria} showEstudioBadge={showEstudioBadge} />
          </div>
        ))}
      </div>
    </>
  )
}
