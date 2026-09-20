import { GraduationCap, PlayCircle, FileText, FlaskConical, Wrench, BookOpen } from 'lucide-react'

// Secciones de Gym System — antes vivían como `servicios` dentro de
// GymPage.jsx; se extrajeron (2026-09-20) porque ahora las usan el listón y
// las tarjetas del home, la página /gym/categorias y el menú del tab bar
// inferior (GymMobileNav.jsx). Mismo orden de siempre.
// "Planos PDF" no es una página propia sino la sección #planos del home
// (`scrollTo`); para navegar a ella desde otra página se usa gymSeccionHref.
export const GYM_SECCIONES = [
  {
    icon: Wrench,
    titulo: 'Máquinas',
    texto: 'Fabricadas con acero calibre grueso y soldadura profesional, a tu medida. Hechas en Chigorodó, Urabá, con acabados listos para uso intenso diario.',
    link: '/gym/maquinas-pedido',
  },
  {
    icon: FileText,
    titulo: 'Planos PDF',
    texto: 'Planos técnicos con medidas exactas y lista de materiales. Descárgalos y fabrica tú mismo tus máquinas, sin depender de nadie más.',
    scrollTo: 'planos',
  },
  {
    icon: FlaskConical,
    titulo: 'Suplementos',
    texto: 'Proteína, creatina y pre-entreno de marcas confiables, con stock real y despacho rápido para complementar tu entrenamiento.',
    // Suplementos ahora es su propio módulo (INKognito Suple) — esta card
    // sigue viviendo en Gym como estaba, solo cambia a dónde lleva
    // (2026-08-02).
    link: '/suplementos',
  },
  {
    icon: PlayCircle,
    titulo: 'Tutoriales',
    texto: 'Videos paso a paso para construir tus propias máquinas caseras, con las mismas técnicas que uso yo. Ideal si prefieres aprender haciendo.',
    link: '/gym/tutoriales',
  },
  {
    icon: GraduationCap,
    titulo: 'Cursos',
    texto: 'Entrenamiento y nutrición en español, grabados por quienes ya viven de esto. Aprende a tu ritmo, sin salir de casa.',
    link: '/gym/cursos',
  },
  {
    icon: BookOpen,
    titulo: 'Recursos',
    texto: 'Ebooks y guías gratuitas para empezar a entrenar sin gastar en gimnasio ni equipo. Contenido real para quien arranca desde cero.',
    link: '/gym/recursos',
  },
]

// Ruta navegable de una sección desde cualquier página (Planos PDF cae a
// /gym#planos — el ScrollToHash global de root.jsx hace el scroll).
export const gymSeccionHref = (s) => s.link || `/gym#${s.scrollTo}`
