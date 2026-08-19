// Calendario real (fase 1 de agenda, 2026-08-19) — utilidades de fecha
// hechas a mano, sin librería (el mes tiene aritmética simple, no amerita
// una dependencia nueva en el frontend). Compartidas entre el calendario
// del cliente (ArtistaLandingPage.jsx) y el calendario de bloqueos del
// artista (ArtistaEditarPerfilPage.jsx) — misma aritmética de mes, cada
// uno con su propia interacción de click.
export const MESES_CALENDARIO = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export const _pad2 = (n) => String(n).padStart(2, '0')

export const fechaISO = (d) => `${d.getFullYear()}-${_pad2(d.getMonth() + 1)}-${_pad2(d.getDate())}`

// Grid de 7 columnas empezando en lunes — devuelve null en las celdas
// vacías antes del día 1 / después del último día del mes.
export const celdasDelMes = (year, month) => {
  const primerDia = new Date(year, month, 1)
  const totalDias = new Date(year, month + 1, 0).getDate()
  const offset = (primerDia.getDay() + 6) % 7 // Date.getDay(): 0=domingo → offset para que lunes quede primero
  const celdas = Array(offset).fill(null)
  for (let dia = 1; dia <= totalDias; dia++) celdas.push({ dia, iso: fechaISO(new Date(year, month, dia)) })
  return celdas
}
