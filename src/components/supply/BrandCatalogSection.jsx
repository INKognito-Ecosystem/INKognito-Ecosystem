import { FaWhatsapp } from 'react-icons/fa'

const WA = '573207911013'

export default function BrandCatalogSection({ brandName }) {
  const msg = encodeURIComponent(
    `Hola, quiero consultar disponibilidad de productos ${brandName} en INKognito Supply.`
  )
  return (
    <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-10 md:p-16 text-center">
      <p className="text-zinc-500 uppercase tracking-[0.25em] text-xs md:text-sm mb-4">
        Catálogo en preparación
      </p>
      <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
        Estamos cargando el catálogo completo de {brandName}. Mientras tanto,
        consulta disponibilidad y precios directo por WhatsApp.
      </p>
      <a
        href={`https://wa.me/${WA}?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:opacity-90 transition"
      >
        <FaWhatsapp size={16} />
        Consultar por WhatsApp →
      </a>
    </div>
  )
}
