import React, { useState, useEffect } from 'react'
import { TATTOO_HOURS } from '../../config/business'
import { Link } from 'react-router-dom'
import milogo from '../../assets/milogo/milogo.webp'
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'
import { Menu, X, ShoppingCart, User, ImageIcon, MessageCircle, Clock, Globe, Home, ShieldCheck, Dumbbell } from 'lucide-react'

export default function Navbar({ showInicio = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [horarioOpen, setHorarioOpen] = useState(false)
  // Sobre el hero (sin scroll): solo el botón hamburguesa, transparente, sin
  // fondo ni línea — para no tapar la foto. Al hacer scroll aparece la barra
  // blanca con logo + nombre. Mismo patrón de scroll que WhatsAppFloat.jsx.
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setMenuOpen(false)
    }
  }

  return (
    <>
      <nav className={`fixed w-full z-50 transition-colors duration-300 ${scrolled ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* grid de 3 columnas (auto / 1fr / auto): el nombre queda centrado
              en el espacio libre entre el logo y el botón hamburguesa, en
              vez de pegado al logo como antes. */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-20 gap-3">

            {scrolled ? (
              <Link to="/jhumaneztattoo" className="flex items-center">
                <img src={milogo} alt="Logo" className="w-14 h-14 object-contain" />
              </Link>
            ) : <span />}

            {scrolled ? (
              <span className="text-black font-black text-lg sm:text-2xl tracking-widest uppercase text-center">
                JHUMANEZTATTOO
              </span>
            ) : <span />}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`justify-self-end transition-colors duration-300 ${scrolled ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-200'}`}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>

        {/* DROPDOWN */}
        {menuOpen && (
          <div className="absolute right-4 top-full bg-white border border-gray-200 shadow-xl w-56 z-50 rounded-lg overflow-hidden">

            {showInicio && (
              <Link to="/jhumaneztattoo" onClick={() => setMenuOpen(false)} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span>Inicio</span>
                  <Home size={14} />
                </div>
              </Link>
            )}

            {!showInicio && (
              <button onClick={() => scrollTo('acerca')} className="w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span>Acerca de mí</span>
                  <User size={14} />
                </div>
              </button>
            )}

            {!showInicio && (
              <Link to="/portafolio" onClick={() => setMenuOpen(false)} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span>Portafolio</span>
                  <ImageIcon size={14} />
                </div>
              </Link>
            )}

            {!showInicio && (
              <button onClick={() => scrollTo('testimonios')} className="w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span>nuestros clientes</span>
                  <MessageCircle size={14} />
                </div>
              </button>
            )}

            <Link to="/cuidados" onClick={() => setMenuOpen(false)} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span>Cuidados</span>
                <ShieldCheck size={14} />
              </div>
            </Link>

            <button onClick={() => { setHorarioOpen(true); setMenuOpen(false) }} className="w-full text-left px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span>Horario</span>
                <Clock size={14} />
              </div>
            </button>

            <Link to="/supply" onClick={() => setMenuOpen(false)} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span>INKognito Supply</span>
                <ShoppingCart size={14} />
              </div>
            </Link>

            <Link to="/store" onClick={() => setMenuOpen(false)} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span>INKognito Store</span>
                <ShoppingCart size={14} />
              </div>
            </Link>

            <Link to="/gym" onClick={() => setMenuOpen(false)} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span>INKognito Gym</span>
                <Dumbbell size={14} />
              </div>
            </Link>

            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-6 py-4 uppercase text-xs tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span>Ecosistema</span>
                <Globe size={14} />
              </div>
            </Link>

            <div className="px-6 py-4 flex gap-4 justify-center">
              <a href="https://www.instagram.com/jhumaneztattoo?igsh=MXh4ZW9vaGZnMDVtZQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gradient-to-br hover:from-pink-500 hover:to-yellow-500 hover:text-white hover:border-transparent transition-all duration-300">
                <FaInstagram size={18} />
              </a>
              <a href="https://www.facebook.com/humanezjose" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all duration-300">
                <FaFacebookF size={16} />
              </a>
              <a href="https://youtube.com/@jhumanezz?si=9uXLRHm_QPAWo6uB" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white hover:border-transparent transition-all duration-300">
                <FaYoutube size={18} />
              </a>
            </div>

          </div>
        )}
      </nav>

      {horarioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setHorarioOpen(false)}>
          <div className="bg-white rounded-xl p-8 w-80 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-black font-black uppercase tracking-widest text-lg">Horario</h3>
              <button onClick={() => setHorarioOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>
            <ul className="space-y-4 text-gray-700 text-sm">
              <li className="flex justify-between border-b border-gray-100 pb-3">
                <span className="font-bold uppercase tracking-wide">{TATTOO_HOURS.weekdays.label}</span>
                <span>{TATTOO_HOURS.weekdays.hours}</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 pb-3">
                <span className="font-bold uppercase tracking-wide">{TATTOO_HOURS.saturday.label}</span>
                <span>{TATTOO_HOURS.saturday.hours}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-bold uppercase tracking-wide">{TATTOO_HOURS.sunday.label}</span>
                <span className="text-red-500">Cerrado</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
