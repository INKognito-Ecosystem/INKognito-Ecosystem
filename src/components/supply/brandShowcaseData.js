// Configuración estratégica y técnica para las páginas premium de Marcas en INKognito Supply.
// Fondo blanco, fotografía de producto flotante, logo oficial y especificaciones de alta gama.

export const BRAND_SHOWCASE_DATA = {
  'tattoo-vision': {
    brandId: 'tattoo-vision',
    brandName: 'Tattoo Vision',
    eyebrow: 'TECNOLOGÍA ÓPTICA ORIGINAL · HERNÁN YEPES',
    title: 'Tattoo Vision 2',
    subtitle: 'Gafas de Polarización Cruzada en TR90 con Clip-On Magnético',
    description: 'El sistema óptico de referencia para tatuadores profesionales creado por Hernán Yepes. Al sincronizarse con la luz polarizada, anula el 100% de los reflejos de vaselina y sangre en la piel, permitiendo evaluar la verdadera saturación dérmica en vivo.',
    productImage: '/supply-assets/tattoovision/glasses_base.webp',
    productAlt: 'Gafas Tattoo Vision 2 reales con montura TR90 y lentes polarizados',
    creatorBadge: 'Diseño Original de Hernán Yepes',
    accentColor: '#0284c7',
    badge: 'Hardware de Precisión Óptica',
    stats: [
      { label: 'Cancelación', value: '100%', note: 'Reflejos en piel' },
      { label: 'Estructura', value: 'TR90 Suizo', note: 'Memoria elástica' },
      { label: 'Acople', value: 'Neodimio N52', note: 'Clip-On magnético' },
      { label: 'Visión', value: 'RX Apta', note: 'Lunas formuladas' },
    ],
    technicalHighlights: [
      {
        id: 'polarization',
        title: 'Polarización Cruzada Real',
        category: 'ÓPTICA DÉRMICA',
        description: 'Filtra el brillo superficial provocado por fluidos y luces de estudio, dejando al descubierto el tono real del pigmento recién inyectado.',
        badge: 'Zero Glare',
      },
      {
        id: 'chassis',
        title: 'Polímero Suizo TR90',
        category: 'ERGONOMÍA CLÍNICA',
        description: 'Montura ultraligera con grabado de filigrana y memoria elástica. Cero fatiga en nariz y sienes durante sesiones extensas de 8+ horas.',
        badge: 'Ultraligera',
      },
      {
        id: 'clipon',
        title: 'Sistema Clip-On Magnético',
        category: 'MODULARIDAD DUAL',
        description: 'El sobrelente polarizado se fija o retira en un segundo mediante micro-imanes de neodimio N52 de alta fijación.',
        badge: 'Magnetic Snap',
      },
      {
        id: 'rx',
        title: 'Compatibilidad de Fórmula',
        category: 'ÓPTICA PROFESIONAL',
        description: 'La montura base permite montar cristales formulados en cualquier óptica, manteniendo la función polarizada con el Clip-On superior.',
        badge: 'Formula Ready',
      },
    ],
  },

  // Plantilla para la siguiente marca
  'industrias-warlock': {
    brandId: 'industrias-warlock',
    brandName: 'Industrias Warlock',
    eyebrow: 'INGENIERÍA MECÁNICA ROTATIVA',
    title: 'Warlock Vector',
    subtitle: 'Máquinas Rotativas de Golpe Directo para Línea y Sombra',
    description: 'Máquinas de precisión diseñadas para respuesta lineal continua, chasis monobloque en aluminio aeroespacial y motor suizo de alto torque.',
    productImage: null,
    productAlt: 'Máquina Rotativa Warlock',
    creatorBadge: 'Ingeniería Nacional',
    accentColor: '#dc2626',
    badge: 'Maquinaria de Precisión',
    stats: [
      { label: 'Motor', value: 'Suizo 10W', note: 'Alto torque' },
      { label: 'Stroke', value: '3.5 - 4.2mm', note: 'Ajustable' },
      { label: 'Chasis', value: 'Aluminio CNC', note: 'Monobloque' },
      { label: 'Grip', value: 'Autoclavable', note: 'Universal' },
    ],
    technicalHighlights: [],
  },
}
