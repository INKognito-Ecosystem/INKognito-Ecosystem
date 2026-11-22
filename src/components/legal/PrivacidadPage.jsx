import LegalPage from './LegalPage'

export const PRIVACIDAD_TITLE = 'Política de Privacidad y Cookies'
export const PRIVACIDAD_UPDATED = '6 de octubre de 2026'
const DESCRIPTION = 'Política de privacidad y cookies de INKognito: qué datos usamos al comprar, quién los recibe, Mercado Pago, analítica del sitio y tus derechos como titular de datos personales.'

export function meta() {
  return [
    { title: `${PRIVACIDAD_TITLE} | INKognito` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/privacidad` },
  ]
}

// Contenido separado del layout de ruta (2026-09-15) — ver mismo comentario
// en TerminosPage.jsx; LegalModal.jsx reusa este contenido como overlay.
export function PrivacidadContent() {
  return (
    <>
      <div>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          INKognito, con sede en Chigorodó, Urabá, Antioquia, Colombia, fundado por Jose Humanez, es
          responsable del tratamiento de los datos personales descritos en esta política. INKognito
          administra este ecosistema digital (estudio de tatuajes, Supply, Store, Suple, Gym y el
          directorio de artistas INK) y opera la plataforma de compra, pago y seguimiento que usan los
          proveedores independientes que venden aquí.
        </p>
        <p>
          <strong>Contacto para temas de privacidad:</strong> inkognitoecosystem@gmail.com
        </p>
      </div>

      <div>
        <h2>2. Qué datos recolectamos</h2>
        <p>
          <strong>Al comprar en el sitio</strong> (Supply, Store, Suple y pedidos directos de INKognito):
          nombre, teléfono de WhatsApp, correo, municipio y dirección de entrega, y el mensaje opcional
          que escribas. Con estos datos se arma tu pedido.
        </p>
        <p>
          <strong>Pagos:</strong> los pagos los procesa Mercado Pago. Los datos de tu tarjeta o de tu
          cuenta los captura y guarda Mercado Pago; INKognito no los ve ni los almacena. Nosotros solo
          guardamos el estado del pago y su identificador.
        </p>
        <p>
          <strong>Reservas y servicios de tatuaje:</strong> nombre, teléfono, correo y los datos de la
          reserva o cita que solicites.
        </p>
        <p>
          <strong>"Cerca de ti" en el directorio de artistas:</strong> si permites el acceso a tu
          ubicación en el navegador, usamos tu ubicación aproximada para ordenar los resultados por
          distancia. Esa ubicación se guarda solo en tu navegador y se envía al servidor únicamente para
          esa búsqueda; no la guardamos asociada a tu identidad.
        </p>
        <p>
          <strong>Datos de navegación:</strong> un identificador anónimo aleatorio, la página visitada y
          el módulo al que pertenece. No guardamos tu dirección IP junto a estos registros.
        </p>
        <p>
          <strong>Datos guardados en tu navegador:</strong> tus compras para la sección "Mis compras"
          (número de compra y un código de seguimiento), tu carrito y algunas preferencias, como los
          avisos de ayuda que ya viste. Estos datos viven en tu navegador, no en nuestros servidores, y
          puedes borrarlos desde la configuración de tu navegador.
        </p>
        <p>
          <strong>Ojo con el enlace de seguimiento:</strong> quien tenga el enlace de una compra puede
          ver su estado, sus productos, su total, el nombre del vendedor y el de la transportadora. Por
          eso no lo compartas con terceros.
        </p>
      </div>

      <div>
        <h2>3. Finalidad del tratamiento</h2>
        <ul>
          <li>Procesar, confirmar y entregar tus pedidos y reservas.</li>
          <li>Permitir que el proveedor o estudio que te vende te entregue el pedido o agende tu servicio, y te contacte por WhatsApp.</li>
          <li>Mostrarte el estado de tu compra y, cuando aplique, avisarte por WhatsApp sobre el envío.</li>
          <li>Entender qué páginas y productos generan más interés, para mejorar el catálogo.</li>
          <li>Medir el resultado de campañas publicitarias (Meta, Instagram, Facebook).</li>
          <li>Cumplir obligaciones contables y tributarias.</li>
        </ul>
        <p>
          No usamos tus datos para tomar decisiones automatizadas que te afecten individualmente, ni los
          vendemos a terceros.
        </p>
      </div>

      <div>
        <h2>4. Cookies y tecnologías de rastreo</h2>
        <table>
          <thead>
            <tr><th>Herramienta</th><th>Qué instala</th><th>Para qué</th></tr>
          </thead>
          <tbody>
            <tr><td>Google Analytics 4</td><td>_ga, _ga_*</td><td>Medir visitas, páginas vistas y origen del tráfico</td></tr>
            <tr><td>Meta Pixel</td><td>_fbp, _fbc</td><td>Medir efectividad de anuncios y retargeting</td></tr>
            <tr><td>Analítica propia del sitio</td><td>Identificador aleatorio en tu navegador (inkognito_visitor_id)</td><td>Contar visitas por página y módulo, sin datos personales</td></tr>
          </tbody>
        </table>
        <p>
          Google LLC y Meta Platforms, Inc. operan fuera de Colombia: al usar el sitio, tus datos de
          navegación pueden ser transferidos y procesados en sus servidores, conforme a sus propias
          políticas de privacidad.
        </p>
        <p>
          <strong>Cómo rechazarlas hoy:</strong> el sitio aún no tiene un banner de consentimiento. Puedes
          bloquear las cookies de terceros desde la configuración de tu navegador, usar el modo incógnito
          o instalar un bloqueador de rastreadores.
        </p>
      </div>

      <div>
        <h2>5. Con quién compartimos datos</h2>
        <p>Compartimos solo lo necesario para cada finalidad:</p>
        <ul>
          <li><strong>Mercado Pago:</strong> procesa los pagos y recibe los datos necesarios para cobrar.</li>
          <li><strong>El proveedor o estudio que te vende</strong> (tienda, proveedor de Supply, estudio o artista): recibe tu nombre, teléfono, correo, dirección y el detalle de tu pedido, para entregártelo o agendar tu servicio.</li>
          <li><strong>Transportadoras de la red Ruta del Golfo</strong> (incluida Eljach): reciben tu nombre, teléfono y dirección de entrega para recoger y llevar el pedido.</li>
          <li><strong>Google LLC</strong> (Google Analytics) y <strong>Meta Platforms, Inc.</strong> (Meta Pixel y WhatsApp Business).</li>
          <li><strong>Proveedores de infraestructura</strong> que alojan el sitio y las bases de datos y envían los mensajes automáticos de WhatsApp: Vercel, Railway y Twilio.</li>
        </ul>
        <p>
          No vendemos tus datos. Cada tercero trata tus datos bajo sus propias políticas y solo para las
          finalidades indicadas.
        </p>
      </div>

      <div>
        <h2>6. Autorización</h2>
        <p>
          Al completar una compra, una reserva o un formulario del sitio, autorizas el tratamiento de tus
          datos para las finalidades de la sección 3.
        </p>
      </div>

      <div>
        <h2>7. Tus derechos (Ley 1581 de 2012, Colombia)</h2>
        <p>Como titular de tus datos personales, tienes derecho a:</p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos.</li>
          <li>Solicitar prueba de la autorización otorgada.</li>
          <li>Ser informado sobre el uso que se les ha dado.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
          <li>Revocar la autorización y/o solicitar la supresión de tus datos, cuando no exista un deber legal o contractual que lo impida.</li>
          <li>Acceder gratuitamente a tus datos.</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, escríbenos a inkognitoecosystem@gmail.com o por
          WhatsApp al número de contacto del estudio.
        </p>
      </div>

      <div>
        <h2>8. Conservación y seguridad</h2>
        <p>
          Conservamos tus datos mientras sean necesarios para las finalidades descritas y para cumplir
          obligaciones legales. Los registros contables y tributarios se conservan por el tiempo que exige
          la ley.
        </p>
        <p>
          El sitio funciona con conexión cifrada (HTTPS). Los pagos no pasan por nuestros servidores. Los
          enlaces de seguimiento y de gestión de cada tienda o artista funcionan con un código personal que
          solo tú debes conocer.
        </p>
      </div>

      <div>
        <h2>9. Vigencia y cambios</h2>
        <p>
          Esta política puede actualizarse para reflejar cambios en el sitio o en la normativa aplicable.
          La fecha de la última actualización siempre aparece al inicio de este documento.
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
