import LegalPage from './LegalPage'

export const TERMINOS_TITLE = 'Términos y Condiciones'
export const TERMINOS_UPDATED = '6 de octubre de 2026'
const DESCRIPTION = 'Términos y condiciones de INKognito: quién vende cada producto, compras y pagos con Mercado Pago, precios, propiedad intelectual y responsabilidad.'

export function meta() {
  return [
    { title: `${TERMINOS_TITLE} | INKognito` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/terminos` },
  ]
}

// Contenido separado del layout de ruta (2026-09-15, Jose: "cuando le doy a
// políticas o privacidad... la idea es que sea como lo que ya solucionamos,
// el modal abre directo donde estoy... blanco... ocupa toda la pantalla") —
// LegalModal.jsx importa este mismo contenido para mostrarlo como overlay
// en vez de navegar a esta ruta; la ruta /terminos sigue existiendo tal
// cual para quien llega por link directo o buscador.
export function TerminosContent() {
  return (
    <>
      <div>
        <h2>1. Objeto</h2>
        <p>
          Este sitio es operado por INKognito, con sede en Chigorodó, Urabá, Antioquia, Colombia, fundado
          por Jose Humanez. Es una plataforma de comercio donde conviven productos propios de INKognito y
          productos de proveedores independientes (tiendas, distribuidores y estudios de tatuaje) que venden
          directamente a través de ella: insumos de tatuaje (Supply), ropa y calzado deportivo (Store),
          suplementos (Suple), máquinas y equipos de gimnasio (Gym), y el directorio de artistas y estudios
          de tatuaje (INK).
        </p>
        <p>
          INKognito opera además como estudio de desarrollo de software y es quien construye y mantiene esta
          plataforma. Al usar este sitio aceptas los términos descritos aquí.
        </p>
      </div>

      <div>
        <h2>2. Quién vende</h2>
        <ul>
          <li><strong>Productos de un proveedor:</strong> el proveedor indicado en cada producto (tienda, distribuidor o estudio) es el vendedor. Responde por el producto, su descripción, su calidad y la entrega, y su nombre aparece en tu compra y en tu seguimiento.</li>
          <li><strong>Productos propios de INKognito:</strong> cuando un producto no tiene proveedor, el vendedor es INKognito.</li>
          <li><strong>Servicios de tatuaje y diseños:</strong> se rigen por las condiciones de cada artista o estudio, y por los términos del directorio Tattoo Artist Colombia.</li>
        </ul>
      </div>

      <div>
        <h2>3. Compras y pagos</h2>
        <ul>
          <li>Las compras de productos de un proveedor se pagan en el sitio con Mercado Pago. El pago llega a la cuenta de Mercado Pago del proveedor y la comisión de INKognito se descuenta en el mismo momento. INKognito no retiene ni administra el dinero del proveedor.</li>
          <li>Los pedidos directos de INKognito se pagan por Nequi (con comprobante verificado antes de despachar) o contraentrega en las rutas que indiquemos. Las máquinas de Gym bajo pedido pueden requerir un anticipo.</li>
          <li>La comisión de INKognito va incluida en el precio que ves en el checkout. El proveedor recibe el precio base que publicó.</li>
          <li>Antes de pagar puedes ver el vendedor, el precio total y la política de envío de ese proveedor.</li>
        </ul>
      </div>

      <div>
        <h2>4. Precios y disponibilidad</h2>
        <p>
          Los precios mostrados pueden cambiar sin previo aviso, pero el precio que pagas es el que aparece en
          el checkout al momento de confirmar la compra. La disponibilidad de un producto se valida al momento
          de pagar. Si un producto no puede entregarse después de tu compra, te contactaremos para acordar una
          solución.
        </p>
      </div>

      <div>
        <h2>5. Cancelaciones, cambios y devoluciones</h2>
        <p>
          Se rigen por la política de envíos, cambios y devoluciones publicada en el sitio. El retracto lo
          atiende el vendedor del producto, o INKognito cuando el producto es propio.
        </p>
      </div>

      <div>
        <h2>6. Uso permitido del sitio</h2>
        <p>
          Te comprometes a usar el sitio de forma lícita, sin intentar vulnerar su seguridad, extraer
          masivamente su contenido (scraping) ni usarlo para fines distintos a conocer y adquirir nuestros
          productos y servicios.
        </p>
      </div>

      <div>
        <h2>7. Propiedad intelectual</h2>
        <p>
          El nombre "INKognito", su logo, diseños, fotografías de trabajos de tatuaje y el contenido del sitio
          son propiedad de INKognito o se usan con autorización de sus autores. No está permitido reproducir o
          usar este contenido con fines comerciales sin autorización previa.
        </p>
      </div>

      <div>
        <h2>8. Enlaces a WhatsApp y redes sociales</h2>
        <p>
          Este sitio contiene enlaces directos a WhatsApp e Instagram. Una vez sales del sitio hacia esas
          plataformas, aplican los términos y políticas de privacidad propios de Meta/WhatsApp, ajenos a
          nuestro control.
        </p>
      </div>

      <div>
        <h2>9. Limitación de responsabilidad</h2>
        <p>
          INKognito no garantiza que el sitio esté libre de errores o interrupciones. INKognito responde por la
          plataforma y por el procesamiento de los pagos en los términos de este documento. La calidad del
          producto, su entrega y la atención posventa son responsabilidad del vendedor y, cuando aplique, de la
          transportadora, sin perjuicio de los derechos que la ley colombiana reconoce al consumidor.
        </p>
      </div>

      <div>
        <h2>10. Ley aplicable</h2>
        <p>
          Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se someterá
          a la jurisdicción de los jueces competentes en Colombia.
        </p>
      </div>

      <div>
        <h2>11. Modificaciones</h2>
        <p>
          Podemos actualizar estos términos en cualquier momento. La fecha de última actualización aparece al
          inicio de este documento.
        </p>
      </div>

      <div>
        <h2>12. Contacto</h2>
        <p>inkognitoecosystem@gmail.com</p>
      </div>
    </>
  )
}

export default function TerminosPage() {
  return (
    <LegalPage title={TERMINOS_TITLE} updated={TERMINOS_UPDATED}>
      <TerminosContent />
    </LegalPage>
  )
}
