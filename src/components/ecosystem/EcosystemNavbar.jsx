import { useState, useEffect } from 'react'
import inkognitoLogo from '../../assets/ecosystem/logo.png'

export default function EcosystemNavbar({ tattooLabel = 'Tattoo Studio' }) {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [tattooOpen, setTattooOpen] = useState(false)
  const [scrolled,  setScrolled]  = useState(false)

  useEffect(() => {
    document.body.style.overflow = (menuOpen || aboutOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, aboutOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openAbout = () => {
    setMenuOpen(false)
    setTimeout(() => setAboutOpen(true), 300)
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        <img
          src={inkognitoLogo}
          alt="INKognito"
          className="h-[52px] w-auto object-contain"
        />

        {/* TAGLINE central — desaparece al hacer scroll */}
        <span
          className="absolute left-1/2 -translate-x-1/2 text-white/60 text-[10px] tracking-[0.28em] uppercase font-bold pointer-events-none transition-opacity duration-500 hidden sm:block"
          style={{ opacity: scrolled ? 0 : 1 }}
        >
          Disciplina. Arte. Identidad.
        </span>

        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          className="flex flex-col gap-[5px] p-1 bg-transparent border-none cursor-pointer"
        >
          <span className="block w-6 h-[2px] bg-white/90 rounded-sm" />
          <span className="block w-6 h-[2px] bg-white/90 rounded-sm" />
          <span className="block w-6 h-[2px] bg-white/90 rounded-sm" />
        </button>
      </nav>

      {/* OVERLAY MENÚ */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-[60]"
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-screen w-[280px] bg-[rgba(10,10,10,0.97)] backdrop-blur-2xl border-l border-white/[0.08] z-[70] flex flex-col p-6 transition-transform duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-12">
          <img src={inkognitoLogo} alt="INKognito" className="h-11 w-auto" />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="bg-transparent border-none cursor-pointer text-white/60 text-2xl leading-none p-1 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          <MenuLink label="About" onClick={openAbout} />

          {/* TATTOO STUDIO — desplegable con solo redes sociales */}
          <div>
            <button
              onClick={() => setTattooOpen(o => !o)}
              className="w-full text-left px-4 py-[14px] text-white/85 bg-transparent border-none cursor-pointer uppercase tracking-[0.25em] text-[13px] font-bold rounded hover:bg-white/[0.06] hover:text-white transition-all duration-200 flex items-center justify-between"
            >
              {tattooLabel}
              <span
                className="text-white/40 text-[10px] transition-transform duration-300"
                style={{ display: 'inline-block', transform: tattooOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▾
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: tattooOpen ? '120px' : '0px', opacity: tattooOpen ? 1 : 0 }}
            >
              <div className="flex flex-col pb-1">
                <SocialLink href="https://www.instagram.com/jhumaneztattoo?igsh=MXh4ZW9vaGZnMDVtZQ==" label="Instagram" />
                <SocialLink href="https://www.facebook.com/humanezjose" label="Facebook" />
              </div>
            </div>
          </div>
        </nav>

        <div className="mt-auto border-t border-white/[0.08] pt-6">
          <p className="text-white/25 text-[10px] tracking-[0.2em] uppercase text-center">
            INKognito Ecosystem © 2026
          </p>
        </div>
      </div>

      {/* OVERLAY MODAL ABOUT */}
      {aboutOpen && (
        <div
          onClick={() => setAboutOpen(false)}
          className="fixed inset-0 bg-black/60 z-[60]"
        />
      )}

      {/* MODAL ABOUT */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-[90%] max-w-[480px] bg-[rgba(10,10,10,0.97)] backdrop-blur-3xl border border-white/[0.08] rounded-lg px-9 py-10 transition-all duration-300 ease-in-out ${
          aboutOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setAboutOpen(false)}
          aria-label="Cerrar"
          className="absolute top-5 right-5 bg-transparent border-none cursor-pointer text-white/40 text-xl hover:text-white transition-colors"
        >
          ✕
        </button>

        <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-6">About</p>

        <p className="text-white text-xl font-bold tracking-[0.05em] uppercase mb-5 leading-[1.3]">
          INKognito.<br />Una forma de ver el mundo.
        </p>

        <p className="text-white/65 text-sm leading-[1.8] tracking-[0.03em]">
          Disciplina, arte, identidad. Nace de alguien que pregunta demasiado. Que quiere construir algo real, desde cero, con intención.
        </p>

        <p className="text-white/90 text-[13px] font-bold tracking-[0.2em] uppercase mt-7">
          Una visión. Dejar marca.
        </p>
      </div>
    </>
  )
}

function MenuLink({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-[14px] text-white/85 bg-transparent border-none cursor-pointer uppercase tracking-[0.25em] text-[13px] font-bold rounded hover:bg-white/[0.06] hover:text-white transition-all duration-200"
    >
      {label}
    </button>
  )
}

function SocialLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-8 py-[10px] text-white/50 hover:text-white uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-white/[0.04] transition-all duration-200 rounded"
    >
      {label}
    </a>
  )
}
