import LegalPage from './LegalPage'

export const PRIVACIDAD_TITLE = 'Política de Privacidad, Datos Personales y Cookies'
export const PRIVACIDAD_UPDATED = '23 de noviembre de 2026'
const DESCRIPTION =
  'Política de tratamiento de datos personales y cookies de INKognito Ecosystem (Ley 1581 de 2012, Decreto 1377 de 2013): datos por rol, Mercado Pago, infraestructura cloud, derechos ARCO y plazos legales.'

export function meta() {
  return [
    { title: `${PRIVACIDAD_TITLE} | INKognito Ecosystem` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/privacidad` },
  ]
}

// Contenido compartido entre la ruta /privacidad (tema oscuro) y LegalModal.jsx (overlay blanco).
export function PrivacidadContent() {
  return (
    <>
      <div>
        <h2>En pocas palabras</h2>
        <ul>
          <li>
            <strong>Cumplimiento colombiano:</strong> Tratamos tus datos conforme a la{' '}
            <strong>Ley 1581 de 2012</strong>, el <strong>Decreto 1377 de 2013</strong> (compilado en el Decreto
            1074 de 2015) y la <strong>Ley 1266 de 2008</strong>.
          </li>
          <li>
            <strong>No vendemos tus datos:</strong> Solo compartimos lo estrictamente necesario con el vendedor,
            artista, transportadora (Ruta del Golfo) y proveedores tecnológicos que permiten operar el servicio.
          </li>
          <li>
            <strong>Pagos seguros:</strong> Los datos de tarjeta se tokenizan directamente en{' '}
            <strong>Mercado Pago</strong>; INKognito nunca almacena números de tarjeta ni códigos CVV.
          </li>
          <li>
            <strong>Control total (ARCO):</strong> Puedes conocer, actualizar, rectificar o suprimir tus datos
            escribiendo a <strong>inkognitoecosystem@gmail.com</strong> (consultas en máximo 10 días hábiles;
            reclamos en máximo 15 días hábiles).
          </li>
        </ul>
      </div>

      <div>
        <h2>1. Responsable del Tratamiento</h2>
        <p>
          <strong>INKognito Ecosystem</strong>, fundado por <strong>Jose Humanez</strong> con domicilio principal en{' '}
          <strong>Chigorodó, Urabá, Antioquia, Colombia</strong>, es el Responsable del Tratamiento de los datos
          personales recolectados a través de <strong>inkognito-ecosystem.com</strong> y sus módulos asociados (
          <strong>INK</strong>, <strong>Supply</strong>, <strong>Store</strong>, <strong>Suple</strong>,{' '}
          <strong>Gym</strong>, <strong>Ruta del Golfo</strong> y <strong>INKognito Development Studio</strong>).
        </p>
        <p>
          <strong>Área y canal oficial de Protección de Datos y PQR:</strong>{' '}
          <a href="mailto:inkognitoecosystem@gmail.com">inkognitoecosystem@gmail.com</a> · WhatsApp:{' '}
          <a href="https://wa.me/573207911013" target="_blank" rel="noreferrer">
            +57 320 791 1013
          </a>
        </p>
      </div>

      <div>
        <h2>2. Qué Datos Recolectamos según tu Rol</h2>
        <div className="overflow-x-auto my-3">
          <table>
            <thead>
              <tr>
                <th>Rol</th>
                <th>Datos recolectados</th>
                <th>Finalidad principal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Compradores y Clientes</strong></td>
                <td>Nombre, WhatsApp/teléfono, correo, departamento, municipio, dirección de entrega, mensaje opcional, comprobante Nequi (en pedidos directos) e identificador de pago.</td>
                <td>Procesar pedidos, coordinar entregas, habilitar seguimiento y atender garantías o PQR.</td>
              </tr>
              <tr>
                <td><strong>Clientes de INK (Citas y Diseños)</strong></td>
                <td>Nombre, correo, WhatsApp, fecha/hora de reserva, mensaje y foto de referencia (cuando aplica).</td>
                <td>Confirmar la compra de diseños o reservas y compartir tus datos con el artista elegido.</td>
              </tr>
              <tr>
                <td><strong>Tatuadores y Estudios (INK)</strong></td>
                <td>Nombre, ciudad/ubicación, estilo, biografía, WhatsApp, redes sociales, correo, fotos/portafolio, diseños, horarios y tokens OAuth de Mercado Pago.</td>
                <td>Publicar el perfil en el buscador nacional, gestionar agenda y habilitar pagos directos (split).</td>
              </tr>
              <tr>
                <td><strong>Tiendas y Proveedores (Supply, Store, Suple)</strong></td>
                <td>Nombre comercial, ubicación, dirección, WhatsApp, correo, logo, portada, catálogo, política de envío y credenciales OAuth/clave pública de Mercado Pago.</td>
                <td>Operar el catálogo multitenant, cumplir el registro de oferentes (Art. 53 Ley 1480) y dispersar pagos.</td>
              </tr>
              <tr>
                <td><strong>Transportadoras y Envíos Directos (Ruta del Golfo)</strong></td>
                <td>Nombre, NIT, dirección, municipio, logo, WhatsApp, correo, zonas de cobertura, vehículos/tarifas; en envíos directos: datos de remitente, destinatario y recaudo.</td>
                <td>Coordinar recogidas, entregas, trazabilidad de envíos y liquidaciones de flete.</td>
              </tr>
              <tr>
                <td><strong>Visitantes ("Cerca de ti" y navegación)</strong></td>
                <td>Identificador anónimo aleatorio (<code>inkognito_visitor_id</code>), ruta visitada y coordenadas aproximadas solo si autorizas geolocalización.</td>
                <td>Ordenar artistas por cercanía (sin asociarlo a tu identidad) y medir visitas por módulo sin guardar IP.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2>3. Procesamiento de Pagos (Mercado Pago)</h2>
        <p>
          Los pagos en línea se procesan a través de <strong>Mercado Pago</strong>:
        </p>
        <ul>
          <li>
            En <strong>Supply, Store y Suple</strong> usamos <strong>Mercado Pago Payment Brick (SDK v2)</strong>: los
            datos de tu tarjeta son capturados y tokenizados directamente por Mercado Pago en tu navegador. Nuestro
            servidor recibe únicamente el token seguro, el método de pago (y los datos mínimos de identificación
            exigidos por PSE cuando eliges esa opción) para crear la transacción en la API de Mercado Pago.
          </li>
          <li>
            En <strong>INK</strong> (diseños y reservas) el pago se realiza en <strong>Mercado Pago Checkout Pro</strong>.
          </li>
          <li>
            INKognito <strong>nunca almacena números de tarjeta, fechas de vencimiento ni códigos CVV</strong>. Solo
            conservamos el identificador de pago y su estado para confirmar tu orden.
          </li>
        </ul>
      </div>

      <div>
        <h2>4. Datos Guardados en tu Navegador (localStorage y sessionStorage)</h2>
        <p>
          Para mejorar tu experiencia sin obligarte a crear contraseña, guardamos ciertos datos localmente en tu
          dispositivo (que puedes borrar en cualquier momento desde la configuración de tu navegador):
        </p>
        <ul>
          <li><strong>Carrito y compras:</strong> carrito por módulo, historial local de &quot;Mis compras&quot; (ID y código de seguimiento) y tu dirección guardada para agilizar futuras compras.</li>
          <li><strong>Cercanía y preferencias UI:</strong> coordenadas aproximadas de &quot;Cerca de ti&quot; (si diste permiso), avisos ya vistos y control de animación de inicio.</li>
          <li><strong>Gestión de aliados:</strong> tokens de acceso para editar tu perfil de artista, estudio, tienda o catálogo desde tu dispositivo.</li>
        </ul>
        <p>
          <strong>Cuidado con tus enlaces personales:</strong> quien tenga el enlace de seguimiento de una compra o tu
          enlace de edición de perfil/tienda puede ver o gestionar esa información. No los compartas con terceros.
        </p>
      </div>

      <div>
        <h2>5. Finalidades del Tratamiento</h2>
        <ul>
          <li>Gestionar compras, pagos, reservas con anticipo, entregas y notificaciones por correo o WhatsApp.</li>
          <li>Compartir con el vendedor, artista, estudio o transportadora los datos indispensables para ejecutar tu pedido o cita.</li>
          <li>Verificar cuentas de aliados mediante enlaces enviados por correo electrónico y prevenir fraude o suplantación.</li>
          <li>Analizar el rendimiento de páginas y módulos para mejorar el catálogo y medir campañas publicitarias.</li>
          <li>Cumplir deberes legales, contables, tributarios y requerimientos de autoridades competentes en Colombia.</li>
        </ul>
        <p>
          <strong>No vendemos tus datos personales</strong> ni los usamos para decisiones automatizadas que produzcan
          efectos jurídicos negativos sin intervención humana.
        </p>
      </div>

      <div>
        <h2>6. Cookies y Tecnologías de Rastreo</h2>
        <div className="overflow-x-auto my-3">
          <table>
            <thead>
              <tr>
                <th>Herramienta</th>
                <th>Identificador / Cookie</th>
                <th>Finalidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Google Analytics 4</td>
                <td><code>_ga</code>, <code>_ga_*</code></td>
                <td>Medir tráfico, páginas visitadas y origen de visitas.</td>
              </tr>
              <tr>
                <td>Meta Pixel</td>
                <td><code>_fbp</code>, <code>_fbc</code></td>
                <td>Medir efectividad de campañas en Instagram y Facebook.</td>
              </tr>
              <tr>
                <td>Analítica propia</td>
                <td><code>inkognito_visitor_id</code></td>
                <td>Conteo anónimo de visitas por página y módulo, sin almacenar IP.</td>
              </tr>
              <tr>
                <td>Sesión técnica (solo panel)</td>
                <td><code>connect.sid</code> (HttpOnly)</td>
                <td>Autenticación segura de administradores y operadores logísticos.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Puedes bloquear o eliminar cookies en cualquier momento desde la configuración de tu navegador, usar modo
          incógnito o activar bloqueadores de rastreadores.
        </p>
      </div>

      <div>
        <h2>7. Con Quién Compartimos Datos y Transferencia/Transmisión Internacional</h2>
        <p>
          Compartimos datos únicamente cuando es indispensable para prestar el servicio. Debido a nuestra arquitectura
          en la nube, algunos proveedores procesan información en servidores fuera de Colombia conforme al{' '}
          <strong>Artículo 26 de la Ley 1581 de 2012</strong> y los{' '}
          <strong>Artículos 2.2.2.25.5.1 y 2.2.2.25.5.2 del Decreto 1074 de 2015</strong>:
        </p>
        <ul>
          <li><strong>Vendedores, proveedores, artistas y estudios:</strong> reciben los datos de tu pedido o reserva para cumplir la entrega o cita.</li>
          <li><strong>Transportadoras de Ruta del Golfo:</strong> reciben nombre, teléfono, dirección y valor de flete/recaudo para realizar la entrega.</li>
          <li><strong>Mercado Pago (Transferencia internacional / Responsable independiente):</strong> procesa pagos, tokenización, prevención de fraude y dispersión OAuth.</li>
          <li><strong>Proveedores tecnológicos (Transmisión internacional / Encargados):</strong> <strong>Vercel</strong> (alojamiento web), <strong>Railway</strong> (servidor y base de datos PostgreSQL), <strong>Cloudinary</strong> (almacenamiento de fotos, portafolios, diseños y comprobantes), <strong>Resend</strong> (correos transaccionales y verificación) y <strong>Google Sheets API</strong> (control interno de liquidaciones).</li>
          <li><strong>Analítica y mensajería:</strong> <strong>Google LLC</strong> (Google Analytics 4) y <strong>Meta Platforms, Inc.</strong> (Meta Pixel y WhatsApp).</li>
        </ul>
        <p>
          Al registrarte, comprar o usar la plataforma otorgas tu autorización previa, expresa e informada para el
          tratamiento, transmisión y transferencia internacional necesarios para las finalidades aquí descritas.
        </p>
      </div>

      <div>
        <h2>8. Menores de Edad (Art. 7, Ley 1581 de 2012)</h2>
        <p>
          INKognito Ecosystem está dirigido a <strong>mayores de 18 años</strong>. No recolectamos intencionalmente
          datos personales de niños, niñas o adolescentes sin la autorización previa de sus padres o representantes
          legales y el respeto irrestricto de su interés superior. Si detectamos datos suministrados por un menor sin
          autorización, procederemos a su supresión inmediata.
        </p>
      </div>

      <div>
        <h2>9. Derechos ARCO (Habeas Data) y Plazos de Respuesta</h2>
        <p>
          Como titular de tus datos personales (<strong>Art. 8, Ley 1581 de 2012</strong>), tienes derecho a:{' '}
          <strong>conocer, actualizar y rectificar</strong> tus datos; solicitar prueba de la autorización; ser
          informado sobre su uso; <strong>revocar la autorización y/o solicitar la supresión</strong> cuando no exista
          un deber legal o contractual de conservarlos; acceder gratuitamente a ellos; y presentar quejas ante la{' '}
          <strong>Superintendencia de Industria y Comercio (SIC)</strong>, previo agotamiento del trámite directo ante
          INKognito (Art. 16).
        </p>
        <div className="overflow-x-auto my-3">
          <table>
            <thead>
              <tr>
                <th>Tipo de solicitud</th>
                <th>Plazo máximo de respuesta</th>
                <th>Prórroga legal máxima</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Consultas</strong> (Art. 14, Ley 1581)</td>
                <td>10 días hábiles</td>
                <td>+ 5 días hábiles adicionales (informando motivos)</td>
              </tr>
              <tr>
                <td><strong>Reclamos</strong> — corrección, supresión o revocatoria (Art. 15, Ley 1581)</td>
                <td>15 días hábiles</td>
                <td>+ 8 días hábiles adicionales (informando motivos; si está incompleto se requiere en 5 días hábiles)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Para radicar una consulta o reclamo, escribe a{' '}
          <a href="mailto:inkognitoecosystem@gmail.com">inkognitoecosystem@gmail.com</a> indicando tu nombre completo,
          documento/teléfono asociado, descripción clara de tu solicitud y correo para recibir respuesta.
        </p>
      </div>

      <div>
        <h2>10. Seguridad de la Información y Conservación</h2>
        <p>
          Implementamos medidas técnicas y administrativas acordes al riesgo: cifrado en tránsito (HTTPS/TLS),
          almacenamiento de contraseñas mediante algoritmos criptográficos de hash, control de acceso por roles,
          verificación de correos por token y tokenización externa de pagos. Conservamos los datos mientras sean
          necesarios para las finalidades descritas y por los términos exigidos por la normativa contable, tributaria
          y comercial colombiana.
        </p>
      </div>

      <div>
        <h2>11. Vigencia y Modificaciones</h2>
        <p>
          Esta política rige a partir de la fecha indicada al inicio. Cualquier cambio sustancial respecto a la
          identificación del responsable o las finalidades del tratamiento será comunicado oportunamente a través de
          la plataforma o por correo electrónico antes o al momento de su entrada en vigencia (Art. 2.2.2.25.2.2,
          Decreto 1074 de 2015).
        </p>
      </div>
    </>
  )
}

export default function PrivacidadPage() {
  return (
    <LegalPage title={PRIVACIDAD_TITLE} updated={PRIVACIDAD_UPDATED}>
      <PrivacidadContent />
    </LegalPage>
  )
}
