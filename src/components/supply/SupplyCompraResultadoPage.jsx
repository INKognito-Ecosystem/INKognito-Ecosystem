import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Mail, XCircle, Clock } from 'lucide-react'
import NavbarCategory from './NavbarCategory'
import FooterSupply from './FooterSupply'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import { guardarCompra } from '../../lib/misCompras'

export function meta() {
  return [{ title: 'Tu compra | INKognito Supply' }]
}

export default function SupplyCompraResultadoPage() {
  const [searchParams] = useSearchParams()
  const estado = searchParams.get('estado')
  const compraId = searchParams.get('compra')
  const token = searchParams.get('token')
  const esFallo = estado === 'failure'
  const { clearCart } = useSupplyCart()

  useEffect(() => {
    if (!esFallo) clearCart()
    if (compraId && token) guardarCompra({ compraId, token, module: 'supply' })
  }, [esFallo, compraId, token])

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">
      <NavbarCategory pageName="Tu compra" light />
      <div className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
        <div className="text-center max-w-sm">
          {esFallo ? (
            <>
              <XCircle size={48} className="mx-auto mb-4 text-red-500" />
              <h1 className="text-2xl font-black uppercase mb-3 text-zinc-900">Pago no aprobado</h1>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Mercado Pago no pudo procesar el pago — no se te cobró nada. Puedes volver a la tienda e intentarlo de nuevo.
              </p>
            </>
          ) : (
            <>
              {estado === 'pending' ? (
                <Clock size={48} className="mx-auto mb-4 text-amber-500" />
              ) : (
                <Mail size={48} className="mx-auto mb-4 text-emerald-600" />
              )}
              <h1 className="text-2xl font-black uppercase mb-3 text-zinc-900">¡Casi listo!</h1>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Estamos confirmando tu pago con Mercado Pago — en cuanto quede aprobado (normalmente son segundos), el proveedor se pondrá en contacto contigo para coordinar la entrega. Revisa tu correo para el comprobante.
              </p>
            </>
          )}
          <Link to="/supply" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:text-black transition-colors text-zinc-500">
            ← Volver a Supply
          </Link>
        </div>
      </div>
      <FooterSupply light />
    </div>
  )
}
