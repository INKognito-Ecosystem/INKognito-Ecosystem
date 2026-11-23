import LegalPage from '../legal/LegalPage'

export const TERMINOS_ARTISTAS_TITLE = 'Términos y Condiciones — INK (Tattoo Artist Colombia)'
export const TERMINOS_ARTISTAS_UPDATED = '23 de noviembre de 2026'
const DESCRIPTION =
  'Términos y condiciones del buscador nacional INK (Tattoo Artist Colombia): perfiles de artistas y estudios, reservas con anticipo, propiedad de diseños digitales, pagos vía Mercado Pago y responsabilidades.'

export function meta() {
  return [
    { title: `${TERMINOS_ARTISTAS_TITLE} | INKognito Ecosystem` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-colombia/terminos` },
  ]
}

// Contenido compartido entre /tattoo-artist-colombia/terminos (theme="light") y LegalModal.jsx (variant="artistas").
export function TerminosArtistasContent() {
  return (
    <>
      <div>
        <h2>En pocas palabras</h2>
        <ul>
          <li>
            <strong>Buscador e intermediario tecnológico:</strong> INK conecta clientes con artistas tatuadores y
            estudios en Colombia. Cada artista o estudio responde por sus citas, bioseguridad, precios y obras.
          </li>
          <li>
            <strong>Pagos directos al artista:</strong> Las reservas con anticipo y compras de diseños se pagan vía{' '}
            <strong>Mercado Pago</strong> con reparto automático (split); INKognito no retiene el dinero del artista.
          </li>
          <li>
            <strong>Diseños digitales:</strong> Compras una licencia de uso personal (para tatuarte o imprimir tu
            lámina); los derechos de autor siguen siendo del artista.
          </li>
          <li>
            <strong>Mayores de 18 años:</strong> Las reservas de tatuaje están dirigidas exclusivamente a mayores de
            edad.
          </li>
        </ul>
      </div>

      <div>
        <h2>1. Objeto y Rol de INKognito</h2>
        <p>
          <strong>INK (Tattoo Artist Colombia)</strong> es el buscador nacional de artistas tatuadores y estudios de
          tatuaje operado por <strong>INKognito Ecosystem</strong> (Chigorodó, Urabá, Antioquia, Colombia). En este
          módulo, INKognito actúa exclusivamente como <strong>portal de contacto y proveedor tecnológico</strong> (Art.
          53, Ley 1480 de 2011 y Ley 2439 de 2024): construye y mantiene la plataforma, pero no es empleador, socio,
          autor ni responsable del contenido, tarifas ni servicios presenciales prestados por cada artista o estudio.
        </p>
      </div>

      <div>
        <h2>2. Registro de Artistas y Estudios</h2>
        <ul>
          <li>
            Los artistas tatuadores y estudios de tatuaje pueden crear su perfil de forma gratuita y verificada por
            correo electrónico. Los estudios pueden vincular a los artistas que integran su equipo mediante
            invitaciones dentro de la plataforma.
          </li>
          <li>
            Cada artista o estudio es responsable de mantener veraz y actualizada su información (ciudad, ubicación,
            estilo, horarios, bloqueos de agenda, tarifas y canales de contacto) y de cumplir las normas sanitarias
            y de bioseguridad vigentes en Colombia.
          </li>
          <li>
            INKognito mantiene el registro de datos de contacto del oferente exigido por la normativa colombiana para
            garantizar la trazabilidad ante quejas o requerimientos de la{' '}
            <strong>Superintendencia de Industria y Comercio (SIC)</strong>.
          </li>
        </ul>
      </div>

      <div>
        <h2>3. Reservas con Anticipo, Reprogramación y Cancelaciones</h2>
        <ul>
          <li>
            Cuando un artista habilita su calendario de disponibilidad, el cliente puede reservar una fecha y hora
            pagando el anticipo publicado a través de Mercado Pago.
          </li>
          <li>
            El anticipo garantiza la separación exclusiva de ese espacio en la agenda del artista. Salvo acuerdo
            escrito distinto con el artista: las solicitudes de reprogramación deben coordinarse directamente con
            antelación razonable; la inasistencia sin aviso (<em>no-show</em>) o cancelación tardía por parte del
            cliente puede implicar la pérdida del anticipo; si el artista cancela y no acuerdan nueva fecha, deberá
            devolver el valor recibido al cliente.
          </li>
          <li>
            <strong>Requisito de edad:</strong> Las reservas de citas de tatuaje están dirigidas a{' '}
            <strong>mayores de 18 años</strong>. El artista es responsable de verificar la identidad y edad del
            cliente antes de realizar cualquier procedimiento.
          </li>
        </ul>
      </div>

      <div>
        <h2>4. Propiedad Intelectual y Compra de Diseños Digitales</h2>
        <p>
          Conforme a la <strong>Ley 23 de 1982</strong> y la <strong>Decisión Andina 351 de 1993</strong>, los
          portafolios, fotografías y diseños digitales publicados pertenecen exclusivamente a cada artista. Al subir
          contenido, el artista concede a INKognito una licencia limitada, no exclusiva y revocable para exhibirlo y
          promocionarlo dentro del ecosistema.
        </p>
        <p>
          Al comprar un diseño de tatuaje o lámina digital en un perfil, adquieres una{' '}
          <strong>licencia de uso personal</strong> (para tatuarte ese diseño o imprimir la lámina para uso propio).
          No adquieres los derechos patrimoniales de autor ni puedes revenderlo, redistribuirlo o explotarlo
          comercialmente.
        </p>
        <p>
          <strong>Exclusión de retracto en contenido digital:</strong> Conforme al Art. 47 de la Ley 1480 de 2011,
          una vez entregado o descargado un diseño digital, no aplica derecho de retracto, sin perjuicio de soporte
          técnico si el archivo presenta fallas.
        </p>
      </div>

      <div>
        <h2>5. Garantía sobre el Contenido Publicado</h2>
        <p>
          Al publicar fotos, portafolio, diseños o textos en tu perfil o estudio, garantizas que eres su titular o
          cuentas con autorización legítima (incluyendo autorización de uso de imagen de los clientes tatuados), y que
          no infringes derechos de terceros ni publicas material ilegal, ofensivo o engañoso.
        </p>
      </div>

      <div>
        <h2>6. Pagos y Comisiones (Mercado Pago)</h2>
        <p>
          Las compras de diseños y las reservas con anticipo se procesan mediante{' '}
          <strong>Mercado Pago Checkout Pro</strong> con dispersión automática directa a la cuenta de Mercado Pago
          del artista (split OAuth). INKognito cobra una comisión fija transparente por transacción y en ningún
          momento retiene ni administra el dinero del artista. Para pagos electrónicos aplican las reglas legales de
          reversión del pago del <strong>Decreto 587 de 2016</strong> cuando se configure alguna de sus 5 causales.
        </p>
      </div>

      <div>
        <h2>7. Responsabilidad del Servicio e Indemnización</h2>
        <p>
          INKognito facilita el descubrimiento, la agenda y el pago, pero no participa ni supervisa la sesión de
          tatuaje. La bioseguridad, esterilidad, ejecución artística, cumplimiento de citas y resultado del servicio
          son responsabilidad exclusiva del artista o estudio, quien se obliga a responder directamente por cualquier
          reclamo, daño o disputa y a mantener indemne a INKognito.
        </p>
      </div>

      <div>
        <h2>8. Remoción de Perfiles o Contenido</h2>
        <p>
          INKognito podrá suspender, desactivar o eliminar perfiles, estudios, horarios o diseños que incumplan estos
          términos, presenten reportes verificados de fraude o suplantación, o afecten la seguridad de la comunidad,
          sin que ello genere derecho a compensación.
        </p>
      </div>

      <div>
        <h2>9. Enlaces Externos, Ley Aplicable y Contacto</h2>
        <p>
          Los perfiles enlazan al WhatsApp e Instagram de cada artista o estudio; al salir de INK aplican los términos
          de Meta/WhatsApp. Estos términos se rigen por las leyes de la <strong>República de Colombia</strong>.
        </p>
        <p>
          <strong>Contacto y PQR:</strong>{' '}
          <a href="mailto:inkognitoecosystem@gmail.com">inkognitoecosystem@gmail.com</a> · WhatsApp:{' '}
          <a href="https://wa.me/573207911013" target="_blank" rel="noreferrer">
            +57 320 791 1013
          </a>
        </p>
      </div>
    </>
  )
}

export default function TerminosArtistasPage() {
  return (
    <LegalPage title={TERMINOS_ARTISTAS_TITLE} updated={TERMINOS_ARTISTAS_UPDATED} theme="light">
      <TerminosArtistasContent />
    </LegalPage>
  )
}
