import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'
import {
  Moon, Droplets, Ban, Pill, Utensils, Sun, Shirt, Sparkles,
  Headphones, CalendarCheck, Clock, Hand, Hourglass, Dumbbell, MessageCircle
} from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'
import Seo from '../Seo'
const ogCuidados = '/og/josefoto-og.jpg'

const ANTES = [
  { icon: Moon, title: 'Descansa bien', text: 'Duerme al menos 7-8 horas la noche anterior para que tu cuerpo esté en óptimas condiciones.' },
  { icon: Droplets, title: 'Hidrátate correctamente', text: 'Toma suficiente agua los días previos para mantener tu piel saludable y facilitar el proceso de tatuado.' },
  { icon: Ban, title: 'Evita alcohol y sustancias', text: 'No consumas alcohol ni drogas al menos 24 horas antes de tu sesión, ya que afectan la circulación y la cicatrización.' },
  { icon: Pill, title: 'No tomes anticoagulantes', text: 'Evita aspirinas o ibuprofeno antes de la sesión, ya que pueden aumentar el sangrado.' },
  { icon: Utensils, title: 'Alimentación adecuada', text: 'Come una comida balanceada antes de tu cita para evitar mareos o debilidad durante la sesión.' },
  { icon: Sun, title: 'Cuida tu piel', text: 'No te expongas al sol ni llegues con quemaduras solares. No apliques cremas o lociones en la zona a tatuar el día de la sesión.' },
  { icon: Shirt, title: 'Usa ropa cómoda', text: 'Vístete con ropa que permita un fácil acceso a la zona donde se realizará el tatuaje.' },
  { icon: Sparkles, title: 'Higiene personal', text: 'Llega limpio y con la piel libre de productos, perfumes o aceites.' },
  { icon: Headphones, title: 'Lleva entretenimiento', text: 'Si la sesión será larga, puedes traer música, un libro o algo que te ayude a relajarte.' },
  { icon: CalendarCheck, title: 'Confirma tu cita', text: 'Asegúrate de estar puntual y en contacto con tu tatuador para cualquier ajuste de horario.' },
]

const DESPUES = [
  { icon: Clock, title: 'No apliques crema hasta después del tercer día', text: 'Es importante permitir que tu piel respire y comience a cicatrizar por sí sola antes de aplicar cremas. A partir del tercer día, usa una crema recomendada por tu tatuador, aplicándola en pequeñas cantidades y sin excederte.' },
  { icon: Droplets, title: 'Mantén el área limpia', text: 'Durante los primeros días, limpia tu tatuaje con agua a temperatura ambiente. No uses jabones ni otros productos que puedan irritar la piel. Seca con una toalla limpia o papel absorbente dando ligeros toques, sin frotar.' },
  { icon: Sun, title: 'Evita el sol y el agua estancada', text: 'El sol puede dañar la piel en proceso de cicatrización y hacer que los colores pierdan intensidad. Evita también piscinas, jacuzzis y el mar, ya que el agua estancada contiene bacterias que pueden causar infecciones.' },
  { icon: Hand, title: 'No retires las costras', text: 'Durante la cicatrización, tu tatuaje pasará por una fase en la que la piel se escamará y pequeñas costras se caerán solas. No las arranques ni rasques, ya que podrías afectar el color y la calidad del tatuaje.' },
  { icon: Shirt, title: 'Usa ropa holgada', text: 'Las prendas ajustadas pueden irritar el tatuaje y dificultar su cicatrización. Opta por ropa suelta y transpirable, especialmente en los primeros días.' },
  { icon: Hourglass, title: 'Sé paciente con el proceso', text: 'Si tu tatuaje es grande, es normal que pase por varias etapas en la cicatrización. En los primeros días puede verse opaco o con piel escamada. No te preocupes, esto es completamente normal y parte del proceso.' },
  { icon: Dumbbell, title: 'Evita el ejercicio intenso', text: 'El sudor y la fricción pueden afectar la cicatrización de tu tatuaje. Intenta no realizar ejercicios intensos durante los primeros días y evita movimientos que generen roce en la zona tatuada.' },
  { icon: MessageCircle, title: 'Consulta cualquier duda', text: 'Si notas algo inusual en tu tatuaje o tienes dudas sobre el proceso de cicatrización, comunícate con tu tatuador. Es mejor resolver cualquier inquietud a tiempo para garantizar una recuperación óptima.' },
]

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué debo hacer antes de mi sesión de tatuaje?',
      acceptedAnswer: { '@type': 'Answer', text: 'Duerme al menos 7-8 horas, hidrátate bien los días previos, come una comida balanceada antes de la cita y evita alcohol o drogas al menos 24 horas antes. No tomes aspirinas ni ibuprofeno, llega limpio, sin cremas en la zona a tatuar y con ropa cómoda.' },
    },
    {
      '@type': 'Question',
      name: '¿Cuándo puedo aplicar crema a mi tatuaje nuevo?',
      acceptedAnswer: { '@type': 'Answer', text: 'No apliques crema hasta después del tercer día: la piel necesita respirar y comenzar a cicatrizar por sí sola. A partir del tercer día usa una crema recomendada por tu tatuador, en pequeñas cantidades y sin excederte.' },
    },
    {
      '@type': 'Question',
      name: '¿Cómo limpio mi tatuaje recién hecho?',
      acceptedAnswer: { '@type': 'Answer', text: 'Durante los primeros días límpialo con agua a temperatura ambiente, sin jabones ni productos que irriten la piel. Seca con una toalla limpia o papel absorbente dando ligeros toques, sin frotar.' },
    },
    {
      '@type': 'Question',
      name: '¿Puedo tomar sol o nadar con un tatuaje recién hecho?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. El sol daña la piel en cicatrización y hace que los colores pierdan intensidad. Evita también piscinas, jacuzzis y el mar: el agua estancada contiene bacterias que pueden causar infecciones.' },
    },
    {
      '@type': 'Question',
      name: '¿Puedo hacer ejercicio después de tatuarme?',
      acceptedAnswer: { '@type': 'Answer', text: 'Evita el ejercicio intenso durante los primeros días: el sudor y la fricción afectan la cicatrización. Evita también movimientos que generen roce en la zona tatuada.' },
    },
    {
      '@type': 'Question',
      name: '¿Qué hago si veo algo inusual en mi tatuaje?',
      acceptedAnswer: { '@type': 'Answer', text: 'No arranques ni rasques las costras. Si notas algo inusual o tienes dudas sobre la cicatrización, comunícate con tu tatuador cuanto antes para garantizar una recuperación óptima.' },
    },
  ],
}

function CuidadoCard({ item, index }) {
  const Icon = item.icon
  return (
    <div className="snap-start flex-shrink-0 w-[calc(100vw-2rem)] md:w-full bg-black/40 p-8 border-l-4 border-zinc-600 rounded-r-lg hover:bg-black/60 transition-colors">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 text-zinc-300">
          <Icon size={22} />
        </div>
        <span className="text-zinc-600 font-black text-3xl italic">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="text-white font-bold uppercase tracking-wide mb-3">
        {item.title}
      </h3>
      <p className="text-gray-300 leading-relaxed font-light text-sm">
        {item.text}
      </p>
    </div>
  )
}

export default function CuidadosPage() {
  // la sección activa se deriva del hash de la URL (/cuidados#antes | /cuidados#despues)
  // cada link es de un solo sentido: muestra SOLO esa sección, no un selector entre ambas
  const { hash } = useLocation()
  const tab = hash === '#despues' ? 'despues' : 'antes'

  const HERO_TEXT = {
    antes: {
      title: <>Antes de tu <span className="text-zinc-600">Sesión</span></>,
      intro: 'Un buen tatuaje empieza con una buena preparación. Sigue estas recomendaciones para llegar listo a tu cita y sacarle el máximo provecho a tu sesión.',
    },
    despues: {
      title: <>Después de tu <span className="text-zinc-600">Sesión</span></>,
      intro: 'El cuidado no termina cuando sales del estudio. Sigue estas recomendaciones para una cicatrización perfecta y un tatuaje que luzca increíble por años.',
    },
  }[tab]

  return (
    <div className="min-h-screen bg-black text-white">

      <Seo
        title="Cuidados antes y después de tu tatuaje | Jose Humanez Tattoo"
        description="Guía completa de cuidados para tu tatuaje: qué hacer antes de tatuarte y cómo cuidar un tatuaje recién hecho para una cicatrización perfecta. Recomendaciones de Jose Humanez, tatuador en Chigorodó, Antioquia."
        image={ogCuidados}
        type="article"
        canonical={`${import.meta.env.VITE_SITE_URL}/cuidados`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(FAQ_JSONLD)}</script>
      </Helmet>

      <Navbar showInicio={true} />

      {/* VOLVER */}
      <div className="pt-24 md:pt-32 px-4 max-w-7xl mx-auto">
        <Link
          to="/jhumaneztattoo#cuidados"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </Link>
      </div>

      {/* HERO */}
      <section className="pt-6 md:pt-10 pb-10 md:pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
          {HERO_TEXT.title}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-6 font-light leading-relaxed">
          {HERO_TEXT.intro}
        </p>
        <div className="h-1 w-20 bg-zinc-600 mx-auto mt-8"></div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-7xl mx-auto px-4 pb-12 md:pb-24">

        {/* ANTES — ambos bloques quedan en el DOM para que Google indexe todo el contenido */}
        <div id="antes" className={tab === 'antes' ? '' : 'hidden'}>
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 scrollbar-hide">
            {ANTES.map((item, i) => (
              <CuidadoCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* DESPUES */}
        <div id="despues" className={tab === 'despues' ? '' : 'hidden'}>
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 scrollbar-hide">
            {DESPUES.map((item, i) => (
              <CuidadoCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>

      </section>

      {/* CIERRE + CTA */}
      <section className="border-t border-white/5 py-12 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">

          <p className="text-gray-300 text-lg leading-relaxed font-light">
            Gracias por tu confianza. Estamos comprometidos con brindarte la mejor experiencia.
            Sigue estas recomendaciones para asegurar un proceso cómodo y exitoso.
          </p>

          <div className="flex gap-5 justify-center">
            <a
              href="https://www.instagram.com/jhumaneztattoo?igsh=MXh4ZW9vaGZnMDVtZQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @jhumaneztattoo"
              className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-pink-500 hover:to-yellow-500 hover:border-transparent transition-all duration-300 hover:scale-110"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://www.facebook.com/share/172JDKdCqe/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Jose Humanez Tattoo"
              className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-white hover:bg-blue-600 hover:border-transparent transition-all duration-300 hover:scale-110"
            >
              <FaFacebookF size={20} />
            </a>
          </div>

          <div className="pt-4">
            <p className="text-white font-black uppercase tracking-widest mb-6">
              ¿Tienes dudas?
            </p>
            <a
              href="https://wa.me/573207911013?text=Hola%20Jose,%20tengo%20una%20duda%20sobre%20los%20cuidados%20de%20mi%20tatuaje"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded bg-zinc-600 text-white font-black text-sm uppercase tracking-widest hover:bg-green-500 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <FaWhatsapp size={20} />
              Escríbenos
            </a>
          </div>

        </div>
      </section>

      <Footer />
      <WhatsAppFloat />

    </div>
  )
}
