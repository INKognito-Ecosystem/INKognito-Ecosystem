import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { Truck, Shield, Clock, MapPin, Star, Award } from 'lucide-react'
import NavbarStore from './NavbarStore'
import FooterStore from './FooterStore'
import StoreProductCard from './StoreProductCard'

const categories = [
  {
    id: 1,
    name: 'Ropa Dama',
    tag: 'Deportiva Femenina',
    description: 'Sets, leggings, tops y conjuntos para mujer activa. Gym, running, yoga y ciclismo.',
    link: '/store/ropa-dama',
  },
  {
    id: 2,
    name: 'Ropa Caballeros',
    tag: 'Deportiva Masculina',
    description: 'Shorts, camisetas, joggers y conjuntos para hombre activo. Desde el gym hasta la calle.',
    link: '/store/ropa-caballeros',
  },
  {
    id: 3,
    name: 'Zapatos Deportivos',
    tag: 'Running & Gym',
    description: 'Para correr, entrenar y rendir. Las siluetas más buscadas en el mercado, a tu alcance.',
    link: '/store/zapatos-deportivos',
  },
  {
    id: 4,
    name: 'Zapatos Casuales',
    tag: 'Estilo Urbano',
    description: 'Cómodos, frescos y con actitud. Los modelos icónicos para el día a día en Urabá.',
    link: '/store/zapatos-casuales',
  },
  {
    id: 5,
    name: 'Guayos',
    tag: 'Fútbol',
    description: 'Para dominar el balón desde Chigorodó hasta Turbo. Tracción, control y poder.',
    link: '/store/guayos',
  },
  {
    id: 6,
    name: 'Tenis Guayo',
    tag: 'Multisuperficie',
    description: 'Versatilidad total. Canchita de sintético, polvo de ladrillo y calle sin cambiar de par.',
    link: '/store/tenis-guayo',
  },
]

const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const CLOTHING_CATS = ['Ropa Dama', 'Ropa Caballeros']

const featured = [
  { id: 1, name: 'Leggings Running Pro', brand: 'Nike', price: '$89.000', category: 'Ropa Dama', tag: 'Running' },
  { id: 2, name: 'Conjunto Deportivo Pro', brand: 'Adidas', price: '$125.000', category: 'Ropa Caballeros', tag: 'Training' },
  { id: 3, name: 'Air Zoom Pegasus 40', brand: 'Nike', price: '$289.000', category: 'Zapatos Deportivos', tag: 'Running' },
  { id: 4, name: 'Air Force 1 Low', brand: 'Nike', price: '$269.000', category: 'Zapatos Casuales', tag: 'Clásico' },
  { id: 5, name: 'Predator Accuracy.1 FG', brand: 'Adidas', price: '$359.000', category: 'Guayos', tag: 'Terreno Firme' },
  { id: 6, name: 'Mercurial Vapor 15 Club TF', brand: 'Nike', price: '$239.000', category: 'Tenis Guayo', tag: 'Velocidad' },
]

const cities = [
  { name: 'Chigorodó', time: '1–2 días' },
  { name: 'Carepa', time: '1–2 días' },
  { name: 'Apartadó', time: '1–2 días' },
  { name: 'Turbo', time: '2–3 días' },
  { name: 'Mutatá', time: '2–3 días' },
  { name: 'Arboletes', time: '3–4 días' },
]

const guarantees = [
  {
    icon: <Shield size={26} />,
    title: 'Réplica de Alta Calidad',
    desc: 'Productos fabricados con materiales premium que replican los mejores diseños del mercado a precio accesible.',
  },
  {
    icon: <Star size={26} />,
    title: 'Calidad Garantizada',
    desc: 'Materiales y acabados probados para el uso diario en el clima cálido y el ritmo activo de Urabá.',
  },
  {
    icon: <FaWhatsapp size={26} />,
    title: 'Soporte WhatsApp',
    desc: 'Atención personalizada en tiempo real. Desde la elección de talla hasta la entrega en tu puerta.',
  },
  {
    icon: <Truck size={26} />,
    title: 'Entrega Segura',
    desc: 'Tu pedido llega bien empacado, con seguimiento y a tiempo a cualquier municipio de Urabá.',
  },
  {
    icon: <Award size={26} />,
    title: 'Cambios de Talla',
    desc: 'Si la talla no es la correcta, te ayudamos a hacer el cambio sin complicaciones.',
  },
  {
    icon: <Clock size={26} />,
    title: 'Respuesta Inmediata',
    desc: 'Lunes a Sábado de 8:00 AM a 7:00 PM. Siempre disponibles para resolver tus dudas.',
  },
]

export default function StorePage() {
  return (
    <main className="bg-white text-gray-900">

      <NavbarStore />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-start overflow-hidden pt-16 bg-gray-50">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 15% 50%, rgba(201,168,76,0.10) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(201,168,76,0.06) 0%, transparent 50%)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/25 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-12 text-center">
          <p className="uppercase tracking-[0.4em] text-[#C9A84C] text-xs md:text-sm mb-6 font-semibold">
            INKognito Store — Urabá, Antioquia
          </p>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black uppercase leading-[0.9] mb-8">
            <span className="block text-gray-900">Ropa &</span>
            <span className="block text-[#C9A84C]">Calzado</span>
            <span className="block text-gray-900">Para Urabá</span>
          </h1>

          <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            Calidad premium, precio accesible. Diseños inspirados en las mejores marcas,
            fabricados para el ritmo de Urabá.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 uppercase tracking-[0.25em] font-black text-sm text-black transition-all duration-300 hover:brightness-90"
              style={{ backgroundColor: '#C9A84C' }}
            >
              Ver Catálogo
            </button>
            <a
              href="https://wa.me/573207911013?text=Hola,%20quiero%20ver%20el%20catálogo%20de%20INKognito%20Store"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 uppercase tracking-[0.25em] font-bold text-sm border border-gray-300 text-gray-700 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaWhatsapp size={18} />
              WhatsApp
            </a>
          </div>

          {/* STATS */}
          <div className="mt-10 md:mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            <div className="text-center">
              <p className="text-3xl md:text-5xl font-black text-[#C9A84C]">6</p>
              <p className="text-gray-600 uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1">Municipios</p>
            </div>
            <div className="text-center border-x border-gray-300">
              <p className="text-3xl md:text-5xl font-black text-[#C9A84C]">6</p>
              <p className="text-gray-600 uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1">Categorías</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-5xl font-black text-[#C9A84C]">100%</p>
              <p className="text-gray-600 uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1">Calidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <section id="categorias" className="bg-gray-50 py-10 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-10">
            <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs md:text-sm mb-4">
              Catálogo
            </p>
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-none text-gray-900">
              Nuestras<br />Categorías
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#C9A84C] hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-[10px] mb-3 font-semibold">
                    {cat.tag}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black uppercase mb-3 text-gray-900 group-hover:text-[#C9A84C] transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6">
                  <span className="uppercase tracking-[0.2em] text-xs text-gray-400 group-hover:text-[#C9A84C] transition-colors duration-300">
                    Ver categoría →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTACADOS ── */}
      <section id="destacados" className="bg-white py-10 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-10">
            <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs md:text-sm mb-4">
              Selección
            </p>
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-none text-gray-900">
              Destacados
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featured.map((product) => (
              <StoreProductCard
                key={product.id}
                product={product}
                category={product.category.toLowerCase().replace(/ /g, '-')}
                sizes={CLOTHING_CATS.includes(product.category) ? CLOTHING_SIZES : SHOE_SIZES}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── ENVÍOS ── */}
      <section id="envios" className="bg-gray-50 py-10 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* IZQUIERDA */}
            <div>
              <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs md:text-sm mb-4">
                Cobertura
              </p>
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-none mb-6 text-gray-900">
                Enviamos a Toda<br />la Región de Urabá
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                No importa en qué municipio estés, tu pedido llega. Cubrimos los 6 municipios
                principales del Urabá antioqueño con tiempos de entrega garantizados y
                seguimiento incluido.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#C9A84C] transition-all duration-300 bg-white">
                  <Truck size={20} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold uppercase tracking-[0.15em] text-sm text-gray-900">Envío Rápido</p>
                    <p className="text-gray-500 text-sm mt-1">1 a 4 días hábiles según tu municipio</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#C9A84C] transition-all duration-300 bg-white">
                  <MapPin size={20} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold uppercase tracking-[0.15em] text-sm text-gray-900">Entrega a Domicilio</p>
                    <p className="text-gray-500 text-sm mt-1">Directamente en tu puerta, sin filas ni desplazamientos</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#C9A84C] transition-all duration-300 bg-white">
                  <Clock size={20} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold uppercase tracking-[0.15em] text-sm text-gray-900">Seguimiento en Tiempo Real</p>
                    <p className="text-gray-500 text-sm mt-1">Te avisamos por WhatsApp en cada paso de tu pedido</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DERECHA — MUNICIPIOS */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs mb-6 font-semibold">
                Municipios con cobertura
              </p>
              <div className="space-y-1">
                {cities.map((city, i) => (
                  <div
                    key={city.name}
                    className={`flex items-center justify-between py-4 ${i < cities.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#C9A84C' }}
                      />
                      <span className="font-bold uppercase tracking-[0.15em] text-sm text-gray-900">{city.name}</span>
                    </div>
                    <span className="text-gray-500 text-xs uppercase tracking-[0.15em]">{city.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl text-center bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-600">
                  Costo desde{' '}
                  <span className="text-[#C9A84C] font-bold">$8.000</span>
                  {' '}— Gratis en compras mayores a{' '}
                  <span className="text-[#C9A84C] font-bold">$300.000</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CONFIANZA ── */}
      <section className="bg-white py-10 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs md:text-sm mb-4">
              Garantías
            </p>
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-none text-gray-900">
              Compra con Confianza
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guarantees.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-2xl p-6 hover:border-[#C9A84C] hover:shadow-sm transition-all duration-300 bg-white"
              >
                <div className="mb-4" style={{ color: '#C9A84C' }}>{item.icon}</div>
                <h3 className="font-black uppercase tracking-[0.1em] text-base mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTO DARK ── */}
      <section id="contacto" className="bg-black text-white py-10 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* IZQUIERDA */}
            <div>
              <p className="uppercase tracking-[0.25em] text-[#C9A84C] text-xs md:text-sm mb-4">
                Contacto
              </p>
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-none mb-6">
                Hablemos
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-10">
                ¿Buscas un modelo específico? ¿Quieres saber disponibilidad de tu talla?
                Escríbenos y te respondemos en minutos.
              </p>
              <a
                href="https://wa.me/573207911013?text=Hola,%20quiero%20información%20sobre%20INKognito%20Store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full max-w-sm py-5 px-6 rounded-xl border text-white uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.2)] hover:border-[#C9A84C]"
                style={{ borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.04)' }}
              >
                <FaWhatsapp size={24} />
                Hablar con INKognito Store
              </a>
              <p className="text-zinc-600 uppercase tracking-[0.2em] text-sm mt-6">
                Lunes a Sábado • 8:00 AM – 7:00 PM
              </p>
            </div>

            {/* DERECHA */}
            <div
              className="bg-zinc-950 rounded-2xl p-8"
              style={{ border: '1px solid rgba(201,168,76,0.15)' }}
            >
              <p className="uppercase tracking-[0.25em] text-zinc-500 text-xs mb-4">
                INKognito Store
              </p>
              <h3 className="text-2xl md:text-3xl font-black uppercase mb-8">
                Zona de Urabá
              </h3>
              <div className="space-y-5">
                {[
                  'Réplicas premium de alta calidad',
                  'Envío a los 6 municipios de Urabá',
                  'Atención personalizada por WhatsApp',
                  'Cambios de talla garantizados',
                  'Pago contraentrega disponible',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="text-[#C9A84C] text-lg">✓</span>
                    <span className="text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <FooterStore />

    </main>
  )
}
