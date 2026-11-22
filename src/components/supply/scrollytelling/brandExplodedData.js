// Configuración y datos técnicos universales para el despiece interactivo (Scrollytelling tipo Wiltech)
// Cada marca define su objeto físico, capas de despiece, especificaciones y callouts técnicos.
// La jerarquía y el componente de animación (BrandExplodedHero) son 100% universales y compartidos.

export const BRAND_EXPLODED_CONFIGS = {
  'tattoo-vision': {
    brandId: 'tattoo-vision',
    brandName: 'Tattoo Vision',
    eyebrow: 'SISTEMAS VISUALES DE PRECISIÓN',
    headline: 'Ingeniería Óptica de Alta Fidelidad para Tatuadores',
    subheadline: 'Despiece técnico del visor de precisión Vision-X Pro. Cada componente está calibrado para garantizar máxima nitidez dérmica y cero fatiga visual.',
    objectName: 'Vision-X Pro Precision Goggles',
    colorAccent: '#2563eb', // Royal Blue técnico
    colorGlow: 'rgba(37, 99, 235, 0.25)',
    badge: 'Hardware Óptico Calibrado',
    stats: [
      { label: 'Peso Total', value: '42 g', note: 'Aleación Ti-6Al-4V' },
      { label: 'Claridad Óptica', value: 'CRI 98.4', note: 'Luz solar neutral' },
      { label: 'Filtro Polarizado', value: '99.8%', note: 'Anti-reflejo dérmico' },
      { label: 'Autonomía LED', value: '12 h', note: 'Batería de polímero' },
    ],
    layers: [
      {
        id: 'optics',
        number: '01',
        title: 'Escudo Óptico Polarizado HD',
        category: 'SISTEMA DE FILTRADO',
        description: 'Cristales multicapa con nano-revestimiento antirreflectante que elimina el 99.8% de los destellos provocados por la vaselina, el brillo de la tinta fresca y la luz ambiental del estudio.',
        specs: ['Vidrio mineral templado 1.8mm', 'Corte UV400 + Polarizado lineal', 'Nano-coating hidrofóbico'],
        desktopOffset: { x: -70, y: -120, scale: 1.05, rotate: -3 },
        mobileOffset: { x: 0, y: -90, scale: 1.03, rotate: 0 },
        accentColor: '#38bdf8',
        tag: 'ÓPTICA FRONTAL',
      },
      {
        id: 'lighting',
        number: '02',
        title: 'Módulo Micro-LED Coaxial',
        category: 'ILUMINACIÓN DUAL-BEAM',
        description: 'Proyector micro-LED 5500K alineado exactamente con el eje de visión. Proyecta un cono de luz sin sombras arrojadas por la máquina ni la mano del artista durante el trazado.',
        specs: ['Índice CRI > 98.4 Real', 'Atenuación continua por sensor táctil', 'Disipador pasivo de grafeno'],
        desktopOffset: { x: 90, y: -45, scale: 1.02, rotate: 2 },
        mobileOffset: { x: 25, y: -30, scale: 1.02, rotate: 1 },
        accentColor: '#fbbf24',
        tag: 'ILUMINACIÓN 5500K',
      },
      {
        id: 'chassis',
        number: '03',
        title: 'Chasis Aeroespacial Monobloque',
        category: 'ARQUITECTURA ESTRUCTURAL',
        description: 'Estructura ultraligera fresada en titanio grado 5 con bisagras de tensión constante y memoria elástica. Distribuye los 42 gramos de masa de manera homogénea en el cráneo.',
        specs: ['Mecanizado CNC monobloque', 'Bisagras sin tornillos expuestos', 'Resistencia a caídas e impactos'],
        desktopOffset: { x: 0, y: 15, scale: 1.0, rotate: 0 },
        mobileOffset: { x: 0, y: 15, scale: 1.0, rotate: 0 },
        accentColor: '#94a3b8',
        tag: 'CHASIS MONOBLOQUE',
      },
      {
        id: 'biogrip',
        number: '04',
        title: 'Almohadillas Anatómicas Bio-Grip',
        category: 'ERGONOMÍA CLÍNICA',
        description: 'Puntos de apoyo fabricados en silicona médica biocompatible con micro-ranuras de disipación térmica. Previenen deslizamientos por sudor durante jornadas extensas de 8 a 12 horas.',
        specs: ['Silicona grado implantable', 'Canales micro-fluidos transpirables', 'Totalmente autoclavable'],
        desktopOffset: { x: -60, y: 110, scale: 0.98, rotate: -2 },
        mobileOffset: { x: -20, y: 85, scale: 0.98, rotate: -1 },
        accentColor: '#34d399',
        tag: 'BIO-GRIP ANATÓMICO',
      },
    ],
  },

  // Plantilla lista para la siguiente marca (ej. Warlock)
  'industrias-warlock': {
    brandId: 'industrias-warlock',
    brandName: 'Industrias Warlock',
    eyebrow: 'INGENIERÍA MECÁNICA ROTATIVA',
    headline: 'Máquinas de Tatuaje de Golpe Directo y Alta Precisión',
    subheadline: 'Despiece técnico de la rotativa Warlock Vector. Mecanizado suizo y chasis de aluminio aeroespacial para líneas sólidas y relleno consistente.',
    objectName: 'Warlock Vector Rotary Machine',
    colorAccent: '#dc2626',
    colorGlow: 'rgba(220, 38, 38, 0.25)',
    badge: 'Hardware Mecánico de Precisión',
    stats: [
      { label: 'Motor', value: 'Suizo 10W', note: 'Coreless de alto torque' },
      { label: 'Stroke', value: '3.5 - 4.2 mm', note: 'Ajuste milimétrico' },
      { label: 'Voltaje Óptimo', value: '5.5 - 9.0 V', note: 'Respuesta lineal' },
      { label: 'Peso', value: '118 g', note: 'Balance centrado en grip' },
    ],
    layers: [],
  },
}
