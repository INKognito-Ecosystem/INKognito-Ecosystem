import LegalPage from './LegalPage'

const TITLE = 'Envíos, Cambios y Devoluciones'
const UPDATED = '23 de noviembre de 2026'
const DESCRIPTION =
  'Política de envíos, cambios, garantías, derecho de retracto (Ley 2439 de 2024) y reversión del pago (Decreto 587 de 2016) para Supply, Store, Suple, Gym y Ruta del Golfo.'

export function meta() {
  return [
    { title: `${TITLE} | INKognito Ecosystem` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/envios-cambios-devoluciones` },
  ]
}

export default function EnviosPage() {
  return (
    <LegalPage title={TITLE} updated={UPDATED}>
      <div>
        <p>
          Esta política aplica a los productos físicos comercializados en <strong>Supply</strong>,{' '}
          <strong>Store</strong>, <strong>Suple</strong> y <strong>Gym</strong>, así como a los despachos
          coordinados a través de la red <strong>Ruta del Golfo</strong>. Los servicios de tatuaje y diseños digitales
          de <strong>INK</strong> se rigen por los términos propios de Tattoo Artist Colombia.
        </p>
      </div>

      <div>
        <h2>1. Cómo se Compra y Métodos de Pago</h2>
        <ul>
          <li>
            <strong>Productos de proveedores y tiendas aliadas (Supply, Store, Suple):</strong> agregas productos al
            carrito (un proveedor por compra), eliges tu municipio de entrega y pagas dentro del sitio con{' '}
            <strong>Mercado Pago</strong> (tarjeta de crédito/débito, PSE o medios habilitados).
          </li>
          <li>
            <strong>Pedidos directos de INKognito (incluyendo Gym):</strong> se confirman por WhatsApp y se pagan por{' '}
            <strong>Nequi</strong> (con comprobante verificado antes de despachar) o contraentrega en rutas
            habilitadas. Las máquinas de Gym fabricadas a pedido pueden requerir un anticipo acordado previamente.
          </li>
        </ul>
      </div>

      <div>
        <h2>2. Envío y Red Logística Ruta del Golfo</h2>
        <ul>
          <li>
            <strong>Ruta del Golfo (transportadoras multitenant):</strong> cuando la tienda o proveedor tiene
            cobertura en tu zona, el checkout muestra antes de pagar el costo de envío según tu municipio y la tabla
            de fletes vigente.
          </li>
          <li>
            <strong>Política de envío del vendedor:</strong> cada proveedor o tienda define si asume el envío, si es
            gratis desde un monto mínimo o si corre por cuenta del comprador (siempre visible antes de pagar).
          </li>
          <li>
            <strong>Supply y envíos nacionales:</strong> cuando el despacho es fuera de ruta local o en compras de
            Supply, el proveedor coordina la transportadora y guía contigo por WhatsApp.
          </li>
          <li>
            <strong>Plazo máximo legal (Art. 50, Ley 1480 de 2011):</strong> si no se pacta un plazo distinto antes
            del pago, el tiempo máximo de entrega es de <strong>30 días calendario</strong>.
          </li>
        </ul>
      </div>

      <div>
        <h2>3. Seguimiento del Pedido</h2>
        <p>
          Al confirmar tu compra recibes un enlace de seguimiento y tu orden queda guardada en{' '}
          <strong>&quot;Mis compras&quot;</strong> en el navegador donde realizaste el pago:
        </p>
        <ul>
          <li><strong>Store y Suple:</strong> Pedido realizado → Pago aprobado → Preparando envío → En camino → Entregado (con trazabilidad de la transportadora asignada).</li>
          <li><strong>Supply:</strong> Pedido realizado → Pago aprobado → Recibido (confirmado por el comprador al recibir del proveedor).</li>
        </ul>
      </div>

      <div>
        <h2>4. Derecho de Retracto (Art. 47, Ley 1480 de 2011 y Ley 2439 de 2024)</h2>
        <p>
          Para compras a distancia de productos físicos no exceptuados, tienes derecho a retractarte dentro de los{' '}
          <strong>5 días hábiles siguientes</strong> a la entrega, siempre que el producto esté sin usar, en su
          empaque original y con etiquetas y accesorios completos.
        </p>
        <p>
          Conforme a la <strong>Ley 2439 de 2024</strong>, el reembolso total del dinero se efectuará en un plazo
          máximo de <strong>15 días calendario</strong> contados desde que ejerces el retracto, suministras los datos
          para la devolución y entregas el producto en las mismas condiciones. El costo del flete de retorno por
          retracto voluntario corre por cuenta del comprador.
        </p>
      </div>

      <div>
        <h2>5. Excepciones al Derecho de Retracto</h2>
        <p>Por mandato legal (Art. 47, Ley 1480 de 2011), seguridad e higiene, no aplica retracto en:</p>
        <ul>
          <li>Agujas, cartuchos estériles, tintas y consumibles de tatuaje que hayan salido de su empaque sellado (<strong>Supply</strong>).</li>
          <li>Suplementos dietarios (proteínas, creatina, pre-entrenos, vitaminas) cuyo sello de seguridad haya sido roto o alterado (<strong>Suple</strong>).</li>
          <li>Prendas de uso íntimo o personal desprecintadas (<strong>Store</strong>).</li>
          <li>Productos fabricados a pedido o a medida: máquinas de gimnasio bajo pedido (<strong>Gym</strong>) y piezas personalizadas de carpintería o herrería (<strong>Store</strong>).</li>
          <li>Contenidos digitales descargables o cursos una vez entregados o habilitado su acceso.</li>
        </ul>
      </div>

      <div>
        <h2>6. Garantía, Defectos de Fábrica y Reversión del Pago</h2>
        <ul>
          <li>
            <strong>Defectos o error en el despacho:</strong> si el producto llega defectuoso o distinto a lo pedido,
            reporta con fotos del producto y del empaque al vendedor (cuyo WhatsApp figura en tu seguimiento). El
            flete de retorno por error o defecto corre por cuenta del vendedor.
          </li>
          <li>
            <strong>Garantía legal:</strong> 1 año para productos nuevos (o el término mayor informado por el
            fabricante) y hasta la fecha de vencimiento en bienes perecederos (suplementos/tintas).
          </li>
          <li>
            <strong>Reversión del pago (Decreto 587 de 2016):</strong> para pagos electrónicos (tarjeta o PSE vía
            Mercado Pago), puedes solicitarla dentro de los <strong>5 días hábiles</strong> ante fraude, operación no
            solicitada, producto no recibido, diferente o defectuoso; se hace efectiva en hasta{' '}
            <strong>15 días hábiles</strong>.
          </li>
        </ul>
      </div>

      <div>
        <h2>7. Contacto y PQR</h2>
        <p>
          Para compras a un proveedor o tienda aliada, contacta primero al vendedor desde el enlace de seguimiento de
          tu pedido. Para productos propios de INKognito o mediación en casos de incumplimiento, escríbenos a{' '}
          <a href="mailto:soporte@inkognito-ecosystem.com">soporte@inkognito-ecosystem.com</a>.
        </p>
      </div>
    </LegalPage>
  )
}
