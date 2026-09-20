// Resuelve el link "Mi Suple" de Mi cuenta/perfil (Suple multitenant,
// 2026-09-20) — calco exacto de storeTienda.js: si alguien tiene un
// catálogo registrado, este botón debe abrir su catálogo en Suple, con su
// botón hamburguesa para gestionar, sin pasarlo por el editor genérico.
//
// EstudioSuplePage.jsx guarda el token de edición de CADA vendedor que su
// dueño visitó bajo la key `suple_edit_token_<id>` (EDIT_TOKEN_KEY_PREFIX
// ahí mismo) apenas confirma que es el dueño — mismo prefijo acá, léelo
// directo si existe. Si no hay ningún vendedor con token guardado (cuenta
// no verificada en este navegador todavía), abre el formulario de correo
// propio de Suple (SupleMiCatalogoPage.jsx) — nunca la página de INK, que
// carga sola el último token de cualquier módulo y redirige al que sea.
const EDIT_TOKEN_KEY_PREFIX = 'suple_edit_token_'

export function irAMiSuple(navigate) {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith(EDIT_TOKEN_KEY_PREFIX)) continue
      const id = key.slice(EDIT_TOKEN_KEY_PREFIX.length)
      const token = localStorage.getItem(key)
      if (id && token) {
        navigate(`/suplementos/estudio/${id}?token=${encodeURIComponent(token)}`)
        return
      }
    }
  } catch {}
  navigate('/suplementos/mi-catalogo')
}
