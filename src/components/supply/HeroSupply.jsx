import { Link } from 'react-router-dom'

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(161,161,170,1) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
}

export default function HeroSupply() {

  return (

    <section className="relative pt-16 md:pt-24 pb-4 md:pb-8 bg-gray-950 text-white flex items-center px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.11]" style={DOT_PATTERN} />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">

        {/* IZQUIERDA */}
        <div>

          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9]">
            Professional
            <br />
            Tattoo
            <br />
            Equipment
          </h1>

          <p className="mt-3 text-zinc-400 text-lg leading-relaxed max-w-xl">
            Equipamiento profesional para tatuadores en Urabá. Stock real,
            calidad verificada y el respaldo que tu trabajo exige.
          </p>

          {/* BOTONES — ancho completo en móvil, flex en desktop */}
          <div className="grid grid-cols-3 md:flex md:flex-wrap gap-3 mt-6 md:mt-10">
            <Link
              to="/supply/ink/vice-colors"
              className="text-center py-3 border border-blue-500 text-white uppercase tracking-wider text-[11px] md:text-sm md:px-6 hover:bg-blue-500 transition-all duration-300"
            >
              Vice Colors
            </Link>
            <Link
              to="/supply/brands/tattoo-vision"
              className="text-center py-3 border border-blue-500 text-white uppercase tracking-wider text-[11px] md:text-sm md:px-6 hover:bg-blue-500 transition-all duration-300"
            >
              Tattoo Vision
            </Link>
            <Link
              to="/supply/brands/heaven-pro"
              className="text-center py-3 border border-blue-500 text-white uppercase tracking-wider text-[11px] md:text-sm md:px-6 hover:bg-blue-500 transition-all duration-300"
            >
              Heaven Pro
            </Link>
          </div>

          <p className="mt-5 text-center md:text-left text-xs italic tracking-wide text-zinc-400">
            “De un tatuador, para tatuadores.”
          </p>

        </div>

        {/* DERECHA — solo desktop */}
<div className="hidden md:flex justify-center">

<div className="bg-zinc-950 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300">
    <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-4">
      Logística · Cobertura
    </p>

    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center justify-center bg-white rounded-xl p-2 flex-shrink-0 w-14 h-14">
        <img src="/eljach.png" alt="Eljach" className="w-full h-full object-contain" />
      </div>
      <div>
        <p className="text-white text-sm font-bold uppercase tracking-wide leading-tight">Eljach Transportadora</p>
        <p className="text-zinc-500 text-xs mt-0.5">Aliado logístico · Contra entrega</p>
      </div>
    </div>

    <div className="space-y-2.5 mb-6">
      {[{name:'Chigorodó',time:'1–2 días'},{name:'Carepa',time:'1–2 días'},{name:'Apartadó',time:'1–2 días'},{name:'Turbo',time:'2–3 días'}].map(c => (
        <div key={c.name} className="flex items-center justify-between border-b border-zinc-900 pb-2">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-500/30 text-blue-400 bg-blue-500/5">{c.name}</span>
          <span className="text-zinc-600 text-[10px] uppercase tracking-[0.12em]">{c.time}</span>
        </div>
      ))}
    </div>

    <div className="border-t border-zinc-800 pt-6">
      <p className="text-zinc-400 text-sm leading-relaxed">
        Contraentrega en toda la región de Urabá. ¿Fuera de la región? También enviamos a
        todo Colombia — tiempo y costo se coordinan al confirmar el pedido.
      </p>
    </div>

  </div>

</div>
</div>
 </section>

  )

}