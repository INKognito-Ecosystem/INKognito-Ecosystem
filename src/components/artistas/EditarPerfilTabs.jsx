import { useState } from 'react'
import { Menu, X } from 'lucide-react'

// Navegación por pestañas para "Editar mi perfil" (artista/estudio,
// 2026-08-19, Jose: "deberían tener una especie de botón hamburguesa...
// tal como funciona el panel") — mismo espíritu que el sidebar/hamburguesa
// del panel admin (inkognito-panel/public/index.html): sidebar fijo en PC,
// botón ☰ que abre una lista a pantalla completa en móvil. Compartido entre
// ArtistaEditarPerfilPage.jsx y EstudioEditarPerfilPage.jsx para no
// duplicar este layout dos veces.
//
// `children` es responsabilidad de quien llama: cada pestaña de contenido
// debe traer su propia clase `block`/`hidden` según `activeTab` — este
// componente solo pinta la navegación, nunca desmonta nada (así no se
// pierde texto ya escrito en otra pestaña al cambiar de sección).
export default function EditarPerfilTabs({ tabs, activeTab, onChange, children }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const activo = tabs.find((t) => t.key === activeTab) || tabs[0]

  const elegir = (key) => {
    onChange(key)
    setMenuAbierto(false)
  }

  return (
    <div className="lg:flex lg:gap-6 lg:items-start lg:px-4 -mt-4">
      {/* Barra móvil — botón ☰ + nombre de la pestaña activa. `-mt-4` en el
          contenedor (2026-08-26, Jose: "sigue siendo mal, pegalo mas al
          navbar") — el padre (ArtistaEditarPerfilPage/EstudioEditarPerfilPage)
          aplica pt-20 md:pt-24 para despejar el navbar fijo (h-16/md:h-20),
          lo que deja un colchón extra de 16px en ambos breakpoints; el
          -mt-4 (16px) lo cancela para que la barra quede pegada justo
          debajo del navbar. */}
      <div className="lg:hidden flex items-center px-4 py-3 border-y border-gray-200 mb-2 bg-gray-50">
        <button
          type="button"
          onClick={() => setMenuAbierto(true)}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-700"
        >
          <Menu size={16} />
          {activo?.label}
        </button>
      </div>

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
  )
}
