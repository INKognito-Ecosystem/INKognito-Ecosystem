// Taxonomía limpia de marcas y líneas por categoría para INKognito Supply.
// Reglas:
// 1) Cada tarjeta usa su propia foto real y única (cero imágenes repetidas).
// 2) En categorías de marca (Tintas, Cartuchos, Máquinas, Cuidados, Fuentes) se
//    muestra únicamente el nombre limpio de la marca/línea, sin sobrecargar con
//    calibres (RL/Magnum/etc.).
// 3) Cada producto vive únicamente en su categoría correcta (ej. Cinta Coban
//    solo en Accesorios).

const normaliza = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

// Fotos limpias (recortes transparentes uniformes) para las 10 categorías en la barra izquierda:
export const CATEGORY_PRIORITY_IMG = {
  Tintas: '/supply-assets/hype-ink/hype_ink_black_clean.webp',
  Cartuchos: '/supply-assets/wjx/wjx_original_rl_clean.webp',
  Agujas: '/supply-assets/subcategorias/aguja_rl.webp',
  Máquinas: '/supply-assets/subcategorias/maquina_wireless.webp',
  Guantes: '/supply-assets/subcategorias/guantes_nitrilo.webp',
  Cuidados: '/supply-assets/mamacure/mamacure_tattoo_cream_clean.webp',
  Fuentes: '/supply-assets/subcategorias/bateria_x40.webp',
  Accesorios: '/supply-assets/tattoovision/glasses_base_clean.webp',
  Mobiliario: '/supply-assets/warlock/camilla_pro_warlock_clean.webp',
  Combos: '/supply-assets/heaven-pro/heaven_combo_clean.webp',
}

export const SUPPLY_SUBCATEGORIES = {
  Tintas: [
    {
      id: 'tintas-vice',
      name: 'Vice Colors',
      image: '/supply-assets/vice-colors/vice_vicious_500_clean.webp',
      marcas: ['vice-colors', 'vice'],
      keywords: ['vice colors', 'vice', 'vicious', 'bounasera', 'sweet lavender'],
    },
    {
      id: 'tintas-dynamic',
      name: 'Dynamic Color',
      image: '/supply-assets/dynamic/dynamic_tbk_clean.webp',
      marcas: ['dynamic', 'dynamic-color'],
      keywords: ['dynamic', 'triple black', 'tbk', 'blk', 'union black'],
      fallback: true,
    },
    {
      id: 'tintas-hype-ink',
      name: 'Hype Ink',
      image: '/supply-assets/hype-ink/hype_ink_black_clean.webp',
      marcas: ['hype-ink', 'hype'],
      keywords: ['hype ink', 'hype', 'kasasink'],
    },
    {
      id: 'tintas-eternal',
      name: 'Eternal Ink',
      image: '/supply-assets/subcategorias/ink_eternal.webp',
      marcas: ['eternal', 'eternal-ink'],
      keywords: ['eternal', 'eternal ink'],
    },
    {
      id: 'tintas-intenze',
      name: 'Intenze',
      image: '/supply-assets/subcategorias/ink_intenze.webp',
      marcas: ['intenze', 'intenze-ink'],
      keywords: ['intenze', 'zuper black', 'suluape'],
    },
    {
      id: 'tintas-world-famous',
      name: 'World Famous',
      image: '/supply-assets/subcategorias/ink_world_famous.webp',
      marcas: ['world-famous', 'world-famous-ink'],
      keywords: ['world famous', 'limitless'],
    },
    {
      id: 'tintas-radiant',
      name: 'Radiant Colors',
      image: '/supply-assets/subcategorias/ink_radiant.webp',
      marcas: ['radiant', 'radiant-colors'],
      keywords: ['radiant', 'victor portugal'],
    },
    {
      id: 'tintas-solid',
      name: 'Solid Ink',
      image: '/supply-assets/subcategorias/ink_solid.webp',
      marcas: ['solid-ink', 'solid'],
      keywords: ['solid ink', 'the solid ink'],
    },
    {
      id: 'tintas-panthera',
      name: 'Panthera Ink',
      image: '/supply-assets/subcategorias/ink_panthera.webp',
      marcas: ['panthera', 'panthera-ink'],
      keywords: ['panthera', 'black gold', 'xxx tribal', 'sumy'],
    },
    {
      id: 'tintas-allegory',
      name: 'Allegory Ink',
      image: '/supply-assets/subcategorias/ink_allegory.webp',
      marcas: ['allegory', 'allegory-ink'],
      keywords: ['allegory', 'blak', 'ultra blak'],
    },
    {
      id: 'tintas-nocturnal',
      name: 'Nocturnal Ink',
      image: '/supply-assets/subcategorias/ink_nocturnal.webp',
      marcas: ['nocturnal', 'nocturnal-ink'],
      keywords: ['nocturnal', 'west coast'],
    },
    {
      id: 'tintas-blanco-mixer',
      name: 'Blanco & Mixer',
      image: '/supply-assets/dynamic/dynamic_white_clean.webp',
      marcas: ['diluyentes'],
      keywords: ['blanco', 'white', 'mixer', 'diluyente', 'aqua mixer', 'mixing solution'],
    },
  ],

  Cartuchos: [
    {
      id: 'cartuchos-wjx',
      name: 'WJX',
      image: '/supply-assets/wjx/wjx_original_rl_clean.webp',
      marcas: ['wjx'],
      keywords: ['wjx'],
      fallback: true,
    },
    {
      id: 'cartuchos-ez-revolution',
      name: 'EZ Revolution',
      image: '/supply-assets/subcategorias/cartucho_rs.webp',
      marcas: ['ez-revolution', 'ez-tattoo', 'ez'],
      keywords: ['ez revolution', 'revolution'],
    },
    {
      id: 'cartuchos-ez-vselect',
      name: 'EZ V-Select',
      image: '/supply-assets/subcategorias/cart_vselect.webp',
      marcas: ['ez-vselect', 'v-select'],
      keywords: ['v-select', 'v select', 'vselect'],
    },
    {
      id: 'cartuchos-kwadron',
      name: 'Kwadron',
      image: '/supply-assets/subcategorias/cart_kwadron.webp',
      marcas: ['kwadron'],
      keywords: ['kwadron'],
    },
    {
      id: 'cartuchos-bishop',
      name: 'Bishop Da Vinci',
      image: '/supply-assets/subcategorias/cart_bishop.webp',
      marcas: ['bishop', 'da-vinci', 'bishop-da-vinci'],
      keywords: ['da vinci', 'davinci', 'bishop'],
    },
    {
      id: 'cartuchos-peak',
      name: 'Peak',
      image: '/supply-assets/subcategorias/cart_peak.webp',
      marcas: ['peak', 'triton', 'peak-needles'],
      keywords: ['peak', 'triton', 'quartz', 'bloodline'],
    },
    {
      id: 'cartuchos-surtidos',
      name: 'Cajas Surtidas',
      image: '/supply-assets/wjx/wjx_ultimate_clean.webp',
      marcas: [],
      keywords: ['surtida', 'surtido', 'mixta', 'variado'],
      customPath: '/supply/cartuchos-surtidos',
    },
  ],

  Agujas: [
    {
      id: 'agujas-precision',
      name: 'Precision Needles',
      image: '/supply-assets/subcategorias/aguja_rl.webp',
      marcas: ['precision', 'spark', 'kingpin'],
      keywords: ['precision', 'tradicional', 'varilla', 'aguja', 'liner', 'shader'],
      fallback: true,
    },
    {
      id: 'agujas-tradicionales',
      name: 'Agujas en Caja',
      image: '/supply-assets/subcategorias/cartucho_m1.webp',
      marcas: ['kwadron', 'ez-tattoo'],
      keywords: ['magnum', 'flat', 'caja x50', 'barra'],
    },
    {
      id: 'agujas-piercing',
      name: 'Agujas Piercing',
      image: '/supply-assets/subcategorias/aguja_curva.webp',
      marcas: ['inxoye', 'kiato', 'jelco'],
      keywords: ['piercing', 'cateter', 'americana', 'curva', 'perforacion'],
    },
    {
      id: 'agujas-guardianes',
      name: 'Guardianes',
      image: '/supply-assets/subcategorias/guardian_agujas.webp',
      marcas: ['biofit', 'prosafe'],
      keywords: ['guardian', 'cortopunzante', 'recolector', 'descarte'],
    },
  ],

  Máquinas: [
    {
      id: 'maquinas-ez',
      name: 'EZ Tattoo',
      image: '/supply-assets/subcategorias/maquina_wireless.webp',
      marcas: ['ez-tattoo', 'ez'],
      keywords: ['ez tattoo', 'ez p3', 'p3 pro', 'p2s', 'evotech', 'ez wireless'],
      fallback: true,
    },
    {
      id: 'maquinas-mast',
      name: 'Mast',
      image: '/supply-assets/subcategorias/maquina_pen.webp',
      marcas: ['mast', 'mastlabs', 'dragonhawk'],
      keywords: ['mast', 'archer', 'racer', 'fold pro', 'tour', 'dragonhawk'],
    },
    {
      id: 'maquinas-wjx',
      name: 'WJX',
      image: '/supply-assets/wjx/wjx_hyper_force_clean.webp',
      marcas: ['wjx'],
      keywords: ['wjx', 'hyper force'],
    },
    {
      id: 'maquinas-don-melo',
      name: 'Don Melo',
      image: '/supply-assets/donmelo/don_melo_coil_liner_clean.webp',
      marcas: ['don-melo', 'donmelo'],
      keywords: ['don melo', 'bobina', 'coil'],
    },
    {
      id: 'maquinas-fk-irons',
      name: 'FK Irons',
      image: '/supply-assets/subcategorias/maq_fk_irons.webp',
      marcas: ['fk-irons', 'spektra', 'darklab'],
      keywords: ['fk irons', 'spektra', 'flux max', 'xion', 'exo'],
    },
    {
      id: 'maquinas-peak',
      name: 'Peak',
      image: '/supply-assets/subcategorias/maq_peak.webp',
      marcas: ['peak'],
      keywords: ['peak', 'solice'],
    },
    {
      id: 'maquinas-lola-pmu',
      name: 'Lola PMU',
      image: '/supply-assets/subcategorias/maquina_pmu.webp',
      marcas: ['lola', 'biomaser'],
      keywords: ['lola', 'pmu', 'micropigmentacion', 'dermografo', 'cejas'],
    },
  ],

  Guantes: [
    {
      id: 'guantes-nitrilo',
      name: 'Nitrilo Negro',
      image: '/supply-assets/subcategorias/guantes_nitrilo.webp',
      marcas: ['gorilla', 'naturflex', 'pantera', 'black-mamba'],
      keywords: ['nitrilo', 'nitrile', 'negro', 'gorilla', 'mamba'],
      fallback: true,
    },
    {
      id: 'guantes-latex',
      name: 'Látex',
      image: '/supply-assets/subcategorias/guantes_latex.webp',
      marcas: ['supermax', 'aurelia', 'sempermed'],
      keywords: ['latex', 'sin polvo'],
    },
    {
      id: 'guantes-campos',
      name: 'Campos Estériles',
      image: '/supply-assets/subcategorias/campos_esteriles.webp',
      marcas: [],
      keywords: ['campo', 'babero', 'dental bib', 'antifluido'],
    },
    {
      id: 'guantes-toallas',
      name: 'Toallas Scott',
      image: '/supply-assets/subcategorias/toallas_scott.webp',
      marcas: ['scott', 'kimberly-clark'],
      keywords: ['toalla', 'scott', 'duramax', 'papel absorbente'],
    },
    {
      id: 'guantes-cubre-maquinas',
      name: 'Cubre-Máquinas',
      image: '/supply-assets/subcategorias/acc_cubre_maquina.webp',
      marcas: [],
      keywords: ['cubre maquina', 'funda pen', 'machine bag', 'pen sleeve', 'barrera'],
    },
  ],

  Cuidados: [
    {
      id: 'cuidados-heaven-pro',
      name: 'Heaven Pro',
      image: '/supply-assets/heaven-pro/heaven_vitta_clean.webp',
      marcas: ['heaven-pro', 'heaven'],
      keywords: ['heaven', 'vitta', 'vita', 'medium', 'tacttus', 'aqua'],
      fallback: true,
    },
    {
      id: 'cuidados-mamacure',
      name: 'MamaCure',
      image: '/supply-assets/mamacure/mamacure_tattoo_cream_clean.webp',
      marcas: ['mamacure'],
      keywords: ['mamacure', 'dragon balm', 'tattoo cream', 'light foam', 'natural soap'],
    },
    {
      id: 'cuidados-royal-three',
      name: 'Royal Three',
      image: '/supply-assets/royal-three/royal_cocoa_clean.webp',
      marcas: ['royal-three'],
      keywords: ['royal three', 'cocoa', 'aloe ink'],
    },
    {
      id: 'cuidados-happy-ink',
      name: 'Happy Ink',
      image: '/supply-assets/subcategorias/care_happy_ink.webp',
      marcas: ['happy-ink', 'happyink'],
      keywords: ['happy ink', 'happyink'],
    },
    {
      id: 'cuidados-proton',
      name: 'Proton',
      image: '/supply-assets/subcategorias/care_proton.webp',
      marcas: ['proton'],
      keywords: ['proton', 'colours obsession', 'proton butter', 'proton cream'],
    },
    {
      id: 'cuidados-green-soap',
      name: 'Green Soap',
      image: '/supply-assets/subcategorias/care_green_soap.webp',
      marcas: ['cosco', 'ultraink'],
      keywords: ['green soap', 'jabon verde', 'espuma', 'foamer'],
    },
    {
      id: 'cuidados-second-skin',
      name: 'Second Skin',
      image: '/supply-assets/subcategorias/care_dermalize.webp',
      marcas: ['dermalize', 'saniderm', 'second-skin'],
      keywords: ['second skin', 'segunda piel', 'dermalize', 'saniderm', 'repair film', 'parche'],
    },
    {
      id: 'cuidados-anestesias',
      name: 'Anestesias',
      image: '/supply-assets/subcategorias/care_anestesia.webp',
      marcas: ['tktx', 'no-pain'],
      keywords: ['anestesia', 'tktx', 'no pain', 'numbing'],
    },
    {
      id: 'cuidados-medusa',
      name: 'Medusa',
      image: '/supply-assets/subcategorias/care_medusa.webp',
      marcas: ['medusa', 'liquid-hard'],
      keywords: ['medusa', 'solidificador', 'liquid hard'],
    },
    {
      id: 'cuidados-hustle-butter',
      name: 'Hustle Butter',
      image: 'https://m.media-amazon.com/images/I/71gwi21XOZL._SL1500_.jpg',
      marcas: ['hustle-butter', 'hustle butter'],
      keywords: ['hustle butter', 'hustle bubbles', 'cuidado posterior'],
    },
    {
      id: 'cuidados-neilmed',
      name: 'NeilMed',
      image: '/supply-assets/subcategorias/care_second_skin.webp',
      marcas: ['neilmed'],
      keywords: ['neilmed', 'solucion salina', 'fine mist', 'spray'],
    },
  ],

  Fuentes: [
    {
      id: 'fuentes-critical',
      name: 'Critical',
      image: '/supply-assets/subcategorias/fue_critical.webp',
      marcas: ['critical'],
      keywords: ['critical', 'atom', 'cx2', 'shorty', 'snap'],
    },
    {
      id: 'fuentes-ez',
      name: 'EZ Wireless',
      image: '/supply-assets/subcategorias/bateria_p3.webp',
      marcas: ['ez-tattoo', 'ez'],
      keywords: ['bateria ez', 'portex', 'p3', 'bateria'],
      fallback: true,
    },
    {
      id: 'fuentes-filter',
      name: 'Filter X40',
      image: '/supply-assets/subcategorias/bateria_x40.webp',
      marcas: ['filter'],
      keywords: ['filter', 'x40', 'bateria rca'],
    },
    {
      id: 'fuentes-mast',
      name: 'Mast',
      image: '/supply-assets/subcategorias/bateria_mast.webp',
      marcas: ['mast', 'ambition'],
      keywords: ['mast', 'racer', 'ambition'],
    },
    {
      id: 'fuentes-pedales',
      name: 'Pedales',
      image: '/supply-assets/subcategorias/pedal_ez.webp',
      marcas: [],
      keywords: ['pedal', 'footswitch'],
    },
    {
      id: 'fuentes-cables',
      name: 'Cables RCA',
      image: '/supply-assets/subcategorias/fue_clip_cord.webp',
      marcas: [],
      keywords: ['cable', 'rca', 'clip cord'],
    },
  ],

  Accesorios: [
    {
      id: 'accesorios-tattoo-vision',
      name: 'Tattoo Vision',
      image: '/supply-assets/tattoovision/glasses_base_clean.webp',
      marcas: ['tattoo-vision'],
      keywords: ['tattoo vision', 'gafas', 'polarizado', 'lente'],
      fallback: true,
    },
    {
      id: 'accesorios-spirit',
      name: 'Papel Spirit',
      image: '/supply-assets/subcategorias/stencil_spirit.webp',
      marcas: ['spirit'],
      keywords: ['spirit', 'hectografico', 'papel transfer'],
    },
    {
      id: 'accesorios-ozer',
      name: 'Ozer Stencil',
      image: '/supply-assets/subcategorias/acc_termocopiadora.webp',
      marcas: ['ozer', 'phomemo'],
      keywords: ['ozer', 'termocopiadora', 'impresora stencil', 'phomemo'],
    },
    {
      id: 'accesorios-proton-stencil',
      name: 'Proton Stencil',
      image: '/supply-assets/subcategorias/acc_stencil_gel.webp',
      marcas: ['proton', 'electrum', 'stencil-stuff'],
      keywords: ['gel stencil', 'proton stencil', 'stencil stuff'],
    },
    {
      id: 'accesorios-removedor',
      name: 'Removedor Stencil',
      image: '/supply-assets/subcategorias/stencil_proton.webp',
      marcas: [],
      keywords: ['removedor', 'stencil remover'],
    },
    {
      id: 'accesorios-coban',
      name: 'Cinta Coban',
      image: '/supply-assets/subcategorias/cinta_coban.webp',
      marcas: ['3m', 'coban'],
      keywords: ['coban', 'cinta cohesiva', 'cubre grip', 'vendaje'],
    },
    {
      id: 'accesorios-caps',
      name: 'Caps de Tinta',
      image: '/supply-assets/subcategorias/acc_ink_caps.webp',
      marcas: [],
      keywords: ['caps', 'ink cap', 'copa tinta', 'copita'],
    },
    {
      id: 'accesorios-pisetas',
      name: 'Pisetas',
      image: '/supply-assets/subcategorias/acc_piseta.webp',
      marcas: [],
      keywords: ['piseta', 'botella boxeador', 'espumadora', 'wash bottle'],
    },
    {
      id: 'accesorios-piel-sintetica',
      name: 'Piel Sintética',
      image: '/supply-assets/subcategorias/acc_piel_sintetica.webp',
      marcas: ['reelskin'],
      keywords: ['piel sintetica', 'practice skin', 'reelskin', 'practica'],
    },
    {
      id: 'accesorios-electrum',
      name: 'Electrum',
      image: '/supply-assets/subcategorias/acc_sharpie.webp',
      marcas: ['electrum', 'sharpie', 'viscot'],
      keywords: ['electrum', 'marcador', 'sharpie', 'viscot'],
    },
    {
      id: 'accesorios-uv',
      name: 'Esterilizador UV',
      image: '/supply-assets/subcategorias/esterilizador_uv.webp',
      marcas: ['germix'],
      keywords: ['esterilizador', 'uv', 'ultrasonido'],
    },
    {
      id: 'accesorios-bajalenguas',
      name: 'Bajalenguas',
      image: '/supply-assets/subcategorias/acc_bajalenguas.webp',
      marcas: [],
      keywords: ['bajalenguas', 'depresor', 'paleta'],
    },
    {
      id: 'accesorios-paneles-led',
      name: 'Paneles LED',
      image: '/supply-assets/tattoovision/led_panel_v2x_clean.webp',
      marcas: ['tattoo-vision'],
      keywords: ['panel led', 'aro led', 'luz foto', 'cpl', 'polarizado'],
    },
    {
      id: 'accesorios-tripodes',
      name: 'Trípodes y Brazos',
      image: '/supply-assets/tattoovision/tripod_stand_clean.webp',
      marcas: ['tattoo-vision'],
      keywords: ['tripode', 'brazo articulado', 'pedestal', 'soporte celular'],
    },
  ],

  Mobiliario: [
    {
      id: 'mobiliario-camillas',
      name: 'Camillas Hidráulicas',
      image: '/supply-assets/warlock/camilla_pro_warlock_clean.webp',
      marcas: ['industrias-warlock', 'warlock', 'bogotattoo'],
      keywords: ['camilla', 'hidraulica', 'warlock', 'sillon'],
      fallback: true,
    },
    {
      id: 'mobiliario-camillas-electricas',
      name: 'Camillas Eléctricas',
      image: '/supply-assets/subcategorias/mob_camilla_electrica.webp',
      marcas: ['inktop', 'tatsoul'],
      keywords: ['camilla electrica', 'motorizada', 'inktop', 'electrica'],
    },
    {
      id: 'mobiliario-camillas-plegables',
      name: 'Camillas Plegables',
      image: '/supply-assets/subcategorias/mob_camilla_plegable.webp',
      marcas: [],
      keywords: ['camilla plegable', 'portatil', 'convencion', 'viajera'],
    },
    {
      id: 'mobiliario-apoyabrazos',
      name: 'Apoyabrazos',
      image: '/supply-assets/warlock/apoyabrazos_hercules_clean.webp',
      marcas: ['industrias-warlock', 'warlock'],
      keywords: ['apoyabrazos', 'descansabrazos', 'hercules'],
    },
    {
      id: 'mobiliario-apoyabrazos-xl',
      name: 'Apoyabrazos XL',
      image: '/supply-assets/subcategorias/mob_apoyabrazos_xl.webp',
      marcas: [],
      keywords: ['super big', 'apoyabrazos xl', 'apoyapiernas', 'neumatico'],
    },
    {
      id: 'mobiliario-estaciones',
      name: 'Estaciones de Trabajo',
      image: '/supply-assets/subcategorias/mob_estacion_pro.webp',
      marcas: [],
      keywords: ['estacion de trabajo', 'workstation', 'cajones', 'locker'],
    },
    {
      id: 'mobiliario-tankstorm',
      name: 'Estaciones TankStorm',
      image: '/supply-assets/subcategorias/mob_tankstorm.webp',
      marcas: ['tankstorm'],
      keywords: ['tankstorm', 'carro metalico', 'estacion light'],
    },
    {
      id: 'mobiliario-mesas',
      name: 'Mesas Auxiliares',
      image: '/supply-assets/warlock/mesa_auxiliar_clean.webp',
      marcas: ['industrias-warlock', 'warlock'],
      keywords: ['mesa auxiliar', 'mesa de trabajo', 'carro auxiliar'],
    },
    {
      id: 'mobiliario-mesas-mayo',
      name: 'Mesas Tipo Mayo',
      image: '/supply-assets/subcategorias/mob_mesa_mayo.webp',
      marcas: ['inkone', 'elite'],
      keywords: ['mesa mayo', 'tipo mayo', 'bandeja acero', 'movil'],
    },
    {
      id: 'mobiliario-sillas',
      name: 'Sillas con Espaldar',
      image: '/supply-assets/warlock/silla_espaldar_clean.webp',
      marcas: ['industrias-warlock', 'warlock'],
      keywords: ['silla espaldar', 'silla ergonomica', 'respaldo'],
    },
    {
      id: 'mobiliario-sillas-multifuncionales',
      name: 'Sillas Multifuncionales',
      image: '/supply-assets/subcategorias/mob_silla_multifuncional.webp',
      marcas: [],
      keywords: ['silla multifuncional', 'silla cliente', 'straddle', 'polea'],
    },
    {
      id: 'mobiliario-taburetes',
      name: 'Taburetes',
      image: '/supply-assets/subcategorias/mob_taburete.webp',
      marcas: [],
      keywords: ['taburete', 'butaco', 'sin espaldar', 'neumatico'],
    },
    {
      id: 'mobiliario-silla-pony',
      name: 'Sillas Pony',
      image: '/supply-assets/subcategorias/mob_silla_pony.webp',
      marcas: ['tatartist'],
      keywords: ['pony', 'saddle', 'silla de montar', 'ergonomica'],
    },
    {
      id: 'mobiliario-lampara-luna',
      name: 'Lámparas Media Luna',
      image: '/supply-assets/subcategorias/mob_lampara_luna.webp',
      marcas: [],
      keywords: ['lampara luna', 'media luna', 'half moon', 'arco led'],
    },
    {
      id: 'mobiliario-lampara-brazos',
      name: 'Lámparas Articuladas',
      image: '/supply-assets/subcategorias/mob_lampara_brazos.webp',
      marcas: ['daysoft'],
      keywords: ['lampara led', 'lampara de pie', 'lampara para tatuajes', 'brazos', 'lupa', 'daysoft'],
    },
    {
      id: 'mobiliario-exhibidores',
      name: 'Exhibidores de Tintas',
      image: '/supply-assets/subcategorias/mob_exhibidor_tintas.webp',
      marcas: [],
      keywords: ['exhibidor', 'organizador', 'rack tintas', 'acrilico'],
    },
    {
      id: 'mobiliario-mesa-luz',
      name: 'Mesas de Luz LED',
      image: '/supply-assets/subcategorias/mob_mesa_luz.webp',
      marcas: [],
      keywords: ['mesa de luz', 'led screen', 'negatoscopio', 'dibujo'],
    },
    {
      id: 'mobiliario-maletines',
      name: 'Maletines Viajeros',
      image: '/supply-assets/subcategorias/mob_maletin_viajero.webp',
      marcas: [],
      keywords: ['maletin', 'case', 'viajero', 'aluminio', 'estuche'],
    },
  ],

  Combos: [
    {
      id: 'combos-heaven-pro',
      name: 'Heaven Pro',
      image: '/supply-assets/heaven-pro/heaven_combo_clean.webp',
      marcas: ['heaven-pro', 'mamacure'],
      keywords: ['heaven', 'mamacure', 'cuidado', 'aftercare'],
      fallback: true,
    },
    {
      id: 'combos-tattoo-vision',
      name: 'Tattoo Vision',
      image: '/supply-assets/subcategorias/kit_vision.webp',
      marcas: ['tattoo-vision'],
      keywords: ['tattoo vision', 'iluminacion', 'gafas', 'tripode'],
    },
    {
      id: 'combos-pigmentos',
      name: 'Sets de Pigmentos',
      image: '/supply-assets/subcategorias/set_pigmentos.webp',
      marcas: ['radiant', 'eternal', 'dynamic', 'vice-colors'],
      keywords: ['set', 'pigmento', 'tinta', 'radiant', 'victor portugal'],
    },
    {
      id: 'combos-royal-three',
      name: 'Royal Three',
      image: '/supply-assets/royal-three/royal_k10_clean.webp',
      marcas: ['royal-three'],
      keywords: ['royal three', 'bioseguridad', 'k10', 'medusa'],
    },
  ],
}

/**
 * Infiera la categoría física de Supply a la que pertenece un producto físico
 * de afiliados (ej. Amazon / Mercado Libre guardado bajo "Kit Externo").
 * Así aparece con stock real tanto en /supply/categorias como en su página de
 * categoría (/supply/aftercare, /supply/furniture, /supply/accessories, etc.).
 */
const AFFILIATE_CATEGORY_RULES = [
  { cat: 'Cuidados', keywords: ['hustle butter', 'cuidado posterior', 'aftercare', 'balsamo', 'jabon', 'second skin', 'dermalize', 'saniderm', 'crema', 'anestesia', 'mamacure', 'heaven pro'] },
  { cat: 'Mobiliario', keywords: ['lampara led de pie', 'lampara de pie', 'lampara para tatuajes', 'camilla', 'apoyabrazos', 'reposabrazos', 'mesa auxiliar', 'bandeja rodante', 'estacion de trabajo', 'taburete', 'silla pony', 'exhibidor'] },
  { cat: 'Accesorios', keywords: ['spirit', 'papel transferencia', 'hectografico', 'stencil', 'termocopiadora', 'piel sintetica', 'coban', 'piseta', 'ink caps', 'gafas', 'tattoo vision'] },
  { cat: 'Guantes', keywords: ['guantes', 'nitrilo', 'latex', 'campos esteriles', 'dental bib', 'barrera'] },
  { cat: 'Combos', keywords: ['kit completo', 'kit de tatuaje', 'combo principiante', 'kit principiante', 'set completo'] },
  { cat: 'Máquinas', keywords: ['maquina de tatuar', 'maquina inalambrica', 'pen inalambrica', 'rotativa', 'bobina', 'fold2', 'filter x30', 'dragonhawk pen'] },
  { cat: 'Cartuchos', keywords: ['cartucho', 'wjx', 'kwadron', 'da vinci', 'v-select', 'pixl'] },
  { cat: 'Agujas', keywords: ['aguja', 'guardian', 'cortopunzante', 'sharps'] },
  { cat: 'Tintas', keywords: ['tinta', 'pigmento', 'mixing solution', 'diluyente', 'dynamic', 'eternal', 'vice colors'] },
  { cat: 'Fuentes', keywords: ['fuente de poder', 'bateria rca', 'pedal', 'cable rca', 'clip cord'] },
]

export function inferPhysicalCategoryForAffiliate(item) {
  if (!item) return null
  const hay = normaliza(`${item.name || ''} ${item.marca || ''} ${item.descripcion || ''}`)
  for (const rule of AFFILIATE_CATEGORY_RULES) {
    if (rule.keywords.some((kw) => hay.includes(kw))) {
      return rule.cat
    }
  }
  return 'Combos'
}

export function getEffectiveSupplyCategory(item) {
  if (!item) return ''
  if (item.tipo === 'afiliado' && normaliza(item.categoria) === 'kit externo') {
    return inferPhysicalCategoryForAffiliate(item)
  }
  return item.categoria || ''
}

/**
 * Distribuye los productos reales de una categoría entre sus marcas/líneas:
 * 1) Coincidencia exacta de `item.marca` (+200)
 * 2) Coincidencia parcial de `item.marca` (+80)
 * 3) Palabras clave en nombre + marca + descripción
 * 4) Si ninguna coincide, cae en `fallback: true`
 * Ordena las tarjetas con stock real primero.
 */
export function matchProductsToSubcategories(categoria, products = []) {
  const subs = SUPPLY_SUBCATEGORIES[categoria] || []
  const buckets = subs.map((sub) => ({ ...sub, products: [] }))
  const fallbackIdx = Math.max(0, buckets.findIndex((b) => b.fallback))

  for (const item of products) {
    const itemMarca = normaliza(item.marca || '')
    const hay = normaliza(`${item.name || ''} ${item.marca || ''} ${item.descripcion || ''}`)
    let matchedIdx = -1
    let bestScore = 0

    buckets.forEach((b, idx) => {
      let score = 0
      if (itemMarca && (b.marcas || []).length > 0) {
        const marcasNorm = b.marcas.map(normaliza)
        if (marcasNorm.includes(itemMarca)) {
          score += 200
        } else if (marcasNorm.some((m) => itemMarca.includes(m) || m.includes(itemMarca))) {
          score += 80
        }
      }
      for (const kw of b.keywords || []) {
        if (hay.includes(normaliza(kw))) {
          score += kw.length
        }
      }
      if (score > bestScore) {
        bestScore = score
        matchedIdx = idx
      }
    })

    if (matchedIdx >= 0) {
      buckets[matchedIdx].products.push(item)
    } else if (buckets[fallbackIdx]) {
      buckets[fallbackIdx].products.push(item)
    }
  }

  return buckets
    .map((b) => ({ ...b, count: b.products.length }))
    .sort((a, b) => (b.count > 0 ? 1 : 0) - (a.count > 0 ? 1 : 0))
}
