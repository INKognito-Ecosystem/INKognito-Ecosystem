import LegalPage from './LegalPage'

const TITLE = 'Política de Privacidad y Cookies'
const DESCRIPTION = 'Política de privacidad y cookies de INKognito: qué datos recolectamos, cómo usamos Google Analytics y Meta Pixel, y tus derechos como titular de datos personales.'

export function meta() {
  return [
    { title: `${TITLE} | INKognito` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/privacidad` },
  ]
}

export default function PrivacidadPage() {
  return (
    <LegalPage title={TITLE} updated="25 de julio de 2026">
      <div>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          INKognito, con sede en Chigorodó, Urabá, Antioquia, Colombia, fundado por Jose Humanez, es
          responsable del tratamiento de los datos personales que se describen en esta política.
          INKognito administra este ecosistema digital (estudio de tatuajes, Supply, Store y Gym) y
          opera además como estudio de desarrollo de software.
        </p>
        <p>
          <strong>Contacto para temas de privacidad:</strong> inkognitoecosystem@gmail.com
        </p>
      </div>

      <div>
        <h2>2. Qué datos recolectamos</h2>
        <p>
          Este sitio <strong>no tiene formularios de checkout ni de registro</strong>. Los módulos de
          Tattoo, Supply, Store y Gym arman un mensaje prellenado y abren WhatsApp — el sitio en sí no
          captura tu nombre, teléfono ni dirección. Esos datos se comparten directamente dentro de
          WhatsApp Business (Meta), fuera de este sitio, cuando decides continuar la conversación con
          nosotros.
        </p>
        <p>
          Lo único que el sitio recolecta automáticamente, sin que lo escribas, son datos de navegación
          a través de las herramientas descritas en la sección 4.
        </p>
      </div>

      <div>
        <h2>3. Finalidad del tratamiento</h2>
        <ul>
          <li>Entender qué páginas/productos generan más interés, para mejorar el catálogo.</li>
          <li>Medir el resultado de campañas publicitarias (Meta/Instagram/Facebook Ads).</li>
          <li>Facilitar el contacto por WhatsApp para cotizar o cerrar un pedido.</li>
        </ul>
        <p>
          No usamos tus datos de navegación para tomar decisiones automatizadas que te afecten
          individualmente, ni los vendemos a terceros.
        </p>
      </div>

      <div>
        <h2>4. Cookies y tecnologías de rastreo</h2>
        <p>
          Este sitio usa dos herramientas de terceros que instalan cookies en tu navegador apenas lo
          visitas:
        </p>
        <table>
          <thead>
            <tr><th>Herramienta</th><th>Cookies que instala</th><th>Para qué</th></tr>
          </thead>
          <tbody>
            <tr><td>Google Analytics 4</td><td>_ga, _ga_*</td><td>Medir visitas, páginas vistas, origen del tráfico</td></tr>
            <tr><td>Meta Pixel</td><td>_fbp, _fbc</td><td>Medir efectividad de anuncios, retargeting</td></tr>
          </tbody>
        </table>
        <p>
          Estas cookies son operadas por Google LLC y Meta Platforms, Inc., empresas ubicadas fuera de
          Colombia — al usar el sitio, tus datos de navegación pueden ser transferidos y procesados en
          sus servidores, conforme a sus propias políticas de privacidad.
        </p>
        <p>
          <strong>Cómo rechazarlas hoy:</strong> el sitio aún no tiene un banner de consentimiento —
          puedes bloquear estas cookies manualmente desde la configuración de tu navegador (modo
          incógnito, extensiones de bloqueo de rastreadores, o desactivando cookies de terceros).
        </p>
      </div>

      <div>
        <h2>5. Con quién compartimos datos</h2>
        <p>
          Google LLC (Google Analytics) y Meta Platforms, Inc. (Meta Pixel, WhatsApp Business), como se
          describe arriba. No compartimos datos con otras empresas ni los usamos con fines distintos a
          los descritos en esta política.
        </p>
      </div>

      <div>
        <h2>6. Tus derechos (Ley 1581 de 2012, Colombia)</h2>
        <p>Como titular de tus datos personales, tienes derecho a:</p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos.</li>
          <li>Solicitar prueba de la autorización otorgada.</li>
          <li>Ser informado sobre el uso que se les ha dado.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
          <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
          <li>Acceder gratuitamente a tus datos.</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, escríbenos a inkognitoecosystem@gmail.com o por
          WhatsApp al número de contacto del estudio.
        </p>
      </div>

      <div>
        <h2>7. Vigencia y cambios</h2>
        <p>
          Esta política puede actualizarse para reflejar cambios en el sitio o en la normativa
          aplicable. La fecha de la última actualización siempre aparece al inicio de este documento.
        </p>
      </div>
    </LegalPage>
  )
}
