import { Link, useLoaderData } from 'react-router-dom'
import NavbarSuple from './NavbarSuple'
import FooterSuple from './FooterSuple'
import CategoriesSuple, { CAT_ICONS } from './CategoriesSuple'
import { SUPLE_CATEGORIES_ORDER } from '../../data/supleCategoriesOrder'
import { fetchCatalogFull } from '../../hooks/useCatalog'
import { ExternalLink, Dumbbell } from 'lucide-react'

const WA = '573207911013'

// Mismo patrón punteado que ya usan las secciones de cobertura/contacto de
// Supply y Store (2026-08-02, "mismo patrón que las demás páginas").
const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export async function loader() {
  return fetchCatalogFull('suplementos')
}

export function meta() {
  const title = 'Suplementos y Accesorios para Entrenar | INKognito Suple — Urabá y Colombia'
  const description = 'Tienda online de proteína, creatina, pre-entreno y accesorios para entrenar. Potencia tus entrenamientos y optimiza tus resultados. Suplementos deportivos en Urabá, Chigorodó, Antioquia. Envíos a toda Colombia.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/suplementos` },
  ]
}

export default function SuplePage() {
  const { allProducts: apiProds, categorias } = useLoaderData()
  const apiAfiliados = apiProds.filter(item => item.tipo === 'afiliado')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavbarSuple />

      {/* HERO — (2026-08-03) rediseñado a pedido de Jose: la versión anterior
          era estructuralmente la misma fórmula de Store/Supply (eyebrow +
          h1 apilado + párrafo + CTAs + 3 stats en grid + card de Eljach a
          la derecha), solo recoloreada a gris — "creo que deberia... darle
          un aire totalmente diferente y propio". Se mantiene la paleta
          (#9E9E9E) y el párrafo descriptivo que a Jose ya le gustaba
          (agregado un cierre mencionando la compra en línea), pero la
          composición cambia: grid asimétrico 3/2 en vez de 2 columnas
          simétricas, título con "Entrenamientos" resaltado tipo marcador
          en vez de solo coloreado, silueta de mancuerna de fondo (propia
          del rubro, nadie más en el sitio la usa) en vez del blur circular
          genérico, stats como ticker horizontal con bordes en vez de grid
          suelto, y la card de la derecha deja de ser el mismo cuadro de
          Eljach copiado de Supply — ahora es un panel "Compra en línea"
          con acceso directo a las 5 categorías (mismo ícono que sus cards
          más abajo, vía CAT_ICONS) y Eljach queda como nota al pie, no
          como protagonista. */}
      <section className="relative overflow-hidden pt-20 md:pt-28 pb-10 md:pb-16 px-4 md:px-6 bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900" />
        <Dumbbell
          className="hidden md:block absolute -right-10 top-1/2 -translate-y-1/2 text-[#9E9E9E]/[0.06] pointer-events-none"
          style={{ transform: 'translateY(-50%) rotate(-20deg)' }}
          size={480}
          strokeWidth={1}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="md:grid md:grid-cols-5 md:gap-12 md:items-end">

            {/* IZQUIERDA — 3/5 */}
            <div className="md:col-span-3 text-center md:text-left">
              <p className="uppercase tracking-[0.4em] text-[#9E9E9E] text-xs md:text-sm mb-4 md:mb-6 font-semibold">
                INKognito Suple — Urabá, Antioquia
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-[1.05] mb-6 md:mb-8">
                <span className="block text-white">Potencia tus</span>
                <span className="inline-block bg-[#9E9E9E] text-gray-950 px-2 -mx-2 md:px-3 md:-mx-3">Entrenamientos</span>
              </h1>
              <p className="text-gray-300 text-base md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0 mb-8 md:mb-12">
                Tienda online de suplementos y accesorios para entrenar — proteína, creatina, pre-entreno y más, con stock real y despacho rápido. Optimiza tus resultados con marcas confiables y envíos desde Urabá a toda Colombia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-4 uppercase tracking-[0.25em] font-black text-sm text-black transition-all duration-300 hover:brightness-90"
                  style={{ backgroundColor: '#9E9E9E' }}
                >
                  Ver Catálogo
                </button>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero ver el catálogo de INKognito Suple')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex px-10 py-4 uppercase tracking-[0.25em] font-bold text-sm border border-gray-700 text-gray-300 hover:border-[#9E9E9E] hover:text-[#9E9E9E] transition-all duration-300 items-center justify-center gap-2"
                >
                  WhatsApp
                </a>
              </div>

              {/* POR OBJETIVO — mismo lugar/formato que las 3 marcas de
                  HeroSupply.jsx, pero con contenido propio de Suple: no hay
                  marcas propias todavía (Nutri House sin cerrar), así que en
                  vez de forzar 3 marcas vacías, son 3 objetivos de
                  entrenamiento, cada uno a la categoría más relevante
                  (2026-08-03, pedido de Jose). */}
              <div className="grid grid-cols-3 md:flex md:flex-wrap gap-3 mt-6 md:mt-8">
                <Link
                  to="/suplementos/proteinas"
                  className="text-center py-3 border border-[#9E9E9E] text-white uppercase tracking-wider text-[11px] md:text-sm md:px-6 hover:bg-[#9E9E9E] hover:text-gray-950 transition-all duration-300"
                >
                  Ganar Masa
                </Link>
                <Link
                  to="/suplementos/vitaminas"
                  className="text-center py-3 border border-[#9E9E9E] text-white uppercase tracking-wider text-[11px] md:text-sm md:px-6 hover:bg-[#9E9E9E] hover:text-gray-950 transition-all duration-300"
                >
                  Definición
                </Link>
                <Link
                  to="/suplementos/pre-entreno"
                  className="text-center py-3 border border-[#9E9E9E] text-white uppercase tracking-wider text-[11px] md:text-sm md:px-6 hover:bg-[#9E9E9E] hover:text-gray-950 transition-all duration-300"
                >
                  Rendimiento
                </Link>
              </div>

              {/* STATS — ticker horizontal con bordes, no el grid suelto de Store */}
              <div className="mt-8 md:mt-14 flex justify-center md:justify-start divide-x divide-gray-800 border-y border-gray-800 max-w-md mx-auto md:mx-0">
                {[{n:'4',l:'Municipios'},{n:'100%',l:'Stock real'}].map(s => (
                  <div key={s.l} className="flex-1 px-4 md:px-6 py-4 text-center md:text-left">
                    <p className="text-2xl md:text-4xl font-black text-[#9E9E9E] [font-variant-numeric:tabular-nums]">{s.n}</p>
                    <p className="text-gray-500 uppercase tracking-[0.2em] text-[9px] md:text-[10px] mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DERECHA — 2/5, solo desktop: panel "Compra en línea" con
                acceso directo a las 5 categorías, Eljach como nota al pie. */}
            <div className="hidden md:block md:col-span-2">
              <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                <p className="text-[#9E9E9E] uppercase tracking-[0.3em] text-xs mb-1">Compra en línea</p>
                <p className="text-gray-500 text-xs mb-5">Elige tu categoría y arma tu pedido en minutos.</p>
                <div className="flex flex-col gap-2">
                  {SUPLE_CATEGORIES_ORDER.map(cat => {
                    const Icon = CAT_ICONS[cat.name]
                    return (
                      <Link
                        key={cat.slug}
                        to={`/suplementos/${cat.slug}`}
                        className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-800 hover:border-[#9E9E9E] transition-all duration-300"
                      >
                        {Icon && <Icon size={16} className="text-[#9E9E9E] flex-shrink-0" />}
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-300 group-hover:text-white flex-1">{cat.name}</span>
                        <span className="text-gray-600 group-hover:text-[#9E9E9E] group-hover:translate-x-0.5 transition-all duration-300">→</span>
                      </Link>
                    )
                  })}
                </div>
                <div className="mt-5 pt-5 border-t border-gray-800 flex items-center gap-2">
                  <img src="/eljach.png" alt="" className="w-4 h-4 object-contain opacity-70" />
                  <span className="text-gray-500 text-[10px] uppercase tracking-[0.15em]">Envíos con Eljach a toda la región</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <CategoriesSuple categorias={categorias} />

      {/* ── SUPLEMENTOS AFILIADOS — sección fija, siempre visible ── */}
      <section className="border-t-2 border-[#9E9E9E]/20 bg-[#0c0c0c] px-4 md:px-6 py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#9E9E9E] text-[10px] font-bold uppercase tracking-widest mb-1">✦ Las marcas que no llegan al local, disponibles para ti</p>
          <h2 className="text-2xl md:text-3xl font-black uppercase leading-none mb-2 text-white">
            Los suplementos que ya usan los que van en serio
          </h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg leading-relaxed">
            Proteínas, creatinas y pre-entrenos de marcas internacionales desde Mercado Libre con envío a Colombia. La misma calidad de los grandes, sin pagar el sobreprecio del intermediario. Complementa tu stack sin limitarte a lo que hay en Urabá.
          </p>
          {apiAfiliados.length > 0 ? (
            <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
              {apiAfiliados.map((item, i) => {
                const url = item.url_ventas || item.url_checkout || null
                const inner = (
                  <div className="border border-gray-700 bg-gray-950 rounded-2xl overflow-hidden flex flex-col h-full hover:border-gray-500 hover:shadow-[0_0_16px_rgba(158,158,158,0.15)] transition-all duration-300">
                    <div className="aspect-square w-full bg-gray-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        : <ExternalLink size={28} className="text-gray-700" strokeWidth={1} />
                      }
                    </div>
                    <div className="p-3 flex flex-col gap-1.5 flex-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Recurso externo · {item.plataforma || item.categoria}</span>
                      <h3 className="text-xs font-black uppercase leading-tight text-white">{item.name}</h3>
                      {item.descripcion && (
                        <p className="text-gray-500 text-[10px] leading-relaxed flex-1">{item.descripcion}</p>
                      )}
                      {url && (
                        <span className="mt-auto pt-1 text-[9px] font-bold uppercase tracking-widest text-gray-300 flex items-center gap-1">
                          Ver producto <ExternalLink size={9} />
                        </span>
                      )}
                    </div>
                  </div>
                )
                return url
                  ? <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="snap-start flex-shrink-0 w-[44vw] md:w-auto">{inner}</a>
                  : <div key={i} className="snap-start flex-shrink-0 w-[44vw] md:w-auto">{inner}</div>
              })}
            </div>
          ) : (
            <div className="border border-gray-700 bg-gray-950 rounded-2xl p-6 text-center">
              <p className="text-gray-500 text-sm mb-4 max-w-sm mx-auto">
                Aún no tenemos suplementos importados cargados. Avísanos y te contactamos apenas tengamos opciones disponibles.
              </p>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero que me avisen cuando haya suplementos disponibles en INKognito Suple.')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-950 font-bold uppercase tracking-[0.15em] text-xs rounded hover:brightness-90 transition"
                style={{ backgroundColor: '#9E9E9E' }}
              >
                Avisarme cuando haya stock →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* COBERTURA + CONTACTO — solo móvil */}
      <section id="contacto" className="relative overflow-hidden md:hidden border-t border-gray-800 bg-gray-950 px-4 py-8">
        <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
        <div className="relative z-10">
        <h2 className="text-2xl font-black uppercase leading-none mb-3 text-white">Llegamos donde estás</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          Contamos con transportadora aliada para entregas seguras y con pago contraentrega en toda la región de Urabá.
        </p>
        <div className="flex gap-2 mb-5">
          <div className="flex items-center justify-center bg-white rounded-xl p-1 flex-shrink-0 aspect-square w-16">
            <img src="/eljach.png" alt="Eljach" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col justify-center bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 flex-1">
            <p className="text-white text-xs font-bold uppercase tracking-wide leading-tight">Eljach Mensajería Express</p>
            <p className="text-gray-500 text-[10px] mt-0.5">Aliado logístico · Contra entrega</p>
          </div>
        </div>
        <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-2">Urabá — Entrega directa</p>
        <div className="flex flex-col gap-1 mb-3">
          {[{n:'Chigorodó',t:'1–2 días'},{n:'Carepa',t:'1–2 días'},{n:'Apartadó',t:'1–2 días'},{n:'Turbo',t:'2–3 días'}].map(c => (
            <div key={c.n} className="flex items-center justify-between border-b border-gray-800 py-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-600 text-gray-300 bg-gray-800/60">{c.n}</span>
              <span className="text-gray-600 text-[9px] uppercase tracking-widest">{c.t}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-700 text-[9px] uppercase tracking-widest mb-1.5">Corregimientos y sectores</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {['Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(c => (
            <span key={c} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-gray-800 text-gray-600 bg-gray-900">{c}</span>
          ))}
        </div>
        <p className="text-gray-700 text-[9px] leading-relaxed mb-4">
          ¿Fuera de Urabá? También enviamos al resto de Colombia — tiempo y costo se coordinan al confirmar.
        </p>
        <div className="flex flex-col gap-2 mb-5">
          {['Pago contraentrega disponible','Atención personalizada por WhatsApp','Cobertura en toda la región de Urabá'].map(g => (
            <div key={g} className="flex items-center gap-2">
              <span className="text-green-500 text-sm font-bold">✓</span>
              <span className="text-gray-400 text-xs">{g}</span>
            </div>
          ))}
        </div>
        <a
          href="https://wa.me/573207911013?text=Hola%2C%20quiero%20hacer%20un%20pedido%20de%20suplementos%20en%20INKognito%20Suple"
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-green-500/40 bg-gray-950 text-white font-bold uppercase tracking-[0.15em] text-sm hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
        >
          📱 Hacer mi pedido ahora
        </a>
        </div>
      </section>

      {/* ── LOGÍSTICA + GARANTÍAS + CONTACTO — solo desktop ── */}
      <section id="contacto-desktop" className="relative overflow-hidden hidden md:block bg-gray-950 border-t border-gray-800 px-6 py-14">
        <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">

          {/* COL 1: LOGÍSTICA */}
          <div>
            <p className="uppercase tracking-[0.25em] text-[#9E9E9E] text-[10px] mb-4">Logística · Cobertura</p>
            <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Llegamos donde estás</h2>
            <div className="flex gap-3 mb-4">
              <div className="flex items-center justify-center bg-white rounded-xl p-2 flex-shrink-0 w-14 h-14">
                <img src="/eljach.png" alt="Eljach" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col justify-center bg-black border border-gray-800 rounded-xl px-4 py-2.5 flex-1">
                <p className="text-white text-sm font-bold uppercase tracking-wide leading-tight">Eljach Mensajería Express</p>
                <p className="text-gray-500 text-xs mt-0.5">Aliado logístico · Contra entrega</p>
              </div>
            </div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">Urabá — Entrega directa</p>
            <div className="flex flex-col gap-1.5 mb-3">
              {[{name:'Chigorodó',time:'1–2 días'},{name:'Carepa',time:'1–2 días'},{name:'Apartadó',time:'1–2 días'},{name:'Turbo',time:'2–3 días'}].map(c => (
                <div key={c.name} className="flex items-center justify-between py-1.5 border-b border-gray-800">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-gray-600 text-gray-300 bg-gray-800/60">{c.name}</span>
                  <span className="text-gray-600 text-[10px] uppercase tracking-[0.12em]">{c.time}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-700 text-[9px] uppercase tracking-widest mb-2">Corregimientos y sectores</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {['Currulao','El Tres','Coldesa','Río Grande','El Reposo','Casa Verde'].map(z => (
                <span key={z} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-800 text-gray-600 bg-gray-900">{z}</span>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-4">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1.5">Resto de Colombia</p>
              <p className="text-gray-600 text-xs leading-relaxed">
                ¿Estás fuera de Urabá? Podemos enviarte tu pedido a cualquier parte del país.
                Tiempo y costo de envío se coordinan al confirmar el pedido.
              </p>
            </div>
          </div>

          {/* COL 2: GARANTÍAS */}
          <div>
            <p className="uppercase tracking-[0.25em] text-[#9E9E9E] text-[10px] mb-4">Garantías</p>
            <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Compra con Confianza</h2>
            <div className="flex flex-col gap-4">
              {[
                {t:'Productos de calidad verificada',    d:'Selección de suplementos de marcas reconocidas. Sin productos de dudosa procedencia.'},
                {t:'Pago contraentrega',                  d:'Paga cuando recibas tu pedido en Urabá. Sin riesgos, sin adelantos innecesarios.'},
                {t:'Envíos a toda Colombia',              d:'Hacemos llegar tus suplementos a cualquier parte del país. Tiempo y costo coordinados.'},
                {t:'Asesoría personalizada',              d:'Te ayudamos a elegir el suplemento correcto según tu objetivo y nivel de entrenamiento.'},
                {t:'Soporte por WhatsApp',                d:'Respuesta rápida para resolver tus dudas sobre dosis, combinaciones y productos.'},
              ].map((g,i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-green-500 font-black text-base mt-0.5 flex-shrink-0">✓</span>
                  <div>
                    <p className="text-white text-sm font-bold uppercase tracking-[0.06em]">{g.t}</p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{g.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COL 3: CONTACTO */}
          <div>
            <p className="uppercase tracking-[0.25em] text-[#9E9E9E] text-[10px] mb-4">Contacto</p>
            <h2 className="text-3xl font-black uppercase leading-none mb-6 text-white">Hablemos</h2>
            <p className="text-gray-400 text-base leading-relaxed mb-7">
              ¿Tienes dudas sobre qué suplemento elegir o cómo combinarlo? Escríbenos y te asesoramos en minutos.
            </p>
            <a
              href="https://wa.me/573207911013?text=Hola%2C%20quiero%20asesor%C3%ADa%20sobre%20suplementos%20en%20INKognito%20Suple"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl border border-green-500/30 bg-black text-white uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-5"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Hablar con INKognito Suple
            </a>
            <div className="flex flex-col gap-3">
              {['Suplementos de calidad para tu rendimiento','Asesoría técnica personalizada','Con base en Urabá, envíos a Colombia','Pago contraentrega disponible en la región'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-green-500 text-sm flex-shrink-0">✓</span>
                  <span className="text-gray-400 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <FooterSuple />
    </div>
  )
}
