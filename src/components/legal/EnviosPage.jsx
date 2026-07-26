import LegalPage from './LegalPage'

const TITLE = 'Envíos, Cambios y Devoluciones'
const DESCRIPTION = 'Política de envíos, cambios y devoluciones de INKognito Supply, Store y Gym: métodos de pago, tiempos de despacho y derecho de retracto.'

export function meta() {
  return [
    { title: `${TITLE} | INKognito` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/envios-cambios-devoluciones` },
  ]
}

export default function EnviosPage() {
  return (
    <LegalPage title={TITLE} updated="25 de julio de 2026">
      <div>
        <p>
          Aplica a los módulos Supply, Store y Gym/Suplementos (venta de producto físico). No aplica al
          servicio de tatuaje, que se rige por acuerdo directo con el artista.
        </p>
      </div>

      <div>
        <h2>1. Cómo se hace un pedido</h2>
        <p>
          Seleccionas tus productos en el sitio, el carrito arma un resumen y lo envía por WhatsApp a
          nuestro equipo. Ahí confirmamos disponibilidad, forma de pago y datos de entrega.
        </p>
      </div>

      <div>
        <h2>2. Métodos de pago</h2>
        <ul>
          <li>Nequi (con comprobante verificado antes de despachar).</li>
          <li>Contraentrega (pagas al recibir).</li>
          <li>Contraentrega con anticipo del 30% (para algunos pedidos, según el producto o el módulo).</li>
        </ul>
      </div>

      <div>
        <h2>3. Tiempos de despacho y flete</h2>
        <p>
          El pedido pasa por las etapas: empacar → listo para recoger → recogido por el transportador →
          entregado. El costo del flete se calcula según el municipio de destino, según nuestra tabla
          vigente, y se informa antes de confirmar el pedido.
        </p>
      </div>

      <div>
        <h2>4. Derecho de retracto (Ley 1480 de 2011)</h2>
        <p>
          Si compraste a través de un medio a distancia (WhatsApp, luego de ver el producto en el sitio
          web), tienes derecho a retractarte dentro de los <strong>5 días hábiles siguientes</strong> a
          la entrega, siempre que:
        </p>
        <ul>
          <li>El producto esté sin usar, en su empaque original, con etiquetas y accesorios completos.</li>
          <li>No aplique alguna de las excepciones descritas abajo.</li>
        </ul>
        <p>
          Para ejercerlo, escríbenos por WhatsApp dentro del plazo indicando el número de pedido y el
          motivo.
        </p>
      </div>

      <div>
        <h2>5. Excepciones al derecho de retracto</h2>
        <p>Por razones de higiene y seguridad, no aceptamos devolución de:</p>
        <ul>
          <li>Agujas, cartuchos y otros insumos de tatuaje que hayan salido de su empaque sellado (Supply).</li>
          <li>Productos personalizados o hechos a pedido.</li>
        </ul>
      </div>

      <div>
        <h2>6. Cambios por defecto de fábrica</h2>
        <p>
          Si el producto llega defectuoso o distinto a lo solicitado, lo cambiamos sin costo adicional.
          Contáctanos por WhatsApp con fotos del producto y del empaque dentro de los 5 días siguientes
          a la entrega.
        </p>
      </div>

      <div>
        <h2>7. Costos de flete en devoluciones/cambios</h2>
        <ul>
          <li>Si el cambio es por error nuestro o producto defectuoso, el flete de retorno corre por cuenta de INKognito.</li>
          <li>Si es un retracto voluntario del cliente (producto en buen estado, sin defecto), el flete de retorno corre por cuenta del cliente.</li>
        </ul>
      </div>

      <div>
        <h2>8. Contacto</h2>
        <p>Cualquier solicitud de cambio o devolución se gestiona por WhatsApp con el mismo equipo que atendió tu pedido.</p>
      </div>
    </LegalPage>
  )
}
