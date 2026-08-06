import LegalPage from '../legal/LegalPage'

const TITLE = 'Términos y Condiciones — Tattoo Artist Colombia'
const DESCRIPTION = 'Términos y condiciones del directorio de artistas Tattoo Artist Colombia: propiedad de los diseños, pagos por Mercado Pago y responsabilidad del servicio.'

export function meta() {
  return [
    { title: `${TITLE} | INKognito` },
    { name: 'description', content: DESCRIPTION },
    { tagName: 'link', rel: 'canonical', href: `${import.meta.env.VITE_SITE_URL}/tattoo-artist-colombia/terminos` },
  ]
}

// Página propia del módulo (2026-08-06, Jose: "este ser un módulo
// especial así que deberá aparecer solo su información de artistas, de
// privacidad y de pagos" — no mezclar con Supply/Store/Gym, que son un
// negocio distinto con su propia lógica de catálogo/WhatsApp). theme
// "light" porque el módulo de artistas es blanco/rojo/gris en todas sus
// otras pantallas, no el fondo negro del resto del ecosistema.
//
// Secciones 4/6/7 (garantía de contenido, indemnización, remoción)
// agregadas tras revisar los términos reales de Tattoodo (2026-08-06) —
// se descartó copiar su comisión del 20%/multa por cerrar fuera de la
// plataforma (contradice que acá el WhatsApp se queda libre y gratis) y
// su modelo de "la plata pasa primero por la plataforma" (contradice el
// Split de Mercado Pago, pago directo al artista). Sí se adoptó el
// principio de que el artista responde por su propio servicio y por lo
// que sube, protegiendo a INKognito como intermediario tecnológico.
export default function TerminosArtistasPage() {
  return (
    <LegalPage title={TITLE} updated="6 de agosto de 2026" theme="light">
      <div>
        <h2>1. Objeto</h2>
        <p>
          Tattoo Artist Colombia es un directorio de tatuadores operado por INKognito. En este
          directorio, INKognito actúa únicamente como estudio de desarrollo: construye y mantiene la
          plataforma tecnológica, pero no es el autor, propietario ni responsable del contenido que
          cada artista publica en su perfil (fotos, portafolio, diseños, textos). Cada artista es
          responsable de la veracidad y legalidad de lo que publica.
        </p>
      </div>

      <div>
        <h2>2. Registro y perfil del artista</h2>
        <p>
          Cualquier tatuador puede crear su perfil gratis. El artista es responsable de mantener
          actualizada su información (ubicación, estilo, disponibilidad, precios) y de la calidad y
          licitud de las fotos y diseños que sube.
        </p>
      </div>

      <div>
        <h2>3. Propiedad de los diseños</h2>
        <p>
          Los diseños de tatuaje y láminas digitales que se venden dentro de un perfil son propiedad
          del artista que los sube, no de INKognito. Al comprar un diseño adquieres el derecho a
          tatuártelo (si es un diseño exclusivo de tatuaje) o a imprimirlo para uso personal (si es una
          lámina) — no adquieres los derechos de autor de la obra, y no puedes reproducirla, revenderla
          ni usarla con fines comerciales.
        </p>
      </div>

      <div>
        <h2>4. Garantía sobre el contenido que subes</h2>
        <p>
          Al subir fotos, diseños o cualquier contenido a tu perfil, garantizas que te pertenece o que
          tienes autorización para usarlo, y que no infringe derechos de terceros ni contiene material
          ilegal, ofensivo o engañoso. Eres el único responsable frente a cualquier reclamo relacionado
          con ese contenido.
        </p>
      </div>

      <div>
        <h2>5. Pagos</h2>
        <p>
          Las compras de diseños y las reservas con anticipo se pagan a través de Mercado Pago, con
          reparto automático directo a la cuenta del artista correspondiente — INKognito cobra una
          comisión fija por transacción, pero en ningún momento retiene ni administra el dinero del
          artista. INKognito no procesa ni almacena datos de tarjetas; eso lo maneja Mercado Pago
          directamente.
        </p>
      </div>

      <div>
        <h2>6. Responsabilidad del servicio e indemnización</h2>
        <p>
          INKognito facilita el contacto y el pago, pero no participa en la sesión de tatuaje ni la
          supervisa. La calidad, el cumplimiento de citas y el resultado del servicio son
          responsabilidad exclusiva del artista — esa relación es directamente entre el cliente y el
          artista.
        </p>
        <p>
          El artista se compromete a responder directamente por cualquier reclamo, lesión, daño o
          disputa que surja de su servicio o de su contenido, y a mantener a INKognito libre de
          responsabilidad frente a esos reclamos.
        </p>
      </div>

      <div>
        <h2>7. Remoción de contenido o perfiles</h2>
        <p>
          INKognito puede desactivar o eliminar, a su criterio, cualquier perfil, diseño o contenido que
          incumpla estos términos, sin que eso genere derecho a compensación.
        </p>
      </div>

      <div>
        <h2>8. Enlaces a WhatsApp y redes sociales</h2>
        <p>
          Los perfiles enlazan directo al WhatsApp e Instagram de cada artista. Una vez sales del sitio
          hacia esas plataformas, aplican los términos y políticas de privacidad propios de
          Meta/WhatsApp, ajenos a nuestro control.
        </p>
      </div>

      <div>
        <h2>9. Ley aplicable</h2>
        <p>
          Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se
          someterá a la jurisdicción de los jueces competentes en Colombia.
        </p>
      </div>

      <div>
        <h2>10. Modificaciones</h2>
        <p>
          Podemos actualizar estos términos en cualquier momento. La fecha de última actualización
          aparece al inicio de este documento.
        </p>
      </div>

      <div>
        <h2>11. Contacto</h2>
        <p>inkognitoecosystem@gmail.com</p>
      </div>
    </LegalPage>
  )
}
