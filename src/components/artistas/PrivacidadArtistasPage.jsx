import LegalPage from '../legal/LegalPage'

export const PRIVACIDAD_ARTISTAS_TITLE = 'Política de Privacidad — INK (Tattoo Artist Colombia)'
export const PRIVACIDAD_ARTISTAS_UPDATED = '23 de noviembre de 2026'
const DESCRIPTION =
  'Política de privacidad y tratamiento de datos personales del buscador nacional INK (Tattoo Artist Colombia) bajo la Ley 1581 de 2012: datos de artistas, estudios y clientes, infraestructura y derechos ARCO.'

export function meta() {
  return [
    { title: `${PRIVACIDAD_ARTISTAS_TITLE} | INKognito Ecosystem` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-colombia/privacidad` },
  ]
}

// Contenido compartido entre /tattoo-artist-colombia/privacidad (theme="light") y LegalModal.jsx (variant="artistas").
export function PrivacidadArtistasContent() {
  return (
    <>
      <div>
        <h2>1. Responsable del Tratamiento</h2>
        <p>
          <strong>INKognito Ecosystem</strong>, con sede en <strong>Chigorodó, Urabá, Antioquia, Colombia</strong>{' '}
          (fundado por Jose Humanez), opera el buscador <strong>INK (Tattoo Artist Colombia)</strong> y actúa como
          Responsable del Tratamiento de los datos personales aquí descritos conforme a la{' '}
          <strong>Ley 1581 de 2012</strong> y el <strong>Decreto 1377 de 2013</strong> (Decreto 1074 de 2015).
        </p>
        <p>
          <strong>Contacto oficial de privacidad y PQR:</strong>{' '}
          <a href="mailto:soporte@inkognito-ecosystem.com">soporte@inkognito-ecosystem.com</a> · WhatsApp:{' '}
          <a href="https://wa.me/573207911013" target="_blank" rel="noreferrer">
            +57 320 791 1013
          </a>
        </p>
      </div>

      <div>
        <h2>2. Datos de Artistas y Estudios</h2>
        <p>
          Al registrar un perfil de <strong>artista</strong> o de <strong>estudio de tatuaje</strong> recolectamos:
          nombre, departamento, municipio, dirección/ubicación exacta (si la activas), estilo, biografía, WhatsApp,
          redes sociales, correo electrónico, horarios/bloqueos de agenda y las fotos de perfil, portafolio o diseños
          que subas. Si conectas <strong>Mercado Pago</strong>, almacenamos únicamente los tokens OAuth necesarios
          para crear los cobros de tus ventas y reservas (nunca tus contraseñas ni datos bancarios).
        </p>
        <p>
          El acceso para editar tu perfil funciona mediante enlaces y tokens personales almacenados en tu navegador
          (<code>localStorage</code>); cuida esos enlaces para que nadie más edite tu información.
        </p>
      </div>

      <div>
        <h2>3. Datos de Clientes y Visitantes</h2>
        <ul>
          <li>
            <strong>Compras de diseños y reservas con anticipo:</strong> recolectamos tu correo electrónico y, en
            reservas, tu nombre, WhatsApp, fecha/hora elegida y mensaje para enviarte la confirmación y entregarle
            tus datos de contacto al artista seleccionado.
          </li>
          <li>
            <strong>Buscador &quot;Cerca de ti&quot;:</strong> si autorizas tu ubicación en el navegador, usamos tus
            coordenadas aproximadas solo para ordenar resultados por distancia; se guardan localmente en tu navegador
            y no se asocian a tu identidad.
          </li>
          <li>
            <strong>Analítica de visitas:</strong> registramos visitas a perfiles y páginas del buscador con un
            identificador anónimo aleatorio (<code>inkognito_visitor_id</code>), sin almacenar dirección IP.
          </li>
        </ul>
      </div>

      <div>
        <h2>4. Pagos (Mercado Pago)</h2>
        <p>
          Los pagos de diseños y reservas se procesan directamente en <strong>Mercado Pago</strong>. INKognito no ve
          ni almacena números de tarjeta ni datos financieros; únicamente recibe la notificación y el identificador
          de la transacción para confirmar el estado del pago.
        </p>
      </div>

      <div>
        <h2>5. Con Quién Compartimos Datos y Proveedores Tecnológicos</h2>
        <p>
          No vendemos tus datos. Solo se comparten o transmiten con los terceros estrictamente necesarios para operar
          el buscador (incluyendo transmisión y transferencia internacional conforme al Art. 26 de la Ley 1581 de
          2012):
        </p>
        <ul>
          <li><strong>Artista o estudio elegido:</strong> recibe los datos de contacto del cliente que reserva o compra un diseño.</li>
          <li><strong>Mercado Pago:</strong> procesa los pagos, prevención de fraude y dispersión OAuth.</li>
          <li><strong>Infraestructura y operación:</strong> <strong>Vercel</strong> (alojamiento web), <strong>Railway</strong> (servidor y base de datos), <strong>Cloudinary</strong> (almacenamiento de fotos, portafolios y diseños) y <strong>Resend</strong> (correos de verificación, enlaces de edición y confirmaciones).</li>
          <li><strong>Analítica y medición global del sitio:</strong> <strong>Google Analytics 4</strong> y <strong>Meta Pixel</strong> (puedes bloquear sus cookies desde la configuración de tu navegador).</li>
        </ul>
      </div>

      <div>
        <h2>6. Menores de Edad</h2>
        <p>
          El registro de perfiles, la compra de diseños y las reservas de citas de tatuaje están dirigidos a{' '}
          <strong>mayores de 18 años</strong>. No recolectamos intencionalmente datos de menores sin autorización
          legal de sus representantes (Art. 7, Ley 1581 de 2012).
        </p>
      </div>

      <div>
        <h2>7. Derechos ARCO y Plazos Legales (Ley 1581 de 2012)</h2>
        <p>
          Como titular tienes derecho a <strong>conocer, actualizar, rectificar y suprimir</strong> tus datos,
          solicitar prueba de la autorización, ser informado sobre su uso, revocar tu autorización, acceder
          gratuitamente a tus datos y presentar quejas ante la{' '}
          <strong>Superintendencia de Industria y Comercio (SIC)</strong> previo agotamiento del trámite directo ante
          INKognito.
        </p>
        <ul>
          <li><strong>Consultas (Art. 14):</strong> respuesta en máximo <strong>10 días hábiles</strong> (prorrogable hasta 5 días hábiles adicionales informando motivos).</li>
          <li><strong>Reclamos (Art. 15):</strong> respuesta en máximo <strong>15 días hábiles</strong> (prorrogable hasta 8 días hábiles adicionales; si está incompleto se requiere en 5 días hábiles).</li>
        </ul>
        <p>
          Radica tus solicitudes en{' '}
          <a href="mailto:soporte@inkognito-ecosystem.com">soporte@inkognito-ecosystem.com</a>.
        </p>
      </div>

      <div>
        <h2>8. Vigencia y Cambios</h2>
        <p>
          Esta política rige desde la fecha indicada al inicio. Los cambios sustanciales se comunicarán antes o al
          momento de implementarlos conforme al Decreto 1074 de 2015.
        </p>
      </div>
    </>
  )
}

export default function PrivacidadArtistasPage() {
  return (
    <LegalPage title={PRIVACIDAD_ARTISTAS_TITLE} updated={PRIVACIDAD_ARTISTAS_UPDATED} theme="light">
      <PrivacidadArtistasContent />
    </LegalPage>
  )
}
