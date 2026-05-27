import { Link } from 'react-router-dom'

export default function NavbarSupply() {

  return (

    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-zinc-900">

      <div className="max-w-7xl mx-auto px-6">

        <div className="h-16 md:h-20 flex items-center justify-between">

          {/* LOGO */}
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em]">

            <span className="text-white">
              INK
            </span>

            <span className="text-zinc-500">
              OGNITO SUPPLY
            </span>

          </h1>

          {/* MENU */}
          <div className="hidden md:flex items-center gap-8">

            <a
  href="#productos"
  className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
>
  Productos
</a>




           <a
  href="#marcas"
  className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
>
  Marcas
</a>

            <button className="uppercase text-sm tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300">
              Contacto
            </button>

          </div>

          {/* VOLVER */}
          <Link
            to="/"
            className="uppercase text-sm tracking-[0.2em] text-zinc-500 hover:text-white transition-all duration-300"
          >
            Ecosistema
          </Link>

        </div>

      </div>

    </nav>

  )

}