import { ZONAS_FLETE } from '../../data/colombiaGeo'

// "Ruta del Golfo" (2026-08-30) — selector de zonas de cobertura para
// transportadoras. Son 10 opciones fijas y conocidas de antemano (las
// zonas reales de settings.flete_tabla) — a diferencia de un combobox
// buscable (pensado para listas largas como los ~125 municipios de
// Colombia), acá una grilla de checkboxes es más simple y directo.
export default function ZonasCoberturaCheckboxes({ value, onChange }) {
  const toggle = (zona) => {
    onChange(value.includes(zona) ? value.filter((z) => z !== zona) : [...value, zona])
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(ZONAS_FLETE).map(([key, label]) => (
        <label key={key} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 cursor-pointer">
          <input type="checkbox" checked={value.includes(key)} onChange={() => toggle(key)} className="accent-gray-700" />
          {label}
        </label>
      ))}
    </div>
  )
}
