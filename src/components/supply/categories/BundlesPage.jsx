import SupplyCategoryPage from '../SupplyCategoryPage'

const guide = [
  { icon: '🎯', title: 'Kit de inicio', text: 'Lo esencial para empezar: maquina, fuente, cartuchos, guantes y limpieza.' },
  { icon: '🔄', title: 'Bundle de reposicion', text: 'Para artistas activos. Tintas, cartuchos y consumibles con descuento por volumen.' },
  { icon: '🎨', title: 'Kit de color', text: 'Tintas en los colores mas pedidos para empezar a ofrecer trabajo a color.' },
  { icon: '💡', title: 'Por que un bundle?', text: 'Menos tiempo buscando, mejor precio por volumen, todo coordinado.' },
]

const faqs = [
  { q: 'Puedo personalizar un bundle?', a: 'Si. Escribenos lo que usas y armamos un paquete a tu medida.' },
  { q: 'Los bundles tienen descuento?', a: 'Si, siempre hay beneficio en precio al comprar en conjunto.' },
  { q: 'Con que frecuencia actualizan los bundles?', a: 'Dependen del stock actual. Escribenos para disponibilidad.' },
  { q: 'Envios?', a: 'Si, por transportadora desde Chigorodo, Uraba.' },
]

export default function BundlesPage() {
  return (
    <SupplyCategoryPage
      title="Bundles"
      categoria="Bundles"
      slug="bundles"
      desc="Combos y paquetes de insumos para tatuadores en Uraba. Kits para iniciar y reposicion."
      intro="Todo lo que necesitas, seleccionado para que te enfoques en tatuar. Sin buscar, sin improvisar, sin excusas."
      guide={guide}
      faqs={faqs}
    />
  )
}
