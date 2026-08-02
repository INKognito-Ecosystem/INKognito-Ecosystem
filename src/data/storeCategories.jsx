import { Shirt, Footprints, Sun, Trophy, Zap } from 'lucide-react'

// Fuente única de las 6 categorías reales de Store — antes vivía inline en
// StorePage.jsx, ahora también la usan las páginas de grupo (deportiva/
// casual) para no duplicar nombre/tag/descripción/ícono en 3 lugares
// (2026-08-02). El campo `group` decide en qué card grande cae cada una en
// la sección "Nuestras Categorías": todas son "deportiva" excepto Zapatos
// Casuales, que es la única realmente "casual" hoy — decisión de Jose.
export const categories = [
  {
    id: 1,
    name: 'Ropa Dama',
    tag: 'Deportiva Femenina',
    description: 'Sets de compresión, leggings y tops para mujer activa. Telas técnicas resistentes al calor de Urabá. Despacho con Eljach a Chigorodó, Apartadó, Carepa y Turbo — pago contraentrega.',
    link: '/store/ropa-dama',
    icon: <Shirt size={28} />,
    group: 'deportiva',
  },
  {
    id: 2,
    name: 'Ropa Caballeros',
    tag: 'Deportiva Masculina',
    description: 'Camisetas dry-fit, shorts y joggers para el hombre activo. Diseños de marcas reconocidas, fabricados para entrenar en el clima cálido de la región. Llegan a tu puerta con Eljach.',
    link: '/store/ropa-caballeros',
    icon: <Shirt size={28} />,
    group: 'deportiva',
  },
  {
    id: 3,
    name: 'Zapatos Deportivos',
    tag: 'Running & Gym',
    description: 'Las siluetas de running y entrenamiento más buscadas del mercado. Réplica premium con amortiguación y acabados de nivel. Ruta diaria con Eljach — entrega en 1 a 2 días hábiles en Chigorodó, Carepa, Apartadó y Turbo.',
    link: '/store/zapatos-deportivos',
    icon: <Footprints size={28} />,
    group: 'deportiva',
  },
  {
    id: 4,
    name: 'Zapatos Casuales',
    tag: 'Estilo Urbano',
    description: 'Modelos icónicos para el día a día — frescos, cómodos y con actitud. Del parque a la calle sin esfuerzo. Despacho a cualquier municipio del Urabá antioqueño con pago contraentrega.',
    link: '/store/zapatos-casuales',
    icon: <Sun size={28} />,
    group: 'casual',
  },
  {
    id: 5,
    name: 'Guayos',
    tag: 'Fútbol',
    description: 'Control, tracción y durabilidad para jugar en canchas de la región. Terreno firme y canchita de sintético. Despacho con Eljach a Chigorodó, Carepa, Apartadó, Turbo y municipios cercanos.',
    link: '/store/guayos',
    icon: <Trophy size={28} />,
    group: 'deportiva',
  },
  {
    id: 6,
    name: 'Tenis Guayo',
    tag: 'Multisuperficie',
    description: 'El calzado más versátil de Urabá: rinde en sintético, polvo de ladrillo y calle sin cambiar de par. La opción inteligente para quien juega donde se pueda. Llega con Eljach, contraentrega.',
    link: '/store/tenis-guayo',
    icon: <Zap size={28} />,
    group: 'deportiva',
  },
  {
    id: 7,
    name: 'Ropa General',
    tag: 'Día a Día',
    description: 'Pantalones, camisetas, camisas y prendas de estilo urbano para el día a día — cómodas, versátiles y con buena mano de obra. Despacho con Eljach, pago contraentrega.',
    link: '/store/ropa-general',
    icon: <Shirt size={28} />,
    group: 'casual',
  },
]

// El link de cada grupo apunta directo a la primera categoría real de ese
// grupo (no a una página intermedia de lista) — al entrar desde el hub se
// aterriza ya en el catálogo, con las flechas prev/next (ver
// storeCategoriesOrder.js) para moverse entre el resto de categorías del
// mismo grupo, sin el paso extra de elegir una card (2026-08-02).
export const CATEGORY_GROUPS = {
  deportiva: {
    name: 'Zapatos y Ropa Deportiva',
    tag: 'Todo lo deportivo',
    description: 'Ropa y calzado para entrenar, correr y jugar — sets, camisetas dry-fit, tenis de running, guayos y multisuperficie.',
    link: categories.find(c => c.group === 'deportiva').link,
    icon: <Zap size={28} />,
  },
  casual: {
    name: 'Ropa y Zapatos Casuales',
    tag: 'Día a Día',
    description: 'Ropa y calzado para el día a día, con comodidad y buena mano de obra que se nota a simple vista — la opción ideal para completar tu look en cualquier plan.',
    link: categories.find(c => c.group === 'casual').link,
    icon: <Sun size={28} />,
  },
}
