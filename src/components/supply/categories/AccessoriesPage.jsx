import SupplyCategoryPage from '../SupplyCategoryPage'

const guide = [
  { icon: '🗂️', title: 'Transfer paper', text: 'Para pasar el diseno a la piel con precision. El de copiado manual con gel es el mas usado.' },
  { icon: '🖊️', title: 'Gel de transferencia', text: 'Permite que el stencil dure mas. Capa delgada y deja secar antes de tatuar.' },
  { icon: '🧩', title: 'Tazas de tinta', text: 'Cada color en su taza evita contaminacion. Las de silicona son reutilizables.' },
  { icon: '📎', title: 'Clip cord y RCA', text: 'Cable que conecta maquina y fuente. Siempre ten un repuesto.' },
  { icon: '🗑️', title: 'Contenedores de residuos', text: 'Los residuos biologicos en contenedores especiales. Parte de tu profesionalismo.' },
]

const faqs = [
  { q: 'Transfer paper compatible con impresoras?', a: 'Hay tipos para impresora y para copiado manual. Verifica antes de comprar.' },
  { q: 'Que gel recomiendan?', a: 'Depende de la piel. Escribenos con tu caso.' },
  { q: 'Venden por unidad o pack?', a: 'Varia segun producto. Consultamos por WhatsApp.' },
  { q: 'Envios?', a: 'Si, a toda la region de Uraba y Colombia.' },
]

export default function AccessoriesPage() {
  return (
    <SupplyCategoryPage
      title="Accesorios"
      categoria="Accesorios"
      slug="accessories"
      desc="Accesorios para tatuadores en Chigorodo, Uraba. Transfer paper, bandejas, cables y mas."
      intro="Los detalles que hacen fluir el trabajo. Porque cuando el proceso es suave, la creatividad no se interrumpe."
      guide={guide}
      faqs={faqs}
    />
  )
}
