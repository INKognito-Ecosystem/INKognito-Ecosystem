import { useState, useEffect } from 'react'
import heroBg from '../../assets/hero/hero-bg.webp'
import { Link } from 'react-router-dom'
import imgmifoto from '../../assets/mifoto/fondoperfilweb.jpg'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'

export default function Hero() {
  // null = todavía cargando (muestra placeholder neutro para evitar flash de imagen antigua)
  // string = URL a mostrar (del panel o fallback estático si falla/vacío)
  const [heroPhoto, setHeroPhoto] = useState(null)

  useEffect(() => {
    fetch(`${PANEL_URL}/api/jhumaneztattoo/hero`)
      .then(r => r.json())
      .then(data => setHeroPhoto(data.image_url || imgmifoto))
      .catch(() => setHeroPhoto(imgmifoto))
  }, [])

  return (
    <section className="relative overflow-hidden min-h-screen bg-black flex items-center justify-center pt-24 pb-12">

      {/* FONDO */}
<img
  src={heroBg}
  alt=""
  className="absolute inset-0 w-full h-full object-cover opacity-70 brightness-50 scale-105"
/>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">

        {/* IZQUIERDA */}
        <div className="flex flex-col items-center md:w-1/2">

          <div className="relative group">

            <div className="absolute -inset-1 bg-red-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-700"></div>

            {heroPhoto
              ? <img
                  src={heroPhoto}
                  alt="Jose Humanez"
                  className="relative w-40 h-40 md:w-96 md:h-96 object-cover rounded-full border-2 border-white/10 shadow-2xl"
                />
              : <div className="relative w-40 h-40 md:w-96 md:h-96 rounded-full border-2 border-white/10 bg-zinc-900 shadow-2xl" />
            }

          </div>

          <div className="mt-3 text-center">

            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
              Jose Humanez
            </h2>

            <p className="text-zinc-600 font-bold text-xs uppercase tracking-[0.4em] mt-1">
              Tatuador Profesional
            </p>

            <p className="text-gray-500 text-sm mt-2 font-medium">
              Chigorodó, Antioquia • Colombia
            </p>

          </div>

          <Link
            to="/portafolio"
            className="mt-5 px-10 py-4 rounded bg-zinc-600 text-white font-black text-sm uppercase tracking-widest hover:bg-green-500 transition-all transform hover:-translate-y-1 text-center shadow-lg"
          >
            Ver Portafolio
          </Link>
        </div>

        {/* DERECHA */}
        <div className="md:w-1/2 text-center md:text-left space-y-8">

          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.85] uppercase italic">

            Arte que <br />

            <span className="text-zinc-600">
              perdura
            </span>

            <br />

            en tu piel

          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto md:mx-0 leading-relaxed font-light">

            Especialista en realismo y sombras.
            Transformo tus ideas en piezas únicas
            con precisión absoluta y arte impecable
            en Chigorodó.

          </p>

        </div>

      </div>
    </section>
  )
}