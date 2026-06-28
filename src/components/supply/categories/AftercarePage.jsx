import SupplyCategoryPage from '../SupplyCategoryPage'

const guide = [
  { icon: '🧴', title: 'Espuma limpiadora', text: 'Para limpiar la zona antes y durante el tatuaje. Elimina sangre sin irritar.' },
  { icon: '🛡️', title: 'Film plastico', text: 'Cubre el tatuaje recien hecho. Ambiente humedo que acelera la cicatrizacion.' },
  { icon: '💧', title: 'Vaselina / Crema barrera', text: 'Capa delgada durante el proceso. Demasiada obstruye la vision del trabajo.' },
  { icon: '🌿', title: 'Crema de cicatrizacion', text: 'Para el cliente en casa. Sin alcohol ni fragancia. Hidratacion cuida el color.' },
  { icon: '📋', title: 'Instrucciones al cliente', text: 'Instrucciones claras reducen consultas post-sesion y protegen tu reputacion.' },
]

const faqs = [
  { q: 'Que productos para aftercare?', a: 'Crema sin fragancia ni alcohol. La vaselina funciona bien los primeros dias.' },
  { q: 'El film reemplaza el vendaje?', a: 'Si. Mas comodo y protege mejor. Se puede dejar 24-48 horas.' },
  { q: 'Venden kits de aftercare?', a: 'Consultamos disponibilidad por WhatsApp.' },
  { q: 'Envios?', a: 'Si, coordinamos por WhatsApp.' },
]

export default function AftercarePage() {
  return (
    <SupplyCategoryPage
      title="Cuidados"
      categoria="Cuidados"
      slug="aftercare"
      desc="Productos de cuidado y limpieza para tatuajes en Chigorodo, Uraba. Para tatuadores profesionales."
      intro="Un proceso limpio no solo protege al cliente. Lo que usas para cuidar el trabajo determina lo que deja tu firma."
      guide={guide}
      faqs={faqs}
    />
  )
}
