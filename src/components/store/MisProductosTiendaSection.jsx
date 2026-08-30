import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, LoaderCircle, Check, Trash2, ChevronDown, CopyPlus, Eye, Plus, Link2, Pencil, X, ExternalLink } from 'lucide-react'
import ComboboxBuscable from '../artistas/ComboboxBuscable'

const PANEL_URL = import.meta.env.VITE_PANEL_URL || 'https://inkognito-panel-production.up.railway.app'
const BTN = '#374151'
const inputClass = 'w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors'

// Store multitenant (2026-08-29) — mismas 7 categorías fijas que ya usan
// las páginas de categoría de Store (src/data/storeCategories.jsx), un
// valor libre dejaría el producto sin ninguna página real donde
// aparecer, mismo criterio que SUPPLY_CATEGORIAS en Supply. Sin
// equivalente de SUPPLY_MARCAS/MARCAS_POR_CATEGORIA — Store no tiene
// páginas curadas por marca como sí tiene Supply, así que `marca` acá es
// texto libre en vez de una lista cerrada.
const STORE_CATEGORIAS_ESTUDIO = ['Ropa Dama', 'Ropa Caballeros', 'Zapatos Deportivos', 'Zapatos Casuales', 'Guayos', 'Teniguayos', 'Ropa General']
const PRODUCTO_VACIO_TIENDA = { product: '', variant: '', price: '', stock: '', categoria: STORE_CATEGORIAS_ESTUDIO[0], marca: '', image_url: '', descripcion: '', descripcionAuto: false, master_product_id: null }

// "Mis productos en Store" (Store multitenant) — relocada 2026-08-30 al
// fusionar perfil+catálogo (antes vivía dentro de EstudioEditarPerfilPage.jsx,
// el dashboard compartido con estudios/empresas de Supply — Store ya no
// pasa por ahí, este componente ahora vive solo en su propio módulo, sin
// ningún vínculo con el de artistas). Mismo patrón de CRUD autocontenido
// que su equivalente de Supply. Sin acordeón propio (quitado 2026-08-30,
// Jose: el botón de gestión no debe abrir directo la edición de perfil —
// "Mis productos" debe verse como su propia opción aparte) — ahora vive
// en su propia pantalla dentro de EstudioTiendaOwnerPanel.jsx, la
// navegación del panel YA decide cuándo se muestra, no hace falta un
// segundo toggle acá adentro.
export default function MisProductosTiendaSection({ token, cloud_name, upload_preset, estudioId, estudioSlug }) {
  const [productos, setProductos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [subiendo, setSubiendo] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [nuevo, setNuevo] = useState(PRODUCTO_VACIO_TIENDA)
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState(null)
  const [masterResults, setMasterResults] = useState([])
  const [varianteDe, setVarianteDe] = useState(null)
  const fileInput = useRef(null)
  const masterSearchTimer = useRef(null)
  const [formAbierto, setFormAbierto] = useState(false)
  const [verGrupo, setVerGrupo] = useState(null)
  const [grupoExpandido, setGrupoExpandido] = useState(null)
  const [linkCopiado, setLinkCopiado] = useState(false)
  const copiarLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopiado(true)
      setTimeout(() => setLinkCopiado(false), 1500)
    }).catch(() => {})
  }

  useEffect(() => {
    fetch(`${PANEL_URL}/api/estudios-inventario-tienda-por-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setProductos)
      .catch(() => setProductos([]))
      .finally(() => setCargando(false))
  }, [token])

  const subirFoto = async (file) => {
    if (!file || !cloud_name || !upload_preset) return
    setSubiendo(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', upload_preset)
      fd.append('folder', 'inkognito-tienda-estudios')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) setNuevo((n) => ({ ...n, image_url: data.secure_url }))
    } catch {
      setError('No pudimos subir la foto — intenta de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  const iniciarEdicion = (p) => {
    setError(null)
    setEditando(p.id)
    setVarianteDe(null)
    setMasterResults([])
    setNuevo({ product: p.product, variant: p.variant || '', price: p.price, stock: p.stock, categoria: p.categoria, marca: p.marca || '', image_url: p.image_url || '', descripcion: p.descripcion || '', descripcionAuto: false, master_product_id: null })
    setFormAbierto(true)
  }
  const cancelarEdicion = () => { setEditando(null); setVarianteDe(null); setNuevo(PRODUCTO_VACIO_TIENDA); setMasterResults([]); setError(null); setFormAbierto(false) }
  const abrirNuevoProducto = () => {
    setError(null)
    setEditando(null)
    setVarianteDe(null)
    setMasterResults([])
    setNuevo(PRODUCTO_VACIO_TIENDA)
    setFormAbierto(true)
  }

  const agregarVariante = (p) => {
    setError(null)
    setEditando(null)
    setVarianteDe(p.product)
    setMasterResults([])
    setNuevo({ product: p.product, variant: '', price: p.price || '', stock: '', categoria: p.categoria, marca: p.marca || '', image_url: '', descripcion: p.descripcion || '', descripcionAuto: false, master_product_id: p.master_product_id || null })
    setFormAbierto(true)
  }

  const onProductInput = (value) => {
    setNuevo((n) => ({ ...n, product: value, master_product_id: null }))
    clearTimeout(masterSearchTimer.current)
    if (value.trim().length < 2) { setMasterResults([]); return }
    masterSearchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${PANEL_URL}/api/master-catalog/search?module=store&categoria=${encodeURIComponent(nuevo.categoria || '')}&q=${encodeURIComponent(value.trim())}`)
        const data = await res.json()
        setMasterResults(data.results || [])
      } catch { setMasterResults([]) }
    }, 300)
  }

  const prefillDescripcion = async (categoria, marca) => {
    try {
      const res = await fetch(`${PANEL_URL}/api/catalogo-defaults-lookup?module=store&categoria=${encodeURIComponent(categoria || '')}&marca=${encodeURIComponent(marca || '')}`)
      const data = await res.json()
      if (data.descripcion) {
        setNuevo((n) => (n.descripcion && !n.descripcionAuto ? n : { ...n, descripcion: data.descripcion, descripcionAuto: true }))
      }
    } catch { /* silencioso — la tienda siempre puede escribirla a mano */ }
  }

  const seleccionarMaster = (item) => {
    setNuevo((n) => ({
      ...n,
      product: item.product,
      categoria: item.categoria || n.categoria,
      marca: item.marca || n.marca,
      descripcion: item.descripcion || n.descripcion,
      descripcionAuto: false,
      image_url: n.image_url || item.image_url || '',
      master_product_id: item.id,
    }))
    setMasterResults([])
  }

  const guardar = async () => {
    if (!nuevo.product.trim() || !nuevo.price) {
      setError('El nombre y el precio son obligatorios.')
      return
    }
    if (!nuevo.variant.trim()) {
      setError('Escribe una talla o variante (talla, color...) — o "Único" si el producto no tiene variantes.')
      return
    }
    setError(null)

    if (!editando && !nuevo.master_product_id) {
      try {
        const simRes = await fetch(`${PANEL_URL}/api/master-catalog/similar?module=store&categoria=${encodeURIComponent(nuevo.categoria || '')}&product=${encodeURIComponent(nuevo.product.trim())}`)
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
      const url = editando ? `${PANEL_URL}/api/estudios-inventario-tienda-por-token/${editando}` : `${PANEL_URL}/api/estudios-inventario-tienda-por-token`
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
    const res = await fetch(`${PANEL_URL}/api/estudios-inventario-tienda-por-token/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, is_active: !p.is_active }),
    })
    if (res.ok) setProductos((ps) => ps.map((x) => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
  }

  const borrar = async (p) => {
    const res = await fetch(`${PANEL_URL}/api/estudios-inventario-tienda-por-token/${p.id}?token=${encodeURIComponent(token)}`, { method: 'DELETE' })
    if (res.ok) {
      setProductos((ps) => ps.filter((x) => x.id !== p.id))
      if (editando === p.id) cancelarEdicion()
    }
  }

  const grupos = useMemo(() => {
    if (!productos) return []
    const mapa = new Map()
    for (const p of productos) {
      if (!mapa.has(p.product)) mapa.set(p.product, { product: p.product, categoria: p.categoria, variantes: [] })
      mapa.get(p.product).variantes.push(p)
    }
    return [...mapa.values()]
  }, [productos])

  const categoriaMarcaBloqueada = !!varianteDe || !!nuevo.master_product_id

  return (
    <div>
          {/* Más grande y más informativa (2026-08-30, Jose: "es allí donde
              puede ver su catálogo y agregar más productos") — antes solo
              explicaba dónde aparecían los productos, sin decir que acá
              mismo puede ver cómo le queda su catálogo. */}
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Acá administras los productos de tu tienda — agrégalos, edítalos o quítalos con el botón de abajo. Se ven en tu catálogo público y también mezclados en la categoría correspondiente de Store.
          </p>
          {estudioId && (
            <a
              href={`/store/${estudioSlug || `estudio/${estudioId}`}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mb-4 text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-gray-900 underline underline-offset-2"
            >
              Ver mi catálogo público <ExternalLink size={12} />
            </a>
          )}

          {cargando ? (
            <p className="text-gray-400 text-xs text-center py-4">Cargando...</p>
          ) : (
            <>
              <button
                type="button"
                onClick={abrirNuevoProducto}
                className="w-full mb-4 py-2.5 flex items-center justify-center gap-1.5 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: BTN }}
              >
                <Plus size={14} />
                Agregar producto a mi tienda
              </button>

              {grupos.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-6">Todavía no tienes productos — agrega el primero arriba.</p>
              ) : (
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
                              <button type="button" onClick={() => agregarVariante(g.variantes[0])} aria-label="Agregar variante" title="Agregar talla/variante"><CopyPlus size={13} /></button>
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

          {formAbierto && (
            <div className="fixed inset-0 z-[80] bg-black/60 flex items-end sm:items-center justify-center px-0 sm:px-4" onClick={cancelarEdicion}>
              <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm max-h-[92vh] overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-black uppercase text-gray-700">{editando ? 'Editando producto' : varianteDe ? 'Nueva variante' : 'Agregar producto'}</p>
                  <button type="button" onClick={cancelarEdicion} aria-label="Cerrar" className="text-gray-400"><X size={18} /></button>
                </div>
                <div className="space-y-2.5">
                  {varianteDe && (
                    <div className="bg-gray-100 rounded-md px-2.5 py-1.5">
                      <p className="text-[10px] text-gray-600">Nueva talla/variante de <span className="font-black">{varianteDe}</span> — quedará agrupada con el mismo producto.</p>
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
                  <input className={inputClass} placeholder='Talla o variante — o "Único" si no aplica' value={nuevo.variant} onChange={(e) => setNuevo((n) => ({ ...n, variant: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">$</span>
                      <input className={inputClass.replace('px-4', 'pl-7 pr-4')} type="number" min="1" placeholder="Precio en COP" value={nuevo.price} onChange={(e) => setNuevo((n) => ({ ...n, price: e.target.value }))} />
                    </div>
                    <input className={inputClass} type="number" min="0" placeholder="Stock" value={nuevo.stock} onChange={(e) => setNuevo((n) => ({ ...n, stock: e.target.value }))} />
                  </div>
                  <ComboboxBuscable
                    value={nuevo.categoria}
                    options={STORE_CATEGORIAS_ESTUDIO}
                    placeholder="Categoría"
                    inputClassName={inputClass}
                    disabled={categoriaMarcaBloqueada}
                    onChange={(categoria) => {
                      setNuevo((n) => ({ ...n, categoria }))
                      prefillDescripcion(categoria, nuevo.marca)
                    }}
                  />
                  <input
                    className={`${inputClass} ${categoriaMarcaBloqueada ? 'bg-gray-100 text-gray-500' : ''}`}
                    placeholder="Marca (opcional)"
                    readOnly={categoriaMarcaBloqueada}
                    value={nuevo.marca}
                    onChange={(e) => { setNuevo((n) => ({ ...n, marca: e.target.value })); prefillDescripcion(nuevo.categoria, e.target.value) }}
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

          {verGrupo && (
            <div className="fixed inset-0 z-[80] bg-black/60 flex items-end sm:items-center justify-center px-0 sm:px-4" onClick={() => setVerGrupo(null)}>
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
  )
}
