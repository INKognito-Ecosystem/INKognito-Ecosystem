// Recursos gratuitos oficiales de INKognito Supply (alojados directamente en
// /public/recursos/*.pdf) y guías/herramientas externas de autores e
// instituciones verificadas (todas las URLs verificadas HTTP 200).

export const RECURSOS_PROPIOS_PDF = [
  {
    id: 'pdf-consentimiento-colombia',
    code: 'CI-TAT-01',
    accent: 'slate',
    title: 'Consentimiento Informado Profesional para Tatuaje (Colombia)',
    author: 'INKognito Supply',
    format: '2 págs. · Tiro y retiro',
    badge: 'Formato legal',
    highlights: ['White-Label (espacio para tu logo)', 'Ley 1581/2012 · Datos Sensibles', 'Tamizaje 14 ítems + Lotes INVIMA'],
    description:
      'Formato imprimible listo para cabina alineado con Ley 9/1979, Acuerdo 103/2003 y Ley 1581/2012. Incluye riesgos, anexo de menores, huella y acuse de aftercare.',
    href: '/recursos/consentimiento-informado-tatuaje-colombia.pdf',
    fileName: 'consentimiento-informado-tatuaje-colombia.pdf',
  },
  {
    id: 'pdf-checklist-bioseguridad',
    code: 'BIO-COL-02',
    accent: 'emerald',
    title: 'Manual y Checklist de Bioseguridad para Estudios (Colombia)',
    author: 'INKognito Supply',
    format: '2 págs. · Manual + Checklist',
    badge: 'Res. 591/2024 PGIRASA',
    highlights: ['Matriz PGIRASA (Rojo/Blanco/Negro)', 'Desinfección 500–5000 ppm', 'Checklist Pre / Durante / Post sesión'],
    description:
      'Manual operativo y lista auditable por sesión actualizada a la Resolución 591 de 2024 (PGIRASA): infraestructura, vacunación, EPP y control sanitario.',
    href: '/recursos/checklist-bioseguridad-estudio-colombia.pdf',
    fileName: 'checklist-bioseguridad-estudio-colombia.pdf',
  },
  {
    id: 'pdf-tabla-agujas-voltajes',
    code: 'TEC-TAT-03',
    accent: 'blue',
    title: 'Manual Técnico de Agujas, Cartuchos y Voltajes',
    author: 'INKognito Supply',
    format: '2 págs. · Manual de cabina',
    badge: 'Referencia técnica',
    highlights: ['Profundidad dermis (1.0–2.0 mm)', 'Calibres #06–#12 + Tapers', 'Stroke × Voltaje + Diagnóstico'],
    description:
      'Referencia técnica de cabina: histología aplicada, decodificación 1207RL-LT, membrana de seguridad, voltajes en rotativas/bobinas y solución de errores.',
    href: '/recursos/tabla-agujas-cartuchos-voltajes-inkognito.pdf',
    fileName: 'tabla-agujas-cartuchos-voltajes-inkognito.pdf',
  },
]

export const RECURSOS_EXTERNOS_VERIFICADOS = [
  {
    id: 'ext-acuerdo-103-bogota',
    monogram: 'AB',
    accent: 'slate',
    title: 'Normativa Sanitaria y Bioseguridad para Estudios de Tatuajes (Acuerdo 103)',
    author: 'Alcaldía Mayor de Bogotá',
    category: 'Normativa Colombia',
    highlights: ['Condiciones locativas y cabina', 'Inscripción de tatuadores', 'Bioseguridad y menores de edad'],
    description:
      'Texto oficial del Acuerdo 103 de 2003: referente nacional en Colombia sobre requisitos sanitarios, manejo de residuos y consentimiento.',
    url: 'https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=10838',
  },
  {
    id: 'ext-cheyenne-guide',
    monogram: 'CH',
    accent: 'blue',
    title: 'Guía Técnica Oficial de Tatuaje, Máquinas y Cartuchos',
    author: 'Cheyenne Tattoo Equipment',
    category: 'Guía técnica',
    highlights: ['Higiene y cartuchos con membrana', 'Cuidado de máquinas rotativas', 'Buenas prácticas de cabina'],
    description:
      'Manual educativo oficial del fabricante alemán Cheyenne sobre higiene, selección de cartuchos de seguridad y mantenimiento de equipo.',
    url: 'https://www.cheyennetattoo.com/en/tattoo-guide',
  },
  {
    id: 'ext-bishop-blog',
    monogram: 'BR',
    accent: 'emerald',
    title: 'Artículos Técnicos sobre Voltaje, Stroke y Cartuchos',
    author: 'Bishop Rotary',
    category: 'Técnica & equipo',
    highlights: ['Calibración de voltaje real', 'Elección de stroke por estilo', 'Técnicas de línea y sombreado'],
    description:
      'Biblioteca oficial de Bishop Rotary con guías prácticas sobre calibración de voltaje, stroke y desempeño en línea, sombra y color.',
    url: 'https://www.bishoprotary.com/blogs/news',
  },
  {
    id: 'ext-procreate-folio',
    monogram: 'PF',
    accent: 'slate',
    title: 'Pinceles Gratuitos de Tatuaje para Procreate (Comunidad Oficial)',
    author: 'Procreate Folio',
    category: 'Diseño & Stencil',
    highlights: ['Packs de fine line y stippling', 'Pinceles de whip-shading y flash', 'Descarga libre para iPad'],
    description:
      'Repositorio oficial de Procreate donde artistas verificados comparten packs gratuitos de pinceles de tatuaje listos para diseñar stencils.',
    url: 'https://folio.procreate.com/discussions/10',
  },
]
