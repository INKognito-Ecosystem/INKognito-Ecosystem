import { motion } from 'motion/react'
import { SiReact, SiVite, SiNodedotjs, SiPostgresql, SiRailway, SiVercel, SiCloudinary, SiMercadopago } from 'react-icons/si'

const STACK = [
  { name: 'React', Icon: SiReact },
  { name: 'Vite', Icon: SiVite },
  { name: 'Node.js', Icon: SiNodedotjs },
  { name: 'PostgreSQL', Icon: SiPostgresql },
  { name: 'Railway', Icon: SiRailway },
  { name: 'Vercel', Icon: SiVercel },
  { name: 'Cloudinary', Icon: SiCloudinary },
  { name: 'Mercado Pago', Icon: SiMercadopago },
]

function TechLogo({ name, Icon }) {
  return (
    <div className="group flex flex-col items-center gap-2 flex-shrink-0">
      <Icon size={30} className="text-zinc-600 group-hover:text-white transition-colors duration-300" />
      <span className="text-zinc-700 group-hover:text-zinc-400 text-[9px] uppercase tracking-widest transition-colors duration-300">
        {name}
      </span>
    </div>
  )
}

// Franja de confianza "construido con estas tecnologías" (2026-08-30, Jose
// — inspirado en fractaill.com). Marquee CSS puro, sin librería.
//
// El truco de "duplicar la lista y deslizar -50%" se ve perfecto solo si el
// ancho total es EXACTAMENTE el doble del ancho de una copia. Con `gap` en
// un solo contenedor eso falla: el gap que separa la copia 1 de la copia 2
// cuenta una sola vez, así que la mitad del ancho total no coincide con el
// ancho real de una copia — queda corto por gap/2, y ese faltante se ve
// como un salto/corte en cada vuelta (reportado 2026-08-30). Por eso acá
// cada copia es su propio contenedor con `pr` igual a su propio `gap` (el
// "espacio de cierre" que en el otro enfoque solo existía entre copias) —
// así cada copia mide lo mismo empaquetada, el contenedor exterior no
// necesita gap propio, y -50% del total cae exactamente donde debe.
export default function TechMarquee() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black border-t border-zinc-900 py-10 md:py-12 overflow-hidden"
    >
      <p className="text-center text-zinc-600 uppercase tracking-[0.25em] text-[10px] md:text-xs mb-7">
        Construido con estas tecnologías y productos
      </p>
      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div className="tech-marquee-track flex items-center w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24 flex-shrink-0">
              {STACK.map((t) => <TechLogo key={t.name} {...t} />)}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
