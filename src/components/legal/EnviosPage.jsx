import LegalPage from './LegalPage'

const TITLE = 'Envíos, Cambios y Devoluciones'
const DESCRIPTION = 'Política de envíos, cambios y devoluciones de INKognito Supply, Store, Suple y Gym: cómo se compra, métodos de pago, envío, seguimiento y derecho de retracto.'

export function meta() {
  return [
    { title: `${TITLE} | INKognito` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/envios-cambios-devoluciones` },
  ]
}

export default function EnviosPage() {
  return (
    <LegalPage title={TITLE} updated="6 de octubre de 2026">
      <div>
        <p>
          Aplica a los productos físicos de Supply, Store, Suple y Gym. No aplica al servicio de tatuaje, que
          se rige por acuerdo directo con el artista.
        </p>
      </div>

      <div>
        <h2>1. Cómo se compra</h2>
        <ul>
          <li><strong>Productos de un proveedor (Store, Suple, Supply):</strong> agregas productos al carrito, eliges el municipio de entrega y pagas en el sitio con Mercado Pago. El carrito acepta productos de un solo proveedor a la vez.</li>
          <li><strong>Pedidos directos de INKognito:</strong> se confirman por WhatsApp con nuestro equipo.</li>
        </ul>
      </div>

      <div>
        <h2>2. Métodos de pago</h2>
        <ul>
          <li><strong>Productos de un proveedor:</strong> tarjeta de crédito o débito, PSE y efectivo en puntos autorizados, según lo que ofrezca Mercado Pago en tu compra.</li>
          <li><strong>Pedidos directos de INKognito:</strong> Nequi (con comprobante verificado antes de despachar) o contraentrega en las rutas que indiquemos. Las máquinas de Gym bajo pedido pueden requerir un anticipo.</li>
        </ul>
      </div>

      <div>
        <h2>3. Envío</h2>
        <ul>
          <li><strong>Ruta del Golfo (Urabá):</strong> cuando el proveedor tiene cobertura en tu zona, el checkout muestra antes de pagar el envío según el municipio de destino y la tabla vigente.</li>
          <li><strong>Política de envío del proveedor:</strong> cada proveedor define si asume el envío, si lo ofrece gratis desde un monto, o si lo paga el comprador. Esa política se muestra antes de pagar.</li>
          <li><strong>Cuando el envío lo paga el comprador:</strong> si el checkout muestra un monto, se paga aparte al recibir el pedido. Si no muestra monto, el proveedor coordina el envío contigo directamente por WhatsApp.</li>
          <li><strong>Supply:</strong> el proveedor coordina la entrega contigo directamente por WhatsApp.</li>
        </ul>
      </div>

      <div>
        <h2>4. Seguimiento del pedido</h2>
        <p>
          Al pagar, recibes un enlace de seguimiento y tu compra queda en "Mis compras" del navegador donde
          pagaste.
        </p>
        <ul>
          <li><strong>Store y Suple:</strong> Pedido realizado → Pago aprobado → Preparando envío → En camino → Entregado. La transportadora registra cada paso. Cuando recoge o entrega tu pedido, te podemos avisar por WhatsApp.</li>
          <li><strong>Supply:</strong> Pedido realizado → Pago aprobado → Recibido. El paso final lo confirmas tú con el botón "Ya recibí mi pedido", porque la entrega se coordina directamente con el proveedor.</li>
        </ul>
      </div>

      <div>
        <h2>5. Derecho de retracto (Ley 1480 de 2011)</h2>
        <p>
          Si compraste a distancia (en el sitio o por WhatsApp), tienes derecho a retractarte dentro de los{' '}
          <strong>5 días hábiles siguientes</strong> a la entrega, siempre que:
        </p>
        <ul>
          <li>El producto esté sin usar, en su empaque original, con etiquetas y accesorios completos.</li>
          <li>No aplique alguna de las excepciones de la sección 6.</li>
        </ul>
        <p>
          El retracto lo atiende el vendedor del producto; si el producto es de INKognito, lo atiende
          INKognito. Para ejercerlo, escribe por WhatsApp dentro del plazo indicando el número de pedido y el
          motivo.
        </p>
      </div>

      <div>
        <h2>6. Excepciones al derecho de retracto</h2>
        <p>Por razones de higiene y seguridad, no aceptamos devolución de:</p>
        <ul>
          <li>Agujas, cartuchos y otros insumos de tatuaje que hayan salido de su empaque sellado.</li>
          <li>Productos de higiene o de uso personal que hayan sido desprecintados.</li>
          <li>Productos personalizados o hechos a pedido.</li>
        </ul>
      </div>

      <div>
        <h2>7. Cambios por defecto de fábrica</h2>
        <p>
          Si el producto llega defectuoso o distinto a lo solicitado, se cambia sin costo adicional. Contacta al
          vendedor por WhatsApp con fotos del producto y del empaque dentro de los 5 días siguientes a la
          entrega.
        </p>
      </div>

      <div>
        <h2>8. Costos de flete en devoluciones y cambios</h2>
        <ul>
          <li>Si el cambio es por error del vendedor o producto defectuoso, el flete de retorno corre por cuenta del vendedor.</li>
          <li>Si es un retracto voluntario del comprador (producto en buen estado, sin defecto), el flete de retorno corre por cuenta del comprador.</li>
        </ul>
      </div>

      <div>
        <h2>9. Contacto</h2>
        <p>
          Cualquier solicitud se gestiona por WhatsApp con el vendedor, cuyo número aparece en el seguimiento de
          tu pedido. Si el producto es de INKognito, la gestiona nuestro equipo en inkognitoecosystem@gmail.com
          o por WhatsApp.
        </p>
      </div>
    </LegalPage>
  )
}
