import SupplyCategoryPage from '../SupplyCategoryPage'

const guide = [
  { icon: '🖤', title: 'Nitrilo negro', text: 'El estandar del sector. Sin alergias y resiste pinchazos mejor que el latex.' },
  { icon: '📏', title: 'Talla correcta', text: 'S=18cm, M=19-20cm, L=21-22cm, XL=23cm+. Uno pequeno cansa, uno grande pierde tacto.' },
  { icon: '🔒', title: 'Doble guante', text: 'Para procedimientos largos, dos guantes superpuestos dan proteccion extra.' },
  { icon: '♻️', title: 'Uso unico', text: 'Nunca reutilices aunque parezca intacto. La barrera microscopica se compromete.' },
]

const faqs = [
  { q: 'Son libres de latex?', a: 'Si, todos de nitrilo. Aptos para personas con alergia.' },
  { q: 'Venden por caja?', a: 'Por caja de 100 unidades.' },
  { q: 'Cual talla es la mas pedida?', a: 'Talla M para la mayoria. Mide el ancho de tu palma.' },
  { q: 'Envios?', a: 'Si, a toda la region de Uraba y Colombia.' },
]

export default function GlovesPage() {
  return (
    <SupplyCategoryPage
      title="Guantes"
      categoria="Guantes"
      slug="gloves"
      desc="Guantes de nitrilo para tatuar en Chigorodo, Uraba. Sin latex y con excelente tacto."
      intro="El guante que usas tambien habla de como trabajas. Agarre exacto, proteccion real, confianza en cada movimiento."
      guide={guide}
      faqs={faqs}
    />
  )
}
