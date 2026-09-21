// Resuelve el link "Cuenta/perfil" de Supply (2026-09-17, Jose: "en el
// botón hamburguesa de supply no veo el ítem de cuenta/perfil, y que este
// también lleve al perfil de quien tiene una tienda registrada") — mismo
// criterio exacto que storeTienda.js: si el dueño ya visitó y confirmó su
// Supply en este navegador, EstudioSupplyPage.jsx guardó su token bajo la
// key `supply_edit_token_<id>` (EDIT_TOKEN_KEY_PREFIX ahí mismo); léelo
// directo y abre esa tienda ya con la gestión activa, en vez de mandarlo
// primero al editor genérico. Sin token guardado (cuenta no verificada en
// este navegador todavía), abre el formulario de correo propio de Supply
// (SupplyMiSupplyPage.jsx) — nunca la página de INK, que carga sola el
// último token de cualquier módulo y redirige al que sea.
const EDIT_TOKEN_KEY_PREFIX = 'supply_edit_token_'

export function irAMiSupply(navigate) {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith(EDIT_TOKEN_KEY_PREFIX)) continue
      const id = key.slice(EDIT_TOKEN_KEY_PREFIX.length)
      const token = localStorage.getItem(key)
      if (id && token) {
        navigate(`/supply/estudio/${id}?token=${encodeURIComponent(token)}`)
        return
      }
    }
  } catch {}
  navigate('/supply/mi-supply')
}
