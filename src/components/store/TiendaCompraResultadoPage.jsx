import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Mail, XCircle, Clock } from 'lucide-react'
import NavbarCategoryStore from './NavbarCategoryStore'
import FooterStore from './FooterStore'
import { useStoreCart } from '../../contexts/StoreCartContext'

// A donde vuelve el comprador tras pagar en Mercado Pago (back_urls de
// POST /api/estudios-tienda-comprar). Clon de SupplyCompraResultadoPage.jsx
// — la fuente de verdad real es el webhook (POST /api/estudios-tienda-webhook-mp
// en el panel), no este redirect.
export function meta() {
  return [{ title: 'Tu compra | INKognito Store' }]
}

export default function TiendaCompraResultadoPage() {
  const [searchParams] = useSearchParams()
  const estado = searchParams.get('estado')
  const esFallo = estado === 'failure'
  const { clearCart } = useStoreCart()

  useEffect(() => {
    if (!esFallo) clearCart()
  }, [esFallo])

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavbarCategoryStore pageName="Tu compra" />
      <div className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-sm">
          {esFallo ? (
            <>
              <XCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <h1 className="text-2xl font-black uppercase mb-3">Pago no aprobado</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Mercado Pago no pudo procesar el pago — no se te cobró nada. Puedes volver a la tienda e intentarlo de nuevo.
              </p>
            </>
          ) : (
            <>
              {estado === 'pending' ? (
                <Clock size={48} className="mx-auto mb-4 text-[#C9A84C]" />
              ) : (
                <Mail size={48} className="mx-auto mb-4 text-[#C9A84C]" />
              )}
              <h1 className="text-2xl font-black uppercase mb-3">¡Casi listo!</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Estamos confirmando tu pago con Mercado Pago — en cuanto quede aprobado (normalmente son segundos), la tienda se pondrá en contacto contigo para coordinar la entrega. Revisa tu correo para el comprobante.
              </p>
            </>
          )}
          <Link to="/store" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-gray-500">
            ← Volver a Store
          </Link>
        </div>
      </div>
      <FooterStore />
    </div>
  )
}
