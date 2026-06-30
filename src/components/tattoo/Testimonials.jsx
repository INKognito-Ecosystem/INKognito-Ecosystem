const REVIEWS = [
  { id: 1, name: "Jhon cardona", text: "La atención al detalle en mi tatuaje de realismo fue increíble. Superó mis expectativas.", role: "Cliente frecuente" },
  { id: 2, name: "Mariana L.", text: "Higiene impecable y un ambiente muy profesional. Mi primer tatuaje y me sentí muy segura.", role: "Nuevo cliente" },
  { id: 3, name: "Andrés M.", text: "El mejor estudio de la ciudad para estilos tradicionales. Los colores siguen vibrantes.", role: "Coleccionista de arte" },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="pt-6 md:pt-12 pb-12 md:pb-24 bg-tattoo-dark">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center mb-8 md:mb-16">
          <div className="w-full max-w-4xl bg-white text-black py-4 rounded shadow-lg">
            <h2 className="text-base sm:text-2xl md:text-4xl font-black uppercase tracking-tight sm:tracking-widest text-center whitespace-nowrap px-2">
              Lo que dicen nuestros clientes
            </h2>
          </div>
        </div>

        <div className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 scrollbar-hide">
          {REVIEWS.map((review) => (
            <div key={review.id} className="snap-start flex-shrink-0 w-[calc(100vw-2rem)] md:w-80 lg:w-96 bg-black/40 p-8 border-l-4 border-tattoo-accent rounded-r-lg hover:bg-black/60 transition-colors">
              <div className="text-tattoo-accent text-4xl mb-4 font-serif">"</div>
              <p className="text-gray-300 italic mb-6 leading-relaxed">"{review.text}"</p>
              <div>
                <h4 className="font-bold text-white">{review.name}</h4>
                <p className="text-tattoo-accent/60 text-xs uppercase tracking-tighter">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}