// "Mis compras" — rastreo de compra sin cuenta (2026-09-22, Jose: avisarle
// al comprador el estado de su envío directo en el sitio, aunque nunca
// inicia sesión en ningún módulo). Mismo espíritu que storeTienda.js/
// supleTienda.js (token guardado en localStorage, sin login), pero del lado
// del COMPRADOR en vez del dueño: Mercado Pago ya redirige de vuelta con
// `compra`+`token` en la URL (ver back_urls de los 3 estudios-*-comprar en
// el panel) — TiendaCompraResultadoPage.jsx/SupleCompraResultadoPage.jsx/
// SupplyCompraResultadoPage.jsx llaman `guardarCompra()` ahí mismo, y
// MisComprasPanel.jsx lee la lista con `leerMisCompras()`.
//
// Una sola clave compartida entre los 3 módulos (no una por módulo) — el
// ícono "Mis compras" del navbar muestra TODAS las compras del comprador en
// este navegador, sin importar en qué tienda compró.
const MIS_COMPRAS_KEY = 'inkognito-mis-compras'
const MIS_COMPRAS_MAX = 20

export function leerMisCompras() {
  try {
    const raw = localStorage.getItem(MIS_COMPRAS_KEY)
    const lista = raw ? JSON.parse(raw) : []
    return Array.isArray(lista) ? lista : []
  } catch {
    return []
  }
}

// { compraId, token, module: 'store'|'suplementos'|'supply', fecha }
export function guardarCompra({ compraId, token, module }) {
  if (!compraId || !token || !module) return
  try {
    const lista = leerMisCompras().filter(c => !(c.compraId === compraId && c.module === module))
    lista.unshift({ compraId, token, module, fecha: Date.now() })
    localStorage.setItem(MIS_COMPRAS_KEY, JSON.stringify(lista.slice(0, MIS_COMPRAS_MAX)))
  } catch {}
}
