// Compartido entre ArtistaLandingPage.jsx (perfil público) y
// ArtistaEditarPerfilPage.jsx (vista previa en vivo, 2026-08-06) — un solo
// lugar para las 5 opciones y su color/frase, así ambas pantallas muestran
// exactamente lo mismo sin desincronizarse. Mismas 5 opciones que usa el
// select del panel (public/index.html, ART_DISPONIBILIDAD) — ese archivo
// es vanilla JS sin módulos compartidos con el ecosistema (ver CLAUDE.md),
// así que ahí se repite a mano; acá sí se puede importar.
export const OPCIONES_DISPONIBILIDAD = ['Disponible ahora', 'Esta semana', 'Este mes', '2-3 meses', 'Agenda llena']

// Color semántico por estado (2026-08-06, Jose: "si está disponible no
// debería ser verde?") — el rojo de marca es un acento, no un semáforo.
export const DISPONIBILIDAD_COLOR = {
  'Disponible ahora': '#16A34A',
  'Esta semana': '#CA8A04',
  'Este mes': '#CA8A04',
  '2-3 meses': '#CA8A04',
  'Agenda llena': '#6B7280',
}

// Frase con contexto en vez del valor crudo del select (2026-08-06, Jose:
// "un cliente no va a tener contexto de para qué sería eso").
export const DISPONIBILIDAD_TEXTO = {
  'Disponible ahora': 'Disponible ahora',
  'Esta semana': 'Cupo esta semana',
  'Este mes': 'Cupo este mes',
  '2-3 meses': 'Próxima cita en 2-3 meses',
  'Agenda llena': 'Agenda llena por ahora',
}
