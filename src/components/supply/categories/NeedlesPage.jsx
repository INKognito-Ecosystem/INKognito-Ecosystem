import SupplyCategoryPage from '../SupplyCategoryPage'

const guide = [
  { icon: '📐', title: 'RL Liner', text: 'Para contornos y trazos finos. Las RL3 y RL5 son las mas versatiles.' },
  { icon: '🌑', title: 'RS Shader', text: 'Para rellenar areas pequenas con color saturado.' },
  { icon: '〰️', title: 'M1 Magnum', text: 'Para fondos grandes y sombras suaves con menos pasadas.' },
  { icon: '🌊', title: 'CM Curved Magnum', text: 'Favorito del realismo. Degradados sin bordes duros.' },
  { icon: '🔬', title: 'Bugpin', text: 'Calibre ultra fino para detalle extremo. Requiere maquina calibrada.' },
]

const faqs = [
  { q: 'Las agujas vienen esterilizadas?', a: 'Si, selladas por EO. Uso unico, nunca reutilices.' },
  { q: 'Que aguja para letras?', a: 'RL3 o RL5 para letras finas. RS7 o M1 para relleno.' },
  { q: 'Venden por caja?', a: 'Si. Consultamos cantidades especificas.' },
  { q: 'Hacen envios?', a: 'Si, a toda la region de Uraba y Colombia.' },
]

export default function NeedlesPage() {
  return (
    <SupplyCategoryPage
      title="Agujas"
      categoria="Agujas"
      slug="needles"
      desc="Agujas de tatuaje profesionales en Chigorodo, Uraba. RL, RS, M1, CM para todos los estilos."
      intro="La aguja correcta no es un detalle. Es la diferencia entre un trabajo limpio y uno que duele dos veces."
      guide={guide}
      faqs={faqs}
    />
  )
}
