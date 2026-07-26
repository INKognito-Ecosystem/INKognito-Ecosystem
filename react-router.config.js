import { vercelPreset } from '@vercel/react-router/vite'

// El preset de Vercel solo genera su formato de build (.vercel/output) bajo
// `vercel build`, no bajo `vite build` plano — se desactivó temporalmente
// para poder previsualizar el build estándar en local con un servidor Node
// normal mientras se verificaba el piloto (con un script descartable, no
// commiteado). Ya reactivado para el deploy real.
const useVercelPreset = true

/** @type {import('@react-router/dev/config').Config} */
export default {
  ssr: true,
  appDirectory: 'src',
  presets: useVercelPreset ? [vercelPreset()] : [],
  // Descubrimiento de rutas "lazy" hace fetch a /__manifest tras hidratar —
  // con pocas rutas no aporta nada y estaba de por medio mientras se
  // depuraba un mismatch de hidratación (2026-07-26). Revisar si vale la
  // pena reactivarlo cuando ya estén las ~55 rutas del sitio completo.
  routeDiscovery: { mode: 'initial' },
  future: { v8_viteEnvironmentApi: true },
}
