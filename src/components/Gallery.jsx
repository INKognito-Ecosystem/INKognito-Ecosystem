import React from 'react';
// IMPORTA CADA IMAGEN AQUÍ ABAJO:
import imgPoseidon from '../assets/portafolio/poseidon.jpg';
import imgPoseidon2 from '../assets/portafolio/poseidon2.jpg';
import imgAguila from '../assets/portafolio/aguila.jpg';
import imgAngelCaido from '../assets/portafolio/angel caido.jpg'; 
import imgColibri from '../assets/portafolio/colibri.jpg';
import Ojoyfiligrana from '../assets/portafolio/ojoyfiligrana.jpg';
import imgLineafina from '../assets/portafolio/lineafina.jpg';
import milogo from '../assets/milogo/milogo.png';
import imgmifoto from '../assets/mifoto/josefoto.jpg';

const GALLERY_ITEMS = [
  { id: 1, title: 'Sombras', img: imgPoseidon, category: 'Realismo' },
  { id: 2, title: 'Sombras', img: imgPoseidon2, category: 'Realismo' },
  { id: 3, title: 'Sombras', img: imgAguila, category: 'Realismo' },
  { id: 4, title: 'Minimalista', img: imgAngelCaido, category: 'línea fina' },
  { id: 5, title: 'Sombras', img: imgColibri, category: 'Realismo' },
  { id: 6, title: 'Sombras', img: Ojoyfiligrana, category: 'Realismo' },
  { id: 7, title: 'Minimalista', img: imgLineafina, category: 'línea fina' },
]

export default function Gallery() {
  return (
    <section id="galeria" className="py-24 bg-black">

      <div className="max-w-7xl mx-auto px-4">

        {/* TITULO */}
        <div className="text-center mb-16">

          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase">
            Portafolio
          </h2>

          <div className="h-1 w-20 bg-zinc-600 mx-auto"></div>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {GALLERY_ITEMS.map((item) => (

            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg aspect-square bg-gray-900"
            >

              <img
                src={item.img}
                alt={item.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">

                <p className="text-zinc-300 text-sm font-bold uppercase tracking-widest mb-1">
                  {item.category}
                </p>

                <h3 className="text-white text-2xl font-black italic">
                  {item.title}
                </h3>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  )
}