import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Mail, XCircle, Clock } from 'lucide-react'
import NavbarSuple from './NavbarSuple'
import FooterSuple from './FooterSuple'
import { useSupleCart } from '../../contexts/SupleCartContext'

// A donde vuelve el comprador tras pagar en Mercado Pago (back_urls de
// POST /api/estudios-suple-comprar). Clon de TiendaCompraResultadoPage.jsx
// — la fuente de verdad real es el webhook (POST /api/estudios-suple-webhook-mp
// en el panel), no este redirect.
export function meta() {
  return [{ title: 'Tu compra | INKognito Suple' }]
}

export default function SupleCompraResultadoPage() {
  const [searchParams] = useSearchParams()
  const estado = searchParams.get('estado')
  const esFallo = estado === 'failure'
  const { clearCart } = useSupleCart()

  useEffect(() => {
    if (!esFallo) clearCart()
  }, [esFallo])

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarSuple pageName="Tu compra" />
      <div className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-sm">
          {esFallo ? (
            <>
              <XCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <h1 className="text-2xl font-black uppercase mb-3">Pago no aprobado</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Mercado Pago no pudo procesar el pago — no se te cobró nada. Puedes volver al catálogo e intentarlo de nuevo.
              </p>
            </>
          ) : (
            <>
              {estado === 'pending' ? (
                <Clock size={48} className="mx-auto mb-4 text-zinc-700" />
              ) : (
                <Mail size={48} className="mx-auto mb-4 text-zinc-700" />
              )}
              <h1 className="text-2xl font-black uppercase mb-3">¡Casi listo!</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Estamos confirmando tu pago con Mercado Pago — en cuanto quede aprobado (normalmente son segundos), el vendedor se pondrá en contacto contigo para coordinar la entrega. Revisa tu correo para el comprobante.
              </p>
            </>
          )}
          <Link to="/suplementos" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-gray-500">
            ← Volver a Suple
          </Link>
        </div>
      </div>
      <FooterSuple />
    </div>
  )
}
