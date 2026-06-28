import SupplyCategoryPage from '../SupplyCategoryPage'

const guide = [
  { icon: '⚙️', title: 'Rotativa de lapiz', text: 'Ligera, silenciosa y versatil. La mas recomendada para empezar.' },
  { icon: '🔩', title: 'Compatible cartuchos', text: 'Cambio rapido sin perder calibracion. Ideal para sesiones largas.' },
  { icon: '⚡', title: 'Bobina (Coil)', text: 'Clasica con golpe propio. Favorita para linea negra y trabajo tradicional.' },
  { icon: '🎛️', title: 'Voltaje de trabajo', text: 'Entre 5V y 9V segun tecnica. Tu fuente debe permitir control preciso.' },
  { icon: '⚖️', title: 'Peso y ergonomia', text: 'Para detalle elige algo ligero. Para linea con fuerza, mas peso da estabilidad.' },
]

const faqs = [
  { q: 'Que maquina para empezar?', a: 'Rotativa de lapiz con cartuchos. La mas versatil.' },
  { q: 'Incluyen garantia?', a: 'Depende del fabricante. Consultamos condiciones antes de confirmar.' },
  { q: 'Compatibles con todas las fuentes?', a: 'Si, que la fuente entregue 5V-12V.' },
  { q: 'Envios a Colombia?', a: 'Si, por transportadora desde Chigorodo.' },
]

export default function MachinesPage() {
  return (
    <SupplyCategoryPage
      title="Maquinas"
      categoria="Maquinas"
      slug="machines"
      desc="Maquinas de tatuar rotativas en Chigorodo, Uraba. Equipos para todos los estilos."
      intro="Tu maquina define tu velocidad, tu control y tu firma. Equipos en manos de tatuadores que no vuelven atras."
      guide={guide}
      faqs={faqs}
    />
  )
}
