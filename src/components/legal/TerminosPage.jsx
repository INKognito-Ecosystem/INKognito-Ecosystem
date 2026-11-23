import { Link } from 'react-router'
import LegalPage from './LegalPage'

export const TERMINOS_TITLE = 'Términos y Condiciones de Uso'
export const TERMINOS_UPDATED = '23 de noviembre de 2026'
const DESCRIPTION =
  'Términos y condiciones de INKognito Ecosystem (Colombia): rol de marketplace y vendedor directo, pagos con Mercado Pago, reglas de INK, Supply, Store, Suple, Gym y Ruta del Golfo, retracto (Ley 2439 de 2024) y reversión del pago.'

export function meta() {
  return [
    { title: `${TERMINOS_TITLE} | INKognito Ecosystem` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/terminos` },
  ]
}

// Contenido compartido entre la ruta /terminos (tema oscuro) y LegalModal.jsx (overlay blanco).
export function TerminosContent() {
  return (
    <>
      <div>
        <h2>En pocas palabras</h2>
        <ul>
          <li>
            <strong>Ecosistema modular:</strong> INKognito integra el buscador de tatuadores <strong>INK</strong>,{' '}
            <strong>Supply</strong>, <strong>Store</strong>, <strong>Suple</strong>, <strong>Gym</strong>, la red
            logística <strong>Ruta del Golfo</strong> y servicios de desarrollo de software.
          </li>
          <li>
            <strong>Rol claro:</strong> En ventas de terceros (proveedores, tiendas, artistas, estudios y
            transportadoras) actuamos como plataforma tecnológica de intermediación (Art. 53, Ley 1480 de 2011).
            Solo somos vendedores directos en productos identificados como propios de INKognito.
          </li>
          <li>
            <strong>Pagos transparentes:</strong> Las compras a terceros se procesan vía <strong>Mercado Pago</strong>{' '}
            con dispersión directa (split); INKognito no retiene el dinero del vendedor.
          </li>
          <li>
            <strong>Retracto actualizado:</strong> Tienes <strong>5 días hábiles</strong> desde la entrega para
            ejercerlo cuando aplique, con reembolso en máximo <strong>15 días calendario</strong> (Ley 2439 de 2024),
            salvo excepciones legales (bienes a pedido, insumos estériles o suplementos desprecintados y contenido
            digital).
          </li>
        </ul>
      </div>

      <div>
        <h2>1. Identificación y Objeto</h2>
        <p>
          Este sitio web (<strong>inkognito-ecosystem.com</strong>) y sus servicios asociados son operados por{' '}
          <strong>INKognito Ecosystem</strong>, iniciativa fundada por <strong>Jose Humanez</strong> con sede
          principal en <strong>Chigorodó, Urabá, Antioquia, Colombia</strong> y cobertura nacional.
        </p>
        <p>
          Al acceder, navegar, registrarte como aliado o realizar una compra o reserva, aceptas estos Términos y
          Condiciones conforme a la <strong>Ley 527 de 1999</strong> (validez jurídica de los mensajes de datos y
          aceptación electrónica), la <strong>Ley 1480 de 2011</strong> (Estatuto del Consumidor) y la{' '}
          <strong>Ley 2439 de 2024</strong>.
        </p>
        <p>
          INKognito Ecosystem opera además como estudio de desarrollo de software (<strong>INKognito Development Studio</strong>),
          responsable de construir y mantener la infraestructura tecnológica de la plataforma.
        </p>
      </div>

      <div>
        <h2>2. Naturaleza Jurídica y Rol Dual (Portal de Contacto vs. Vendedor Directo)</h2>
        <p>
          De conformidad con el <strong>Artículo 53 de la Ley 1480 de 2011</strong> y la{' '}
          <strong>Ley 2439 de 2024</strong>, INKognito cumple dos roles diferenciados que siempre se informan antes
          de pagar:
        </p>
        <ul>
          <li>
            <strong>Plataforma de intermediación / Portal de contacto (Marketplace):</strong> En las ventas y
            servicios ofrecidos por terceros independientes (proveedores de Supply, tiendas y talleres de Store,
            tiendas de Suple, tatuadores y estudios de INK, y transportadoras de Ruta del Golfo), INKognito provee
            la tecnología de publicación, conexión y pago. El contrato de compraventa, servicio o transporte se
            celebra directamente entre el usuario y el tercero oferente, quien responde por la calidad, idoneidad,
            garantía, facturación y entrega.
          </li>
          <li>
            <strong>Vendedor directo:</strong> Únicamente cuando el producto o servicio indique expresamente que es
            ofrecido directamente por INKognito (por ejemplo, catálogo propio o <em>INKognito Gym Equipment</em>).
          </li>
          <li>
            <strong>Registro de oferentes:</strong> INKognito mantiene un registro actualizado de los datos de
            identificación y contacto de los vendedores, estudios y transportadoras registradas, el cual se pone a
            disposición del consumidor para ejercer sus derechos o ante requerimiento de la{' '}
            <strong>Superintendencia de Industria y Comercio (SIC)</strong>.
          </li>
        </ul>
      </div>

      <div>
        <h2>3. Resumen de Módulos y Reglas Clave</h2>
        <div className="overflow-x-auto my-3">
          <table>
            <thead>
              <tr>
                <th>Módulo</th>
                <th>Rol de INKognito</th>
                <th>Regla clave</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>INK (Tattoo Artist Colombia)</strong></td>
                <td>Buscador e intermediario tecnológico</td>
                <td>Citas, anticipos, bioseguridad y diseños son responsabilidad exclusiva del artista o estudio.</td>
              </tr>
              <tr>
                <td><strong>Supply</strong></td>
                <td>Marketplace B2B / enlaces afiliados</td>
                <td>Insumos profesionales y estériles; sin retracto si se abre el empaque sellado.</td>
              </tr>
              <tr>
                <td><strong>Store</strong></td>
                <td>Marketplace de tiendas y oficios</td>
                <td>Moda, calzado, carpintería y herrería; piezas a medida excluidas de retracto.</td>
              </tr>
              <tr>
                <td><strong>Suple</strong></td>
                <td>Marketplace de nutrición deportiva</td>
                <td>Registro Sanitario INVIMA a cargo de cada tienda; sin retracto si se rompe el sello.</td>
              </tr>
              <tr>
                <td><strong>Gym</strong></td>
                <td>Vendedor directo / afiliados</td>
                <td>Máquinas fabricadas bajo pedido (excluidas de retracto) y cursos/recursos digitales.</td>
              </tr>
              <tr>
                <td><strong>Ruta del Golfo</strong></td>
                <td>Plataforma de conexión logística</td>
                <td>Transportadoras independientes responsables de custodia, recaudo y entrega.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2>4. Compras, Pagos y Comisiones</h2>
        <ul>
          <li>
            <strong>Pagos en Marketplace (Supply, Store, Suple):</strong> Se procesan dentro del sitio mediante{' '}
            <strong>Mercado Pago</strong> (Payment Brick embebido con tokenización directa en el navegador). El pago
            ingresa directamente a la cuenta de Mercado Pago del vendedor y la comisión de plataforma de INKognito se
            liquida automáticamente en el mismo acto (split OAuth). INKognito no retiene ni administra el dinero del
            vendedor.
          </li>
          <li>
            <strong>Diseños y reservas en INK:</strong> Se pagan mediante <strong>Mercado Pago Checkout Pro</strong>{' '}
            con dispersión directa al artista y comisión fija por transacción.
          </li>
          <li>
            <strong>Pedidos directos de INKognito:</strong> Se pagan por <strong>Nequi</strong> (con verificación de
            comprobante antes del despacho) o <strong>contraentrega</strong> en rutas habilitadas. Las máquinas de Gym
            bajo pedido pueden requerir un anticipo acordado antes de iniciar fabricación.
          </li>
          <li>
            <strong>Transparencia de precios:</strong> Antes de confirmar el pago se muestra el vendedor, el precio
            total (con comisión de plataforma incluida cuando aplica, así como recargos por cajas surtidas
            personalizadas en Supply si el proveedor los configura) y la política de envío aplicable.
          </li>
          <li>
            <strong>Disponibilidad:</strong> El stock se valida al momento del pago. Si un producto no pudiera
            entregarse después de confirmado el pago, el vendedor (o INKognito en ventas propias) te contactará para
            acordar cambio o devolución total del dinero.
          </li>
        </ul>
      </div>

      <div>
        <h2>5. Reglas Específicas por Módulo</h2>
        <ul>
          <li>
            <strong>INK (Buscador Nacional de Tatuadores y Estudios):</strong> Se rige adicionalmente por los{' '}
            <Link to="/tattoo-artist-colombia/terminos">Términos de Tattoo Artist Colombia</Link>. El servicio de
            tatuaje, el cumplimiento de normas sanitarias/bioseguridad y la atención de citas son responsabilidad
            exclusiva del artista o estudio.
          </li>
          <li>
            <strong>Supply (Insumos y Educación):</strong> Los insumos están dirigidos a tatuadores y estudios con
            conocimiento de su manejo seguro y estéril. Los cursos, kits o recursos recomendados con enlaces a
            plataformas externas (como <strong>Hotmart</strong> u otros terceros) corresponden a programas de
            afiliados; su compra, soporte y reembolso se rigen por los términos del tercero.
          </li>
          <li>
            <strong>Suple (Suplementación Deportiva):</strong> Conforme a los{' '}
            <strong>Decretos 3249 de 2006 y 3863 de 2008</strong>,{' '}
            <strong>
              ESTE PRODUCTO ES UN SUPLEMENTO DIETARIO, NO ES UN MEDICAMENTO Y NO SUPLE UNA ALIMENTACIÓN EQUILIBRADA
            </strong>
            . Cada comercio aliado garantiza que los productos que publica cuentan con{' '}
            <strong>Registro Sanitario INVIMA vigente</strong>, etiquetas originales y fecha de vencimiento válida, y
            tiene prohibido atribuir propiedades curativas o terapéuticas.
          </li>
          <li>
            <strong>Store y Gym (Stock vs. Fabricación a Pedido):</strong> En productos fabricados sobre medidas o
            especificaciones del cliente (máquinas de gimnasio a pedido, carpintería o herrería), el vendedor
            informará el tiempo estimado de producción antes del pago.
          </li>
          <li>
            <strong>Ruta del Golfo (Transportadoras Multitenant y Envíos Directos):</strong> Las transportadoras
            registradas son aliados logísticos independientes responsables de la recogida, custodia, entrega y,
            cuando aplique, del recaudo contraentrega. Al recibir un paquete, revisa su estado externo y reporta de
            inmediato cualquier avería o faltante.
          </li>
        </ul>
      </div>

      <div>
        <h2>6. Entregas y Plazos (Art. 50, Ley 1480 de 2011)</h2>
        <p>
          El plazo estimado de despacho y entrega se informa antes de pagar o se acuerda directamente con el vendedor
          cuando el envío es coordinado. A falta de plazo expreso, aplica el término máximo legal de{' '}
          <strong>30 días calendario</strong> contados desde el día siguiente a la confirmación del pedido. Si se
          incumple el plazo sin justificación aceptada por ti, puedes cancelar el pedido y exigir la devolución
          íntegra del dinero sin retenciones.
        </p>
      </div>

      <div>
        <h2>7. Derecho de Retracto y Excepciones (Ley 1480 de 2011 y Ley 2439 de 2024)</h2>
        <p>
          Para compras a distancia de productos físicos no exceptuados, tienes derecho a retractarte dentro de los{' '}
          <strong>5 días hábiles</strong> siguientes a la entrega del bien, devolviéndolo sin uso, en su empaque
          original y con todos sus accesorios (los costos de transporte de retorno corren por cuenta del consumidor).
          Conforme a la <strong>Ley 2439 de 2024</strong>, el reembolso del dinero se realizará en un plazo máximo de{' '}
          <strong>15 días calendario</strong> contados desde que ejerces el retracto, suministras los datos para la
          devolución y entregas el producto en las mismas condiciones.
        </p>
        <p>
          <strong>Excepciones legales (Art. 47, Ley 1480 de 2011) — NO aplica retracto en:</strong>
        </p>
        <ul>
          <li>
            <strong>Bienes confeccionados a pedido o personalizados:</strong> máquinas de gimnasio bajo pedido (Gym),
            trabajos a medida de carpintería o herrería (Store) y diseños personalizados.
          </li>
          <li>
            <strong>Bienes de uso personal, higiene, salud o perecederos desprecintados:</strong> agujas, cartuchos
            estériles, tintas y consumibles de tatuaje abiertos (Supply), suplementos dietarios con sello de seguridad
            roto (Suple) y prendas de uso íntimo/personal.
          </li>
          <li>
            <strong>Contenido digital descargable o de acceso inmediato:</strong> diseños digitales de tatuaje (INK),
            cursos o recursos digitales una vez entregados o habilitado el acceso.
          </li>
          <li>
            <strong>Servicios ya iniciados con tu acuerdo:</strong> sesiones de tatuaje iniciadas o ejecutadas y
            servicios de transporte ya prestados.
          </li>
        </ul>
        <p>
          Consulta el procedimiento detallado en nuestra{' '}
          <Link to="/envios-cambios-devoluciones">Política de Envíos, Cambios y Devoluciones</Link>.
        </p>
      </div>

      <div>
        <h2>8. Reversión del Pago (Art. 51, Ley 1480 y Decreto 587 de 2016)</h2>
        <p>
          Cuando pagues mediante instrumentos electrónicos (tarjeta de crédito, débito o PSE) a través de Mercado
          Pago, puedes solicitar la reversión del pago dentro de los <strong>5 días hábiles</strong> siguientes a la
          fecha en que conociste la operación fraudulenta o no solicitada, o desde la entrega/fecha límite del
          producto, únicamente por las 5 causales legales:
        </p>
        <ul>
          <li>Fraude o suplantación.</li>
          <li>Operación no solicitada.</li>
          <li>Producto adquirido no recibido.</li>
          <li>Producto entregado que no corresponde a lo solicitado o no cumple características informadas.</li>
          <li>Producto defectuoso.</li>
        </ul>
        <p>
          Debes radicar la queja ante el vendedor (o ante INKognito en compras propias) y notificar a tu entidad
          financiera dentro del mismo plazo de 5 días hábiles, poniendo el producto a disposición para su devolución
          si aplica. Los participantes del proceso de pago cuentan con <strong>15 días hábiles</strong> para hacer
          efectiva la reversión. No aplica para pagos en efectivo contraentrega.
        </p>
      </div>

      <div>
        <h2>9. Garantía Legal (Arts. 7, 8 y 11, Ley 1480 de 2011)</h2>
        <p>
          Todos los productos nuevos cuentan con la garantía informada por el productor o vendedor; en ausencia de
          indicación expresa, aplica el término legal de <strong>1 año</strong> desde la entrega. Para bienes
          perecederos (como suplementos o tintas con fecha de expiración), la garantía rige hasta la fecha de
          vencimiento. En ventas de terceros, la garantía es asumida directamente por el vendedor o productor
          identificado en tu orden.
        </p>
      </div>

      <div>
        <h2>10. Edad Mínima y Uso Permitido</h2>
        <ul>
          <li>
            Las compras, contrataciones, registros de aliados y reservas de citas de tatuaje están dirigidas a{' '}
            <strong>mayores de 18 años</strong> con plena capacidad legal en Colombia.
          </li>
          <li>
            Te comprometes a usar la plataforma de forma lícita, sin vulnerar su seguridad, extraer información
            masivamente (<em>scraping</em>), suplantar identidades ni publicar contenido ilegal o engañoso.
          </li>
          <li>
            INKognito podrá suspender o retirar perfiles, catálogos o cuentas de aliados que incumplan estos términos,
            reciban reportes reiterados de incumplimiento o afecten la seguridad de los usuarios.
          </li>
        </ul>
      </div>

      <div>
        <h2>11. Propiedad Intelectual (Ley 23 de 1982 y Decisión Andina 351)</h2>
        <p>
          La marca <strong>INKognito</strong>, su logotipo, software, arquitectura, interfaz y contenidos propios
          pertenecen a INKognito Ecosystem. Los catálogos, fotografías, logotipos de marcas oficiales y obras de
          tatuadores pertenecen a sus respectivos titulares, quienes conceden a INKognito una licencia no exclusiva y
          revocable para exhibirlos dentro de la plataforma. Queda prohibida la reproducción o explotación comercial
          sin autorización previa.
        </p>
      </div>

      <div>
        <h2>12. Enlaces a Plataformas de Terceros</h2>
        <p>
          El ecosistema contiene enlaces hacia <strong>WhatsApp</strong>, <strong>Instagram</strong>,{' '}
          <strong>Facebook</strong>, <strong>Mercado Pago</strong> y plataformas educativas externas (como{' '}
          <strong>Hotmart</strong>). Al salir hacia esos sitios aplican los términos y políticas propios de cada
          tercero.
        </p>
      </div>

      <div>
        <h2>13. Responsabilidad, Ley Aplicable y Contacto</h2>
        <p>
          INKognito responde por la disponibilidad razonable y seguridad técnica de la plataforma, sin garantizar
          ausencia absoluta de interrupciones de red o de terceros. Estos términos se rigen por las leyes de la{' '}
          <strong>República de Colombia</strong>; cualquier controversia se someterá a los jueces competentes en
          Colombia, sin perjuicio de las facultades de la <strong>Superintendencia de Industria y Comercio (SIC)</strong>.
        </p>
        <p>
          <strong>Canales de atención y PQR:</strong>{' '}
          <a href="mailto:inkognitoecosystem@gmail.com">inkognitoecosystem@gmail.com</a> · WhatsApp:{' '}
          <a href="https://wa.me/573207911013" target="_blank" rel="noreferrer">
            +57 320 791 1013
          </a>{' '}
          · Chigorodó, Urabá, Antioquia, Colombia.
        </p>
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
