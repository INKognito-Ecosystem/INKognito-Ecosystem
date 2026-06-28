import SupplyCategoryPage from '../SupplyCategoryPage'

const guide = [
  { icon: '🛏️', title: 'Camilla reclinable', text: 'Altura regulable, tapizado resistente y reclinacion para distintas zonas del cuerpo.' },
  { icon: '🪑', title: 'Silla del artista', text: 'Altura ajustable, ruedas suaves y apoyo lumbar para jornadas largas.' },
  { icon: '🗄️', title: 'Almacenamiento', text: 'Cajones y porta-maquinas. Espacio ordenado transmite profesionalismo.' },
  { icon: '💡', title: 'Iluminacion', text: 'Lampara articulada luz fria (5000K-6500K). Revela colores como se veran cicatrizados.' },
  { icon: '📐', title: 'Distribucion del espacio', text: 'Organiza muebles para minimizar movimiento durante la sesion.' },
]

const faqs = [
  { q: 'Las camillas resisten cualquier peso?', a: 'Entre 150 y 200kg segun modelo. Confirmamos capacidad antes de vender.' },
  { q: 'Que tapizado es mas facil de limpiar?', a: 'Polipiel (cuero sintetico). Evita telas o materiales porosos.' },
  { q: 'Hacen envios de muebles?', a: 'Si, coordinamos embalaje y envio. El flete varia segun peso y destino.' },
  { q: 'Opciones para espacios pequenos?', a: 'Si. Escribenos con las medidas de tu espacio.' },
]

export default function FurniturePage() {
  return (
    <SupplyCategoryPage
      title="Muebles"
      categoria="Muebles"
      slug="furniture"
      desc="Muebles para estudio de tatuajes en Uraba. Camillas, bancos y almacenamiento profesional."
      intro="Tu espacio dice mas de ti que cualquier otro elemento. La diferencia entre un cuarto y un estudio empieza por el mueble que el cliente toca primero."
      guide={guide}
      faqs={faqs}
    />
  )
}
