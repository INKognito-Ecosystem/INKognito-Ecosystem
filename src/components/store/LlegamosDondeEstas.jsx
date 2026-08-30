import { ZONAS_FLETE } from '../../data/colombiaGeo'
import rutaDelGolfoLogo from '../../assets/milogo/rutadelgolfologo.png'

const GARANTIAS = ['Pago contraentrega disponible', 'Contacto directo con cada tienda', 'Cobertura en toda la región de Urabá']

// "Llegamos donde estás" — logística, solo móvil. Compartida entre
// StorePage.jsx y todas las páginas de categoría (2026-08-30) — antes cada
// página de categoría tenía su propia copia hardcodeada con el logo y
// nombre de Eljach, y quedaron desactualizadas cuando Store pasó a "Ruta
// del Golfo" (varias transportadoras, no una sola). Un solo componente
// evita que esto vuelva a desalinearse (Jose: "todo debe ser consistente").
//
// A propósito NO muestra días de entrega por municipio, a diferencia de la
// versión vieja — con varias transportadoras pudiendo conectarse, el
// tiempo real va a variar y en varios casos será más rápido que la ruta
// fija de antes; prometer un rango fijo ya no es preciso (2026-08-30, Jose).
export default function LlegamosDondeEstas() {
  return (
    <div className="md:hidden bg-black text-white border-t border-zinc-900 px-6 py-8">
      <h2 className="text-2xl font-black uppercase leading-none mb-3 text-white">Llegamos donde estás</h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-5">
        Entregas seguras con Ruta del Golfo, nuestra red de transportadoras verificadas en toda la región de Urabá.
      </p>
      <div className="flex items-center gap-3 mb-5 bg-white rounded-xl px-3 py-2.5">
        <img src={rutaDelGolfoLogo} alt="Ruta del Golfo" className="w-14 h-14 flex-shrink-0" />
        <div>
          <p className="text-gray-900 text-xs font-bold uppercase tracking-wide leading-tight">Ruta del Golfo</p>
          <p className="text-gray-500 text-[10px] mt-0.5">Transportadoras verificadas</p>
        </div>
      </div>
      <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Zonas de cobertura</p>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {Object.values(ZONAS_FLETE).map((z) => (
          <span key={z} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] bg-[#C9A84C]/5">{z}</span>
        ))}
      </div>
      <p className="text-zinc-700 text-[9px] leading-relaxed mb-4">
        ¿Fuera de Urabá? También enviamos al resto de Colombia — tiempo y costo se coordinan al confirmar el pedido.
      </p>
      <div className="flex flex-col gap-2">
        {GARANTIAS.map((g) => (
          <div key={g} className="flex items-center gap-2">
            <span className="font-bold text-sm" style={{ color: '#C9A84C' }}>✓</span>
            <span className="text-zinc-400 text-xs">{g}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
