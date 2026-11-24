// Configuración estratégica y técnica para las páginas premium de Marcas en INKognito Supply.
// Fondo blanco, fotografía de producto flotante, logo oficial y especificaciones de alta gama.

export const BRAND_SHOWCASE_DATA = {
  'tattoo-vision': {
    brandId: 'tattoo-vision',
    brandName: 'Tattoo Vision',
    logoFallback: '/supply-assets/logos/supply_brand_tattoo_vision.webp',
    officialUrl: 'https://tattoovision.com',
    eyebrow: 'ÓPTICA ORIGINAL · HERNÁN YEPES',
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
    eyebrow: 'BOBINAS ARTESANALES · COLOMBIA',
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

  // Difuso Galería & Supply — Estudio de tatuajes y tienda de insumos en Envigado, Medellín
  'difuso-galeria': {
    brandId: 'difuso-galeria',
    brandName: 'Difuso Galería',
    logoFallback: '/marcas-marquee/difuso-galeria.png',
    officialUrl: 'https://difusosupplytattoo.com',
    officialLabel: 'Sitio Oficial Difuso Supply',
    eyebrow: 'ESTUDIO & SUPPLY · MEDELLÍN',
    title: 'Difuso Galería & Supply',
    subtitle: 'Estudio de Tatuajes en Envigado y Tienda de Insumos Profesionales',
    description: 'Estudio referente en Envigado (Área Metropolitana de Medellín) con tienda propia de insumos para tatuadores. Trabajan bajo el criterio de tatuadores en activo: marcas originales, inventario constante y despachos a toda Colombia.',
    accentColor: '#3f1d1d',
    badge: 'Estudio & Supply',

    heroSlides: [
      {
        id: 'difuso-emblem-watermark',
        frameStyle: 'watermark',
        title: 'Difuso Galería · Estudio & Tienda Supply',
        subtitle: 'Envigado, Antioquia — Área Metropolitana de Medellín',
        category: 'DIFUSO GALERÍA · ENVIGADO, ANTIOQUIA',
        src: '/marcas-marquee/difuso-galeria.png',
        alt: 'Emblema oficial de Difuso Galería',
        maxHeight: 'max-h-[220px] sm:max-h-[270px] md:max-h-[310px]',
        maxWidth: 'max-w-[260px] sm:max-w-[320px] md:max-w-[360px]',
        shadowWidth: 'w-[180px] sm:w-[230px] md:w-[270px]',
        badge: 'Difuso Galería',
        detail: 'Estudio de tatuajes y tienda especializada en insumos profesionales en Zona El Dorado, Envigado, con envíos a todo el país.',
      },
    ],

    stats: [
      { label: 'Ubicación', value: 'Envigado', note: 'Área Metro Medellín' },
      { label: 'Enfoque', value: 'Estudio', note: 'De tatuadores' },
      { label: 'Insumos', value: 'Originales', note: 'Marcas líderes' },
      { label: 'Envíos', value: 'Nacional', note: 'Toda Colombia' },
    ],

    systemSection: {
      eyebrow: 'Qué Ofrece Difuso',
      title: 'Estudio de Tatuajes & Tienda Supply',
    },

    systemTools: [
      {
        name: 'Estudio de Tatuajes',
        desc: 'Espacio artístico consolidado en Envigado dedicado al tatuaje profesional con altos estándares técnicos y sanitarios.',
        tag: 'Galería',
      },
      {
        name: 'Cartuchos & Agujas',
        desc: 'Distribución de líneas reconocidas como WJX, EZ Revolution, V-Select y Kwadron para trabajo diario en estudio.',
        tag: 'Insumos',
      },
      {
        name: 'Pigmentos & Cuidado',
        desc: 'Tintas originales Dynamic, Umbra Ink, anestesias, bálsamos y productos de higiene para antes, durante y después de la sesión.',
        tag: 'Pigmentos',
      },
      {
        name: 'Tienda Física & Envíos',
        desc: 'Atención directa en Zona El Dorado (Envigado) y distribución nacional ágil para tatuadores y estudios en Colombia.',
        tag: 'Cobertura',
      },
    ],

    bento: {
      featured: {
        image: null,
        watermarkLogo: '/marcas-marquee/difuso-galeria.png',
        imageAlt: 'Marca de agua oficial de Difuso Galería',
        overlayLeft: 'De Tatuadores para Tatuadores',
        overlayRight: 'Envigado · Medellín',
        eyebrow: 'ESTUDIO + TIENDA SUPPLY',
        badge: 'Difuso Supply',
        title: 'Insumos Seleccionados desde la Práctica Real',
        description: 'Al operar simultáneamente como estudio activo y tienda de insumos, cada producto de su catálogo —cartuchos, pigmentos, cremas y consumibles— responde a las exigencias reales de tatuadores profesionales en Medellín y Colombia.',
      },
      cards: [
        {
          eyebrow: 'SEDE EN ENVIGADO',
          badge: 'Zona El Dorado',
          title: 'Atención Directa en Tienda Física',
          description: 'Ubicados en la Cl. 40D Sur #40A-46 (Envigado, Antioquia), ofrecen asesoría técnica directa sobre insumos, calibres y consumibles tanto para artistas locales como para estudios de otras ciudades.',
          footer: 'Sede física en Envigado y despachos a toda Colombia',
        },
        {
          eyebrow: 'RESPALDO COMERCIAL',
          badge: '100% Original',
          title: 'Marcas Reconocidas del Sector',
          description: 'Catálogo enfocado en fabricantes verificados de la industria del tatuaje, asegurando esterilidad, consistencia en el pigmento y disponibilidad continua para el ritmo del estudio.',
          footer: 'Tienda oficial disponible en difusosupplytattoo.com',
        },
      ],
    },

    technicalHighlights: [],
  },

  // Industrias Warlock S.A.S. — Mobiliario profesional para estudios de tatuaje (Colombia)
  'industrias-warlock': {
    brandId: 'industrias-warlock',
    brandName: 'Industrias Warlock',
    logoFallback: '/marcas-marquee/warlock.png',
    officialUrl: null,
    eyebrow: 'MOBILIARIO PROFESIONAL · COLOMBIA',
    title: 'Industrias Warlock',
    subtitle: 'Mobiliario Ergonómico de Alto Tráfico para Estudios de Tatuaje',
    description: 'Fabricante colombiano especializado en el diseño y producción de mobiliario profesional para tatuadores. Camillas reclinables, apoyabrazos ajustables, sillas de trabajo y carros auxiliares fabricados en estructura metálica con pintura electrostática y tapizados de alta resistencia.',
    accentColor: '#18181b',
    badge: 'Mobiliario de Estudio',

    heroSlides: [
      {
        id: 'camilla-pro-warlock',
        title: 'Camilla Pro Acolchada Warlock',
        subtitle: 'Tapizado Romboidal Pranna · Cabecero Facial · Pierneras Independientes',
        category: 'MOBILIARIO INSIGNIA · ESTUDIO DE TATUAJE',
        src: '/supply-assets/warlock/camilla_pro_warlock_clean.webp',
        alt: 'Camilla profesional acolchada Industrias Warlock con cabecero facial y apoyabrazos dobles',
        maxHeight: 'max-h-[290px] sm:max-h-[350px] md:max-h-[410px]',
        maxWidth: 'max-w-[280px] sm:max-w-[340px] md:max-w-[400px]',
        shadowWidth: 'w-[210px] sm:w-[270px] md:w-[320px]',
        badge: 'Camilla Pro Warlock',
        detail: 'Tapizado acolchado de costura romboidal en espuma de alta densidad, cabecero con cavidad facial, apoyabrazos dobles y pierneras divididas sobre estructura metálica con pintura electrostática.',
      },
      {
        id: 'apoyabrazos-hercules',
        title: 'Apoyabrazos Hércules con Rack',
        subtitle: 'Soporte Pesado Regulable · Porta-Guantes y Bandeja de Tintas',
        category: 'SOPORTE & ESTABILIDAD · EXTREMIDADES',
        src: '/supply-assets/warlock/apoyabrazos_hercules_clean.webp',
        alt: 'Apoyabrazos Hércules con rack organizador para tatuaje',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[390px]',
        maxWidth: 'max-w-[280px] sm:max-w-[340px] md:max-w-[400px]',
        shadowWidth: 'w-[210px] sm:w-[270px] md:w-[320px]',
        badge: 'Apoyabrazos Hércules',
        detail: 'Base estructural de doble columna con ajuste de altura e inclinación, más rack integrado para caja de guantes y tintas.',
      },
      {
        id: 'mesa-auxiliar-tripode',
        title: 'Mesa Auxiliar Trípode Warlock',
        subtitle: 'Acero Inoxidable con Pintura Electrostática · Dispensador de Toallas',
        category: 'PUESTO DE TRABAJO · ORGANIZACIÓN',
        src: '/supply-assets/warlock/mesa_auxiliar_clean.webp',
        alt: 'Mesa auxiliar trípode Industrias Warlock para tatuadores',
        maxHeight: 'max-h-[280px] sm:max-h-[340px] md:max-h-[400px]',
        maxWidth: 'max-w-[260px] sm:max-w-[320px] md:max-w-[380px]',
        shadowWidth: 'w-[190px] sm:w-[240px] md:w-[290px]',
        badge: 'Mesa Trípode',
        detail: 'Superficie de 45×40 cm con altura regulable de 56 a 95 cm, barras de 2.5 cm y soporte dispensador integrado para toallas desechables.',
      },
      {
        id: 'silla-ergonomica',
        title: 'Silla Ergonómica de Tatuador',
        subtitle: 'Base Cromada Giratoria 360° · Espaldar de Apoyo Lumbar',
        category: 'ERGONOMÍA EN SESIONES EXTENSAS',
        src: '/supply-assets/warlock/silla_espaldar_clean.webp',
        alt: 'Silla giratoria ergonómica con espaldar para tatuadores',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[390px]',
        maxWidth: 'max-w-[230px] sm:max-w-[280px] md:max-w-[330px]',
        shadowWidth: 'w-[170px] sm:w-[220px] md:w-[260px]',
        badge: 'Silla Ergonómica',
        detail: 'Pistón neumático de altura ajustable, rodachinas de desplazamiento suave y espaldar anatómico pensado para largas jornadas.',
      },
    ],

    stats: [
      { label: 'Estructura', value: 'Hierro', note: 'Pintura electrostática' },
      { label: 'Tapizado', value: 'Pranna', note: 'Alta durabilidad' },
      { label: 'Confort', value: 'Ergonómico', note: 'Sesiones largas' },
      { label: 'Origen', value: 'Colombia', note: 'Fabricación nacional' },
    ],

    systemSection: {
      eyebrow: 'Líneas de Mobiliario',
      title: 'Equipamiento Integral para tu Estudio',
    },

    systemTools: [
      {
        name: 'Camillas & Sillas Reclinables',
        desc: 'Modelos modulares e hidráulicos con cabeceros extraíbles, extensores, espuma de alta densidad y tapizado fácil de desinfectar.',
        tag: 'Camillas',
      },
      {
        name: 'Apoyabrazos Ajustables',
        desc: 'Bases firmes con regulación de altura e inclinación (incluyendo línea Hércules) para trabajar extremidades con estabilidad total.',
        tag: 'Soporte',
      },
      {
        name: 'Sillas de Trabajo Ergonómicas',
        desc: 'Asientos giratorios diseñados para cuidar la postura lumbar del tatuador durante sesiones continuas de varias horas.',
        tag: 'Ergonomía',
      },
      {
        name: 'Mesas & Carros Auxiliares',
        desc: 'Superficies metálicas organizadas para mantener tintas, cartuchos, fuentes y consumibles al alcance con higiene.',
        tag: 'Organización',
      },
    ],

    bento: {
      featured: {
        image: '/supply-assets/warlock/warlock_studio_bento.webp',
        imageAlt: 'Estación de tatuaje equipada con camilla acolchada, mesa auxiliar trípode y apoyabrazos Industrias Warlock',
        overlayLeft: 'Postura · Resistencia · Durabilidad',
        overlayRight: 'Fabricación Nacional · Colombia',
        eyebrow: 'INGENIERÍA EN MOBILIARIO',
        badge: 'Alto Tráfico',
        title: 'Diseñado para el Ritmo Diario del Tatuador',
        description: 'Un buen mobiliario no es solo comodidad para quien se tatúa: define la postura, la precisión y la salud física del artista durante jornadas de 6 a 10 horas. Industrias Warlock fabrica piezas robustas pensadas específicamente para las exigencias reales de un estudio de tatuaje.',
      },
      cards: [
        {
          eyebrow: 'ESTRUCTURA & ACABADO',
          badge: 'Pintura Electrostática',
          title: 'Resistencia y Limpieza en Estudio',
          description: 'Chasis metálicos en hierro con recubrimiento en pintura electrostática y tapizados de alta resistencia en Pranna, preparados para soportar limpieza constante con productos desinfectantes sin deteriorarse.',
          footer: 'Materiales seleccionados para uso intensivo diario',
        },
        {
          eyebrow: 'COBERTURA NACIONAL',
          badge: 'Hecho en Colombia',
          title: 'Fabricación Local con Respaldo',
          description: 'Con base de fabricación en Bogotá D.C. y presencia en las principales tiendas de insumos del país, facilitan el acceso a mobiliario profesional con despachos y soporte en toda Colombia.',
          footer: 'Disponible en la vitrina de proveedores de INKognito Supply',
        },
      ],
    },

    technicalHighlights: [],
  },

  // WJX — Cartuchos y maquinaria profesional de precisión (Dragonhawk / WJX)
  wjx: {
    brandId: 'wjx',
    brandName: 'WJX Tattoo',
    logoFallback: '/supply-assets/logos/supply_brand_wjx.webp',
    logoMaskColor: '#2563eb',
    officialUrl: 'https://www.wjxtattoo.com',
    officialLabel: 'Sitio Oficial WJX Tattoo',
    eyebrow: 'CARTUCHOS & MAQUINARIA · ESTÁNDAR PRO',
    title: 'WJX Pro Series',
    subtitle: 'Cartuchos de Membrana con Estabilizador Interno y Acero Quirúrgico 316L',
    description: 'Referente global en cartuchos profesionales para tatuaje. Carcasa en policarbonato grado médico LG, agujas en acero quirúrgico 316L con soldadura de bajo estaño, membrana antiflujo y esterilización por gas EO en cada blíster.',
    accentColor: '#2563eb',
    badge: 'Precisión en Cartuchos',

    heroSlides: [
      {
        id: 'wjx-ultimate-rl',
        title: 'Cartuchos WJX Ultimate RL',
        subtitle: 'Alineación Micrométrica · Flujo Optimizado · Caja x20',
        category: 'SERIE INSIGNIA · LÍNEA DE PRECISIÓN',
        src: '/supply-assets/wjx/wjx_ultimate_clean.webp',
        alt: 'Caja de cartuchos profesionales WJX Ultimate RL x20',
        maxHeight: 'max-h-[260px] sm:max-h-[320px] md:max-h-[370px]',
        maxWidth: 'max-w-[260px] sm:max-w-[320px] md:max-w-[380px]',
        shadowWidth: 'w-[200px] sm:w-[250px] md:w-[300px]',
        badge: 'Ultimate RL',
        detail: 'Serie de alta gama con estabilización mecánica de baja vibración, control preciso del flujo de pigmento y esterilización individual por gas EO.',
      },
      {
        id: 'wjx-ultimate-rm',
        title: 'Cartuchos WJX Ultimate RM',
        subtitle: 'Curved Magnum para Sombreado y Empastado · Caja x20',
        category: 'SERIE INSIGNIA · SOMBRA & RELLENO',
        src: '/supply-assets/wjx/wjx_ultimate_rm_clean.webp',
        alt: 'Caja de cartuchos profesionales WJX Ultimate RM x20',
        maxHeight: 'max-h-[260px] sm:max-h-[320px] md:max-h-[370px]',
        maxWidth: 'max-w-[280px] sm:max-w-[340px] md:max-w-[400px]',
        shadowWidth: 'w-[210px] sm:w-[260px] md:w-[310px]',
        badge: 'Ultimate RM',
        detail: 'Agrupación magnum curva con descarga uniforme de tinta para degradados suaves en black & grey y saturación limpia a color.',
      },
      {
        id: 'wjx-original-rl',
        title: 'Cartuchos WJX Original',
        subtitle: 'Policarbonato Grado Médico LG · Membrana Antiflujo · Caja x20',
        category: 'RENDIMIENTO DIARIO · RL / RS / M1 / RM',
        src: '/supply-assets/wjx/wjx_original_rl_clean.webp',
        alt: 'Caja de cartuchos profesionales WJX Original x20',
        maxHeight: 'max-h-[260px] sm:max-h-[320px] md:max-h-[370px]',
        maxWidth: 'max-w-[260px] sm:max-w-[320px] md:max-w-[380px]',
        shadowWidth: 'w-[200px] sm:w-[250px] md:w-[300px]',
        badge: 'WJX Original',
        detail: 'Diseñados para trabajo continuo en estudio con excelente retención de tinta, visibilidad transparente de la aguja y ajuste universal.',
      },
      {
        id: 'wjx-hyper-force',
        title: 'WJX Hyper Force 4.5 mm',
        subtitle: 'Máquina Rotativa Pen de Alto Torque · Stroke 4.5 mm',
        category: 'MAQUINARIA ROTATIVA · GOLPE FIRME',
        src: '/supply-assets/wjx/wjx_hyper_force_clean.webp',
        alt: 'Máquina rotativa WJX Hyper Force 4.5mm',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[160px] sm:max-w-[200px] md:max-w-[240px]',
        shadowWidth: 'w-[140px] sm:w-[180px] md:w-[220px]',
        badge: 'Hyper Force 4.5mm',
        detail: 'Recorrido contundente de 4.5 mm diseñado para mover agrupaciones grandes de cartuchos WJX en línea gruesa, relleno sólido y realismo.',
      },
    ],

    stats: [
      { label: 'Acero', value: '316L', note: 'Grado quirúrgico' },
      { label: 'Carcasa', value: 'LG PC', note: 'Policarbonato médico' },
      { label: 'Seguridad', value: 'Gas EO', note: 'Membrana antiflujo' },
      { label: 'Empaque', value: '20 pcs', note: 'Blíster individual' },
    ],

    systemSection: {
      eyebrow: 'Ingeniería WJX',
      title: 'Estabilidad, Higiene y Flujo Continuo',
    },

    systemTools: [
      {
        name: 'WJX Ultimate & Ultra',
        desc: 'Sistema estabilizador elástico que reduce el juego lateral de la aguja y mantiene un golpe consistente.',
        tag: 'Estabilidad',
      },
      {
        name: 'Carcasa Transparente LG PC',
        desc: 'Policarbonato grado médico de alta transparencia para monitorear en todo momento la carga de pigmento.',
        tag: 'Visibilidad',
      },
      {
        name: 'Membrana de Seguridad',
        desc: 'Barrera interna que bloquea el retorno de tinta y fluidos hacia el grip y el motor de la máquina.',
        tag: 'Bioseguridad',
      },
      {
        name: 'Configuraciones Completas',
        desc: 'Disponibles en RL, RS, M1 y RM desde calibres finos (0.18–0.25 mm) hasta 0.35 mm para todo estilo.',
        tag: 'Versatilidad',
      },
    ],

    bento: {
      featured: {
        image: '/supply-assets/wjx/wjx_bento.webp',
        imageAlt: 'Línea profesional WJX: cartuchos Original, Ultimate RL/RM y máquina rotativa Hyper Force',
        overlayLeft: 'Acero 316L · Membrana Antiflujo',
        overlayRight: 'Compatibilidad Universal',
        eyebrow: 'PRECISIÓN EN CADA TRAZO',
        badge: 'EO Sterilized',
        title: 'Control Real del Pigmento sin Vibraciones',
        description: 'La combinación de agujas en acero quirúrgico 316L con soldadura de bajo estaño y el estabilizador interno de WJX entrega trazos firmes desde la primera línea hasta el último sombreado, cuidando la máquina gracias a su membrana sellada.',
      },
      cards: [
        {
          eyebrow: 'ACOPLE UNIVERSAL',
          badge: 'Plug & Tattoo',
          title: 'Compatible con Máquinas Pen y Grips Estándar',
          description: 'Encaje firme de cuarto de vuelta compatible con la gran mayoría de máquinas rotativas tipo Pen y grips universales del mercado.',
          footer: 'Cambio rápido de calibre durante la sesión',
        },
        {
          eyebrow: 'BIOSEGURIDAD CERTIFICADA',
          badge: '100% Desechable',
          title: 'Esterilización Individual por Gas EO',
          description: 'Cada cartucho viene sellado en blíster individual con fecha de lote y vencimiento, garantizando un entorno higiénico y seguro para el cliente.',
          footer: 'Cajas selladas de 20 unidades',
        },
      ],
    },

    technicalHighlights: [],
  },

  // Dynamic Color Co. — Tintas profesionales Made in USA desde 1990
  dynamic: {
    brandId: 'dynamic',
    brandName: 'Dynamic Color Co.',
    logoFallback: '/marcas-marquee/dynamic.png',
    officialUrl: 'https://dynamiccolor.com',
    officialLabel: 'Sitio Oficial Dynamic Color',
    eyebrow: 'MADE IN USA · DESDE 1990',
    title: 'Dynamic Color Co.',
    subtitle: 'Pigmentos Pre-Dispersados de Referencia Mundial: BLK, Triple Black y Heavy White',
    description: 'Fabricadas en Estados Unidos desde 1990, las tintas Dynamic son el estándar global en negros profundos, diluciones de sombras y blancos de alta opacidad. Fórmulas 100% veganas, estériles y con sello holográfico antifalsificación.',
    accentColor: '#111827',
    badge: 'Pigmentos USA · 1990',

    heroSlides: [
      {
        id: 'dynamic-blk',
        title: 'Dynamic BLK (Original Black)',
        subtitle: 'Negro Clásico de Fluidez Ligera · 8 oz / 240 ml',
        category: 'ESTÁNDAR MUNDIAL · LÍNEA & SOMBRA',
        src: '/supply-assets/dynamic/dynamic_blk_clean.webp',
        alt: 'Tinta de tatuaje Dynamic BLK Original Black 8oz',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[260px] sm:max-w-[320px] md:max-w-[370px]',
        shadowWidth: 'w-[180px] sm:w-[230px] md:w-[280px]',
        badge: 'Original BLK',
        detail: 'La tinta negra icónica de Dynamic desde 1990: consistencia fluida ideal para líneas limpias, dotwork, sombreado y mezclas personalizadas de greywash.',
      },
      {
        id: 'dynamic-tbk',
        title: 'Dynamic Triple Black (TBK)',
        subtitle: 'Alta Concentración de Pigmento · 8 oz / 240 ml',
        category: 'BLACKWORK & RELLENO SÓLIDO',
        src: '/supply-assets/dynamic/dynamic_tbk_clean.webp',
        alt: 'Tinta de tatuaje Dynamic Triple Black TBK 8oz',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[260px] sm:max-w-[320px] md:max-w-[370px]',
        shadowWidth: 'w-[180px] sm:w-[230px] md:w-[280px]',
        badge: 'Triple Black TBK',
        detail: 'Mayor carga de pigmento que BLK manteniendo una aplicación suave y limpieza fácil; diseñada para blackouts, rellenos sólidos y contrastes intensos.',
      },
      {
        id: 'dynamic-white',
        title: 'Dynamic Heavy White',
        subtitle: 'Blanco Cremoso de Alta Opacidad · Brillos Nítidos',
        category: 'ILUMINACIÓN & DETALLES FINALES',
        src: '/supply-assets/dynamic/dynamic_white_clean.webp',
        alt: 'Tinta de tatuaje Dynamic White',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[260px] sm:max-w-[320px] md:max-w-[370px]',
        shadowWidth: 'w-[180px] sm:w-[230px] md:w-[280px]',
        badge: 'Heavy White',
        detail: 'Blanco denso de máxima cobertura diseñado para puntos de luz, brillos en realismo y blancos sólidos duraderos.',
      },
      {
        id: 'dynamic-union',
        title: 'Dynamic Union Black (REACH)',
        subtitle: 'Negro Formulado bajo Normativa Europea REACH · 8 oz / 240 ml',
        category: 'ESTÁNDAR REACH · ACABADO MATE',
        src: '/supply-assets/dynamic/dynamic_union_clean.webp',
        alt: 'Tinta de tatuaje Dynamic Union Black REACH 8oz',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[200px] sm:max-w-[240px] md:max-w-[280px]',
        shadowWidth: 'w-[150px] sm:w-[190px] md:w-[230px]',
        badge: 'Union Black',
        detail: 'Formulación compatible con la regulación europea REACH, de consistencia fluida, tono frío ligeramente mate y degradados limpios.',
      },
    ],

    stats: [
      { label: 'Origen', value: 'USA', note: 'Desde 1990' },
      { label: 'Fórmula', value: '100% Vegana', note: 'Pre-dispersada' },
      { label: 'Seguridad', value: 'Holograma', note: 'Sello antifraude' },
      { label: 'Formatos', value: '1 oz – 8 oz', note: 'Estudio y color' },
    ],

    systemSection: {
      eyebrow: 'Línea Dynamic Color',
      title: 'Negros, Blancos y Color con Respaldo Original',
    },

    systemTools: [
      {
        name: 'Dynamic BLK (Original)',
        desc: 'El negro versátil por excelencia para líneas, sombreado suave y diluciones en escala de grises.',
        tag: 'Clásico',
      },
      {
        name: 'Triple Black (TBK)',
        desc: 'Extra concentración de pigmento negro para blackwork, tribal, japonés y rellenos densos.',
        tag: 'Alto Contraste',
      },
      {
        name: 'Union Black (REACH)',
        desc: 'Versión formulada bajo normativa europea REACH con acabado ligeramente mate y degradados limpios.',
        tag: 'REACH',
      },
      {
        name: 'Heavy & Mixing White',
        desc: 'Blancos de alta pureza para brillos contundentes en realismo o aclarado uniforme de tonos.',
        tag: 'Blancos',
      },
    ],

    bento: {
      featured: {
        image: '/supply-assets/dynamic/dynamic_bento.webp',
        imageAlt: 'Botellas originales Dynamic Color Co.: BLK, Triple Black, Union Black y Heavy White',
        overlayLeft: 'Made in USA · Desde 1990',
        overlayRight: 'Sello Holográfico Original',
        eyebrow: 'AUTENTICIDAD GARANTIZADA',
        badge: 'Anti-Counterfeit',
        title: 'Sello Holográfico y Esterilidad de Fábrica',
        description: 'Cada botella original de Dynamic Color viene en envase PET cristalino con etiqueta holográfica recubierta y sello térmico grabado con el logo oficial, protegiendo al tatuador frente a imitaciones y garantizando consistencia real en la piel.',
      },
      cards: [
        {
          eyebrow: 'CURACIÓN CONFIABLE',
          badge: 'Pre-Dispersada',
          title: 'Implantación Rápida y Limpieza Fluida',
          description: 'Su viscosidad balanceada entra en la dermis sin esfuerzo, reduce el trauma en la piel y se limpia fácilmente durante sesiones largas de black & grey o color.',
          footer: 'Fórmula 100% vegana y libre de crueldad animal',
        },
        {
          eyebrow: 'VERSATILIDAD DE ESTUDIO',
          badge: 'BLK · TBK · UNB',
          title: 'Un Negro para Cada Técnica',
          description: 'Desde la fluidez clásica de BLK hasta la densidad extrema de Triple Black y el cumplimiento REACH de Union Black, cubre todas las necesidades de línea, sombra y blackout.',
          footer: 'Disponible a través de proveedores verificados en INKognito Supply',
        },
      ],
    },

    technicalHighlights: [],
  },

  // Vice Colors — Pigmentos de alta saturación y colaboraciones con artistas
  'vice-colors': {
    brandId: 'vice-colors',
    brandName: 'Vice Colors',
    logoFallback: '/marcas-marquee/vice-colors.png',
    officialUrl: null,
    eyebrow: 'PIGMENTOS DE ALTA SATURACIÓN',
    title: 'Vice Colors Ink',
    subtitle: 'Negros Intensos, Blancos Luminosos y Paleta de Color de Alta Carga Pigmentaria',
    description: 'Marca internacional reconocida por su fórmula micro-dispersada de rápida implantación y colores de alto impacto. Desde su icónico Vicious Black hasta su vibrante paleta de colores y sets de colaboración con artistas.',
    accentColor: '#dc2626',
    badge: 'Color & Blackwork',

    heroSlides: [
      {
        id: 'vice-vicious-black',
        title: 'Vice Vicious Black 500 ml',
        subtitle: 'Negro Carbón Ultra Oscuro · Relleno Sólido y Línea Firme',
        category: 'NEGRO INSIGNIA · FORMATO ESTUDIO',
        src: '/supply-assets/vice-colors/vice_vicious_500_clean.webp',
        alt: 'Tinta Vice Colors Vicious Black 500ml',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[180px] sm:max-w-[220px] md:max-w-[260px]',
        shadowWidth: 'w-[150px] sm:w-[190px] md:w-[230px]',
        badge: 'Vicious Black',
        detail: 'Pigmento negro de máxima densidad diseñado para blackwork contundente, líneas limpias y empaque sólido en formato profesional de estudio.',
      },
      {
        id: 'vice-green-hulk',
        title: 'Vice Green Hulk 50 ml',
        subtitle: 'Pigmento Micro-Dispersado de Alta Luminosidad',
        category: 'PALETA DE COLOR · FULL COLOR',
        src: '/supply-assets/vice-colors/vice_green_hulk_clean.webp',
        alt: 'Pigmento Vice Colors Green Hulk 50ml',
        maxHeight: 'max-h-[260px] sm:max-h-[320px] md:max-h-[370px]',
        maxWidth: 'max-w-[180px] sm:max-w-[220px] md:max-w-[260px]',
        shadowWidth: 'w-[140px] sm:w-[180px] md:w-[220px]',
        badge: 'Green Hulk',
        detail: 'Verde vibrante con alta concentración de pigmento que mantiene su intensidad tras la cicatrización en neo-tradicional, color y realismo.',
      },
      {
        id: 'vice-bounasera-blue',
        title: 'Vice Bounasera Blue 50 ml',
        subtitle: 'Azul Profundo de Implantación Suave y Curación Uniforme',
        category: 'PALETA DE COLOR · ALTA SATURACIÓN',
        src: '/supply-assets/vice-colors/vice_bounasera_blue_clean.webp',
        alt: 'Pigmento Vice Colors Bounasera Blue 50ml',
        maxHeight: 'max-h-[260px] sm:max-h-[320px] md:max-h-[370px]',
        maxWidth: 'max-w-[180px] sm:max-w-[220px] md:max-w-[260px]',
        shadowWidth: 'w-[140px] sm:w-[180px] md:w-[220px]',
        badge: 'Bounasera Blue',
        detail: 'Tono azul intenso formulado para saturar con menos pasadas, reduciendo la fatiga de la piel durante sesiones de color exigentes.',
      },
      {
        id: 'vice-sweet-lavender',
        title: 'Vice Sweet Lavender 50 ml',
        subtitle: 'Tonos Pastel y Transiciones Limpias en Color',
        category: 'PALETA DE COLOR · TRANSICIONES',
        src: '/supply-assets/vice-colors/vice_sweet_lavender_clean.webp',
        alt: 'Pigmento Vice Colors Sweet Lavender 50ml',
        maxHeight: 'max-h-[260px] sm:max-h-[320px] md:max-h-[370px]',
        maxWidth: 'max-w-[180px] sm:max-w-[220px] md:max-w-[260px]',
        shadowWidth: 'w-[140px] sm:w-[180px] md:w-[220px]',
        badge: 'Sweet Lavender',
        detail: 'Lavanda brillante de textura equilibrada ideal para degradados suaves, detalles florales y composiciones a todo color.',
      },
    ],

    stats: [
      { label: 'Fórmula', value: 'Micro', note: 'Alta carga pigmentaria' },
      { label: 'Ética', value: 'Vegana', note: 'Cruelty-free' },
      { label: 'Insignia', value: 'Vicious', note: 'Negro & Full Color' },
      { label: 'Formatos', value: '30 – 500 ml', note: 'Color y bulk' },
    ],

    systemSection: {
      eyebrow: 'Catálogo Vice Colors',
      title: 'Negros Contundentes y Color de Alto Impacto',
    },

    systemTools: [
      {
        name: 'Vicious Black & Black Sabbath',
        desc: 'Negros profundos de alto contraste pensados para rellenos sólidos, líneas definidas y blackwork.',
        tag: 'Negros',
      },
      {
        name: 'El Gato Blanco',
        desc: 'Pigmento blanco de alta luminosidad diseñado para brillos limpios y detalles de contraste.',
        tag: 'Blanco',
      },
      {
        name: 'Paleta Full Color',
        desc: 'Amplia gama de tonos vivos (verdes, azules, rojos, lavandas y tonos tierra) de curación sólida.',
        tag: 'Color',
      },
      {
        name: 'Sets & Greywash',
        desc: 'Colaboraciones exclusivas con artistas internacionales y sets de sombras listas para usar.',
        tag: 'Sets Pro',
      },
    ],

    bento: {
      featured: {
        image: '/supply-assets/vice-colors/vice_bento.webp',
        imageAlt: 'Colección de pigmentos Vice Colors: Vicious Black, Green Hulk, Bounasera Blue y Sweet Lavender',
        overlayLeft: 'Micro-Dispersión · Alta Saturación',
        overlayRight: 'Vegana & Cruelty-Free',
        eyebrow: 'SATURACIÓN QUE PERDURA',
        badge: 'Vice Colors',
        title: 'Color Limpio e Implantación Rápida',
        description: 'Vice Colors combina una viscosidad estable con pigmentos de alta densidad que permiten empastar en menos pasadas, logrando degradados fluidos y colores que se mantienen vibrantes una vez cicatrizados.',
      },
      cards: [
        {
          eyebrow: 'FORMATOS DE ESTUDIO',
          badge: '30 · 50 · 250 · 500 ml',
          title: 'Del Detalle Puntual al Consumo Diario',
          description: 'Colores en presentaciones de 30 y 50 ml para máxima frescura y negros insignia en botellas de 250 y 500 ml para estudios de alto volumen.',
          footer: 'Distribución en Colombia a través de tiendas aliadas',
        },
        {
          eyebrow: 'DESARROLLADA CON ARTISTAS',
          badge: 'Artist Collabs',
          title: 'Tonos Probados en Piel Real',
          description: 'Sus líneas de color y sets de colaboración nacen junto a tatuadores especialistas en neo-tradicional, realismo a color y black & grey.',
          footer: 'Disponible en la vitrina de INKognito Supply',
        },
      ],
    },

    technicalHighlights: [],
  },

  // Hype Ink — Pigmento negro profesional co-creado por Cristian Casas (@kasasink)
  'hype-ink': {
    brandId: 'hype-ink',
    brandName: 'Hype Ink',
    logoFallback: null,
    officialUrl: 'https://hypeink.es',
    officialLabel: 'Sitio Oficial Hype Ink',
    eyebrow: 'NEGRO NEUTRO PRO · CO-CREADA POR KASASINK',
    title: 'Hype Ink Black',
    subtitle: 'Pigmento Negro Terciopelo sin Subtonos Azules ni Verdosos tras la Cicatrización',
    description: 'Co-creada por el reconocido tatuador colombiano Cristian Casas (@kasasink) y Lea (@lea_ht2). Hype Ink nace de la investigación en piel real para ofrecer un negro neutro, aterciopelado y estable con tapa dosificadora de precisión para preparar diluciones exactas de greywash.',
    accentColor: '#18181b',
    badge: 'Negro Profesional',

    heroSlides: [
      {
        id: 'hype-ink-black',
        title: 'Hype Ink Black · Pigmento Negro Pro',
        subtitle: 'Acabado Negro Mate Terciopelo · Tapa Dosificadora de Precisión',
        category: 'PIGMENTO NEGRO NEUTRO · 30 / 100 / 200 ML',
        src: '/supply-assets/hype-ink/hype_ink_black_clean.webp',
        alt: 'Botella de tinta profesional Hype Ink Black',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[390px]',
        maxWidth: 'max-w-[260px] sm:max-w-[320px] md:max-w-[380px]',
        shadowWidth: 'w-[190px] sm:w-[240px] md:w-[290px]',
        badge: 'Hype Ink Black',
        detail: 'Formulada 100% vegana para mantener un negro neutro y profundo que no vira a azul ni verde al cicatrizar, ideal para realismo black & grey, líneas finas y blackwork.',
      },
    ],

    stats: [
      { label: 'Acabado', value: 'Negro Mate', note: 'Sin viraje azul/verde' },
      { label: 'Fórmula', value: '100% Vegana', note: 'Cruelty-free' },
      { label: 'Formatos', value: '30·100·200ml', note: 'Estudio y viaje' },
      { label: 'Tapón', value: 'Gota Exacta', note: 'Control de greywash' },
    ],

    systemSection: {
      eyebrow: 'Diseño Hype Ink',
      title: 'Un Solo Negro Perfeccionado al Detalle',
    },

    systemTools: [
      {
        name: 'Hype Ink Black 200 ml',
        desc: 'Formato de alto rendimiento pensado para trabajo diario constante en estudio, rellenos y blackwork.',
        tag: 'Estudio',
      },
      {
        name: 'Hype Ink Black 100 ml',
        desc: 'Tamaño intermedio equilibrado para sesiones regulares, convenciones y guest spots.',
        tag: 'Versátil',
      },
      {
        name: 'Hype Ink Black 30 ml',
        desc: 'Presentación compacta ideal para viajes, pruebas técnicas o reposición rápida en estación.',
        tag: 'Compacto',
      },
      {
        name: 'Tapón Dosificador Preciso',
        desc: 'Dispensador de goteo controlado que permite repetir proporciones exactas al mezclar sombras greywash.',
        tag: 'Greywash',
      },
    ],

    bento: {
      featured: {
        image: '/supply-assets/hype-ink/hype_ink_bento.webp',
        imageAlt: 'Hype Ink en convenciones y sesiones profesionales de tatuaje',
        overlayLeft: 'Co-creada por @kasasink & @lea_ht2',
        overlayRight: 'Colombia · Europa',
        eyebrow: 'INVESTIGACIÓN EN PIEL REAL',
        badge: 'Velvet Black',
        title: 'Estabilidad Real en Realismo Black & Grey',
        description: 'En vez de dispersarse en decenas de referencias, Hype Ink concentró toda su formulación en perfeccionar un pigmento negro de fluidez controlada que cicatriza sólido, aterciopelado y fiel al tono trabajado en cabina.',
      },
      cards: [
        {
          eyebrow: 'CONTROL DE DILUCIONES',
          badge: 'Precision Drip-Cap',
          title: 'Greywash Repetible Gota a Gota',
          description: 'Su boquilla de goteo exacto facilita preparar escalas de grises consistentes sesión tras sesión, logrando degradados suaves sin saltos bruscos de tono.',
          footer: 'Compatible con cualquier diluyente profesional',
        },
        {
          eyebrow: 'TRAZABILIDAD & PUREZA',
          badge: '100% Vegana',
          title: 'Envase con Precinto y Lote Trazable',
          description: 'Pigmento de carbono sintetizado en laboratorio con vehículos de origen vegetal, libre de derivados animales y sellado de fábrica con control de lote.',
          footer: 'Disponible en tiendas aliadas de INKognito Supply',
        },
      ],
    },

    technicalHighlights: [],
  },

  // Heaven Pro — Cuidado profesional de la piel, lubricación de proceso y diluyente (Colombia)
  'heaven-pro': {
    brandId: 'heaven-pro',
    brandName: 'Heaven Pro',
    logoFallback: '/supply-assets/logos/supply_brand_heaven_pro.webp',
    officialUrl: 'https://heavenpro.co',
    officialLabel: 'Sitio Oficial Heaven Pro',
    eyebrow: 'CUIDADO DERMATOLÓGICO · COLOMBIA',
    title: 'Heaven Professional Tattoo',
    subtitle: 'Sistema Completo para Antes, Durante y Después del Tatuaje: VITTA, MEDIUM, TACTTUS y AQUA',
    description: 'Marca colombiana fundada por tatuadores y especialistas en cuidado de la piel. Fórmulas 100% veganas, hipoalergénicas y dermatológicamente probadas que cubren todo el flujo de trabajo: deslizamiento durante la sesión, limpieza delicada, dilución de pigmento y cicatrización.',
    accentColor: '#0f172a',
    badge: 'Skincare Profesional',

    heroSlides: [
      {
        id: 'heaven-vitta',
        title: 'Crema VITTA · Aftercare',
        subtitle: 'Aceite de Frambuesa y Aloe Vera · 30 ml y 200 ml',
        category: 'CICATRIZACIÓN · DESDE EL DÍA UNO',
        src: '/supply-assets/heaven-pro/heaven_vitta_clean.webp',
        alt: 'Crema cicatrizante Heaven Pro VITTA para tatuajes',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[260px] sm:max-w-[320px] md:max-w-[370px]',
        shadowWidth: 'w-[180px] sm:w-[230px] md:w-[280px]',
        badge: 'Crema VITTA',
        detail: 'Crema post-tatuaje formulada con aceite de frambuesa y extracto de aloe vera para hidratación profunda, alivio y preservación del color desde el primer día.',
      },
      {
        id: 'heaven-medium',
        title: 'Crema MEDIUM · Proceso',
        subtitle: 'Lubricante con Colágeno · Imperceptible bajo Lente Polarizado',
        category: 'DURANTE LA SESIÓN · 90 G',
        src: '/supply-assets/heaven-pro/heaven_medium_clean.webp',
        alt: 'Crema lubricante de proceso Heaven Pro MEDIUM 90g',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[200px] sm:max-w-[240px] md:max-w-[280px]',
        shadowWidth: 'w-[150px] sm:w-[190px] md:w-[230px]',
        badge: 'Crema MEDIUM',
        detail: 'Textura ultraligera que no obstruye cartuchos, controla fluidos, calma el enrojecimiento con astringentes naturales y no genera brillo bajo óptica polarizada.',
      },
      {
        id: 'heaven-tacttus',
        title: 'TACTTUS · Wet Wipes',
        subtitle: 'Hamamelis, Aloe Vera y Aceite de Jojoba · 40 Unidades',
        category: 'LIMPIEZA DELICADA · REVITALIZANTE',
        src: '/supply-assets/heaven-pro/heaven_tacttus_clean.webp',
        alt: 'Toallitas húmedas Heaven Pro TACTTUS 40 unidades',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[260px] sm:max-w-[320px] md:max-w-[370px]',
        shadowWidth: 'w-[180px] sm:w-[230px] md:w-[280px]',
        badge: 'TACTTUS Wipes',
        detail: 'Toallitas húmedas con tensioactivos suaves, hamamelis, aloe vera y jojoba para limpiar tatuajes recién hechos o cicatrizados sin irritar la piel.',
      },
      {
        id: 'heaven-aqua-mixer',
        title: 'AQUA Mixer · Diluyente Pro',
        subtitle: 'Hamamelis, Caléndula, Pepino, Té Verde y Aloe · 310 ml',
        category: 'DILUCIÓN DE PIGMENTOS · 310 ML',
        src: '/supply-assets/heaven-pro/heaven_aqua_mixer_clean.webp',
        alt: 'Diluyente profesional para tintas Heaven Pro AQUA Mixer 310ml',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[260px] sm:max-w-[320px] md:max-w-[370px]',
        shadowWidth: 'w-[180px] sm:w-[230px] md:w-[280px]',
        badge: 'AQUA Mixer',
        detail: 'Diluyente hidroalcohólico enriquecido con extractos botánicos de alta concentración para mezclas de sombras limpias y control total de la fluidez.',
      },
    ],

    stats: [
      { label: 'Fórmulas', value: '100% Veganas', note: 'Cruelty-free' },
      { label: 'Seguridad', value: 'Testadas', note: 'Hipoalergénicas' },
      { label: 'Flujo', value: '4 Pasos', note: 'Proceso a sanado' },
      { label: 'Origen', value: 'Colombia', note: 'Heaven Pro S.A.S.' },
    ],

    systemSection: {
      eyebrow: 'Ecosistema Heaven Pro',
      title: 'Cuidado Clínico de la Piel Tatuada',
    },

    systemTools: [
      {
        name: 'Crema MEDIUM (Proceso)',
        desc: 'Deslizamiento suave con colágeno durante la sesión, control de fluidos y cero interferencia en lentes polarizados.',
        tag: 'Proceso',
      },
      {
        name: 'AQUA Mixer (310 ml)',
        desc: 'Diluyente botánico con hamamelis, caléndula y té verde para tonos de sombra consistentes y suaves.',
        tag: 'Diluyente',
      },
      {
        name: 'TACTTUS Wet Wipes',
        desc: 'Limpieza delicada en 40 toallitas con aloe vera y jojoba para higiene cómoda en estudio o casa.',
        tag: 'Limpieza',
      },
      {
        name: 'Crema VITTA (Aftercare)',
        desc: 'Recuperación desde el día uno con aceite de frambuesa y aloe vera en presentaciones de 30 ml y 200 ml.',
        tag: 'Aftercare',
      },
    ],

    bento: {
      featured: {
        image: '/supply-assets/heaven-pro/heaven_combo_clean.webp',
        imageAlt: 'Combo Heaven Pro VITTA 30ml y TACTTUS 40 Wet Wipes',
        overlayLeft: 'Dermatológicamente Probado',
        overlayRight: '100% Vegano · Colombia',
        eyebrow: 'PROTOCOLO COMPLETO DE CICATRIZACIÓN',
        badge: 'VITTA + TACTTUS',
        title: 'Protege el Resultado de Cada Sesión',
        description: 'Un tatuaje bien ejecutado depende tanto de la técnica en cabina como del cuidado posterior. El combo VITTA + TACTTUS ofrece a los estudios una solución lista para entregar al cliente, manteniendo la piel hidratada, limpia y con pigmentos vivos.',
      },
      cards: [
        {
          eyebrow: 'COMPATIBLE CON ÓPTICA POLARIZADA',
          badge: 'Crema MEDIUM',
          title: 'Cero Brillo Molesto Durante el Tatuaje',
          description: 'Formulada específicamente para no tapar las agujas ni generar película grasosa brillante, permitiendo evaluar la saturación real incluso con gafas polarizadas.',
          footer: 'Enriquecida con colágeno para elasticidad de la piel',
        },
        {
          eyebrow: 'BOTÁNICA APLICADA',
          badge: 'Aloe · Hamamelis · Caléndula',
          title: 'Ingredientes Calmantes de Alto Desempeño',
          description: 'Cada producto combina extractos naturales seleccionados —frambuesa, jojoba, té verde, pepino y hamamelis— para disminuir el enrojecimiento y acelerar la recuperación.',
          footer: 'Disponible en tienda oficial Heaven Pro dentro de INKognito Supply',
        },
      ],
    },

    technicalHighlights: [],
  },

  // Royal Three Elements — Consumibles, cuidado y bioseguridad clínica para tatuadores (Cali, Colombia)
  'royal-three': {
    brandId: 'royal-three',
    brandName: 'Royal Three',
    logoFallback: '/marcas-marquee/royal-three.png',
    officialUrl: 'https://royalthree.co',
    officialLabel: 'Sitio Oficial Royal Three',
    eyebrow: 'BIOSEGURIDAD & CONSUMIBLES · CALI, COLOMBIA',
    title: 'Royal Three Elements',
    subtitle: 'Línea Integral de Limpieza, Bioseguridad Clínica, Diluyentes y Cuidado del Tatuaje',
    description: 'Fabricante colombiano con sede en Cali (Edenlab Colombia S.A.S.), referente nacional en bioseguridad y consumibles para estudios de tatuaje. Productos cosméticos con Notificación Sanitaria INVIMA (NSO), fórmulas veganas y soluciones clínicas desde la limpieza de superficies hasta la cicatrización.',
    accentColor: '#1e3a8a',
    badge: 'Bioseguridad & INVIMA',

    heroSlides: [
      {
        id: 'royal-aloe-ink',
        title: 'Royal Three Aloe Ink (350 g)',
        subtitle: 'Crema de Proceso con Aloe Vera, Colágeno y Pantenol',
        category: 'DURANTE LA SESIÓN · LUBRICACIÓN PRO',
        src: '/supply-assets/royal-three/royal_aloe_clean.webp',
        alt: 'Crema para tatuar Royal Three Aloe Ink 350g',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[190px] sm:max-w-[230px] md:max-w-[270px]',
        shadowWidth: 'w-[140px] sm:w-[180px] md:w-[220px]',
        badge: 'Aloe Ink',
        detail: 'Crema humectante de proceso con aloe vera, colágeno, vitaminas A/D/E y pantenol que calma el enrojecimiento y facilita el deslizamiento.',
      },
      {
        id: 'royal-cocoa-cream',
        title: 'Royal Three Cocoa Cream (200 g)',
        subtitle: 'Tattoo Butter Vegana · Vitaminas A, B, E y Pantenol',
        category: 'CUIDADO & CICATRIZACIÓN · VEGANA',
        src: '/supply-assets/royal-three/royal_cocoa_clean.webp',
        alt: 'Tattoo butter vegana Royal Three Cocoa Cream 200g',
        maxHeight: 'max-h-[240px] sm:max-h-[290px] md:max-h-[340px]',
        maxWidth: 'max-w-[280px] sm:max-w-[340px] md:max-w-[400px]',
        shadowWidth: 'w-[210px] sm:w-[260px] md:w-[310px]',
        badge: 'Cocoa Cream',
        detail: 'Mantequilla emoliente vegana diseñada para preparar, lubricar y acompañar la cicatrización manteniendo la piel nutrida y los colores vivos.',
      },
      {
        id: 'royal-k10',
        title: 'Limpiador Enzimático K-10 (500 ml)',
        subtitle: 'Enzimas Proteasas para Fluidos Orgánicos y Superficies',
        category: 'BIOSEGURIDAD CLÍNICA · DESINFECCIÓN',
        src: '/supply-assets/royal-three/royal_k10_clean.webp',
        alt: 'Limpiador enzimático K-10 Royal Three 500ml',
        maxHeight: 'max-h-[260px] sm:max-h-[320px] md:max-h-[370px]',
        maxWidth: 'max-w-[230px] sm:max-w-[280px] md:max-w-[330px]',
        shadowWidth: 'w-[170px] sm:w-[220px] md:w-[260px]',
        badge: 'Enzimático K-10',
        detail: 'Degrada eficazmente sangre, plasma, grasas y residuos de tinta en camillas, apoyabrazos, mesas auxiliares e instrumental de estudio.',
      },
      {
        id: 'royal-medusa',
        title: 'Perlas Absorbentes Medusa',
        subtitle: 'Solidificador Biodegradable de Residuos Líquidos',
        category: 'GESTIÓN DE RESIDUOS · BIOSEGURIDAD',
        src: '/supply-assets/royal-three/royal_medusa_clean.webp',
        alt: 'Solidificador biodegradable Perlas Absorbentes Medusa Royal Three',
        maxHeight: 'max-h-[270px] sm:max-h-[330px] md:max-h-[380px]',
        maxWidth: 'max-w-[160px] sm:max-w-[200px] md:max-w-[240px]',
        shadowWidth: 'w-[130px] sm:w-[170px] md:w-[210px]',
        badge: 'Medusa',
        detail: 'Polímero superabsorbente que solidifica en segundos el agua y tinta residual de los vasos para una disposición higiénica y sin derrames.',
      },
    ],

    stats: [
      { label: 'Respaldo', value: 'INVIMA', note: 'Notificación NSO' },
      { label: 'Fórmulas', value: 'Veganas', note: 'Cruelty-free' },
      { label: 'Enfoque', value: 'Integral', note: 'Higiene & Cuidado' },
      { label: 'Origen', value: 'Cali, CO', note: 'Edenlab S.A.S.' },
    ],

    systemSection: {
      eyebrow: 'Línea Royal Three Elements',
      title: 'Higiene, Cuidado y Bioseguridad de Estudio',
    },

    systemTools: [
      {
        name: 'Aloe Ink & Cocoa Cream',
        desc: 'Cremas y mantequillas veganas con aloe vera, colágeno, pantenol y vitaminas A, D y E para proceso y sanado.',
        tag: 'Cuidado',
      },
      {
        name: 'SKUM & Orange Soap',
        desc: 'Espuma limpiadora y jabón antibacterial de pH neutro para mantener la piel limpia sin resecar.',
        tag: 'Limpieza',
      },
      {
        name: 'Royal Three Mixer',
        desc: 'Diluyente universal para ajustar densidad y fluidez en sombras suaves y degradados de color.',
        tag: 'Diluyente',
      },
      {
        name: 'Bioseguridad K-10 & Medusa',
        desc: 'Limpiador enzimático para superficies y solidificador biodegradable Medusa para disposición segura de residuos líquidos.',
        tag: 'Bioseguridad',
      },
    ],

    bento: {
      featured: {
        image: '/supply-assets/royal-three/royal_bento.webp',
        imageAlt: 'Línea oficial de productos Royal Three Elements para estudios de tatuaje',
        overlayLeft: 'Notificación Sanitaria INVIMA',
        overlayRight: 'Cali, Colombia',
        eyebrow: 'ESTÁNDAR CLÍNICO COLOMBIANO',
        badge: 'INVIMA NSO',
        title: 'Todo el Protocolo de Bioseguridad en una Sola Marca',
        description: 'Desde la limpieza del puesto con K-10 y la solidificación de residuos con Medusa, hasta el deslizamiento de Aloe Ink y la cicatrización con Cocoa Cream, Royal Three respalda a los estudios colombianos con formulaciones certificadas.',
      },
      cards: [
        {
          eyebrow: 'MANEJO DE RESIDUOS',
          badge: 'Medusa + K-10',
          title: 'Cumplimiento Sanitario sin Complicaciones',
          description: 'El solidificador Medusa convierte agua y tinta residual en gel en segundos para desechar sin derrames, complementando la acción enzimática del limpiador K-10.',
          footer: 'Ideal para auditorías sanitarias de estudios',
        },
        {
          eyebrow: 'PRODUCCIÓN NACIONAL',
          badge: 'Edenlab Colombia',
          title: 'Disponibilidad Constante en Todo el País',
          description: 'Fabricación directa en Santiago de Cali con amplia red de distribución en Colombia para reponer consumibles de estudio sin demoras de importación.',
          footer: 'Disponible en la vitrina de INKognito Supply',
        },
      ],
    },

    technicalHighlights: [],
  },
}
