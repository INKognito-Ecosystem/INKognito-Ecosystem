// Configuración estratégica y técnica para las páginas premium de Marcas en INKognito Supply.
// Fondo blanco, fotografía de producto flotante, logo oficial y especificaciones de alta gama.

export const BRAND_SHOWCASE_DATA = {
  'tattoo-vision': {
    brandId: 'tattoo-vision',
    brandName: 'Tattoo Vision',
    logoFallback: '/supply-assets/logos/supply_brand_tattoo_vision.webp',
    officialUrl: 'https://tattoovision.com',
    eyebrow: 'TECNOLOGÍA ÓPTICA ORIGINAL · HERNÁN YEPES',
    title: 'Kit Tattoo Vision 2X',
    subtitle: 'Sistema Integral de Polarización Cruzada: Óptica TR90 + Iluminación LED Dual',
    description: 'El sistema óptico de referencia para tatuadores profesionales creado por Hernán Yepes. Al sincronizar las gafas polarizadas con las luces LED de polarización cruzada, anula el 100% de los reflejos de vaselina, fluidos y brillo superficial en la piel, permitiendo evaluar la verdadera saturación dérmica en vivo.',
    accentColor: '#0284c7',
    badge: 'Hardware de Precisión Óptica',

    // Piezas físicas reales del sistema integral para el slider interactivo flotante (Imágenes oficiales independientes en alta resolución)
    heroSlides: [
      {
        id: 'glasses',
        title: 'Gafas Base TR90',
        subtitle: 'Montura Ultraligera Suiza con Memoria Elástica',
        category: 'FILTRO RECEPTOR · POLARIZACIÓN ÓPTICA',
        src: '/supply-assets/tattoovision/glasses_base_clean.webp',
        alt: 'Gafas Tattoo Vision 2X en TR90 con grabado de filigrana',
        maxHeight: 'max-h-[260px] sm:max-h-[320px] md:max-h-[380px]',
        maxWidth: 'max-w-[380px] sm:max-w-[480px] md:max-w-[560px]',
        shadowWidth: 'w-[260px] sm:w-[360px] md:w-[440px]',
        badge: 'Montura Base TR90',
        detail: 'Montura ergonómica de 42g en TR90 suizo con memoria elástica indeformable y puertos magnéticos de acople.',
      },
      {
        id: 'clipon',
        title: 'Clip-On Magnético Polarizado',
        subtitle: 'Sobrelente Óptico con Fijación en Neodimio N52',
        category: 'MODULARIDAD DUAL · ACOPLE INSTANTÁNEO',
        src: '/supply-assets/tattoovision/clipon_polarizado_clean.webp',
        alt: 'Clip-On Magnético Polarizado Tattoo Vision',
        maxHeight: 'max-h-[220px] sm:max-h-[260px] md:max-h-[320px]',
        maxWidth: 'max-w-[320px] sm:max-w-[400px] md:max-w-[460px]',
        shadowWidth: 'w-[220px] sm:w-[300px] md:w-[360px]',
        badge: 'Clip-On Neodimio N52',
        detail: 'Filtro polarizado circular de grado óptico con micro-imanes de neodimio que se acopla o retira en un segundo.',
      },
      {
        id: 'ledDual',
        title: 'Panel LED Polarizado 2X',
        subtitle: 'Emisor de Luz Sincronizada con Disipador CNC',
        category: 'EMISOR DE POLARIZACIÓN CRUZADA',
        src: '/supply-assets/tattoovision/led_panel_v2x_clean.webp',
        alt: 'Panel de Iluminación LED Polarizada Tattoo Vision 2X',
        maxHeight: 'max-h-[220px] sm:max-h-[270px] md:max-h-[330px]',
        maxWidth: 'max-w-[300px] sm:max-w-[380px] md:max-w-[440px]',
        shadowWidth: 'w-[220px] sm:w-[300px] md:w-[360px]',
        badge: 'Luz LED Polarizada CNC',
        detail: 'Panel de alta potencia lumínica con filtro polarizado rotatorio, chasis disipador en aluminio anodizado rojo y grabado láser.',
      },
      {
        id: 'articulatedArm',
        title: 'Articulación Doble CNC 360°',
        subtitle: 'Brazo Mecanizado con Bloqueo Omnidireccional',
        category: 'SOPORTE MECÁNICO DE PRECISIÓN',
        src: '/supply-assets/tattoovision/articulated_arm_clean.webp',
        alt: 'Brazo articulado CNC 360° con doble fijación',
        maxHeight: 'max-h-[220px] sm:max-h-[270px] md:max-h-[320px]',
        maxWidth: 'max-w-[200px] sm:max-w-[260px] md:max-w-[300px]',
        shadowWidth: 'w-[160px] sm:w-[220px] md:w-[260px]',
        badge: 'Brazo CNC 360°',
        detail: 'Estructura en aluminio aeroespacial macizo con perillas rojas de bloqueo firme para orientar la luz en cualquier posición.',
      },
      {
        id: 'tripod',
        title: 'Trípode de Estudio Telescópico',
        subtitle: 'Soporte Plegable de Alta Rigidez',
        category: 'ESTABILIDAD & FIJACIÓN EN CABINA',
        src: '/supply-assets/tattoovision/tripod_stand_clean.webp',
        alt: 'Trípode de soporte para luces Tattoo Vision',
        maxHeight: 'max-h-[260px] sm:max-h-[330px] md:max-h-[390px]',
        maxWidth: 'max-w-[140px] sm:max-w-[180px] md:max-w-[220px]',
        shadowWidth: 'w-[140px] sm:w-[180px] md:w-[220px]',
        badge: 'Trípode Telescópico',
        detail: 'Estructura tubular ligera y plegable para anclar la iluminación perimetralmente en cabina o llevar a convenciones.',
      },
    ],

    stats: [
      { label: 'Cancelación', value: '100%', note: 'Reflejos en piel' },
      { label: 'Estructura', value: 'TR90 Suizo', note: 'Memoria elástica' },
      { label: 'Iluminación', value: '2x LED CNC', note: 'Doble emisión' },
      { label: 'Visión', value: 'RX Apta', note: 'Lunas formuladas' },
    ],

    systemSection: {
      eyebrow: 'Arquitectura del Kit',
      title: 'Sistema Integral de Precisión',
    },

    systemTools: [
      {
        name: 'Gafas TR90 + Clip-On',
        desc: 'Montura ergonómica con micro-imanes de neodimio N52 y opción para lentes formulados.',
        tag: 'Filtro Receptor',
      },
      {
        name: 'Doble Panel LED 2X',
        desc: 'Disipación de calor en aluminio anodizado rojo y grabado de filigrana con selector de intensidad.',
        tag: 'Emisor Polarizado',
      },
      {
        name: 'Articulación Doble CNC',
        desc: 'Mecanizado de precisión en aluminio con perillas de apriete rápido y rotación 360°.',
        tag: 'Soporte Mecánico',
      },
      {
        name: 'Trípode de Estudio',
        desc: 'Estructura telescópica ultra compacta para fijar el punto de iluminación en cabina o convención.',
        tag: 'Estabilidad',
      },
    ],

    bento: {
      featured: {
        image: '/supply-assets/tattoovision/tattoo_demonstration.webp',
        imageAlt: 'Demostración real de lentes Tattoo Vision cancelando reflejos sobre tatuaje',
        overlayLeft: 'Lente Izquierdo: Polarizado',
        overlayRight: 'Exterior: Brillo Superficial',
        eyebrow: 'TECNOLOGÍA DE POLARIZACIÓN CRUZADA',
        badge: 'Zero Glare',
        title: 'Visión Real de la Dermis sin Reflejos',
        description: 'Al sincronizar el filtro de las gafas con la luz polarizada, se anula el 100% del rebote de luz especular provocado por la vaselina, el brillo de las tintas y los fluidos. El artista evalúa la saturación real, el empastado y los degradados en tiempo real sin tener que esperar la cicatrización.',
      },
      cards: [
        {
          eyebrow: 'MODULARIDAD DUAL',
          badge: 'Neodimio N52',
          title: 'Clip-On Magnético Instantáneo',
          description: 'El sobrelente polarizado se acopla o retira en una fracción de segundo gracias a micro-imanes de neodimio de alta atracción integrados en los vértices del armazón.',
          footer: 'Acople firme que no se desprende con el movimiento',
        },
        {
          eyebrow: 'ERGONOMÍA & FÓRMULA ÓPTICA',
          badge: 'TR90 Suizo',
          title: 'Polímero Ultraligero & Apta para Fórmula',
          description: 'Estructura en TR90 suizo con memoria elástica indeformable (peso pluma de 42g). Permite que cualquier óptica adapte tus cristales formulados (miopía o astigmatismo) en la montura base sin perder la función polarizada del Clip-On.',
          footer: 'Compatible con cristales formulados y de descanso',
        },
      ],
    },

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

  // Don Melo — Máquinas de tatuar artesanales de bobinas (Colombia)
  'don-melo': {
    brandId: 'don-melo',
    brandName: 'Don Melo',
    logoFallback: '/marcas-marquee/don-melo.png',
    officialUrl: 'https://www.instagram.com/donmelotattoomachines/',
    officialLabel: 'Instagram Oficial Don Melo',
    eyebrow: 'INGENIERÍA METALMECÁNICA ARTESANAL · COLOMBIA',
    title: 'Don Melo Handmade Coil Liner',
    subtitle: 'Máquina de Bobinas Calibrada a Mano: Golpe Seco, Chasis Sólido y Precisión Clásica',
    description: 'Fabricada artesanalmente en Colombia por Cristian Melo (Don Melo), tatuador e ingeniero metalmecánico. Cada máquina es ensamblada y calibrada pieza por pieza para entregar un golpe seco, estable y contundente en líneas sólidas (Power Liner), honrando la mecánica clásica de bobinas magnéticas.',
    accentColor: '#8a852b',
    badge: 'Máquina Artesanal de Bobinas',

    // Una sola máquina insignia flotante (sin slider de kit)
    heroSlides: [
      {
        id: 'coil-liner',
        title: 'Don Melo Power Liner · Bobinas Artesanal',
        subtitle: 'Chasis Metálico Forjado · Bobinas Calibradas · Contacto en Cobre Puro',
        category: 'MÁQUINA DE BOBINAS · HANDMADE COLOMBIA',
        src: '/supply-assets/donmelo/don_melo_coil_liner_clean.webp',
        alt: 'Máquina de tatuar artesanal de bobinas Don Melo Power Liner',
        maxHeight: 'max-h-[270px] sm:max-h-[340px] md:max-h-[400px]',
        maxWidth: 'max-w-[350px] sm:max-w-[450px] md:max-w-[520px]',
        shadowWidth: 'w-[240px] sm:w-[330px] md:w-[400px]',
        badge: 'Coil Power Liner',
        detail: 'Calibrada a mano para líneas limpias y sólidas (3RL a 13RL+), con rango nominal de 4V–6V, frecuencia estable de 120–145 Hz y chasis sólido de ~165g.',
      },
    ],

    stats: [
      { label: 'Voltaje', value: '4V – 6V', note: 'Rango óptimo' },
      { label: 'Frecuencia', value: '120–145 Hz', note: 'Golpe lineal' },
      { label: 'Peso', value: '~165 g', note: 'Chasis metálico' },
      { label: 'Origen', value: 'Handmade', note: 'Colombia' },
    ],

    systemSection: {
      eyebrow: 'Anatomía Mecánica',
      title: 'Componentes Calibrados a Mano',
    },

    systemTools: [
      {
        name: 'Chasis Metálico Forjado',
        desc: 'Estructura rígida con acabado artesanal texturizado, diseñada para absorber vibraciones y equilibrar el peso en cabina.',
        tag: 'Estructura',
      },
      {
        name: 'Bobinas Magnéticas Propias',
        desc: 'Embobinado calibrado con carretes translúcidos sellados y condensador de respuesta rápida para empuje continuo.',
        tag: 'Electromagnetismo',
      },
      {
        name: 'Contacto en Cobre Puro',
        desc: 'Tornillo de contacto y bornera en cobre puro que maximizan la conductividad eléctrica y reducen el calentamiento.',
        tag: 'Conductividad',
      },
      {
        name: 'Flejes & Martillo DM',
        desc: 'Flejes templados a medida y barra armadura grabada con sello DM para un recorrido firme en líneas exigentes.',
        tag: 'Calibración',
      },
    ],

    bento: {
      featured: {
        image: '/supply-assets/donmelo/don_melo_workshop.webp',
        imageAlt: 'Colección de máquinas de tatuar artesanales Don Melo en taller',
        overlayLeft: 'Calibración Artesanal · 1 a 1',
        overlayRight: 'Fusagasugá, Colombia',
        eyebrow: 'MANUFACTURA METALMECÁNICA PROPIA',
        badge: 'Custom Tuned',
        title: 'Precisión de Taller para Trazos Contundentes',
        description: 'A diferencia de las máquinas producidas en serie, cada chasis Don Melo pasa por un ajuste manual de flejes, tensión de bobinas y alineación de barra armadura. El resultado es un golpe firme y predecible que clava líneas sólidas en una sola pasada sin maltratar la piel.',
      },
      cards: [
        {
          eyebrow: 'POTENCIA EN LÍNEA',
          badge: 'Power Liner',
          title: 'De Micro Liner a Líneas Gruesas',
          description: 'Configurada para mover agrupaciones desde 3RL hasta 13RL+ con soltura en voltajes bajos (4V a 6V), manteniendo velocidad constante y sin pérdida de empuje en pieles exigentes.',
          footer: 'Respuesta inmediata desde el primer contacto del pedal',
        },
        {
          eyebrow: 'DURABILIDAD DE POR VIDA',
          badge: 'Cobre & Acero',
          title: 'Mecánica Reparable y Eterna',
          description: 'Construida con metales sólidos, borneras en cobre y tornillería estándar industrial. Una herramienta hecha para durar décadas en cabina, con mantenimiento sencillo y calibración a gusto del tatuador.',
          footer: 'Respaldada por la trayectoria de Cristian Melo en Colombia',
        },
      ],
    },

    technicalHighlights: [],
  },

  // Plantilla para la siguiente marca
  'industrias-warlock': {
    brandId: 'industrias-warlock',
    brandName: 'Industrias Warlock',
    logoFallback: '/supply-assets/logos/supply_brand_kwadron.jpg',
    officialUrl: null,
    eyebrow: 'INGENIERÍA MECÁNICA ROTATIVA',
    title: 'Warlock Vector',
    subtitle: 'Máquinas Rotativas de Golpe Directo para Línea y Sombra',
    description: 'Máquinas de precisión diseñadas para respuesta lineal continua, chasis monobloque en aluminio aeroespacial y motor suizo de alto torque.',
    accentColor: '#dc2626',
    badge: 'Maquinaria de Precisión',
    heroStage: null,
    stats: [
      { label: 'Motor', value: 'Suizo 10W', note: 'Alto torque' },
      { label: 'Stroke', value: '3.5 - 4.2mm', note: 'Ajustable' },
      { label: 'Chasis', value: 'Aluminio CNC', note: 'Monobloque' },
      { label: 'Grip', value: 'Autoclavable', note: 'Universal' },
    ],
    systemTools: [],
    technicalHighlights: [],
  },
}
