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
  route('supply/cartridges/ez-tattoo', 'components/supply/categories/Cartridges/EZCartridgesPage.jsx'),
  route('supply/cartridges/wjx', 'components/supply/categories/Cartridges/WJXCartridgesPage.jsx'),
  route('supply/cartridges/kwadron', 'components/supply/categories/Cartridges/KwadronCartridgesPage.jsx'),
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
  route('supply/aprende', 'components/supply/AprendePage.jsx'),

  // Store
  route('store', 'components/store/StorePage.jsx'),
  route('store/ropa-dama', 'components/store/categories/RopaDamaPage.jsx'),
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
  route('gym/suplementos', 'components/gym/categories/SuplementosPage.jsx'),
  route('gym/recursos', 'components/gym/categories/RecursosPage.jsx'),
]
