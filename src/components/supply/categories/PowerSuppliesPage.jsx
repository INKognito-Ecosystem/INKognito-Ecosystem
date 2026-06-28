import SupplyCategoryPage from '../SupplyCategoryPage'

const guide = [
  { icon: '🎛️', title: 'Control de voltaje', text: 'Incrementos de 0.1V. La diferencia entre 6V y 6.5V cambia el comportamiento de tu maquina.' },
  { icon: '📺', title: 'Pantalla digital', text: 'Muestra el voltaje exacto en tiempo real. Indispensable para trabajo consistente.' },
  { icon: '⚡', title: 'Amperaje', text: 'Para rotativas: 2A suficientes. Para varias maquinas o bobinas potentes: 3A o mas.' },
  { icon: '🔌', title: 'Compatibilidad', text: 'Verifica el conector: RCA, jack 3.5mm o clip cord.' },
  { icon: '🔇', title: 'Inalambricas', text: 'Libertad de movimiento. Autonomia entre 3 y 5 horas. Ten segunda bateria cargada.' },
]

const faqs = [
  { q: 'Que fuente para rotativas?', a: 'Control digital, minimo 2A y display visible. Escribenos con tu maquina.' },
  { q: 'Las inalambricas duran toda la sesion?', a: 'Entre 3 y 5 horas segun uso. Ten segunda bateria cargada.' },
  { q: 'Incluyen cable y adaptadores?', a: 'Consultamos el kit incluido antes de confirmar.' },
  { q: 'Envios?', a: 'Si, por transportadora desde Chigorodo.' },
]

export default function PowerSuppliesPage() {
  return (
    <SupplyCategoryPage
      title="Fuentes de poder"
      categoria="Fuentes"
      slug="power-supplies"
      desc="Fuentes de poder para maquinas de tatuar en Chigorodo, Uraba. Voltaje estable y control preciso."
      intro="La fuente que no falla es la que nunca piensas en ella mientras tatuas. Voltaje estable, mente libre para crear."
      guide={guide}
      faqs={faqs}
    />
  )
}
