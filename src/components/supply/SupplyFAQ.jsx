import AccordionCard from './AccordionCard'

// Preguntas frecuentes de una página de marca (2026-08-09) — reemplaza el
// bloque <AccordionCard icon="❓"...>{faq.map(...)}</AccordionCard> que
// antes se repetía a mano en cada una de las 12 páginas de marca. `items`
// ya viene combinado (general + marca) desde fetchSupplyFaq() en el
// loader — este componente es puramente presentacional. Las 10 páginas
// de categoría NO usan esto — siguen pasando `faqs` directo a
// SupplyCategoryPage.jsx, que ya sabía pintarlo antes de este cambio.
export default function SupplyFAQ({ items, nombre }) {
  if (!items?.length) return null
  return (
    <section className="mt-10 md:mt-14">
      <AccordionCard
        icon="❓"
        title="Preguntas frecuentes"
        subtitle={`Todo lo que necesitas saber sobre ${nombre} antes de tu pedido. Toca para ver las respuestas.`}
      >
        <div className="flex flex-col gap-5">
          {items.map((item, i) => (
            <div key={item.id} className={i < items.length - 1 ? 'pb-5 border-b border-zinc-800' : ''}>
              <p className="font-bold text-white text-sm mb-2">{item.pregunta}</p>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.respuesta}</p>
            </div>
          ))}
        </div>
      </AccordionCard>
    </section>
  )
}
