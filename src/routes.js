import { route, index } from '@react-router/dev/routes'

// Cluster "home" del bloque piloto — infra + estas rutas ya llevan loader/meta()
// real (ver plan en C:\Users\USUARIO\.claude\plans\typed-toasting-lampson.md).
// El resto (Supply/Store/Gym/producto) se registra tal cual estaba en el
// App.jsx viejo — mismo comportamiento de hoy (fetch client-side con
// useCatalog), solo movidas al nuevo sistema de rutas. Se convierten a
// loader en los próximos bloques del plan (Supply → Store → Gym → producto).
//
// ComingSoon retirado de /supply, /store, /gym (2026-07-30) — Jose ya está
// hablando con proveedores y necesita las páginas reales visibles. Las 3
// páginas (SupplyPage/StorePage/GymPage) ya existían completas en el
// código, solo estaban desconectadas de routes.js — no hizo falta traer
// nada de la rama master (que sigue desactualizada, pre-migración SSR).
// Categorías con poco/sin inventario ya muestran "Próximamente disponible"
// automáticamente (ver SupplyCategoryPage.jsx) — no es un bug, es el estado
// esperado mientras se sigue cargando catálogo real.
export default [
  index('components/ecosystem/InkognitoHome.jsx'),
  route('jhumaneztattoo', 'routes/HomePage.jsx'),
  route('jhumaneztattoo/agenda', 'routes/JhumaneztattooAgenda.jsx'),
  route('portafolio', 'routes/PortfolioPage.jsx'),
  route('cuidados', 'components/tattoo/CuidadosPage.jsx'),
  route('p/:id', 'components/landing/ProductLandingPage.jsx'),
  route('pedido/:module', 'components/pedido/PedidoOnlinePage.jsx'),

  // Legal
  route('privacidad', 'components/legal/PrivacidadPage.jsx'),
  route('terminos', 'components/legal/TerminosPage.jsx'),
  route('envios-cambios-devoluciones', 'components/legal/EnviosPage.jsx'),

  // Supply
  route('supply', 'components/supply/SupplyPage.jsx'),
  route('supply/machines', 'components/supply/categories/MachinesPage.jsx'),
  route('supply/cartridges', 'components/supply/categories/Cartridges/CartridgesPage.jsx'),
  route('supply/cartuchos-surtidos', 'components/supply/categories/Cartridges/CartuchosSurtidosPage.jsx'),
  route('supply/cartridges/ez-tattoo', 'components/supply/categories/Cartridges/EZCartridgesPage.jsx'),
  route('supply/cartridges/wjx', 'components/supply/categories/Cartridges/WJXCartridgesPage.jsx'),
  route('supply/power-supplies', 'components/supply/categories/PowerSuppliesPage.jsx'),
  route('supply/ink', 'components/supply/categories/ink/InkPage.jsx'),
  route('supply/ink/vice-colors', 'components/supply/categories/ink/ViceColorsPage.jsx'),
  route('supply/ink/dynamic', 'components/supply/categories/ink/DynamicColorsPage.jsx'),
  route('supply/ink/eternal', 'components/supply/categories/ink/EternalColorsPage.jsx'),
  route('supply/ink/intenze', 'components/supply/categories/ink/IntenzeColorsPage.jsx'),
  route('supply/ink/fusion', 'components/supply/categories/ink/FusionColorsPage.jsx'),
  route('supply/ink/world-famous', 'components/supply/categories/ink/WorldFamousColorsPage.jsx'),
  route('supply/ink/solid-ink', 'components/supply/categories/ink/SolidColorsPage.jsx'),
  route('supply/needles', 'components/supply/categories/NeedlesPage.jsx'),
  route('supply/gloves', 'components/supply/categories/GlovesPage.jsx'),
  route('supply/aftercare', 'components/supply/categories/AftercarePage.jsx'),
  route('supply/accessories', 'components/supply/categories/AccessoriesPage.jsx'),
  route('supply/furniture', 'components/supply/categories/FurniturePage.jsx'),
  route('supply/bundles', 'components/supply/categories/BundlesPage.jsx'),
  route('supply/brands/tattoo-vision', 'components/supply/marcasProfesionales/TattooVisionPage.jsx'),
  route('supply/brands/heaven-pro', 'components/supply/marcasProfesionales/HeavenProPage.jsx'),
  route('supply/brands/royal-three', 'components/supply/marcasProfesionales/RoyalThreePage.jsx'),
  route('supply/mobiliario/warlock', 'components/supply/marcasProfesionales/IndustriasWarlockPage.jsx'),
  route('supply/aprende', 'components/supply/AprendePage.jsx'),

  // Store
  route('store', 'components/store/StorePage.jsx'),
  route('store/ropa-dama', 'components/store/categories/RopaDamaPage.jsx'),
  route('store/ropa-general', 'components/store/categories/RopaGeneralPage.jsx'),
  route('store/ropa-caballeros', 'components/store/categories/RopaCaballerosPage.jsx'),
  route('store/zapatos-deportivos', 'components/store/categories/ZapatosDeportivosPage.jsx'),
  route('store/zapatos-casuales', 'components/store/categories/ZapatosCasualesPage.jsx'),
  route('store/guayos', 'components/store/categories/GuayosPage.jsx'),
  route('store/tenis-guayo', 'components/store/categories/TenisGuayoPage.jsx'),

  // Gym
  route('gym', 'components/gym/GymPage.jsx'),
  route('gym/maquinas-pedido', 'components/gym/categories/MaquinasPedidoPage.jsx'),
  route('gym/tutoriales', 'components/gym/categories/VideosTutorialesPage.jsx'),
  route('gym/cursos', 'components/gym/categories/CursosPage.jsx'),
  route('gym/recursos', 'components/gym/categories/RecursosPage.jsx'),
  // Suplementos era una página de Gym — se independizó como módulo propio
  // (2026-08-02). Redirect preserva links/SEO viejos de /gym/suplementos.
  route('gym/suplementos', 'routes/RedirectGymSuplementos.jsx'),

  // Suple (INKognito Suple — suplementos deportivos, módulo propio)
  route('suplementos', 'components/suplementos/SuplePage.jsx'),
  route('suplementos/proteinas', 'components/suplementos/categories/ProteinasPage.jsx'),
  route('suplementos/creatina', 'components/suplementos/categories/CreatinaPage.jsx'),
  route('suplementos/pre-entreno', 'components/suplementos/categories/PreEntrenoPage.jsx'),
  route('suplementos/vitaminas', 'components/suplementos/categories/VitaminasPage.jsx'),
  route('suplementos/accesorios', 'components/suplementos/categories/AccesoriosPage.jsx'),

  // Tattoo Artist Colombia — directorio de artistas (2026-08-03, renombrado
  // de "Urabá" a "Colombia" el 2026-08-06 tras la expansión nacional del
  // registro). Desplegado sin exponer aún: sin link desde InkognitoHome.jsx
  // ni ningún navbar, adrede — ver plan "Directorio de artistas de tatuaje
  // en Urabá" (nombre original del plan).
  route('tattoo-artist-colombia', 'components/artistas/ArtistasColombiaPage.jsx'),
  route('tattoo-artist-colombia/unete', 'components/artistas/ArtistaRegistroPage.jsx'),
  // Verificación de correo + edición de perfil por token (2026-08-05) —
  // ver server.js (panel) para el flujo completo.
  route('tattoo-artist-colombia/mi-perfil', 'components/artistas/ArtistaEditarPerfilPage.jsx'),
  // Legal propio del módulo (2026-08-06, Jose: "este ser un módulo
  // especial así que deberá aparecer solo su información") — separado
  // de /terminos y /privacidad, que son del resto del ecosistema.
  route('tattoo-artist-colombia/terminos', 'components/artistas/TerminosArtistasPage.jsx'),
  route('tattoo-artist-colombia/privacidad', 'components/artistas/PrivacidadArtistasPage.jsx'),
  route('artista/verificar', 'components/artistas/ArtistaVerificarPage.jsx'),
  // Venta de diseños (2026-08-05) — a donde vuelve el comprador tras pagar
  // en Mercado Pago (back_urls de POST /api/disenos-comprar, panel).
  route('artista/diseno/compra', 'components/artistas/DisenoCompraResultadoPage.jsx'),
  // Reservas con anticipo (fase 2, 2026-08-06) — a donde vuelve el cliente
  // tras pagar en Mercado Pago (back_urls de POST /api/artistas-reservar).
  route('artista/reserva/resultado', 'components/artistas/ReservaResultadoPage.jsx'),
  route('artista/:id', 'components/artistas/ArtistaLandingPage.jsx'),
]
