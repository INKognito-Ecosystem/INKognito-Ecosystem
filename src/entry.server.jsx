// Reexporta el handler de streaming SSR provisto por @vercel/react-router —
// ya incluye el chequeo isbot (esperar contenido completo para bots/crawlers
// en vez de solo el shell) y el manejo de skew protection de Vercel. No hace
// falta reescribirlo a mano.
export { handleRequest as default, streamTimeout } from '@vercel/react-router/entry.server'
