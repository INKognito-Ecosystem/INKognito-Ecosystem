// Resuelve el link "Tienda" de Mi cuenta/perfil (2026-09-16, Jose: "si
// alguien tiene registrada su tienda, cuando le dé en este botón, lo que
// debe abrir es su tienda en Store, con su botón hamburguesa para
// gestionar... eso sí, si tengo ya una cuenta activa") — antes apuntaba
// siempre a /tattoo-artist-colombia/estudio/mi-perfil (el editor de
// perfil genérico de INK, pensado para estudios de tatuaje), que para una
// tienda de Store solo llegaba a la pantalla de "te enviamos un link por
// correo" en vez de abrir su tienda directo.
//
// EstudioTiendaPage.jsx guarda el token de edición de CADA tienda que su
// dueño visitó bajo la key `store_edit_token_<id>` (EDIT_TOKEN_KEY_PREFIX
// ahí mismo) apenas confirma que es el dueño — mismo prefijo acá, léelo
// directo si existe. Si no hay ninguna tienda con token guardado (cuenta
// no verificada en este navegador todavía), abre el formulario de correo
// propio de Store (StoreMiTiendaPage.jsx) — nunca la página de INK, que
// carga sola el último token de cualquier módulo y redirige al que sea.
const EDIT_TOKEN_KEY_PREFIX = 'store_edit_token_'

export function irAMiTienda(navigate) {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith(EDIT_TOKEN_KEY_PREFIX)) continue
      const id = key.slice(EDIT_TOKEN_KEY_PREFIX.length)
      const token = localStorage.getItem(key)
      if (id && token) {
        navigate(`/store/estudio/${id}?token=${encodeURIComponent(token)}`)
        return
      }
    }
  } catch {}
  navigate('/store/mi-tienda')
}
