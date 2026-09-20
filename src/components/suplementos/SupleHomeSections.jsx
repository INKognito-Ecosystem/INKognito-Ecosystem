import { ExternalLink } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { ZONAS_FLETE } from '../../data/colombiaGeo'
import rutaDelGolfoLogo from '../../assets/milogo/rutadelgolfologo.png'

export const WA = '573207911013'

// Mismo patrón punteado que ya usan las secciones de cobertura/contacto de
// Supply y Store (2026-08-02) — en blanco (2026-09-19) el punto pasa a
// oscuro y muy tenue.
export const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(24,24,27,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

// Secciones del home de Suple compartidas entre la versión móvil
// (MobileHomeSuple.jsx) y la de escritorio (SuplePage.jsx), en blanco
// (2026-09-19, migración de Suple a fondo blanco). El contenido es el mismo
// que ya tenía el home — solo se separó en piezas para no duplicarlo.

// ── SUPLEMENTOS AFILIADOS — sección fija, siempre visible ──
export function AfiliadosSuple({ afiliados = [] }) {
  return (
    <section className="border-t border-zinc-200 bg-zinc-50 px-4 md:px-6 py-10 md:py-14">
      <div className="max-w-7xl mx-auto">
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">✦ Las marcas que no llegan al local, disponibles para ti</p>
        <h2 className="text-2xl md:text-3xl font-black uppercase leading-none mb-2 text-zinc-900">
          Los suplementos que ya usan los que van en serio
        </h2>
        <p className="text-zinc-500 text-sm mb-8 max-w-lg leading-relaxed">
          Proteínas, creatinas y pre-entrenos de marcas internacionales desde Mercado Libre con envío a Colombia. La misma calidad de los grandes, sin pagar el sobreprecio del intermediario. Complementa tu stack sin limitarte a lo que hay en Urabá.
        </p>
        {afiliados.length > 0 ? (
          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-hide">
            {afiliados.map((item, i) => {
              const url = item.url_ventas || item.url_checkout || null
              const inner = (
                <div className="border border-zinc-200 bg-white rounded-2xl overflow-hidden flex flex-col h-full hover:border-zinc-400 hover:shadow-md transition-all duration-300">
                  <div className="aspect-square w-full bg-zinc-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      : <ExternalLink size={28} className="text-zinc-300" strokeWidth={1} />
                    }
                  </div>
                  <div className="p-3 flex flex-col gap-1.5 flex-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Recurso externo · {item.plataforma || item.categoria}</span>
                    <h3 className="text-xs font-black uppercase leading-tight text-zinc-900">{item.name}</h3>
                    {item.descripcion && (
                      <p className="text-zinc-500 text-[10px] leading-relaxed flex-1">{item.descripcion}</p>
                    )}
                    {url && (
                      <span className="mt-auto pt-1 text-[9px] font-bold uppercase tracking-widest text-zinc-700 flex items-center gap-1">
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
          <div className="border border-zinc-200 bg-white rounded-2xl p-6 text-center">
            <p className="text-zinc-500 text-sm mb-4 max-w-sm mx-auto">
              Aún no tenemos suplementos importados cargados. Avísanos y te contactamos apenas tengamos opciones disponibles.
            </p>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero que me avisen cuando haya suplementos disponibles en INKognito Suple.')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-700 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-zinc-800 transition"
            >
              Avisarme cuando haya stock →
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

// ── COBERTURA + CONTACTO — solo móvil ──
export function CoberturaMovilSuple() {
  return (
    <section id="contacto" className="relative overflow-hidden border-t border-zinc-200 bg-white px-4 py-8">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={DOT_PATTERN} />
      <div className="relative z-10">
        <h2 className="text-2xl font-black uppercase leading-none mb-3 text-zinc-900">Llegamos donde estás</h2>
        <p className="text-zinc-500 text-sm leading-relaxed mb-5">
          Entregas seguras con Ruta del Golfo, nuestra red de transportadoras verificadas en toda la región de Urabá.
        </p>
        {/* Ruta del Golfo — mismo bloque y colores de marca que Store
            (LlegamosDondeEstas.jsx); reemplaza al viejo bloque de Eljach.
            Sin días por municipio a propósito: con varias transportadoras el
            tiempo real varía. */}
        <div className="flex items-center gap-3 mb-5 bg-[#0057D9]/5 border border-[#0057D9]/15 rounded-xl px-3 py-2.5">
          <img src={rutaDelGolfoLogo} alt="Ruta del Golfo" className="w-14 h-14 flex-shrink-0" />
          <div>
            <p className="text-zinc-900 text-xs font-bold uppercase tracking-wide leading-tight">Ruta del Golfo</p>
            <p className="text-zinc-500 text-[10px] mt-0.5">Transportadoras verificadas</p>
          </div>
        </div>
        <p className="text-[#0057D9] text-[10px] uppercase tracking-widest mb-2 font-semibold">Zonas de cobertura</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {Object.values(ZONAS_FLETE).map(z => (
            <span key={z} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#F2854C]/40 text-[#F2854C] bg-[#F2854C]/10">{z}</span>
          ))}
        </div>
        <p className="text-zinc-400 text-[9px] leading-relaxed mb-4">
          ¿Fuera de Urabá? También enviamos al resto de Colombia — tiempo y costo se coordinan al confirmar.
        </p>
        <div className="flex flex-col gap-2">
          {['Pago contraentrega disponible','Cobertura en toda la región de Urabá'].map(g => (
            <div key={g} className="flex items-center gap-2">
              <span className="text-green-600 text-sm font-bold">✓</span>
              <span className="text-zinc-600 text-xs">{g}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── LOGÍSTICA + GARANTÍAS + CONTACTO — solo desktop ──
export function LogisticaGarantiasSuple() {
  return (
    <section id="contacto-desktop" className="relative overflow-hidden bg-white border-t border-zinc-200 px-6 py-14">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={DOT_PATTERN} />
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">

        {/* COL 1: LOGÍSTICA */}
        <div>
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-[10px] mb-4">Logística · Cobertura</p>
          {/* Ruta del Golfo — mismo bloque y colores de marca que Store
              (StorePage.jsx, col. logística); reemplaza al viejo bloque de
              Eljach. Sin días por municipio a propósito. */}
          <div className="flex items-center gap-3 mb-6 bg-[#0057D9]/5 border border-[#0057D9]/15 rounded-xl px-4 py-3">
            <img src={rutaDelGolfoLogo} alt="Ruta del Golfo" className="w-14 h-14 flex-shrink-0" />
            <div>
              <p className="text-zinc-900 text-sm font-bold uppercase tracking-wide leading-tight">Ruta del Golfo</p>
              <p className="text-zinc-500 text-xs mt-0.5">Transportadoras verificadas</p>
            </div>
          </div>
          <h2 className="text-3xl font-black uppercase leading-none mb-6 text-zinc-900">Llegamos donde estás</h2>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-2">Zonas de cobertura</p>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {Object.values(ZONAS_FLETE).map(z => (
              <span key={z} className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#F2854C]/40 text-[#F2854C] bg-[#F2854C]/10">{z}</span>
            ))}
          </div>
          <div className="border-t border-zinc-200 pt-4">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1.5">Resto de Colombia</p>
            <p className="text-zinc-500 text-xs leading-relaxed">
              ¿Estás fuera de Urabá? Podemos enviarte tu pedido a cualquier parte del país.
              Tiempo y costo de envío se coordinan al confirmar el pedido.
            </p>
          </div>
        </div>

        {/* COL 2: GARANTÍAS */}
        <div>
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-[10px] mb-4">Garantías</p>
          <h2 className="text-3xl font-black uppercase leading-none mb-6 text-zinc-900">Compra con Confianza</h2>
          <div className="flex flex-col gap-4">
            {[
              {t:'Productos de calidad verificada',    d:'Selección de suplementos de marcas reconocidas. Sin productos de dudosa procedencia.'},
              {t:'Pago contraentrega',                  d:'Paga cuando recibas tu pedido en Urabá. Sin riesgos, sin adelantos innecesarios.'},
              {t:'Envíos a toda Colombia',              d:'Hacemos llegar tus suplementos a cualquier parte del país. Tiempo y costo coordinados.'},
              {t:'Asesoría personalizada',              d:'Te ayudamos a elegir el suplemento correcto según tu objetivo y nivel de entrenamiento.'},
              {t:'Soporte por WhatsApp',                d:'Respuesta rápida para resolver tus dudas sobre dosis, combinaciones y productos.'},
            ].map((g,i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-green-600 font-black text-base mt-0.5 flex-shrink-0">✓</span>
                <div>
                  <p className="text-zinc-900 text-sm font-bold uppercase tracking-[0.06em]">{g.t}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">{g.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COL 3: CONTACTO */}
        <div>
          <p className="uppercase tracking-[0.25em] text-zinc-500 text-[10px] mb-4">Contacto</p>
          <h2 className="text-3xl font-black uppercase leading-none mb-6 text-zinc-900">Hablemos</h2>
          <p className="text-zinc-600 text-base leading-relaxed mb-7">
            ¿Tienes dudas sobre qué suplemento elegir o cómo combinarlo? Escríbenos y te asesoramos en minutos.
          </p>
          <a
            href="https://wa.me/573207911013?text=Hola%2C%20quiero%20asesor%C3%ADa%20sobre%20suplementos%20en%20INKognito%20Suple"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl border border-green-500/40 bg-green-50 text-green-700 uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-green-100 mb-5"
          >
            <FaWhatsapp size={22} />
            Hablar con INKognito Suple
          </a>
          <div className="flex flex-col gap-3">
            {['Suplementos de calidad para tu rendimiento','Asesoría técnica personalizada','Con base en Urabá, envíos a Colombia','Pago contraentrega disponible en la región'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <span className="text-green-600 text-sm flex-shrink-0">✓</span>
                <span className="text-zinc-600 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
