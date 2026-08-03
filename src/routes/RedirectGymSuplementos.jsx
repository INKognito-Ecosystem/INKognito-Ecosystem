import { redirect } from 'react-router'

// /gym/suplementos vivía como página de Gym antes de que Suplementos se
// independizara como su propio módulo (2026-08-02) — este redirect
// preserva los links/SEO que ya apuntaban a la ruta vieja.
export async function loader() {
  return redirect('/suplementos')
}

export default function RedirectGymSuplementos() {
  return null
}
