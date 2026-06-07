import SupplyPage from './components/supply/SupplyPage'
import MachinesPage from './components/supply/categories/MachinesPage'
import CartridgesPage from './components/supply/categories/CartridgesPage'
import PowerSuppliesPage from './components/supply/categories/PowerSuppliesPage'
import NeedlesPage from './components/supply/categories/NeedlesPage'
import GlovesPage from './components/supply/categories/GlovesPage'
import InkPage from './components/supply/categories/ink/InkPage'
import ViceColorsPage from './components/supply/categories/ink/ViceColorsPage'
import DynamicColorsPage from "./components/supply/categories/ink/DynamicColorsPage";
import EternalColorsPage from './components/supply/categories/ink/EternalColorsPage'
import IntenzeColorsPage from './components/supply/categories/ink/IntenzeColorsPage'
import FusionColorsPage from './components/supply/categories/ink/FusionColorsPage'
import WorldFamousColorsPage from './components/supply/categories/ink/WorldFamousColorsPage'
import SolidColorsPage from './components/supply/categories/ink/SolidColorsPage'
import AftercarePage from './components/supply/categories/AftercarePage'
import AccessoriesPage from './components/supply/categories/AccessoriesPage'
import FurniturePage from './components/supply/categories/FurniturePage'
import BundlesPage from './components/supply/categories/BundlesPage'
import TattooVisionPage from './components/supply/Marcasprofesionales/TattooVisionPage'
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

      <Navbar showInicio={true} />

      <Gallery />

      <section className="relative overflow-hidden py-24 px-4 bg-black border-t border-white/5">
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
            <select value={estilo} onChange={(e) => setEstilo(e.target.value)} className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none">
              <option value="">¿Qué estilo buscas?</option>
              <option value="Realismo">Realismo</option>
              <option value="Línea fina">Línea fina</option>
              <option value="Blackwork">Blackwork</option>
              <option value="Otro">Otro</option>
            </select>
            <select value={zona} onChange={(e) => setZona(e.target.value)} className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none">
              <option value="">¿Zona del cuerpo?</option>
              <option value="Brazo">Brazo</option>
              <option value="Pierna">Pierna</option>
              <option value="Pecho">Pecho</option>
              <option value="Espalda">Espalda</option>
            </select>
            <select value={tamano} onChange={(e) => setTamano(e.target.value)} className="w-full bg-zinc-900 border border-gray-700 text-white p-4 rounded outline-none">
              <option value="">¿Tamaño aproximado?</option>
              <option value="Pequeño">Pequeño</option>
              <option value="Mediano">Mediano</option>
              <option value="Grande">Grande</option>
            </select>
            <a href={`https://wa.me/573207911013?text=Hola Jose,%20quiero%20cotizar%20un%20tatuaje.%0A%0A•%20Estilo:%20${estilo}%0A•%20Zona:%20${zona}%0A•%20Tamaño:%20${tamano}`} target="_blank" rel="noopener noreferrer" className="block w-full bg-zinc-600 text-white font-black py-4 rounded uppercase tracking-widest hover:bg-green-500 transition-all duration-300 text-center">
              Continuar por WhatsApp
            </a>
          </div>
          <div className="mt-10">
            <Link to="/tattoo" className="px-10 py-4 rounded bg-zinc-600 text-white font-black text-sm uppercase tracking-widest hover:bg-green-500 transition-all transform hover:-translate-y-1 text-center shadow-lg">
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
  <Route 
    path="/supply/machines" 
    element={<MachinesPage />} 
  />
  <Route 
  path="/supply/cartridges" 
  element={<CartridgesPage />} 
  />
<Route 
  path="/supply/power-supplies" 
  element={<PowerSuppliesPage />} 
  />
  <Route 
  path="/supply/ink" 
  element={<InkPage />} 
  />
  <Route 
  path="/supply/ink/vice-colors" 
  element={<ViceColorsPage />} 
  />
  <Route 
  path="/supply/needles" 
  element={<NeedlesPage />} 
  />
  <Route 
  path="/supply/gloves" 
  element={<GlovesPage />} 
  />
  <Route path="/supply/aftercare" element={<AftercarePage />} />
  <Route path="/supply/accessories" element={<AccessoriesPage />} />
  <Route path="/supply/furniture" element={<FurniturePage />} />
  <Route path="/supply/bundles" element={<BundlesPage />} />
  <Route path="/brands/tattoo-vision" element={<TattooVisionPage />} />
  <Route path="/supply/ink/dynamic" element={<DynamicColorsPage />}/>
  <Route path="/supply/ink/eternal" element={<EternalColorsPage />} />
  <Route path="/supply/ink/intenze" element={<IntenzeColorsPage />} />
  <Route path="/supply/ink/fusion" element={<FusionColorsPage />} />
  <Route path="/supply/ink/world-famous" element={<WorldFamousColorsPage />} />
  <Route path="/supply/ink/solid-ink" element={<SolidColorsPage />} />




</Routes>
    </div>
  )
}

export default App