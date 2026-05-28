import { useState, useEffect } from 'react'
import inkognitoLogo from '../../assets/ecosystem/logo.png'

export default function EcosystemNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = (menuOpen || aboutOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, aboutOpen])

  const openAbout = () => {
    setMenuOpen(false)
    setTimeout(() => setAboutOpen(true), 300)
  }

  return (
    <>
      {/* NAVBAR */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
      }}>
        <img
          src={inkognitoLogo}
          alt="INKognito"
          style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
        />
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px' }}
        >
          <span style={lineStyle} />
          <span style={lineStyle} />
          <span style={lineStyle} />
        </button>
      </nav>

      {/* OVERLAY MENÚ */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={overlayStyle} />
      )}

      {/* DRAWER */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '280px',
        background: 'rgba(10,10,10,0.97)',
        backdropFilter: 'blur(16px)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        zIndex: 70,
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
          <img src={inkognitoLogo} alt="INKognito" style={{ height: '44px', width: 'auto' }} />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '24px', lineHeight: 1, padding: '4px' }}
          >
            ✕
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <MenuLink label="About" onClick={openAbout} />
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center' }}>
            INKognito Ecosystem © 2026
          </p>
        </div>
      </div>

      {/* OVERLAY MODAL ABOUT */}
      {aboutOpen && (
        <div onClick={() => setAboutOpen(false)} style={overlayStyle} />
      )}

      {/* MODAL ABOUT */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: aboutOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)',
        opacity: aboutOpen ? 1 : 0,
        pointerEvents: aboutOpen ? 'all' : 'none',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        zIndex: 80,
        width: '90%',
        maxWidth: '480px',
        background: 'rgba(10,10,10,0.97)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        padding: '40px 36px',
      }}>
        {/* CERRAR */}
        <button
          onClick={() => setAboutOpen(false)}
          aria-label="Cerrar"
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '20px' }}
        >
          ✕
        </button>

        {/* CONTENIDO */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '24px' }}>
          About
        </p>

        <p style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '20px', lineHeight: 1.3 }}>
          INKognito.<br />Una forma de ver el mundo.
        </p>

        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: 1.8, letterSpacing: '0.03em' }}>
          Disciplina, arte, identidad. Nace de alguien que pregunta demasiado. Que quiere construir algo real, desde cero, con intención.
        </p>

        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '28px' }}>
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
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '14px 16px',
        color: 'rgba(255,255,255,0.85)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '0.25em',
        fontSize: '13px',
        fontWeight: '700',
        borderRadius: '4px',
        transition: 'background 0.2s, color 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.color = '#fff'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
      }}
    >
      {label}
    </button>
  )
}

const lineStyle = {
  display: 'block',
  width: '24px',
  height: '2px',
  background: 'rgba(255,255,255,0.9)',
  borderRadius: '2px',
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  zIndex: 60,
}