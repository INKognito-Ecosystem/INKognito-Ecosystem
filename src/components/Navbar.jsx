import React from 'react'
import { Link } from 'react-router-dom'
import milogo from '../assets/milogo/milogo.png'

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white shadow-lg border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-20">

          {/* IZQUIERDA */}
          <Link
            to="/"
            className="flex items-center gap-4"
          >
            <img
              src={milogo}
              alt="Logo"
              className="w-16 h-16 object-contain"
            />

            <span className="text-black font-black text-2xl tracking-widest uppercase">
              JHUMANEZTATTOO
            </span>
          </Link>

          {/* CENTRO */}
          <div className="hidden lg:block">

          <Link
  to="/"
  className="px-20 py-4 rounded bg-zinc-700 text-white font-black tracking-[0.4em] uppercase text-sm italic shadow-md hover:bg-green-600 transition-all duration-300"
>
  Inkognito tattoo
</Link>
          </div>

          {/* DERECHA */}
          <div className="hidden md:flex items-center space-x-8">

            <Link
              to="/tattoo"
              className="text-black hover:text-gray-600 transition-colors text-sm font-bold tracking-wide uppercase"
            >
              Inicio
            </Link>

            <Link
              to="/portafolio"
              className="text-black hover:text-gray-600 transition-colors text-sm font-bold tracking-wide uppercase"
            >
              Galería
            </Link>

            <a
              href="https://wa.me/573207911013?text=Hola%20Jose,%20quiero%20información%20sobre%20un%20tatuaje"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded bg-zinc-600 text-white font-bold hover:bg-green-500 transition-all duration-300 uppercase"
            >
              Reservar Cita
            </a>

          </div>

        </div>
      </div>
    </nav>
  )
}