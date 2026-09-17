import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, Home, LayoutGrid, ShoppingCart, Menu as MenuIcon, X, Store, PlusCircle, GraduationCap, Globe, FileText, Shield, UserCircle } from 'lucide-react'
import { categories } from './CategoriesSupply'
import BrandsMarquee from './BrandsMarquee'
import SupplyProductCard from './SupplyProductCard'
import CartDrawerSupply from './CartDrawerSupply'
import InkognitoModuleMenu from '../InkognitoModuleMenu'
import LegalModal from '../legal/LegalModal'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import { useLoadMore, fetchCatalogPage } from '../../hooks/useCatalog'
import logoSupply from '../../assets/milogo/supply.webp'
import bannerBg from '../../assets/supply/banner-tattoo-swirl.jpg'
import { irAMiSupply } from '../../lib/supplyTienda'

// Home móvil de Supply en formato marketplace (2026-09-14, boceto + mockup
// aprobados por Jose) — reemplaza SOLO en móvil a NavbarSupply/HeroSupply/
// CategoriesSupply/BrandsSupply (que siguen intactos para desktop, ver
// SupplyPage.jsx). Local por ahora, sin push.
//
// Textos del banner y del carrusel de marcas son los MISMOS que ya existen
// en HeroSupply.jsx — Jose fue explícito: no inventar copy nuevo, reusar
// "Professional Tattoo Equipment" y "De un tatuador, para tatuadores."
export default function MobileHomeSupply({ imgs = {}, initialProducts }) {
  const navigate = useNavigate()
  const { count } = useSupplyCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // legalOpen (2026-09-15, Jose: "el modal abre directo donde estoy...
  // blanco... ocupa toda la pantalla" — mismo patrón que EcosystemNavbar.jsx).
  const [legalOpen, setLegalOpen] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState(null) // null = sin búsqueda activa

  const { items, hasMore, loading, loadMore } = useLoadMore('supply', {}, initialProducts)
  const yaHizoScroll = useRef(false)

  // Sin tildes/mayúsculas — mismo criterio que SupplyCategoryPage.jsx
  // (normaliza) para que "cartucho" encuentre "Cartuchos".
  const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

  // Búsqueda global del módulo (todas las categorías a la vez) — mismo
  // debounce de 300ms que ya usa SupplyCategoryPage.jsx, mismo
  // fetchCatalogPage de siempre, sin cursor propio (primera página nada
  // más — la búsqueda por categoría con "cargar más" ya existe en cada
  // página de categoría).
  //
  // También filtra por CATEGORÍA (2026-09-15, Jose: "también se debe
  // filtrar por categoría, no es necesario especificar el nombre del
  // producto") — si lo escrito coincide con el nombre de una categoría
  // (ej. "cartucho" → "Cartuchos"), suma también los productos de esa
  // categoría completa, no solo los que calzan por nombre de producto.
  useEffect(() => {
    const q = busqueda.trim()
    // Bug real (2026-09-15, Jose: "al borrar, destacado queda cargando y
    // no retorna si no hasta que recargo la página") — el return
    // temprano no reseteaba `buscando`, así que si quedaba en `true`
    // desde la búsqueda anterior, "Buscando…" se quedaba en pantalla
    // para siempre en vez de volver a mostrar Destacados.
    if (q.length < 2) { setResultados(null); setBuscando(false); yaHizoScroll.current = false; return }
    setBuscando(true)
    const t = setTimeout(async () => {
      const qNorm = normaliza(q)
      const categoriaCoincide = categories.find(c => normaliza(c.cat).includes(qNorm))
      const [porNombre, porCategoria] = await Promise.all([
        fetchCatalogPage('supply', { q, limit: 12 }),
        categoriaCoincide
          ? fetchCatalogPage('supply', { categoria: categoriaCoincide.cat, tipo: 'fisico', limit: 12 })
          : Promise.resolve({ items: [] }),
      ])
      const mapa = new Map()
      for (const item of [...porCategoria.items, ...porNombre.items]) {
        mapa.set(`${item.name}-${item.estudio_id ?? 'x'}`, item)
      }
      const nuevosResultados = [...mapa.values()]
      setResultados(nuevosResultados)
      setBuscando(false)
      // Scroll a los resultados UNA sola vez por búsqueda activa, pero
      // solo cuando de verdad HAY algo que mostrar (2026-09-15, corregido
      // — Jose: "si ya apareció algo, debe hacer scroll con una sola
      // letra o con el nombre completo de un producto"). Antes se
      // disparaba apenas el texto llegaba a 2 caracteres, sin importar si
      // esos 2 caracteres ya traían resultados reales — si no traían
      // nada, el scroll se "gastaba" ahí (yaHizoScroll queda en true) y
      // ya no volvía a dispararse aunque después, con más letras, sí
      // aparecieran resultados de verdad. "Certero" (Jose, corrección
      // anterior): mide el alto REAL de la barra sticky en vez de confiar
      // en el scroll-padding-top global de index.css (calibrado para el
      // navbar de 80px de otras páginas, no para esta barra propia de
      // MobileHomeSupply) — así la card queda exacta, justo debajo del
      // navbar, sin hueco ni quedar tapada.
      if (nuevosResultados.length > 0 && !yaHizoScroll.current) {
        const el = document.getElementById('grid-mobile')
        const bar = document.querySelector('.sticky.top-0')
        if (el) {
          const barH = bar?.getBoundingClientRect().height ?? 0
          const y = el.getBoundingClientRect().top + window.scrollY - barH
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
        yaHizoScroll.current = true
      }
    }, 300)
    return () => clearTimeout(t)
  }, [busqueda])

  const gridItems = resultados ?? items

  return (
    <div className="md:hidden bg-white text-zinc-900">

      {/* TOP BAR — logo + buscador + campana. Blanco (2026-09-15, Jose:
          "convierte la page principal, en formato blanco... desde sus dos
          navbar hasta el footer") — mismos tokens que ya usa NavbarCategory
          en su versión light (bg-white/95, border-zinc-200, input
          bg-zinc-50). */}
      <div className="sticky top-0 z-40 flex items-center gap-2 px-4 py-3 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <Link to="/supply" className="flex-shrink-0">
          <img src={logoSupply} alt="INKognito Supply" className="w-12 h-12 object-contain" />
        </Link>
        <div className="flex-1 flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-2 min-w-0">
          <Search size={14} className="text-zinc-400 flex-shrink-0" />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar tintas, agujas, máquinas..."
            className="flex-1 min-w-0 bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
        {/* Campana visual por ahora — Supply no tiene notificaciones todavía */}
        <button className="flex-shrink-0 w-9 h-9 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500">
          <Bell size={16} />
        </button>
      </div>

      {/* CATEGORÍAS — franja azul sólida (2026-09-15, mismo tratamiento que
          se armó para Cartuchos en SupplyCategoryPage.jsx: "el listón de
          las categorías pasa a azul"). Ya llega borde a borde sola (esta
          página no envuelve sus secciones en un contenedor con padding
          propio), sin necesitar el truco -mx/px de allá. */}
      <div id="categorias-mobile" className="flex gap-5 overflow-x-auto px-4 py-3 bg-blue-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className={`flex-shrink-0 text-[13px] font-extrabold pb-1.5 border-b-2 whitespace-nowrap ${!resultados ? 'text-white border-white' : 'text-blue-100 border-transparent'}`}>
          Todos
        </span>
        {categories.map(cat => (
          <Link
            key={cat.name}
            to={cat.path}
            className="flex-shrink-0 text-[13px] font-extrabold text-blue-100 pb-1.5 border-b-2 border-transparent whitespace-nowrap"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* BANNER — más ancho que el resto, texto igual al de HeroSupply.jsx.
          Compacto sin botón CTA (2026-09-14); un poco más alto (2026-09-15).
          Sigue igual, con su azul traslúcido (2026-09-15, Jose, al pasar
          el resto de la página a blanco) — text-white explícito acá
          porque el título ("Professional"/"Equipment") no tiene color
          propio, hereda del contenedor; sin esto quedaba negro-sobre-negro
          en cuanto la raíz de la página pasó a texto oscuro.
          Foto de fondo (2026-09-15, Jose subió "referencia banner" a
          Obsidian) — imagen vertical original, rotada 90° para que su
          lado largo quede horizontal y encaje en un banner ancho, no
          alto. opacity-35 (subido desde 20, Jose: "pon más opacidad...
          para que se vea más opaco") para que quede más presente sin
          dejar de ser textura de fondo — el degradado azul y el fondo
          oscuro de antes se quedan ENCIMA de la foto (no al revés), para
          que el resplandor siga leyéndose igual de claro. "Tattoo" y
          "Colombia" probaron rojo/amarillo y volvieron a su azul de
          siempre (Jose, misma sesión: "restaura el color"). */}
      <div
        className="mx-2 mt-3 rounded-2xl border border-blue-500/30 px-4 py-6 relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(145deg,#0e1626,#07090d)' }}
      >
        {/* brightness-50 (2026-09-15, Jose: "algunas letras claras no se
            están distinguiendo bien... que el banner se vea más oscuro
            la imagen") — el swirl es blanco brillante sobre negro; al
            subir la opacidad esos brillos empezaron a competir con el
            texto blanco de encima. Oscurecer la FOTO (no el texto) para
            que siga sumando textura sin pelear con "PROFESSIONAL"/
            "EQUIPMENT". */}
        <img src={bannerBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 brightness-50" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 88% 28%, rgba(59,130,246,.28), transparent 55%)' }}
        />
        <div className="relative z-10">
          <p className="text-blue-500 text-[9px] font-bold uppercase tracking-[0.3em] mb-2">
            INKognito Supply — Colombia
          </p>
          <h2 className="text-lg font-black uppercase leading-[0.95]">
            Professional <span className="text-blue-500">Tattoo</span> Equipment
          </h2>
          <p className="text-zinc-400 text-[10.5px] mt-2 max-w-[230px] leading-snug">
            Ecosistema de distribución de insumos profesionales.
          </p>
        </div>
        {/* Checks de cobertura/confianza (2026-09-15) — texto completo, en
            una sola fila, alineados a la altura de "profesionales." (2da
            línea del subtítulo), aprovechando el espacio libre a su
            derecha. Posición absoluta: no suma altura al banner. Hermano
            del wrapper de texto (relative z-10), no hijo — así su
            `bottom` sigue midiendo contra el div exterior de siempre, no
            contra el wrapper nuevo que se agregó para la foto de fondo
            (quedaba mal calculado adentro, se superponía con el título). */}
        <div className="absolute right-4 bottom-[26px] left-[108px] z-10 flex flex-nowrap justify-between gap-1">
          {['Stock verificado', 'Despacho directo', 'Cobertura nacional'].map(g => (
            <span key={g} className="flex items-center gap-0.5 text-[7.5px] font-bold text-zinc-300 whitespace-nowrap">
              <span className="text-green-500">✓</span> {g}
            </span>
          ))}
        </div>
      </div>

      {/* MARCAS — mismo BrandsMarquee y mismas frases del hero, justo debajo del banner */}
      <div className="mt-6">
        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-semibold">
          Marcas referentes en la industria
        </p>
        <BrandsMarquee imgs={imgs} light />
        <p className="mt-4 text-center text-xs italic tracking-wide text-zinc-500">
          &ldquo;De un tatuador, para tatuadores.&rdquo;
        </p>
      </div>

      {/* GRID DE PRODUCTOS — paginado real (fetchCatalogPage/useLoadMore) */}
      <div id="grid-mobile" className="px-4 mt-8">
        <h2 className="text-lg font-black uppercase mb-3">{resultados ? 'Resultados' : 'Destacados'}</h2>
        {buscando ? (
          <p className="text-zinc-500 text-xs">Buscando…</p>
        ) : gridItems.length === 0 ? (
          <p className="text-zinc-500 text-xs">Ningún producto coincide con tu búsqueda.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* light (2026-09-15, Jose: "la card del producto debe
                mostrarse actualizada en la cantidad de información que
                contiene") — esta grilla se había quedado con la card
                vieja (con "Suministrado por...", nombre grande) mientras
                el resto de Supply ya usa la versión nueva. */}
            {gridItems.map(item => (
              <SupplyProductCard key={`${item.name}-${item.estudio_id ?? 'x'}`} item={item} categoria={item.categoria} light />
            ))}
          </div>
        )}
        {!resultados && hasMore && (
          <div className="flex justify-center mt-5">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-2.5 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-[0.15em] rounded hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Cargando…' : 'Cargar más'}
            </button>
          </div>
        )}
      </div>

      {/* espacio para que el tab bar fijo no tape el último contenido */}
      <div className="h-20" />

      {/* TAB BAR INFERIOR — Inicio / Categorías / Carrito / Menú. Blanco
          (2026-09-15) — mismos tokens que ya usa SupplyMobileNav.jsx en su
          versión light (fondo blanco, borde blue-500/20 conservado tal
          cual, íconos negros). */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center bg-white/95 backdrop-blur-md border-t border-blue-500/20 py-2.5">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1 text-blue-500">
          <Home size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Inicio</span>
        </button>
        {/* Antes hacía scroll a la tira de texto de categorías del home
            (2026-09-15, Jose: "quiero que el botón categorías abra una
            page nueva... con card y foto, como estaban antes") — mismo
            destino que ya usa SupplyMobileNav.jsx en el resto de Supply. */}
        <Link to="/supply/categorias" className="flex flex-col items-center gap-1 text-black">
          <LayoutGrid size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Categorías</span>
        </Link>
        <button onClick={() => setDrawerOpen(true)} className="relative flex flex-col items-center gap-1 text-black">
          <ShoppingCart size={19} />
          {count > 0 && (
            <span className="absolute -top-1 right-1 w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] font-black flex items-center justify-center">
              {count > 9 ? '9+' : count}
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-wide">Carrito</span>
        </button>
        <button onClick={() => setMenuOpen(true)} className="flex flex-col items-center gap-1 text-black">
          <MenuIcon size={19} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Menú</span>
        </button>
      </div>

      <CartDrawerSupply open={drawerOpen} onClose={() => setDrawerOpen(false)} light />

      {/* MENÚ — pantalla completa (2026-09-15, antes era un sheet chico que
          dejaba ver el fondo; mismo contenido que el dropdown de NavbarSupply).
          Blanco (2026-09-15) — mismos tokens que la versión light de
          SupplyMobileNav.jsx. */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <img src={logoSupply} alt="INKognito Supply" className="w-12 h-12 object-contain" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Menú</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-zinc-500 p-1"><X size={22} /></button>
          </div>
          {/* Jerarquía por secciones (2026-09-15, Jose: "armalo para los 4
              [navbars de Supply], tal como lo hicimos con el home del
              ecosistema y con INK") — mismo criterio: eyebrow + divisores
              agrupando por tema, en vez de la lista plana de siempre.
              Términos/Privacidad se suman por primera vez acá (Jose: "debería
              ir políticas y privacidad en esos botones tal como en INK y en
              el home del ecosistema") — Supply no tiene su propia página
              legal, así que apuntan a las mismas /terminos y /privacidad
              que ya usa FooterSupply.jsx. */}
          <div className="flex-1 overflow-y-auto">
            <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">Proveedores</p>
            <Link to="/supply/proveedores" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-[15px] font-medium text-zinc-800">
              <Store size={18} className="flex-shrink-0" />
              Tiendas verificadas
            </Link>
            <Link to="/supply/proveedores/unete" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-[15px] font-medium text-zinc-800">
              <PlusCircle size={18} className="flex-shrink-0" />
              Registrar mi Supply
            </Link>

            <div className="border-t border-zinc-100" />
            <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">Aprende</p>
            {/* Va a la page de Cursos, no a la sección de la home
                (2026-09-15, Jose) — ahí ya se ve la franja con Kit y
                Recursos al lado, mismo patrón que Categorías. */}
            <Link to="/supply/aprende/cursos" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-[15px] font-medium text-zinc-800">
              <GraduationCap size={18} className="flex-shrink-0" />
              Educación para el artista
            </Link>

            <div className="border-t border-zinc-100" />
            {/* Mi cuenta/perfil (2026-09-17, Jose: "en el botón hamburguesa
                de supply no veo el ítem de cuenta/perfil, y que este
                también lleve al perfil de quien tiene una tienda
                registrada") — irAMiSupply revisa si ya hay un Supply con
                token guardado en este navegador y lo abre directo con su
                botón de gestión; si no, cae al flujo de siempre (correo →
                INK) — ver supplyTienda.js. Esta es la home de Supply
                (MobileHomeSupply.jsx), con su propio menú aparte del de
                SupplyMobileNav.jsx (categorías/marcas) — el mismo ítem se
                suma en ambos. */}
            <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">Mi cuenta/perfil</p>
            <button type="button" onClick={() => { setMenuOpen(false); irAMiSupply(navigate) }} className="flex items-center gap-3 w-full text-left px-6 py-4 text-[15px] font-medium text-zinc-800">
              <UserCircle size={18} className="flex-shrink-0" />
              Mi Supply
            </button>

            <div className="border-t border-zinc-100" />
            {/* only=['store'] + extraLinks (2026-09-15, Jose: "el botón
                inkognito store se llamará Moda y estilo... quitaremos el
                de suple, lo reemplazaremos por el de INK, pero el buscador
                debe ir arriba y Moda y estilo abajo") — extraLinks pinta
                ANTES que la lista de `only`, así que INK queda primero. */}
            <InkognitoModuleMenu current="supply" only={['store']} extraLinks={[{ label: 'INK — encuentra tu tatuador', to: '/tattoo-artist-colombia' }]} uppercase={false} textSize="text-[15px]" textClassName="text-zinc-800 font-medium" icon={LayoutGrid} onNavigate={() => setMenuOpen(false)} />

            <div className="border-t border-zinc-100" />
            <p className="px-6 pt-5 pb-1 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">Ecosistema y legal</p>
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-[15px] font-medium text-zinc-800">
              <Globe size={18} className="flex-shrink-0" />
              Ecosistema
            </Link>
            {/* Botones, no Links (2026-09-15) — abren el modal en vez de
                navegar a /terminos //privacidad. */}
            <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('terminos') }} className="flex items-center gap-3 w-full text-left px-6 py-4 text-[15px] font-medium text-zinc-800">
              <FileText size={18} className="flex-shrink-0" />
              Términos
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); setLegalOpen('privacidad') }} className="flex items-center gap-3 w-full text-left px-6 py-4 text-[15px] font-medium text-zinc-800">
              <Shield size={18} className="flex-shrink-0" />
              Privacidad
            </button>
          </div>
        </div>
      )}

      <LegalModal type={legalOpen} variant="ecosystem" onClose={() => setLegalOpen(null)} />
    </div>
  )
}
