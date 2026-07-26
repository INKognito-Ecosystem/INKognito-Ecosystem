import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    reactRouter(),
    tailwindcss()
  ],
  resolve: {
    caseSensitive: false
  },
  // Sin esto, el build de servidor deja `react-helmet-async` como import externo
  // de Node — en el runtime serverless de Vercel (Node 24, ESM estricto) el
  // detector automático de exports de CJS no reconoce `Helmet` como named
  // export y revienta con "does not provide an export named 'Helmet'". Forzar
  // que Vite lo empaquete (en vez de dejarlo externo) evita ese problema porque
  // Rollup lo convierte a ESM real en tiempo de build, sin depender del
  // intérprete de Node en producción.
  // Con `future.v8_viteEnvironmentApi` activo (react-router.config.js), el SSR
  // vive bajo `environments.ssr`, no bajo el `ssr` de nivel raíz de Vite <8
  // (ese quedó ignorado silenciosamente — confirmado con un build de prueba).
  environments: {
    ssr: {
      resolve: {
        noExternal: ['react-helmet-async'],
      },
    },
  },
})
