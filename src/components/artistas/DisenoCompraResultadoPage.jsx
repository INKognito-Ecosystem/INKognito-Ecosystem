import { Link, useSearchParams } from 'react-router-dom'
import { Mail, XCircle, Clock } from 'lucide-react'
import NavbarArtistas from './NavbarArtistas'

const ACCENT = '#B3202F'

// A donde vuelve el comprador tras pagar en Mercado Pago (back_urls de
// POST /api/disenos-comprar). La fuente de verdad real es el webhook
// (GET /api/disenos-webhook-mp en el panel), no este redirect — por eso
// el mensaje acá es siempre "revisa tu correo", nunca "tu diseño ya está
// activo", aunque el estado diga "success" (Mercado Pago puede tardar
// unos segundos en confirmar el pago después del redirect).
export function meta() {
  return [{ title: 'Tu compra | Tattoo Artist Colombia' }]
}

export default function DisenoCompraResultadoPage() {
  const [searchParams] = useSearchParams()
  const estado = searchParams.get('estado')

  const esFallo = estado === 'failure'

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarArtistas />
      <div className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-sm">
          {esFallo ? (
            <>
              <XCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <h1 className="text-2xl font-black uppercase mb-3">Pago no aprobado</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Mercado Pago no pudo procesar el pago — no se te cobró nada. Puedes volver al perfil del artista e intentarlo de nuevo.
              </p>
            </>
          ) : (
            <>
              {estado === 'pending' ? (
                <Clock size={48} className="mx-auto mb-4" style={{ color: ACCENT }} />
              ) : (
                <Mail size={48} className="mx-auto mb-4" style={{ color: ACCENT }} />
              )}
              <h1 className="text-2xl font-black uppercase mb-3">¡Casi listo!</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Estamos confirmando tu pago con Mercado Pago — en cuanto quede aprobado (normalmente son segundos), te llega tu diseño por correo, sin marca de agua.
              </p>
            </>
          )}
          <Link to="/tattoo-artist-colombia" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-gray-600">
            ← Volver al buscador
          </Link>
        </div>
      </div>
      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:justify-between items-center text-gray-400 text-[12px] gap-3">
          <p className="text-[9.5px] sm:text-[12px] whitespace-nowrap">© {new Date().getFullYear()} Tattoo Artist Colombia — Todos los derechos reservados.</p>
          <span className="text-gray-300">Desarrollado por INKognito</span>
        </div>
      </footer>
    </div>
  )
}
