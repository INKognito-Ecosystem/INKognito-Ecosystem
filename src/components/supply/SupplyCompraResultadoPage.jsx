import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Mail, XCircle, Clock } from 'lucide-react'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import { useSupplyCart } from '../../contexts/SupplyCartContext'

// A donde vuelve el comprador tras pagar en Mercado Pago (back_urls de
// POST /api/estudios-supply-comprar). La fuente de verdad real es el
// webhook (POST /api/estudios-supply-webhook-mp en el panel), no este
// redirect — mismo criterio que ReservaResultadoPage.jsx/
// DisenoCompraResultadoPage.jsx.
export function meta() {
  return [{ title: 'Tu compra | INKognito Supply' }]
}

export default function SupplyCompraResultadoPage() {
  const [searchParams] = useSearchParams()
  const estado = searchParams.get('estado')
  const esFallo = estado === 'failure'
  const { clearCart } = useSupplyCart()

  // Vacía el carrito en cuanto el comprador vuelve de Mercado Pago con
  // éxito/pendiente — optimista (la aprobación real la confirma el
  // webhook), mismo criterio que ya usa el checkout normal de Supply
  // (limpia el carrito justo después de enviar el pedido, sin esperar
  // confirmación del proveedor).
  useEffect(() => {
    if (!esFallo) clearCart()
  }, [esFallo])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <NavbarCategory pageName="Tu compra" />
      <div className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-sm">
          {esFallo ? (
            <>
              <XCircle size={48} className="mx-auto mb-4 text-zinc-600" />
              <h1 className="text-2xl font-black uppercase mb-3">Pago no aprobado</h1>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Mercado Pago no pudo procesar el pago — no se te cobró nada. Puedes volver a la tienda e intentarlo de nuevo.
              </p>
            </>
          ) : (
            <>
              {estado === 'pending' ? (
                <Clock size={48} className="mx-auto mb-4 text-blue-500" />
              ) : (
                <Mail size={48} className="mx-auto mb-4 text-blue-500" />
              )}
              <h1 className="text-2xl font-black uppercase mb-3">¡Casi listo!</h1>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Estamos confirmando tu pago con Mercado Pago — en cuanto quede aprobado (normalmente son segundos), el proveedor se pondrá en contacto contigo para coordinar la entrega. Revisa tu correo para el comprobante.
              </p>
            </>
          )}
          <Link to="/supply" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-zinc-400">
            ← Volver a Supply
          </Link>
        </div>
      </div>
      <FooterSupply />
    </div>
  )
}
