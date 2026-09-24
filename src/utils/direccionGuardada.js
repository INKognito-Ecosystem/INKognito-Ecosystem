// "Mi dirección" guardada (2026-09-23, Jose) — sin cuenta, igual que el
// resto del carrito y "Mis compras": vive en el navegador del comprador,
// una sola clave compartida por Store/Suple/Supply (mismo origen, mismo
// localStorage) — se guarda una vez desde cualquiera de los 3 carritos y
// queda disponible en los 3 checkouts. Forma canónica SIEMPRE nacional
// (departamento + municipio + dirección, igual que ya usan Suple/Supply)
// porque es la única que cubre los 3 módulos sin perder información —
// Store usa una lista de zonas más granular (ver ZONAS_FLETE en
// colombiaGeo.js), así que su prefill hace un match por nombre en vez de
// guardar dos formas distintas (ver PedidoSupplyVendorCheckout.jsx).
const KEY = 'inkognito-mi-direccion'

export function leerDireccionGuardada() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const datos = JSON.parse(raw)
    return datos && typeof datos === 'object' ? datos : null
  } catch {
    return null
  }
}

export function guardarDireccion(datos) {
  try {
    localStorage.setItem(KEY, JSON.stringify(datos))
  } catch {
    // localStorage puede fallar (ventana privada, storage bloqueado) — la
    // página sigue funcionando, el comprador solo no gana el atajo.
  }
}
