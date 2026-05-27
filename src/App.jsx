import SupplyPage from './components/supply/SupplyPage'
import InkognitoHome from './components/ecosystem/InkognitoHome'
import reservaBg from './assets/reserva/reserva-bg.png'
import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Navbar from './components/tattoo/Navbar'
import Hero from './components/tattoo/Hero'
import About from './components/tattoo/About'
import Gallery from './components/tattoo/Gallery'
import Testimonials from './components/tattoo/Testimonials'
import Footer from './components/tattoo/Footer'

import milogo from './assets/milogo/milogo.png'

/* =========================
   PAGINA PRINCIPAL
========================= */
function HomePage({
  estilo,
  setEstilo,
  zona,
  setZona,
  tamano,
  setTamano
}) {
  return (
    <>
      <Navbar />

      <Hero />

      <About />

      <Testimonials />

      {/* CONTACTO */}
     <section
  id="contacto"
  className="relative py-24 px-4 overflow-hidden border-t border-white/5"
>
  {/* IMAGEN DE FONDO */}
<img
  src={reservaBg}
  alt=""
  className="absolute inset-0 w-full h-full object-cover opacity-80"
/>

{/* CAPA OSCURA */}
<div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">

          <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-8">
            Reserva tu <span className="text-zinc-600">Lugar</span>
          </h2>

          <div className="max-w-md mx-auto bg-black p-8 rounded-xl border border-gray-800 space-y-5">

            <p className="text-gray-300 text-center text-sm">
              Completa esto antes de reservar tu cita
            </p>

            {/* ESTILO */}
            <select
              value={estilo}
              onChange={(e) => setEstilo(e.target.value)}
              className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none"
            >
              <option value="">¿Qué estilo buscas?</option>
              <option value="Realismo">Realismo</option>
              <option value="Línea fina">Línea fina</option>
              <option value="Blackwork">Blackwork</option>
              <option value="Otro">Otro</option>
            </select>

            {/* ZONA */}
            <select
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none"
            >
              <option value="">¿Zona del cuerpo?</option>
              <option value="Brazo">Brazo</option>
              <option value="Pierna">Pierna</option>
              <option value="Pecho">Pecho</option>
              <option value="Espalda">Espalda</option>
            </select>

            {/* TAMAÑO */}
            <select
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
              className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none"
            >
              <option value="">¿Tamaño aproximado?</option>
              <option value="Pequeño">Pequeño</option>
              <option value="Mediano">Mediano</option>
              <option value="Grande">Grande</option>
            </select>

            {/* BOTON */}
            <a
              href={`https://wa.me/573207911013?text=Hola Jose,%20quiero%20cotizar%20un%20tatuaje.%0A%0A•%20Estilo:%20${estilo}%0A•%20Zona:%20${zona}%0A•%20Tamaño:%20${tamano}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-zinc-600 text-white font-black py-4 rounded uppercase tracking-widest hover:bg-green-500 transition-all duration-300 text-center"
            >
              Continuar por WhatsApp
            </a>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

/* =========================
   PAGINA PORTAFOLIO
========================= */
function PortfolioPage({
  estilo,
  setEstilo,
  zona,
  setZona,
  tamano,
  setTamano
}) {
  return (

    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
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

      {/* GALERIA */}
      <Gallery />

      {/* RESERVA */}
      <section className="relative overflow-hidden py-24 px-4 bg-black border-t border-white/5">
      {/* FONDO */}
<img
  src={reservaBg}
  alt=""
  className="absolute inset-0 w-full h-full object-cover opacity-20"
/>

        <div className="relative z-10 max-w-4xl mx-auto text-center">

          <h2 className="text-3xl md:text-5xl font-black uppercase italic mb-8">
            Reserva tu <span className="text-zinc-600">Lugar</span>
          </h2>

          <div className="max-w-md mx-auto bg-black p-8 rounded-xl border border-gray-800 space-y-5">

            <p className="text-gray-300 text-center text-sm">
              Completa esto antes de reservar tu cita
            </p>

            {/* ESTILO */}
            <select
              value={estilo}
              onChange={(e) => setEstilo(e.target.value)}
              className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none"
            >
              <option value="">¿Qué estilo buscas?</option>
              <option value="Realismo">Realismo</option>
              <option value="Línea fina">Línea fina</option>
              <option value="Blackwork">Blackwork</option>
              <option value="Otro">Otro</option>
            </select>

            {/* ZONA */}
            <select
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none"
            >
              <option value="">¿Zona del cuerpo?</option>
              <option value="Brazo">Brazo</option>
              <option value="Pierna">Pierna</option>
              <option value="Pecho">Pecho</option>
              <option value="Espalda">Espalda</option>
            </select>

            {/* TAMAÑO */}
            <select
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
              className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none"
            >
              <option value="">¿Tamaño aproximado?</option>
              <option value="Pequeño">Pequeño</option>
              <option value="Mediano">Mediano</option>
              <option value="Grande">Grande</option>
            </select>

            {/* BOTON */}
            <a
              href={`https://wa.me/573207911013?text=Hola Jose,%20quiero%20cotizar%20un%20tatuaje.%0A%0A•%20Estilo:%20${estilo}%0A•%20Zona:%20${zona}%0A•%20Tamaño:%20${tamano}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-zinc-600 text-white font-black py-4 rounded uppercase tracking-widest hover:bg-green-500 transition-all duration-300 text-center"
            >
              Continuar por WhatsApp
            </a>

          </div>

          {/* BOTON INICIO ABAJO */}
          <div className="mt-10">

            <Link
              to="/tattoo"
              className="px-10 py-4 rounded bg-zinc-600 text-white font-black text-sm uppercase tracking-widest hover:bg-green-500 transition-all transform hover:-translate-y-1 text-center shadow-lg"
            >
              Inicio
            </Link>

          </div>

        </div>
      </section>

      <Footer />

    </div>
  )
}

/* =========================
   APP
========================= */
function App() {

  const [estilo, setEstilo] = useState('')
  const [zona, setZona] = useState('')
  const [tamano, setTamano] = useState('')

  return (
    <div className="bg-black text-white overflow-x-hidden">

      <Routes>

  <Route
    path="/"
    element={<InkognitoHome />}
  />

  <Route
    path="/tattoo"
    element={
      <HomePage
        estilo={estilo}
        setEstilo={setEstilo}
        zona={zona}
        setZona={setZona}
        tamano={tamano}
        setTamano={setTamano}
      />
    }
  />

  <Route
    path="/portafolio"
    element={
      <PortfolioPage
        estilo={estilo}
        setEstilo={setEstilo}
        zona={zona}
        setZona={setZona}
        tamano={tamano}
        setTamano={setTamano}
      />
    }
  />

  <Route
    path="/supply"
    element={<SupplyPage />}
  />

</Routes>
    </div>
  )
}

export default App