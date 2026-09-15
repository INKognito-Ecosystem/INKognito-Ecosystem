import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Check, ExternalLink, GraduationCap } from 'lucide-react'
import { useSupplyCart } from '../../contexts/SupplyCartContext'
import ProductImageGallery from '../ProductImageGallery'

const VAR_THRESHOLD = 3

// Mismo criterio de nombre por plataforma que ProductLandingPage.jsx —
// solo para la insignia/CTA, no repite toda su lógica de afiliados.
const PLATAFORMA_LABEL = {
  hotmart: 'Hotmart',
  amazon: 'Amazon',
  aliexpress: 'AliExpress',
  mercadolibre: 'Mercado Libre',
}

// Extraído de SupplyCategoryPage.jsx (2026-07-30) para reusarlo también en
// BrandCatalogSection.jsx — antes las páginas de marca no tenían forma de
// mostrar inventario real y cada una inventaba su propia card (algunas con
// productos y precios inventados, ej. "$XX.XXX", que además agregaban al
// carrito real si el cliente hacía clic). Una sola fuente de verdad para la
// card de producto de Supply.
export function VariantSelectorSupply({ variantObjs, selIdx, onChange, light = false }) {
  const [open, setOpen] = useState(false)
  if (!variantObjs || variantObjs.length <= 1) return null
  const inactiveClass = light
    ? 'border-zinc-300 text-zinc-600 hover:border-blue-400 hover:text-zinc-900'
    : 'border-zinc-700 text-zinc-500 hover:border-blue-400 hover:text-white'

  if (variantObjs.length <= VAR_THRESHOLD) {
    return (
      <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `repeat(${variantObjs.length}, 1fr)` }}>
        {variantObjs.map((v, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`text-[9px] font-bold py-1 rounded border transition-all duration-200 text-center truncate ${
              selIdx === i ? 'bg-blue-500 text-white border-blue-500' : inactiveClass
            }`}
          >
            {v.variant}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between py-1.5 px-2 rounded border text-[9px] font-bold transition-all duration-200 ${light ? 'border-zinc-300 text-zinc-700 hover:border-blue-400' : 'border-zinc-700 text-zinc-300 hover:border-blue-400'}`}
      >
        <span className="truncate">{variantObjs[selIdx]?.variant || '—'}</span>
        <span className={`ml-1 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="mt-1 grid grid-cols-2 gap-1">
          {variantObjs.map((v, i) => (
            <button
              key={i}
              onClick={() => { onChange(i); setOpen(false) }}
              className={`text-[9px] font-bold py-1.5 px-1 rounded border transition-all duration-200 text-center truncate ${
                selIdx === i ? 'bg-blue-500 text-white border-blue-500' : inactiveClass
              }`}
            >
              {v.variant}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// light (2026-09-15, piloto de Jose en Cartuchos: "cambia el color negro
// que aún tiene la card") — default false para no tocar las demás
// categorías ni Store/marcas, que reusan esta misma card.
export default function SupplyProductCard({ item, categoria, showEstudioBadge = true, light = false }) {
  const { items: cartItems, addItem, removeItem } = useSupplyCart()
  const navigate = useNavigate()
  const t = light ? {
    cardBg: 'bg-white', photoBg: 'bg-zinc-50', text: 'text-zinc-900', textMuted: 'text-zinc-500', noImg: 'text-zinc-400',
    sheetBg: 'bg-white', sheetBorder: 'border-zinc-200',
    cardBorder: 'border-black/80 hover:border-black', photoSeparator: 'border-b border-zinc-200',
  } : {
    cardBg: 'bg-zinc-950', photoBg: 'bg-zinc-900', text: 'text-white', textMuted: 'text-zinc-500', noImg: 'text-zinc-700',
    sheetBg: 'bg-zinc-950', sheetBorder: 'border-zinc-800',
    cardBorder: 'border-blue-500/40 hover:border-blue-500', photoSeparator: '',
  }
  const [selIdx, setSelIdx] = useState(0)
  const [showDesc, setShowDesc] = useState(false)
  const [bloqueoMsg, setBloqueoMsg] = useState(null)

  // Antes se filtraba a solo las variantes CON nombre — pensado para el
  // caso de una única variante sin nombre (mobiliario, no todo necesita
  // "sabor"/talla). Pero con varios proveedores compartiendo el mismo
  // producto (catálogo maestro), es común que una fila tenga nombre de
  // variante y otra no — filtrar dejaba esas filas sin nombre totalmente
  // invisibles/imposibles de seleccionar, aunque tuvieran stock real
  // (reportado 2026-08-09: un producto de un proveedor no aparecía). Se
  // usan todas las variantes tal cual; ProductLandingPage.jsx ya hace lo
  // mismo (`v.variant || 'Único'`) sin filtrar.
  const allVariants = item.variantes ?? []
  const variantObjs = allVariants
  const totalStock  = allVariants.reduce((s, v) => s + (v.stock || 0), 0)
  const sel         = variantObjs[selIdx] || variantObjs[0] || {}

  const resolvedPrice = sel.price
    ? '$' + Math.round(sel.price).toLocaleString('es-CO')
    : null
  // Si la variante seleccionada no tiene foto propia, sigue siendo el mismo
  // producto — antes caía a item.image_url, que es solo la de la primera
  // variante en orden alfabético y podía estar igual de vacía. Ahora busca
  // cualquier otra variante que sí tenga foto (mismo criterio aplicado en
  // StoreProductCard.jsx, reportado 2026-08-02).
  const fallbackVariant = allVariants.find(v => v.image_url)
  const activeImage = sel.image_url || fallbackVariant?.image_url || item.image_url || null
  const images = sel.image_url
    ? [sel.image_url, sel.image_url_2, sel.image_url_3].filter(Boolean)
    : fallbackVariant
      ? [fallbackVariant.image_url, fallbackVariant.image_url_2, fallbackVariant.image_url_3].filter(Boolean)
      : [item.image_url, item.image_url_2, item.image_url_3].filter(Boolean)
  const galleryImages = images.filter(Boolean)

  // Descripción de la variante seleccionada si tiene la suya propia; si no,
  // la del producto — mismo criterio que StoreProductCard.jsx. Antes
  // siempre mostraba item.descripcion (la de la primera fila en la base),
  // nunca cambiaba al cambiar de variante (reportado 2026-08-02).
  const description = sel.descripcion || item.descripcion

  // Dueño real de la variante seleccionada — no del producto agrupado
  // (que puede mezclar variantes de más de un estudio desde que el
  // catálogo maestro permite compartir el mismo nombre de producto).
  // Con fallback al nivel de producto por compatibilidad con datos
  // viejos, pero la variante siempre gana si trae su propio dato.
  const proveedorId      = sel.estudio_id ?? item.estudio_id ?? null
  const proveedorNombre  = sel.estudio_nombre_supply || sel.estudio_nombre || item.estudio_nombre_supply || item.estudio_nombre || null
  const proveedorSlug    = sel.estudio_slug || item.estudio_slug || null
  const proveedorMp      = sel.estudio_mp_conectado ?? item.estudio_mp_conectado ?? false

  const productId = item.name + (sel.variant ? '-' + sel.variant : '')
  const cartKey = `${categoria}-${productId}`
  const enCarrito = cartItems.some(i => i.key === cartKey)

  // Cursos/productos afiliados (Hotmart, etc.) — 2026-09-15, Jose: "en
  // destacados están apareciendo cursos de hotmar, pero dice agregar al
  // carrito cuando debe llevar directo al embudo de venta... si se va a
  // mostrar por fuera de su propio enlace, debe mostrar una insignia".
  // Estos campos solo existen a nivel de producto (item), nunca por
  // variante — un afiliado no tiene carrito real, así que no aplica
  // ningún dato de `sel`.
  const esAfiliado = item.tipo === 'afiliado'
  const afiliadoUrl = item.url_checkout || item.url_ventas
  const plataformaLabel = PLATAFORMA_LABEL[item.plataforma] || item.plataforma || 'Afiliado'

  const handleAdd = () => {
    const resultado = addItem({
      id:          productId,
      inventoryId: sel.id ?? null,
      name:        item.name + (sel.variant ? ` (${sel.variant})` : ''),
      price:       resolvedPrice || '—',
      brand:       item.categoria || '',
      image:       activeImage || '',
    }, categoria, {
      estudioId:      proveedorId,
      estudioNombre:  proveedorNombre,
      mpConectado:    !!proveedorMp,
    })
    if (!resultado.ok) {
      setBloqueoMsg(`Ya tienes productos de ${resultado.nombreActual} en tu carrito — termina esa compra antes de agregar de otro proveedor.`)
      setTimeout(() => setBloqueoMsg(null), 5000)
    }
  }

  // Alterna agregar/quitar (2026-09-15, Jose: "volver a apretar el botón
  // del carrito elimina el objeto y vuelve a su estado de ícono de
  // carrito") — antes volver a tocar el botón ya en el carrito no hacía
  // nada útil.
  const handleToggle = () => {
    if (enCarrito) removeItem(cartKey)
    else handleAdd()
  }

  return (
    <div className={`border ${t.cardBorder} ${t.cardBg} rounded-2xl overflow-hidden hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col h-full`}>

      {/* Clic en la foto abre la ficha propia del producto, físico O
          afiliado (2026-09-15, Jose: "si un x producto se muestra en
          destacados... debería poder abrir la page de ese producto, sea
          físico o afiliado, inclusive si estoy en una tienda") — antes
          `!esAfiliado` bloqueaba el clic para cursos/kit externo/recursos;
          SupplyProductDetailPage.jsx ya sabe renderizar el CTA correcto
          (Hotmart/Amazon/etc.) cuando el producto es afiliado, así que ya
          no hace falta esa exclusión. El ícono incrustado abajo-derecha
          (carrito o "ver en plataforma") sigue con su propio
          stopPropagation — sigue siendo un atajo directo, sin entrar a la
          ficha. */}
      <div
        className={`relative aspect-square w-full ${t.photoBg} ${t.photoSeparator} overflow-hidden flex-shrink-0 ${light && sel.id ? 'cursor-pointer' : ''}`}
        onClick={light && sel.id ? () => navigate(`/supply/producto/${sel.id}`) : undefined}
      >
        {galleryImages.length > 0 ? (
          <ProductImageGallery
            images={galleryImages}
            alt={`${item.name}${sel.variant ? ' ' + sel.variant : ''}`}
            containerClassName="w-full h-full"
            imgClassName="w-full h-full object-cover"
            square
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className={`${t.noImg} uppercase tracking-[0.3em] text-[10px] text-center px-3`}>{item.name}</p>
          </div>
        )}
        {/* Carrito como ícono incrustado en la foto (2026-09-15, piloto de
            Jose en Cartuchos) — reemplaza el botón de texto de abajo. Chico,
            azul tenue y sin contorno (flota sobre la card con solo sombra),
            azul sólido cuando el producto ya está en el carrito. */}
        {light && (
          esAfiliado ? (
            <a
              href={afiliadoUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Ver en ${plataformaLabel}`}
              className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300 bg-blue-50 text-blue-400 hover:bg-blue-100"
            >
              <ExternalLink size={12} />
            </a>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); handleToggle() }}
              aria-label={enCarrito ? 'Quitar del carrito' : 'Agregar al carrito'}
              className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                enCarrito ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-400 hover:bg-blue-100'
              }`}
            >
              {enCarrito ? <Check size={13} /> : <ShoppingCart size={12} />}
            </button>
          )
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 gap-1.5 min-h-0">
        {/* Supply multitenant (fase 4, 2026-08-07) — insignia por card
            solo para productos de un estudio-vendedor. La insignia fija
            de categoría (Tommy/Warlock) sigue viviendo en
            SupplyCategoryPage.jsx a nivel de página, sin tocar — esta es
            la excepción puntual cuando el producto viene de otra parte.
            En light se quita (2026-09-15, Jose: "ya no es necesario") —
            el clic en la foto ya lleva a la ficha, que muestra el módulo
            completo de la tienda (logo, ubicación, más productos). Las
            demás categorías/páginas no tienen ese clic todavía, así que
            ahí la insignia sigue siendo la única forma de llegar al
            proveedor — se queda igual. */}
        {/* Insignia de curso/producto afiliado (2026-09-15, Jose) — se
            muestra siempre que aparezca por fuera de su propio embudo
            (acá, mezclado en un grid genérico junto a productos físicos
            reales), para que no se confunda con inventario de INKognito. */}
        {esAfiliado && (
          <span className={`inline-flex items-center gap-1 w-fit text-[8px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
            light ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}>
            <GraduationCap size={10} /> Curso {plataformaLabel}
          </span>
        )}
        {showEstudioBadge && proveedorNombre && !light && (
          proveedorId ? (
            <Link
              to={`/supply/${proveedorSlug || `estudio/${proveedorId}`}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[8px] font-bold uppercase tracking-wide text-blue-400 hover:text-blue-300 underline underline-offset-2 w-fit"
            >
              Suministrado por {proveedorNombre}
            </Link>
          ) : (
            <p className="text-[8px] font-bold uppercase tracking-wide text-blue-400">Suministrado por {proveedorNombre}</p>
          )
        )}
        {/* Nombre más chico y sin mayúsculas forzadas en light (2026-09-15,
            Jose, mismo criterio que ya aplicamos en la ficha de
            producto) — deja espacio para nombres más largos/con más
            info sin dominar la card. Las demás categorías se quedan con
            el estilo de siempre. */}
        <h3 className={light ? `text-[11px] font-medium leading-snug ${t.text}` : `text-xs font-black uppercase leading-tight ${t.text}`}>{item.name}</h3>
        {resolvedPrice && <p className={`${t.text} font-bold text-sm`}>{resolvedPrice}</p>}
        {totalStock <= 3 && totalStock > 0 && (
          <p className="text-yellow-500 text-[9px] font-bold">⚠️ Últimas {totalStock}</p>
        )}
        {description && (
          <>
            {/* Escritorio — texto completo, debajo de nombre/precio */}
            <p className={`hidden md:block ${t.textMuted} text-[9.5px] leading-snug`}>{description}</p>
            {/* Móvil — botón que abre modal, en vez de estirar la card
                (descripción de mobiliario es un párrafo largo, no la
                etiqueta corta de una palabra que este campo tenía antes;
                2026-08-01). */}
            <button
              type="button"
              onClick={() => setShowDesc(true)}
              className={`md:hidden self-start ${t.textMuted} text-[9px] font-bold uppercase tracking-[0.15em] underline underline-offset-2`}
            >
              Ver descripción
            </button>
          </>
        )}
        {/* Con una sola variante no hay nada que elegir — mostrar su
            nombre ("Único", una talla suelta, lo que sea que haya
            escrito el proveedor) no aporta nada, solo ruido visual
            (Jose, 2026-08-09). El selector solo aparece con 2+. */}
        {variantObjs.length > 1 && (
          <div className="mt-auto pt-1">
            <VariantSelectorSupply variantObjs={variantObjs} selIdx={selIdx} onChange={setSelIdx} light={light} />
          </div>
        )}
      </div>

      {bloqueoMsg && (
        <p className="px-3 pb-2 text-[9px] leading-snug text-amber-400 bg-amber-950/40">{bloqueoMsg}</p>
      )}
      {/* Botón de texto de siempre — solo cuando NO hay ícono incrustado en
          la foto (light lo reemplaza por completo). Afiliado: nunca
          "agregar al carrito" (no hay carrito real), va directo al
          embudo de venta de su plataforma. */}
      {!light && (
        esAfiliado ? (
          <a
            href={afiliadoUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="w-full py-2.5 font-bold uppercase tracking-[0.1em] text-[10px] flex-shrink-0 text-center transition-all duration-300 bg-amber-500 text-black hover:bg-amber-400"
          >
            Comprar en {plataformaLabel}
          </a>
        ) : (
          <button
            onClick={handleToggle}
            className={`w-full py-2.5 font-bold uppercase tracking-[0.1em] text-[10px] flex-shrink-0 transition-all duration-300 ${
              enCarrito ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {enCarrito ? '✓ Agregado' : '+ Agregar al carrito'}
          </button>
        )
      )}

      {showDesc && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 flex items-end justify-center"
          onClick={() => setShowDesc(false)}
        >
          <div
            className={`w-full max-w-md ${t.sheetBg} border-t ${t.sheetBorder} rounded-t-2xl p-5`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-xs font-black uppercase tracking-widest ${t.text}`}>Descripción</h4>
              <button onClick={() => setShowDesc(false)} className={`${t.textMuted} text-lg leading-none px-1`}>✕</button>
            </div>
            <p className={`${t.textMuted} text-sm leading-relaxed`}>{description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
