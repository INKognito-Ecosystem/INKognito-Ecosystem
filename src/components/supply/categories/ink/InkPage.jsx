import SupplyCategoryPage from '../../SupplyCategoryPage'

const intro = `Tintas y pigmentos de alta densidad para tatuadores profesionales en Chigorodó, Urabá. Colores con alta concentración de pigmento, formulados para definición nítida, larga duración y cicatrización limpia. Disponibles en 1oz, 2oz y 4oz según existencias.`

const guide = [
  { icon: '🎨', title: 'Negros y grises', text: 'Esenciales para realismo y sombras. Busca alta densidad para trazo limpio y negros absolutos sin dilución. Los negros de calidad mantienen el color sin desvanecer con los años.' },
  { icon: '🌈', title: 'Colores vivos', text: 'Para color tradicional y neotrad. Elige tintas con alta saturación. Los rojos y amarillos son los más difíciles de mantener — invierte en marcas probadas.' },
  { icon: '💧', title: 'Dilución correcta', text: 'Dilata solo con agua destilada estéril. Jamás con agua del grifo ni alcohol. La proporción correcta depende del efecto: del 10% al 50% según el gris que busques.' },
  { icon: '🔒', title: 'Sellos y fechas', text: 'Verifica fecha de vencimiento y sello de seguridad. Tintas abiertas tienen vida útil de 12 meses. Almacena lejos de luz directa y a temperatura ambiente.' },
  { icon: '📦', title: 'Cantidad por sesión', text: 'Para una sesión de 4-6 horas de trabajo en color calculas entre 3 y 6 tintas según paleta. En piezas grandes conviene tener respaldo de los colores base.' },
  { icon: '🔬', title: 'Veganas y aptas piel', text: 'Todas las tintas en nuestro catálogo son libres de crueldad animal y formuladas para uso dérmico profesional, cumpliendo estándares de seguridad para tatuaje.' },
]

const faqs = [
  { q: '¿Las tintas son originales de las marcas que ofrecen?', a: 'Sí. Trabajamos con distribución directa de las marcas que tenemos disponibles. Cada tinta viene con sello de fábrica y fecha de vencimiento visible.' },
  { q: '¿Hacen envíos a ciudades fuera de Chigorodó?', a: 'Sí. Despachamos a Apartadó, Turbo, Carepa, Mutatá, Arboletes y otras ciudades de Urabá. Confirmamos tiempos y costos de envío por WhatsApp.' },
  { q: '¿Qué tinta me recomiendan para comenzar en el realismo?', a: 'Para realismo negro y gris te recomendamos una tinta negra de alta densidad más sets de grises ya preparados. Escríbenos y te orientamos según tu estilo y máquina.' },
  { q: '¿Tienen disponibilidad inmediata o es por pedido?', a: 'Depende del producto. Lo que ves en la tienda está en stock actual. Si necesitas algo específico que no aparece, escríbenos — podemos conseguirlo con tiempo.' },
  { q: '¿Puedo comprar tintas individuales o solo cajas?', a: 'Vendemos por unidad y en cantidades mayores. El precio varía según volumen. Para compras de 6 unidades o más consultamos descuento especial.' },
]

export default function InkPage() {
  return (
    <SupplyCategoryPage
      title="Tintas"
      categoria="Tintas"
      slug="ink"
      desc="Tintas y pigmentos profesionales para tatuaje en Chigorodó, Urabá. Alta densidad, larga duración. Marcas como Vice Colors, Dynamic, Eternal. Envíos a Apartadó, Turbo y toda la región."
      intro={intro}
      guide={guide}
      faqs={faqs}
    />
  )
}
