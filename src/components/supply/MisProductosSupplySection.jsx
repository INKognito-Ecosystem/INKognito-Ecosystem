import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, LoaderCircle, X, Trash2, ShoppingBag, ChevronDown, CopyPlus, Eye, Plus, Link2, Check, Pencil, ExternalLink } from 'lucide-react'
import ComboboxBuscable from '../artistas/ComboboxBuscable'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const BTN = '#374151'
const MP_BLUE = '#3483FA'
const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'

const SUPPLY_CATEGORIAS = ['Tintas', 'Cartuchos', 'Agujas', 'Máquinas', 'Guantes', 'Cuidados', 'Fuentes', 'Accesorios', 'Mobiliario', 'Combos']
// Mismo set fijo que INV_MARCAS.supply en el panel (public/index.html) —
// copia local, mismo criterio que SUPPLY_CATEGORIAS de arriba.
const SUPPLY_MARCAS = [
  { value: '', label: '— Sin marca / genérica —' },
  { value: 'wjx', label: 'WJX' },
  // 'kwadron' es la marca global de agujas/cartuchos (y también mobiliario,
  // ver nota en MARCAS_POR_CATEGORIA) — 'industrias-warlock' es un
  // proveedor LOCAL de mobiliario aparte, sin relación con la marca
  // Kwadron (ver project_proveedor_warlock_mobiliario en memoria).
  { value: 'kwadron', label: 'Kwadron' },
  { value: 'industrias-warlock', label: 'Industrias Warlock (mobiliario)' },
  { value: 'ez-tattoo', label: 'EZ Tattoo' },
  { value: 'vice-colors', label: 'Vice Colors' },
  { value: 'dynamic', label: 'Dynamic' },
  { value: 'eternal', label: 'Eternal' },
  { value: 'intenze', label: 'Intenze' },
  { value: 'fusion', label: 'Fusion' },
  { value: 'world-famous', label: 'World Famous' },
  { value: 'solid-ink', label: 'Solid Ink' },
  { value: 'tattoo-vision', label: 'Tattoo Vision' },
  { value: 'heaven-pro', label: 'Heaven Pro' },
  { value: 'royal-three', label: 'Royal Three' },
  { value: 'cheyenne', label: 'Cheyenne' },
  { value: 'critical', label: 'Critical' },
  { value: 'tatsoul', label: 'TATSoul' },
  { value: 'bishop', label: 'Bishop' },
  { value: 'gorilla', label: 'Gorilla' },
  { value: 'naturflex', label: 'Naturflex' },
]
const SUPPLY_MARCA_LABEL = (v) => SUPPLY_MARCAS.find((m) => m.value === v)?.label || v

// Qué marcas tiene sentido ofrecer según la categoría elegida (Jose,
// 2026-08-09: "si agrego tintas, en marcas debería aparecerme solo
// tintas"). Investigado marca por marca — nada de "general, aparece en
// todas" sin verificar primero.
const MARCAS_POR_CATEGORIA = {
  'Tintas':      ['vice-colors', 'dynamic', 'eternal', 'intenze', 'fusion', 'world-famous', 'solid-ink'],
  'Cartuchos':   ['wjx', 'kwadron', 'ez-tattoo'],
  'Agujas':      ['wjx', 'kwadron', 'ez-tattoo'],
  'Cuidados':    ['heaven-pro', 'royal-three'],
  'Mobiliario':  ['kwadron', 'industrias-warlock'],
  'Máquinas':    ['tattoo-vision'],
  'Accesorios':  ['tattoo-vision'],
  'Fuentes':     ['cheyenne', 'critical', 'tatsoul', 'bishop'],
  'Guantes':     ['gorilla', 'naturflex'],
}
// Categoría sin entrada acá (Combos, Cursos, Kit Externo, Recursos, o
// cualquiera nueva que se agregue después) → solo "Sin marca / genérica",
// NUNCA la lista completa.
const marcasParaCategoria = (categoria) => {
  const permitidas = MARCAS_POR_CATEGORIA[categoria] || []
  return SUPPLY_MARCAS.filter((m) => m.value === '' || permitidas.includes(m.value)).map((m) => m.value)
}

// descripcionAuto: si la descripción actual vino sola (cascada
// categoría/marca), sigue siendo "refrescable" al cambiar de categoría/
// marca después. En cuanto el proveedor la toca a mano, o viene de un
// producto real (editar, vincular del buscador), deja de tocarse sola.
const PRODUCTO_VACIO = { product: '', variant: '', price: '', stock: '', categoria: SUPPLY_CATEGORIAS[0], marca: '', image_url: '', descripcion: '', descripcionAuto: false, master_product_id: null }

// "Mis productos en Supply" (fase 4, 2026-08-07, Supply multitenant) —
// solo se renderiza si el estudio tiene vende_supply activo (Jose lo
// activa uno por uno desde el panel, mismo criterio de curaduría que ya
// usa con Tommy/Warlock). Mismo patrón de CRUD autocontenido que
// MisDisenosSection en ArtistaEditarPerfilPage.jsx, adaptado a los
// campos de un producto (una sola foto, categoría fija, variante y
// stock) en vez de un diseño.
// Extraído (2026-09-12) de EstudioEditarPerfilPage.jsx a su propio archivo
// — mismo criterio que MisProductosTiendaSection.jsx en Store: se
// reutiliza tal cual dentro de EstudioSupplyOwnerPanel.jsx (el panel del
// botón hamburguesa en /supply/estudio/:id), en vez de duplicar esta
// lógica. `standalone` (2026-09-12) — cuando este componente ES el
// contenido completo de una pantalla dedicada (la vista "productos" del
// panel, con su propio título en el header), arranca abierto — el
// acordeón propio ya no tiene sentido si no hay nada más debajo con qué
// compartir espacio.
export default function MisProductosSupplySection({ token, cloud_name, upload_preset, standalone = false, mpConectado = false }) {
  // Desplegable como Mis Ventas — a diferencia de esa sección, acá ni
  // siquiera se pide la lista al servidor hasta que se abre por primera
  // vez (puede traer fotos de muchos productos, no vale la pena cargarlo
  // de entrada si el proveedor no lo va a abrir). Si es standalone, ya
  // arranca abierto (el proveedor llegó acá a propósito a ver esto).
  const [open, setOpen] = useState(standalone)
  const [productos, setProductos] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [nuevo, setNuevo] = useState(PRODUCTO_VACIO)
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState(null)
  const [masterResults, setMasterResults] = useState([])
  const [varianteDe, setVarianteDe] = useState(null)
  const fileInput = useRef(null)
  const masterSearchTimer = useRef(null)
  // Autollenado de la descripción (ver prefillDescripcion más abajo):
  // prefillSeq numera cada pedido para que solo cuente el último;
  // marcaTimer da un respiro mientras se escribe una marca de texto libre.
  const prefillSeq = useRef(0)
  const marcaTimer = useRef(null)
  const cargadoRef = useRef(false)
  // Tabla tipo Excel (2026-08-27, Jose: "como hemos venido organizando los
  // del panel... si son muchos que se vean bien organizados en columnas,
  // no cards grandes") — reemplaza las cards de imagen grande por filas
  // agrupadas por producto (expandibles si hay más de una variante),
  // mismo espíritu que el inventario del panel admin. El formulario ya no
  // está siempre visible: ahora es un modal, abierto por el botón
  // "Agregar producto" o al tocar "Ver"/"Editar" en una fila.
  const [formAbierto, setFormAbierto] = useState(false)
  const [verGrupo, setVerGrupo] = useState(null)
  const [grupoExpandido, setGrupoExpandido] = useState(null)
  // Link público por producto (2026-08-27, Jose: "que se pueda hacer
  // publicidad con ese link... hazlo visible para mirarlo") — el
  // mecanismo YA existe end-to-end: /p/:id (ProductLandingPage.jsx) lee
  // /api/product/:id, que ya hace JOIN con estudios y ya muestra
  // "Suministrado por X" + enruta el pago Split a la cuenta de ESTE
  // estudio, dinámico por producto. Solo faltaba mostrarlo — cualquier
  // id de variante del grupo sirve, la landing agrupa todas las
  // variantes del mismo producto igual que acá.
  const [linkCopiado, setLinkCopiado] = useState(false)
  const copiarLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopiado(true)
      setTimeout(() => setLinkCopiado(false), 1500)
    }).catch(() => {})
  }

  useEffect(() => {
    if (!open || cargadoRef.current) return
    cargadoRef.current = true
    setCargando(true)
    fetch(`${PANEL_URL}/api/estudios-inventario-por-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setProductos)
      .catch(() => setProductos([]))
      .finally(() => setCargando(false))
  }, [open, token])

  const subirFoto = async (file) => {
    if (!file || !cloud_name || !upload_preset) return
    setSubiendo(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-supply-estudios')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!data.secure_url) throw new Error(data.error?.message || 'No se pudo subir la imagen')
      setNuevo((n) => ({ ...n, image_url: data.secure_url }))
    } catch {
      setError('No pudimos subir la foto — intenta de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  const iniciarEdicion = (p) => {
    prefillSeq.current++
    setError(null)
    setEditando(p.id)
    setVarianteDe(null)
    setMasterResults([])
    setNuevo({ product: p.product, variant: p.variant || '', price: p.price, stock: p.stock, categoria: p.categoria, marca: p.marca || '', image_url: p.image_url || '', descripcion: p.descripcion || '', descripcionAuto: false, master_product_id: null })
    setFormAbierto(true)
  }
  const cancelarEdicion = () => { prefillSeq.current++; setEditando(null); setVarianteDe(null); setNuevo(PRODUCTO_VACIO); setMasterResults([]); setError(null); setFormAbierto(false) }
  const abrirNuevoProducto = () => {
    setError(null)
    setEditando(null)
    setVarianteDe(null)
    setMasterResults([])
    setNuevo(PRODUCTO_VACIO)
    setFormAbierto(true)
    // La categoría ya viene elegida (la primera de la lista): la descripción
    // se llena desde el primer momento, no solo después de cambiarla.
    prefillDescripcion(PRODUCTO_VACIO.categoria, '')
  }

  // Agregar una variante (talla, sabor, color...) de un producto propio ya
  // cargado — a diferencia de "editar", esto SIEMPRE crea una fila nueva
  // (POST, no PUT), pero copia el nombre/categoría/marca EXACTOS del
  // producto original para que quede agrupado en la misma card en la web
  // de Supply en vez de crear un producto aparte por una diferencia de
  // texto (mayúsculas, espacios) al retipear el nombre a mano.
  const agregarVariante = (p) => {
    prefillSeq.current++
    setError(null)
    setEditando(null)
    setVarianteDe(p.product)
    setMasterResults([])
    setNuevo({ product: p.product, variant: '', price: p.price || '', stock: '', categoria: p.categoria, marca: p.marca || '', image_url: '', descripcion: p.descripcion || '', descripcionAuto: false, master_product_id: p.master_product_id || null })
    setFormAbierto(true)
  }

  // Catálogo maestro — buscar un producto ya cargado por otro proveedor
  // (o por Jose desde el panel admin) para no retipear nombre/categoría/
  // marca/descripción desde cero.
  const onProductInput = (value) => {
    setNuevo((n) => ({ ...n, product: value, master_product_id: null }))
    clearTimeout(masterSearchTimer.current)
    if (value.trim().length < 2) { setMasterResults([]); return }
    masterSearchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${PANEL_URL}/api/master-catalog/search?module=supply&categoria=${encodeURIComponent(nuevo.categoria || '')}&q=${encodeURIComponent(value.trim())}`)
        const data = await res.json()
        setMasterResults(data.results || [])
      } catch { setMasterResults([]) }
    }, 300)
  }

  // Autollenado de la descripción (Jose, 2026-08-09: "mientras subía producto
  // tampoco se autocompletó de manera automática"; endurecido 2026-09-21).
  // Al abrir el formulario y cada vez que cambia la categoría/marca se pide
  // el texto por defecto (tabla catalogo_defaults del panel, editable por
  // Jose). Reglas:
  //  - Solo pisa lo que llegó solo: si el proveedor la escribió a mano, o vino de
  //    un producto real (editar, catálogo maestro), no se toca; si la borra,
  //    vuelve a poder llenarse.
  //  - Si dos cambios seguidos hacen que las respuestas lleguen desordenadas
  //    (o el formulario ya cambió de categoría), solo cuenta la última.
  //  - Si la categoría nueva no tiene texto por defecto, el texto automático
  //    de la anterior se quita: nunca queda la descripción de una categoría
  //    dentro de un producto de otra.
  const prefillDescripcion = async (categoria, marca) => {
    const mio = ++prefillSeq.current
    try {
      const res = await fetch(`${PANEL_URL}/api/catalogo-defaults-lookup?module=supply&categoria=${encodeURIComponent(categoria || '')}&marca=${encodeURIComponent(marca || '')}`)
      const data = res.ok ? await res.json() : {}
      if (mio !== prefillSeq.current) return
      setNuevo((n) => {
        if ((n.categoria || '') !== (categoria || '')) return n
        if (n.descripcion && !n.descripcionAuto) return n
        if (data.descripcion) return { ...n, descripcion: data.descripcion, descripcionAuto: true }
        return n.descripcionAuto ? { ...n, descripcion: '', descripcionAuto: false } : n
      })
    } catch { /* silencioso — el proveedor siempre puede escribirla a mano */ }
  }

  const seleccionarMaster = (item) => {
    setNuevo((n) => ({
      ...n,
      product: item.product,
      categoria: item.categoria || n.categoria,
      marca: item.marca || n.marca,
      descripcion: item.descripcion || n.descripcion,
      descripcionAuto: item.descripcion ? false : n.descripcionAuto,
      image_url: n.image_url || item.image_url || '',
      master_product_id: item.id,
    }))
    setMasterResults([])
    // Sin descripción propia, la de la categoría (posiblemente otra) se recalcula.
    if (!item.descripcion) prefillDescripcion(item.categoria || nuevo.categoria, item.marca || nuevo.marca)
  }

  const guardar = async () => {
    if (!nuevo.product.trim() || !nuevo.price) {
      setError('El nombre y el precio son obligatorios.')
      return
    }
    // Obligatoria (Jose, 2026-08-09): una fila sin variante quedaba
    // invisible/inseleccionable en la card de Supply cuando comparte
    // producto con otra fila que sí la tiene. Si el producto de verdad
    // no tiene variantes, escribe "Único" o algo simple — decisión tuya,
    // no un texto que el sistema inventa en silencio.
    if (!nuevo.variant.trim()) {
      setError('Escribe una variante (talla, sabor, color...) — o "Único" si el producto no tiene variantes.')
      return
    }
    setError(null)

    // Si no se está editando/vinculando uno ya existente, avisar (sin
    // bloquear) si hay algo muy parecido en el catálogo maestro.
    if (!editando && !nuevo.master_product_id) {
      try {
        const simRes = await fetch(`${PANEL_URL}/api/master-catalog/similar?module=supply&categoria=${encodeURIComponent(nuevo.categoria || '')}&product=${encodeURIComponent(nuevo.product.trim())}`)
        const simData = await simRes.json()
        if (simData.results?.length) {
          const nombres = simData.results.map((r) => `• ${r.product}${r.marca ? ' — ' + r.marca : ''}`).join('\n')
          const seguir = window.confirm(`Ya existe algo parecido en el catálogo maestro:\n\n${nombres}\n\n¿Seguro que es un producto distinto?\n\nAceptar = crear de todos modos.\nCancelar = revisar el nombre.`)
          if (!seguir) return
        }
      } catch { /* si falla la verificación, no bloquear el guardado */ }
    }

    setGuardando(true)
    try {
      const url = editando ? `${PANEL_URL}/api/estudios-inventario-por-token/${editando}` : `${PANEL_URL}/api/estudios-inventario-por-token`
      const res = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...nuevo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '')
      if (editando) {
        setProductos((ps) => ps.map((x) => x.id === editando ? data : x))
      } else {
        setProductos((ps) => [data, ...(ps || [])])
      }
      cancelarEdicion()
    } catch (err) {
      setError(err.message || 'No pudimos guardar — intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const toggleActivo = async (p) => {
    const res = await fetch(`${PANEL_URL}/api/estudios-inventario-por-token/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, is_active: !p.is_active }),
    })
    if (res.ok) setProductos((ps) => ps.map((x) => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
  }

  const borrar = async (p) => {
    const res = await fetch(`${PANEL_URL}/api/estudios-inventario-por-token/${p.id}?token=${encodeURIComponent(token)}`, { method: 'DELETE' })
    if (res.ok) {
      setProductos((ps) => ps.filter((x) => x.id !== p.id))
      if (editando === p.id) cancelarEdicion()
    }
  }

  // Agrupar por nombre exacto de producto — mismo criterio que usa la
  // tienda pública de Supply para armar una sola card con variantes
  // (GROUP BY product), para que el dashboard se vea igual de agrupado
  // que la web en vez de una card por fila/variante.
  const grupos = useMemo(() => {
    if (!productos) return []
    const mapa = new Map()
    for (const p of productos) {
      if (!mapa.has(p.product)) mapa.set(p.product, { product: p.product, categoria: p.categoria, variantes: [] })
      mapa.get(p.product).variantes.push(p)
    }
    return [...mapa.values()]
  }, [productos])

  // Categoría/marca "reales" (2026-08-09, Jose: "que aparezcan las
  // categorías y marcas reales detrás de cada producto"). No hay forma de
  // adivinar la marca real de un nombre que nunca se ha subido — pero para
  // un producto que SÍ ya existe (vinculado del buscador de catálogo
  // maestro, o una variante nueva de algo propio ya cargado), la
  // categoría/marca reales ya se conocen y no deberían poder desviarse por
  // error. Mismo principio que departamento→municipio: una vez el valor
  // está confirmado contra un dato real, el campo deja de ser editable a
  // mano.
  const categoriaMarcaBloqueada = !!varianteDe || !!nuevo.master_product_id

  return (
    <div className="mb-8 -mx-4 md:mx-0 bg-gray-50 border-y md:border border-gray-200 md:rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-4 flex items-center justify-between gap-2 text-left hover:bg-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <ShoppingBag size={12} />
          Mis productos en Supply
        </span>
        <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-5">
          <p className="text-gray-400 text-[10px] mb-4">Aparecen en tu propio catálogo (enlazado desde tu perfil) y también mezclados en la tienda general de Supply, en su categoría correspondiente.</p>

          {cargando ? (
            <p className="text-gray-400 text-xs text-center py-4">Cargando...</p>
          ) : (
            <>
              {/* Todo vendedor debe tener Mercado Pago conectado para poder
                  subir productos (2026-09-24, Jose: "si un vendedor no tiene
                  mercado pago activo, no debería poder subir productos") —
                  sin esto la venta nunca pasa por Split. Solo bloquea el
                  ALTA: los productos que ya tiene siguen editables/visibles
                  abajo, tal cual, aunque se desconecte después. */}
              {mpConectado ? (
                <button
                  type="button"
                  onClick={abrirNuevoProducto}
                  className="w-full mb-4 py-2.5 flex items-center justify-center gap-1.5 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: BTN }}
                >
                  <Plus size={14} />
                  Agregar producto a mi tienda
                </button>
              ) : (
                <div className="mb-4 rounded-lg border p-4" style={{ borderColor: MP_BLUE, backgroundColor: '#3483FA0D' }}>
                  <p className="text-sm font-bold mb-1" style={{ color: MP_BLUE }}>Conecta Mercado Pago para poder subir productos</p>
                  <p className="text-gray-500 text-xs mb-3">Así el pago de cada venta te llega directo a tu cuenta, con tu comisión ya descontada.</p>
                  <a
                    href={`${PANEL_URL}/api/estudios-mp-conectar?token=${encodeURIComponent(token)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-[11px] font-black uppercase tracking-widest shadow-md hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: MP_BLUE }}
                  >
                    Conecta Mercado Pago <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {grupos.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-6">Todavía no tienes productos — agrega el primero arriba.</p>
              ) : (
                /* Tabla tipo Excel (2026-08-27, Jose: "como hemos venido
                   organizando los del panel... si son muchos que se vean
                   bien organizados en columnas" — y luego, al ocultar las
                   columnas en móvil: "eso no se ve en móvil", quería el
                   encabezado también ahí, no solo en PC). Columnas fijas
                   SIEMPRE visibles (mismo grid-cols en header y filas, en
                   cualquier tamaño de pantalla) — si no caben todas en un
                   celular angosto, la tabla scrollea horizontal en vez de
                   esconder columnas, igual que Excel/Sheets en el celular. */
                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <div className="min-w-[454px]">
                    <div className="grid grid-cols-[minmax(190px,1fr)_60px_40px_116px] gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200 text-[9px] font-bold uppercase tracking-wide text-gray-400">
                      <span>Producto</span>
                      <span className="text-right">Precio</span>
                      <span className="text-center">Stock</span>
                      <span className="text-right">Acciones</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {grupos.map((g) => {
                        const portada = g.variantes.find((v) => v.image_url)?.image_url
                        const unaSola = g.variantes.length === 1
                        const expandido = grupoExpandido === g.product
                        return (
                          <div key={g.product}>
                            <div className="grid grid-cols-[minmax(190px,1fr)_60px_40px_116px] gap-2 items-center px-3 py-2 hover:bg-gray-50 transition-colors">
                              <button
                                type="button"
                                onClick={() => !unaSola && setGrupoExpandido((cur) => cur === g.product ? null : g.product)}
                                className={`flex items-center gap-2 min-w-0 text-left ${unaSola ? 'cursor-default' : ''}`}
                              >
                                <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                  {portada ? <img src={portada} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-[8px]">Sin foto</div>}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-xs text-gray-900 truncate">{g.product}</p>
                                  <p className="text-[10px] text-gray-400 truncate">
                                    {g.categoria}
                                    {!unaSola && ` · ${g.variantes.length} variantes`}
                                  </p>
                                </div>
                              </button>
                              {unaSola ? (
                                <>
                                  <span className="text-xs text-gray-700 text-right">${Number(g.variantes[0].price).toLocaleString('es-CO')}</span>
                                  <span className="text-xs text-gray-700 text-center">{g.variantes[0].stock}</span>
                                </>
                              ) : (
                                <>
                                  <span />
                                  <span />
                                </>
                              )}
                              <div className="flex items-center justify-end gap-2.5 text-gray-400 flex-shrink-0">
                              <button type="button" onClick={() => setVerGrupo(g)} aria-label="Ver producto" title="Ver"><Eye size={14} /></button>
                              <button type="button" onClick={() => agregarVariante(g.variantes[0])} aria-label="Agregar variante" title="Agregar variante (talla, sabor, color...)"><CopyPlus size={13} /></button>
                              {unaSola ? (
                                <>
                                  <button type="button" onClick={() => iniciarEdicion(g.variantes[0])} aria-label="Editar producto" title="Editar"><Pencil size={13} /></button>
                                  <button type="button" onClick={() => borrar(g.variantes[0])} aria-label="Borrar producto" title="Borrar"><Trash2 size={13} /></button>
                                </>
                              ) : (
                                <button type="button" onClick={() => setGrupoExpandido((cur) => cur === g.product ? null : g.product)} aria-label="Ver variantes" title="Variantes">
                                  <ChevronDown size={14} className={`transition-transform ${expandido ? 'rotate-180' : ''}`} />
                                </button>
                              )}
                            </div>
                          </div>

                          {!unaSola && expandido && (
                            <div className="px-3 pb-2 pt-1 space-y-1 bg-gray-50">
                              {g.variantes.map((v) => (
                                <div key={v.id} className={`flex items-center justify-between gap-2 text-[11px] rounded-md px-2.5 py-1.5 bg-white border border-gray-100 ${v.is_active ? '' : 'opacity-50'}`}>
                                  <span className="truncate flex-1">{v.variant || 'Única'}</span>
                                  <span className="text-gray-500 flex-shrink-0">${Number(v.price).toLocaleString('es-CO')}</span>
                                  <span className="text-gray-400 flex-shrink-0 w-14 text-right">Stock {v.stock}</span>
                                  <div className="flex items-center gap-1.5 text-gray-400 flex-shrink-0">
                                    <button type="button" onClick={() => iniciarEdicion(v)} aria-label="Editar variante"><Pencil size={11} /></button>
                                    <button type="button" onClick={() => toggleActivo(v)} className="underline">{v.is_active ? 'Ocultar' : 'Mostrar'}</button>
                                    <button type="button" onClick={() => borrar(v)} aria-label="Borrar variante"><Trash2 size={11} /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Modal: agregar/editar producto — ya no vive siempre visible
              en la sección (Jose, 2026-08-27), se abre con "Agregar
              producto a mi tienda" o al tocar "Editar"/"Agregar variante"
              en una fila. */}
          {formAbierto && (
            <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center px-0 sm:px-4" onClick={cancelarEdicion}>
              <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm max-h-[92vh] overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-black uppercase text-gray-700">{editando ? 'Editando producto' : varianteDe ? 'Nueva variante' : 'Agregar producto'}</p>
                  <button type="button" onClick={cancelarEdicion} aria-label="Cerrar" className="text-gray-400"><X size={18} /></button>
                </div>
                <div className="space-y-2.5">
                  {varianteDe && (
                    <div className="bg-gray-100 rounded-md px-2.5 py-1.5">
                      <p className="text-[10px] text-gray-600">Nueva variante de <span className="font-black">{varianteDe}</span> — quedará agrupada con el mismo producto.</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" ref={fileInput} style={{ display: 'none' }} onChange={(e) => subirFoto(e.target.files?.[0])} />
                  <button type="button" onClick={() => fileInput.current?.click()} className="w-full aspect-video rounded-lg bg-white border border-gray-200 text-gray-400 overflow-hidden relative">
                    {nuevo.image_url ? (
                      <img src={nuevo.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : subiendo ? (
                      <div className="w-full h-full flex items-center justify-center"><LoaderCircle size={16} className="animate-spin" /></div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                        <Camera size={16} />
                        <span className="text-[10px] font-bold uppercase">Foto del producto</span>
                      </div>
                    )}
                  </button>

                  <div className="relative">
                    <input className={`${inputClass} ${varianteDe ? 'bg-gray-100 text-gray-500' : ''}`} placeholder="Nombre del producto" autoComplete="off" readOnly={!!varianteDe} value={nuevo.product} onChange={(e) => onProductInput(e.target.value)} />
                    {masterResults.length > 0 && (
                      <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {masterResults.map((r) => (
                          <button type="button" key={r.id} onClick={() => seleccionarMaster(r)} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center justify-between gap-2">
                            <span className="truncate">{r.product}{r.marca && <span className="text-gray-400"> — {r.marca}</span>}</span>
                            <span className="text-gray-400 text-[10px] flex-shrink-0">{r.categoria}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-[10px] -mt-1.5">Si ya alguien cargó este producto antes, elígelo de la lista para no repetir categoría/marca/descripción.</p>
                  <input className={inputClass} placeholder='Variante — talla, sabor, color... o "Único" si no aplica' value={nuevo.variant} onChange={(e) => setNuevo((n) => ({ ...n, variant: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">$</span>
                      <input className={inputClass.replace('px-4', 'pl-7 pr-4')} type="number" min="1" placeholder="Precio en COP" value={nuevo.price} onChange={(e) => setNuevo((n) => ({ ...n, price: e.target.value }))} />
                    </div>
                    <input className={inputClass} type="number" min="0" placeholder="Stock" value={nuevo.stock} onChange={(e) => setNuevo((n) => ({ ...n, stock: e.target.value }))} />
                  </div>
                  <ComboboxBuscable
                    value={nuevo.categoria}
                    options={SUPPLY_CATEGORIAS}
                    placeholder="Categoría"
                    inputClassName={inputClass}
                    disabled={categoriaMarcaBloqueada}
                    onChange={(categoria) => {
                      // Al cambiar de categoría, si la marca elegida ya no
                      // aplica ahí (ej. venía de Tintas y ahora es Cartuchos),
                      // se limpia — evita dejar una marca incoherente guardada.
                      const marcasValidas = marcasParaCategoria(categoria)
                      const marcaSigueValida = marcasValidas.includes(nuevo.marca)
                      setNuevo((n) => ({ ...n, categoria, marca: marcaSigueValida ? n.marca : '' }))
                      prefillDescripcion(categoria, marcaSigueValida ? nuevo.marca : '')
                    }}
                  />
                  <ComboboxBuscable
                    value={nuevo.marca}
                    options={marcasParaCategoria(nuevo.categoria)}
                    labelFor={SUPPLY_MARCA_LABEL}
                    placeholder="Marca (opcional)"
                    inputClassName={inputClass}
                    disabled={categoriaMarcaBloqueada}
                    onChange={(marca) => { setNuevo((n) => ({ ...n, marca })); prefillDescripcion(nuevo.categoria, marca) }}
                  />
                  {nuevo.master_product_id && !varianteDe && (
                    <div className="flex items-center justify-between bg-green-50 rounded-md px-2.5 py-1.5 -mt-1">
                      <p className="text-[10px] text-green-700">✓ Categoría y marca reales — vinculadas al catálogo maestro.</p>
                      <button type="button" onClick={() => setNuevo((n) => ({ ...n, master_product_id: null }))} className="text-gray-400 text-[10px] font-bold uppercase underline flex-shrink-0 ml-2">No es este</button>
                    </div>
                  )}
                  <textarea rows={2} className={inputClass} placeholder="Descripción (opcional)" value={nuevo.descripcion} onChange={(e) => setNuevo((n) => ({ ...n, descripcion: e.target.value, descripcionAuto: false }))} />

                  {error && <p className="text-red-600 text-xs">{error}</p>}

                  <button
                    type="button"
                    onClick={guardar}
                    disabled={guardando}
                    className="w-full py-2.5 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{ backgroundColor: BTN }}
                  >
                    {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : '+ Agregar producto'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: ver detalle de un producto (2026-08-27, nuevo — antes
              la única forma de ver la foto/descripción era la card grande;
              con la tabla compacta hace falta un botón dedicado). */}
          {verGrupo && (
            <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center px-0 sm:px-4" onClick={() => setVerGrupo(null)}>
              <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="w-full aspect-square bg-gray-100">
                  {verGrupo.variantes.find((v) => v.image_url)?.image_url ? (
                    <img src={verGrupo.variantes.find((v) => v.image_url).image_url} alt={verGrupo.product} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Sin foto</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-black text-sm truncate">{verGrupo.product}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide truncate">{verGrupo.categoria}{verGrupo.variantes[0]?.marca ? ` · ${verGrupo.variantes[0].marca}` : ''}</p>
                    </div>
                    <button type="button" onClick={() => setVerGrupo(null)} aria-label="Cerrar" className="text-gray-400 flex-shrink-0"><X size={18} /></button>
                  </div>
                  {verGrupo.variantes[0]?.descripcion && (
                    <p className="text-gray-600 text-xs leading-relaxed mt-2">{verGrupo.variantes[0].descripcion}</p>
                  )}
                  <div className="mt-3 space-y-1.5">
                    {verGrupo.variantes.map((v) => (
                      <div key={v.id} className={`flex items-center justify-between text-xs rounded-md px-2.5 py-1.5 bg-gray-50 ${v.is_active ? '' : 'opacity-50'}`}>
                        <span className="truncate flex-1">{v.variant || 'Única'}</span>
                        <span className="text-gray-600 flex-shrink-0 mx-2">${Number(v.price).toLocaleString('es-CO')}</span>
                        <span className="text-gray-400 flex-shrink-0">Stock: {v.stock}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Link para compartir este producto</p>
                    <div className="flex items-center gap-2">
                      <p className="flex-1 min-w-0 text-[11px] text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 truncate">
                        {`${import.meta.env.VITE_SITE_URL}/p/${verGrupo.variantes[0].id}`}
                      </p>
                      <button
                        type="button"
                        onClick={() => copiarLink(`${import.meta.env.VITE_SITE_URL}/p/${verGrupo.variantes[0].id}`)}
                        className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: BTN }}
                      >
                        {linkCopiado ? <Check size={12} /> : <Link2 size={12} />}
                        {linkCopiado ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { const primera = verGrupo.variantes[0]; setVerGrupo(null); iniciarEdicion(primera) }}
                    className="w-full mt-3 py-2.5 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: BTN }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
