// Compartido entre ArtistaLandingPage.jsx (perfil público) y
// ArtistaEditarPerfilPage.jsx (vista previa en vivo, 2026-08-06) — un solo
// lugar para las 5 opciones y su color/frase, así ambas pantallas muestran
// exactamente lo mismo sin desincronizarse. Mismas 5 opciones que usa el
// select del panel (public/index.html, ART_DISPONIBILIDAD) — ese archivo
// es vanilla JS sin módulos compartidos con el ecosistema (ver CLAUDE.md),
// así que ahí se repite a mano; acá sí se puede importar.
// Reescritura de opciones (2026-09-13, Jose: "Estado de agenda") — pasó de
// 5 a 4 opciones (se fusionó "Esta semana" en "Cupos este mes"). Migración
// de valores viejos ya guardados en `artistas.disponibilidad` en
// server.js — sin eso, cualquier artista con un valor anterior quedaría
// con un estado que ya no aparece en el selector.
export const OPCIONES_DISPONIBILIDAD = ['Disponible hoy', 'Cupos este mes', 'Agenda abierta (2-3 meses)', 'Agenda cerrada']

// Color semántico por estado (2026-08-06, Jose: "si está disponible no
// debería ser verde?") — el rojo de marca es un acento, no un semáforo.
export const DISPONIBILIDAD_COLOR = {
  'Disponible hoy': '#16A34A',
  'Cupos este mes': '#CA8A04',
  'Agenda abierta (2-3 meses)': '#CA8A04',
  'Agenda cerrada': '#6B7280',
}

// Ya no hace falta re-frasear el valor crudo (2026-09-13) — los nombres
// nuevos ya se leen como una frase completa para el cliente, a diferencia
// de los viejos ("2-3 meses" solo, sin contexto).
export const DISPONIBILIDAD_TEXTO = {
  'Disponible hoy': 'Disponible hoy',
  'Cupos este mes': 'Cupos este mes',
  'Agenda abierta (2-3 meses)': 'Agenda abierta (2-3 meses)',
  'Agenda cerrada': 'Agenda cerrada',
}
