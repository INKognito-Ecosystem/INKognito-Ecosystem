import LegalPage from '../legal/LegalPage'

const TITLE = 'Política de Privacidad — Tattoo Artist Colombia'
const DESCRIPTION = 'Política de privacidad del directorio de artistas Tattoo Artist Colombia: qué datos recolectamos de artistas y clientes, y tus derechos como titular.'

export function meta() {
  return [
    { title: `${TITLE} | INKognito` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-colombia/privacidad` },
  ]
}

// Página propia del módulo (2026-08-06, Jose) — mismo criterio que
// TerminosArtistasPage.jsx: solo información de artistas/clientes de
// este directorio, sin mezclar con el resto del ecosistema.
export default function PrivacidadArtistasPage() {
  return (
    <LegalPage title={TITLE} updated="6 de agosto de 2026" theme="light">
      <div>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          INKognito, con sede en Chigorodó, Urabá, Antioquia, Colombia, opera Tattoo Artist Colombia
          como estudio de desarrollo de software — es responsable del tratamiento de los datos
          personales que se describen en esta política dentro de este directorio.
        </p>
        <p>
          <strong>Contacto para temas de privacidad:</strong> inkognitoecosystem@gmail.com
        </p>
      </div>

      <div>
        <h2>2. Datos de artistas</h2>
        <p>
          Al crear tu perfil recolectamos: nombre, municipio/departamento (y ubicación exacta, si la
          activas), estilo, bio, WhatsApp, redes sociales, correo, y las fotos/diseños que subas. Si
          conectas Mercado Pago, guardamos el token de acceso de tu cuenta (no tus datos bancarios ni de
          tarjeta — eso lo administra Mercado Pago) para poder crear los cobros de tus ventas y
          reservas.
        </p>
      </div>

      <div>
        <h2>3. Datos de clientes</h2>
        <p>
          Al comprar un diseño o reservar con un artista, recolectamos tu correo (y, en reservas,
          nombre y WhatsApp) para poder enviarte la confirmación y para que el artista pueda contactarte
          y coordinar la cita. Estos datos se comparten con el artista correspondiente — es necesario
          para que el servicio funcione.
        </p>
      </div>

      <div>
        <h2>4. Pagos</h2>
        <p>
          Los pagos se procesan directamente por Mercado Pago. INKognito no ve ni almacena tu número de
          tarjeta ni otros datos financieros — solo recibe la confirmación de si el pago fue aprobado.
        </p>
      </div>

      <div>
        <h2>5. Con quién compartimos datos</h2>
        <p>
          Con el artista correspondiente (datos de contacto de quien compra o reserva) y con Mercado
          Pago (para procesar el pago). No compartimos tus datos con otras empresas ni los usamos con
          fines distintos a los descritos en esta política.
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
          Para ejercer cualquiera de estos derechos, escríbenos a inkognitoecosystem@gmail.com.
        </p>
      </div>

      <div>
        <h2>7. Vigencia y cambios</h2>
        <p>
          Esta política puede actualizarse para reflejar cambios en el directorio o en la normativa
          aplicable. La fecha de la última actualización siempre aparece al inicio de este documento.
        </p>
      </div>
    </LegalPage>
  )
}
