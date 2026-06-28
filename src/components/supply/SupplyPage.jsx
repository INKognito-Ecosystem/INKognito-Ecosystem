import NavbarSupply from './NavbarSupply'
import HeroSupply from './HeroSupply'
import CategoriesSupply from './CategoriesSupply'
import BrandsSupply from './BrandsSupply'
import FooterSupply from './FooterSupply'
import { FaWhatsapp } from 'react-icons/fa'
import Seo from '../Seo'
const ogSupply = '/og/supply.webp'
import { Link } from 'react-router-dom'
import { SUPPLY_HOURS } from '../../config/business'

const supplyJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${import.meta.env.VITE_SITE_URL}/supply#business`,
  "name": "INKognito Supply",
  "description": "Insumos y equipos profesionales para tatuadores en Urabá, Antioquia. Máquinas, tintas, cartuchos, agujas y accesorios. Despacho a toda Colombia por solicitud.",
  "url": `${import.meta.env.VITE_SITE_URL}/supply`,
  "telephone": "+57-320-791-1013",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Chigorodó",
    "addressRegion": "Antioquia",
    "addressCountry": "CO"
  },
  "areaServed": ["Chigorodó","Apartadó","Turbo","Carepa","Mutatá","Colombia por solicitud"]
}

export default function SupplyPage() {

  return (

    <main className="bg-black text-white">

    <Seo
      title="INKognito Supply | Insumos y equipos para tatuaje en Urabá"
      description="Máquinas, cartuchos, tintas, agujas y accesorios profesionales para tatuadores. Con base en Urabá (Apartadó, Turbo, Carepa). Despacho a otras ciudades de Colombia por solicitud. Pedidos por WhatsApp."
      image={ogSupply}
      siteName="INKognito Supply"
      canonical={`${import.meta.env.VITE_SITE_URL}/supply`}
      jsonLd={supplyJsonLd}
    />

    <NavbarSupply />

      <HeroSupply />

<div className="max-w-7xl mx-auto px-6 mt-4 md:mt-8">
  <div className="border-b border-zinc-900"></div>
</div>

<CategoriesSupply />

    <BrandsSupply />

    {/* SECCIÓN APRENDE A TATUAR — solo desktop */}
    <section className="hidden md:block bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div>
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs mb-3">
            Para nuevos tatuadores
          </p>
          <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-3">
            ¿Quieres aprender<br />
            <span className="text-zinc-500">a tatuar?</span>
          </h2>
          <p className="text-zinc-400 text-base max-w-lg">
            Cursos, kit básico y recursos para dar tus primeros pasos en el mundo del tatuaje.
          </p>
        </div>
        <Link
          to="/supply/aprende"
          className="shrink-0 border border-blue-500/40 text-blue-400 text-sm font-black uppercase tracking-[0.2em] py-4 px-8 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 whitespace-nowrap"
        >
          Ver recursos para principiantes →
        </Link>
      </div>
    </section>

    {/* ── COBERTURA + CONTACTO — solo móvil ────────────────────── */}
    <section className="md:hidden border-t border-zinc-900 bg-zinc-950 px-6 py-8">
      <h2 className="text-2xl font-black uppercase leading-none mb-1 text-white">
        Llegamos donde estás
      </h2>
      <p className="text-zinc-500 text-sm mb-5">Urabá, puerta a puerta.</p>

      {/* Aliado transportadora */}
      <div className="flex items-center gap-3 mb-5 border border-zinc-800 rounded-xl p-3">
        <img src="/eljach.png" alt="Eljach Transportadora" className="h-8 w-auto object-contain" />
        <div>
          <p className="text-white text-xs font-bold uppercase tracking-wide">Eljach Transportadora</p>
          <p className="text-zinc-500 text-[11px]">Entregas locales en Urabá el mismo día</p>
        </div>
      </div>

      {/* Ciudades de cobertura */}
      <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Zonas de cobertura</p>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {['Chigorodó','Carepa','Apartadó','Turbo','Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(c => (
          <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30 text-blue-400 bg-blue-500/5">{c}</span>
        ))}
      </div>

      {/* Garantías */}
      <div className="flex flex-col gap-2 mb-5">
        {['Pago contraentrega disponible','Atención personalizada por WhatsApp','Envíos a toda Colombia*'].map(g => (
          <div key={g} className="flex items-center gap-2">
            <span className="text-green-500 text-sm font-bold">✓</span>
            <span className="text-zinc-400 text-xs">{g}</span>
          </div>
        ))}
      </div>
      <p className="text-zinc-700 text-[9px] mb-5">* Fuera de Urabá por transportadora nacional. Flete por cuenta del cliente.</p>

      {/* CTA */}
      <a
        href="https://wa.me/573207911013?text=Hola%2C%20quiero%20hacer%20un%20pedido%20en%20INKognito%20Supply"
        target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-green-500/40 bg-zinc-950 text-white font-bold uppercase tracking-[0.15em] text-sm hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
      >
        📱 Hacer mi pedido ahora
      </a>
    </section>

    <section
  id="contacto"
  className="hidden md:block max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20 border-t border-zinc-900"
>

  <div className="grid md:grid-cols-2 gap-12 items-start">

    {/* IZQUIERDA */}
    <div>

      <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs md:text-sm mb-3">
        Contacto
      </p>

      <h2 className="text-4xl md:text-6xl font-black uppercase leading-none mb-6">
        Compra con confianza
      </h2>

      <p className="text-zinc-400 text-lg leading-relaxed mb-10">
        Te ayudamos a conseguir insumos, tintas, cartuchos, mobiliario y productos
        especializados para tatuadores en la región de Urabá. Nuestro objetivo es
        acompañarte durante todo el proceso de compra y entrega para que recibas
        exactamente lo que necesitas.
      </p>

      <div className="mb-10">
        <a
          href="https://wa.me/573207911013"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center justify-center gap-3
            w-full max-w-xl
            py-5 px-6
            rounded-xl
            border border-green-500/30
            bg-zinc-950
            text-white
            uppercase
            tracking-[0.2em]
            font-semibold
            transition-all duration-300
            hover:border-green-500
            hover:shadow-[0_0_30px_rgba(34,197,94,0.45)]
            hover:scale-[1.02]
          "
        >
          <FaWhatsapp size={24} />
          Hablar con Inkognito Supply
        </a>
      </div>

      <div className="text-zinc-500 uppercase tracking-[0.2em] text-sm space-y-2">
        <p>{SUPPLY_HOURS.weekdays.label}</p>
        <p>{SUPPLY_HOURS.weekdays.hours}</p>
      </div>

      <div className="mt-10 pt-10 border-t border-zinc-900">
        <p className="text-zinc-400">
          <span className="font-semibold text-white">
            INKOGNITO SUPPLY:
          </span>{' '}
          Tu aliado para insumos de tatuaje en Urabá.
        </p>
      </div>

</div>

    {/* DERECHA */}
<div className="bg-zinc-950 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300">
      <p className="text-zinc-500 uppercase tracking-[0.25em] text-xs mb-4">
        Confianza
      </p>

      <h3 className="text-2xl md:text-3xl font-black uppercase mb-8">
        Compra con Seguridad
      </h3>

      <div className="space-y-5">

        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-zinc-300">
            Proveedores verificados
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-zinc-300">
            Atención personalizada
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-zinc-300">
            Soporte por WhatsApp
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <span className="text-zinc-300">
            Entregas en Urabá
          </span>
        </div>

      </div>

    </div>

  </div>

</section>

    <FooterSupply />

    </main>

  )

}
