import { createContext, useContext, useState } from 'react'
import { Menu, X } from 'lucide-react'

// Navegación por pestañas para "Editar mi perfil" (artista, 2026-08-19,
// Jose: "deberían tener una especie de botón hamburguesa... tal como
// funciona el panel") — sidebar fijo en PC, botón ☰ que abre una lista a
// pantalla completa en móvil.
//
// v2 (2026-09-22, Jose: "el botón hamburguesa... la idea es que quede en
// esa esquina, pero dentro de la foto de portada, como lo hace Facebook")
// — antes el botón vivía en su propia barra gris arriba de la portada
// (fila completa, con el nombre de la pestaña activa); ahora es un círculo
// que se monta DENTRO de la portada (ver BotonMenuSecciones más abajo),
// así que este componente ya no dibuja ninguna barra propia — solo expone
// `abrir()` por contexto para que quien pinte la portada (o cualquier
// pestaña sin portada) decida dónde poner el botón. Quitar esa barra
// entera también es lo que deja la portada pegada al navbar sin hueco de
// por medio (el -mt-4 de abajo ya cancelaba el colchón del padre; antes
// caía sobre la barra, ahora cae directo sobre la portada).
//
// `children` es responsabilidad de quien llama: cada pestaña de contenido
// debe traer su propia clase `block`/`hidden` según `activeTab` — este
// componente solo pinta la navegación, nunca desmonta nada (así no se
// pierde texto ya escrito en otra pestaña al cambiar de sección). Cada
// pestaña SIN portada (Mis diseños, Reservas y agenda) debe montar su
// propio <BotonMenuSecciones /> en algún punto visible de su contenido —
// si no, en móvil no hay forma de volver a "Mi perfil".
const MenuSeccionesCtx = createContext(null)

// Para pestañas sin portada: el mismo botón, sin overlay de foto detrás.
export function useAbrirMenuSecciones() {
  const abrir = useContext(MenuSeccionesCtx)
  return abrir || (() => {})
}

// Círculo ☰ reutilizable — mismo look tanto incrustado en la portada
// (fondo oscuro translúcido, como el botón "Portada" que ya vive en esa
// misma esquina opuesta) como suelto en una pestaña sin foto (className
// pisa el fondo/color para verse bien sobre blanco).
export function BotonMenuSecciones({ className = 'bg-black/50 text-white backdrop-blur-sm hover:bg-black/70' }) {
  const abrir = useAbrirMenuSecciones()
  return (
    <button
      type="button"
      onClick={abrir}
      aria-label="Cambiar de sección"
      className={`lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors ${className}`}
    >
      <Menu size={17} />
    </button>
  )
}

export default function EditarPerfilTabs({ tabs, activeTab, onChange, children }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const elegir = (key) => {
    onChange(key)
    setMenuAbierto(false)
  }

  return (
    <MenuSeccionesCtx.Provider value={() => setMenuAbierto(true)}>
    <div className="lg:flex lg:gap-6 lg:items-start lg:px-4 -mt-4">
      {/* Overlay móvil a pantalla completa — mismo espíritu que
          body.mobile-tabs-open del panel */}
      {menuAbierto && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <p className="text-xs font-black uppercase tracking-widest">Secciones</p>
            <button type="button" onClick={() => setMenuAbierto(false)} aria-label="Cerrar menú" className="text-gray-500">
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-2">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => elegir(key)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-left transition-colors ${
                  key === activeTab ? 'text-gray-900 bg-gray-50' : 'text-gray-500'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Sidebar fijo en PC */}
      <nav className="hidden lg:block lg:w-56 lg:flex-shrink-0 lg:sticky lg:top-24 space-y-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide text-left transition-colors ${
              key === activeTab ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
    </MenuSeccionesCtx.Provider>
  )
}
