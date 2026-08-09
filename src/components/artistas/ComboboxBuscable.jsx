import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { normalize } from '../../data/colombiaGeo'

// Reemplaza el <select> nativo para listas largas (departamentos,
// municipios — hasta ~125 opciones por departamento) — el <select> nativo
// abre un modal enorme sin forma de escribir para filtrar (Jose,
// 2026-08-05: "deberia permitirme escribir el departamento o el municipio
// y que este aparesca mientras escribo... deberia desplegarce la lista
// abajo"). Combobox simple: input de texto que filtra la lista mostrada
// debajo, sin librería externa (no hay ninguna en el proyecto todavía).
//
// El valor solo se confirma (onChange) al elegir una opción de la lista o
// al salir del campo con un texto que matchea una opción exacta (sin
// importar tildes/mayúsculas) — si no matchea nada, revierte al último
// valor válido. Esto evita que quede guardado un municipio mal escrito
// que después no encuentre coordenadas ni aparezca bien en el buscador.
// labelFor (opcional): cuando la opción guardada no es el texto que se
// debe mostrar (ej. marca: se guarda el slug "vice-colors" pero se
// muestra "Vice Colors") — por defecto identidad, no cambia nada para
// los usos existentes (departamento/municipio, donde valor y texto son
// lo mismo).
export default function ComboboxBuscable({ value, onChange, options, placeholder, disabled, inputClassName, labelFor }) {
  const getLabel = labelFor || ((v) => v)
  // Sin valor elegido, el campo debe verse VACÍO — no basta con
  // "getLabel(value) || ''", porque una opción como marca='' ("— Sin
  // marca / genérica —") tiene una etiqueta NO vacía. Si esa etiqueta
  // quedaba precargada en el input, la búsqueda arrancaba filtrando
  // sobre ese texto y escondía el resto de opciones hasta borrarlo a
  // mano (reportado 2026-08-09: "el filtro no se está efectuando").
  const textoInicial = (v) => (v ? getLabel(v) : '')
  const [texto, setTexto] = useState(textoInicial(value))
  const [abierto, setAbierto] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => { setTexto(textoInicial(value)) }, [value])

  useEffect(() => {
    const onClickFuera = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setAbierto(false)
    }
    document.addEventListener('mousedown', onClickFuera)
    return () => document.removeEventListener('mousedown', onClickFuera)
  }, [])

  const q = normalize(texto.trim())
  const filtradas = q === '' ? options : options.filter((o) => normalize(getLabel(o)).includes(q))

  const elegir = (opcion) => {
    setTexto(textoInicial(opcion))
    onChange(opcion)
    setAbierto(false)
  }

  return (
    <div className="relative" ref={wrapRef}>
      <div className="relative">
        <input
          type="text"
          disabled={disabled}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value)
            setAbierto(true)
            if (e.target.value === '') onChange('')
          }}
          onFocus={() => setAbierto(true)}
          onBlur={() => {
            setAbierto(false)
            if (texto.trim() === '') { setTexto(''); if (value !== '') onChange(''); return }
            const match = options.find((o) => normalize(getLabel(o)) === normalize(texto))
            if (match) { setTexto(textoInicial(match)); if (match !== value) onChange(match) }
            else setTexto(textoInicial(value))
          }}
          placeholder={placeholder}
          className={inputClassName}
          autoComplete="off"
        />
        <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {abierto && !disabled && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          {filtradas.length > 0 ? filtradas.slice(0, 80).map((o) => (
            <button
              key={o}
              type="button"
              // onMouseDown (no onClick) + preventDefault: dispara ANTES del
              // blur del input, así elegir una opción no se pisa con el
              // revert-si-no-matchea del onBlur de arriba.
              onMouseDown={(e) => { e.preventDefault(); elegir(o) }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${o === value ? 'font-bold' : 'text-gray-700'}`}
              style={o === value ? { color: '#B3202F' } : undefined}
            >
              {getLabel(o)}
            </button>
          )) : (
            <p className="px-4 py-2 text-sm text-gray-400">Sin resultados</p>
          )}
        </div>
      )}
    </div>
  )
}
