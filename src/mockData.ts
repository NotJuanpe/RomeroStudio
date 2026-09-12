import { Project, ServiceItem, ContactMessage } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'casa-del-olmo',
    title: 'Casa del Olmo',
    category: 'Residencial',
    description: 'Reforma integral de vivienda unifamiliar, priorizando la apertura espacial y la integración de materiales nobles locales.',
    longDescription:
      'Reforma integral de vivienda unifamiliar situada en entorno suburbano de alto valor paisajístico. El proyecto consistió en la demolición controlada de muros de carga interiores para configurar una planta baja diáfana donde el salón, comedor y cocina convergen hacia un patio acristalado de orientación sur. Se recuperó la fábrica de ladrillo original combinándola con pavimentos continuos y carpinterías de acero de perfilería mínima.',
    year: 2024,
    area: '420 m²',
    scope: 'Obra Nueva',
    materials: 'Hormigón Visto, Acero, Vidrio Templado',
    heroImage:
      'https://lh3.googleusercontent.com/aida/AEtjO1Wm-oir3hdNFNXEtEOxcSJJkzbZbr8aiDL6j9lo1iueEAmKviXBuXjbcZJSxUIEpGI-mmet0-NrJ74YAve-JQdS7pWPvT2UHu--BP8Do8fQUxFjc4Zk7QsKPj4D3tR2w2aoGMdJnl-PvNvmKKAQj0BdZZ540mQdwbIicXniR_z02_JDYix1l-tnGCzDCPLkM-fLh0x60MR86elY5DnBXcAQGYacSnA2ZxtkWqu9tPK-UI0_E9xBaNdVBU3T',
    detailImage:
      'https://lh3.googleusercontent.com/aida/AEtjO1XFhEUtn0AKqzYb88n4nHc3xppmzqkMsMQktrDotbmXcEJJ5x2yGg-UyJNtK85xCuxodCYAmb1JgaB98W9CBKSVS-wA_d0p7Ws1GZHHq_7Ypijl1tEdVsnHfu5M9bwxgE6o2NxzsJXQ-_REGIQ7FYGbHIkZovsSdYO5VhTaMjRcEitzjpu8FmkDbLLFrGvzWVUbi1bz4PGYUCIOOnSinnC4mst_hHiq0oWXMhnrGchBHkAKieE2_omL8mp8',
    beforeImage:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImage:
      'https://lh3.googleusercontent.com/aida/AEtjO1Wm-oir3hdNFNXEtEOxcSJJkzbZbr8aiDL6j9lo1iueEAmKviXBuXjbcZJSxUIEpGI-mmet0-NrJ74YAve-JQdS7pWPvT2UHu--BP8Do8fQUxFjc4Zk7QsKPj4D3tR2w2aoGMdJnl-PvNvmKKAQj0BdZZ540mQdwbIicXniR_z02_JDYix1l-tnGCzDCPLkM-fLh0x60MR86elY5DnBXcAQGYacSnA2ZxtkWqu9tPK-UI0_E9xBaNdVBU3T',
    location: 'Buenos Aires, Zona Norte',
    client: 'Privado',
    featured: true,
    status: 'Completado',
    specs: {
      'Plazo de Ejecución': '10 meses',
      'Eficiencia Energética': 'Calificación A+',
      'Climatización': 'Suelo radiante/refrescante geotérmico',
      'Estructura': 'Hormigón armado y perfiles laminados HEB',
    },
  },
  {
    id: 'estudio-norte',
    title: 'Estudio Norte',
    category: 'Comercial',
    description: 'Construcción de nueva planta para oficinas corporativas. Estructura optimizada combinada con espacios modulares contemporáneos.',
    longDescription:
      'Sede corporativa contemporánea concebida para una empresa de consultoría e innovación. El edificio se resuelve con una crujía limpia y losas nervadas vistas que optimizan la inercia térmica y el paso de instalaciones técnicas. Los cerramientos acústicos acristalados de suelo a techo garantizan transparencia y luminosidad natural en todos los puestos de trabajo.',
    year: 2024,
    area: '420 m²',
    scope: 'Obra Nueva',
    materials: 'Hormigón Visto, Acero, Vidrio Templado',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_202zA_K2qRLLCh_afcYWWM4IHRLXNpbCEYwr71bbgtgvtycbV9VM6z4cg78I_yy-zvhEkm1Xg-ncoox_PcWQSPsd1XjsXF_6EFxGjpjlmpxweFUoJkaPSgNAtuYo0nJUJj7NqRv3xnsXSaiHtNVrnH33Zejl6_9kdbjiOKvZBHyVFrugji_0Rdi1xBIP0XM5_NeoNSrUlRxsBtQJZTCGv79-dy6ZheWNboQrhcCRBA354_GYr4FOPA',
    detailImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCixL4Ili3-iTSJQgqulyKqjPFE_9s6j0L2vSp_zctn--yYRHnVwiOKk1e4ETqYO97FWPoMYrE752KQm_srQyHfY22W99f_ABRo4U0taIL_JVw8GPoei8i1Gmrsba7Q3YZ2zKtfJ4g773SXgQ2RFdTMl8NfXUGBBjpe6XNcCuxIB9eC61tdDCUHdWkQye0O83Jl_btPPTDvNNPvdQ4mNYwFgFOJHv8F9CycLlYVj2xxhRMrlA8lD5QCSw',
    beforeImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    afterImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_202zA_K2qRLLCh_afcYWWM4IHRLXNpbCEYwr71bbgtgvtycbV9VM6z4cg78I_yy-zvhEkm1Xg-ncoox_PcWQSPsd1XjsXF_6EFxGjpjlmpxweFUoJkaPSgNAtuYo0nJUJj7NqRv3xnsXSaiHtNVrnH33Zejl6_9kdbjiOKvZBHyVFrugji_0Rdi1xBIP0XM5_NeoNSrUlRxsBtQJZTCGv79-dy6ZheWNboQrhcCRBA354_GYr4FOPA',
    location: 'Buenos Aires, Polo Tecnológico',
    client: 'Norte Corp',
    featured: true,
    status: 'Completado',
    specs: {
      'Plazo de Ejecución': '8 meses',
      'Certificación': 'LEED Gold candidate',
      'Carpinterías': 'Vidrio doble laminado acústico 6+6/16/6',
      'Pavimento': 'Hormigón pulido con cuarzo endurecido',
    },
  },
  {
    id: 'casa-olivos',
    title: 'Casa Olivos',
    category: 'Residencial',
    description: 'Arquitectura Integral Residencial con diálogo constante entre volumetría geométrica y vegetación autóctona.',
    longDescription:
      'Vivienda unifamiliar aislada organizada en torno a un patio interior de olivos centenarios. La intervención enfatiza la conexión interior-exterior mediante voladizos continuos que protegen de la radiación solar estival y permiten la entrada de radiación directa en invierno.',
    year: 2023,
    area: '380 m²',
    scope: 'Reforma Integral',
    materials: 'Roble Natural, Microcemento, Acero Inoxidable',
    heroImage:
      'https://lh3.googleusercontent.com/aida/AEtjO1XFhEUtn0AKqzYb88n4nHc3xppmzqkMsMQktrDotbmXcEJJ5x2yGg-UyJNtK85xCuxodCYAmb1JgaB98W9CBKSVS-wA_d0p7Ws1GZHHq_7Ypijl1tEdVsnHfu5M9bwxgE6o2NxzsJXQ-_REGIQ7FYGbHIkZovsSdYO5VhTaMjRcEitzjpu8FmkDbLLFrGvzWVUbi1bz4PGYUCIOOnSinnC4mst_hHiq0oWXMhnrGchBHkAKieE2_omL8mp8',
    detailImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBVlFSmzwaCAVKTcK_oNMsgEGl_ePv2fn5krNqdAB-nm2zhGjR5oOl6z2SzHpZTlU2KM0gqztqAmseio_RMXHbIc3CBmkI6WAYOYSKiWeboNWudJU7V-7juCa1467asQJGHgv2PWN_bjHYlr9XvfZ74sh8uvNztmHabJcs8ttnGsnvrfD8w1IVVkRCd7Abc-uHjV6yQevACmwT15klHMM6Ki31xcX23GZAoyRpkT0IPg_tS2iMdY3X9Rg',
    location: 'Olivos, Buenos Aires',
    client: 'Familia Rivas',
    featured: true,
    status: 'En curso',
  },
  {
    id: 'depto-belgrano',
    title: 'Depto. Belgrano',
    category: 'Reforma',
    description: 'Obras de Alta Gama con carpintería a medida en madera de roble natural y cocina integrada con isla monolítica.',
    longDescription:
      'Reforma completa de ático en torre clásica de Belgrano. La planta original muy tabicada se reconfiguró mediante un eje de almacenamiento continuo en madera de roble y un bloque central de cocina con isla en cuarcita natural.',
    year: 2023,
    area: '185 m²',
    scope: 'Reforma Integral',
    materials: 'Cuarcita Patagonia, Roble Americano, Grifería Grafito',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFs4HusVlDrQmmS3xtUvOPKXguODXP4agdRckciMhHhjPQdh5e8MkmKDNGSjH3cCaNs_B6V6Gi28PuS4PRHXcIbuLWty1HE-WTXuAhJ2OqKahd5EPZaAW691_Dynfa-2KDr4uuiTzVP3NWzyUMhT7R2S2pNZhs9Jlwm2rCC83FnpNzNiUWQP61g4jCgcN8YtT7vejT6uE9yEhDpcl0Zxfp2RDqmJu-jggttcAleWKGL6GFbdxRhRs9Cg',
    beforeImage:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    afterImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFs4HusVlDrQmmS3xtUvOPKXguODXP4agdRckciMhHhjPQdh5e8MkmKDNGSjH3cCaNs_B6V6Gi28PuS4PRHXcIbuLWty1HE-WTXuAhJ2OqKahd5EPZaAW691_Dynfa-2KDr4uuiTzVP3NWzyUMhT7R2S2pNZhs9Jlwm2rCC83FnpNzNiUWQP61g4jCgcN8YtT7vejT6uE9yEhDpcl0Zxfp2RDqmJu-jggttcAleWKGL6GFbdxRhRs9Cg',
    location: 'Belgrano, CABA',
    client: 'Privado',
    featured: true,
    status: 'Completado',
  },
  {
    id: 'pabellon-cristal',
    title: 'Pabellón de Cristal & Sombra',
    category: 'Comercial',
    description: 'Intervención volumétrica de alta inercia térmica mediante losas de hormigón visto y carpinterías continuas de piso a techo.',
    longDescription:
      'Edificio de oficinas y showroom corporativo resuelto con un lenguaje brutalista templado por celosías móviles de aluminio que controlan la radiación solar y la privacidad según la hora del día.',
    year: 2024,
    area: '680 m²',
    scope: 'Obra Nueva',
    materials: 'Hormigón Visto, Vidrio Solar Control, Acero Lacado',
    heroImage:
      'https://lh3.googleusercontent.com/aida/AEtjO1Uc26-afnYYE6UhDXUX39qA0EPW0MgY0xWY0gpze6nxyhlgi5NSzhPPlE1ttKbz5g8fRg1qWCU7tXWo4NT73AVrZow-VWyh_sO4lJbnogyh5NFHRBRLkxlia7jq3I_GPSVwWhPiZo3sUhvDq_fbrkE7fwuRHDxs7N1gvF8vWIOz3YvKqUD9_bf5KGXsrNfDhg9opaEK0NzKpCMuhzd_eMBfMlVkOdVDl6dJ-2WPV9VTg_YoYLXP2Qr3890',
    location: 'Vicente López, Buenos Aires',
    client: 'Inmobiliaria Delta',
    featured: false,
    status: 'Completado',
  },
  {
    id: 'oficinas-tech',
    title: 'Oficinas Centrales Tech',
    category: 'Corporativo',
    description: 'Remodelación integral de nave industrial reconvertida en sede tecnológica para 120 puestos de trabajo flexibles.',
    year: 2023,
    area: '520 m²',
    scope: 'Reforma Integral',
    materials: 'Hormigón Visto, Acero, Panel Fonoabsorbente',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD6Gh8TN3vvxQVkUycq8gYazbQltvh_Ytg_VgeaU64A35TIvQ0q1BSe8o0M2zdNiW4li636RVblxOHCC1-XpX7rBg5M-1NPduE0n_iyH1pGv1spNPlyhhY1558E3LIQSjZfS-1jNir_M-OmSe7WzVx7y9CHVGseqofjBOOyCZCY-WEIezRYMeNuByxyY7Uaymoe8nh934MOAxzUfbQKMQS9P9osse5A6DT2B8TELI_Eqio4hl_icNB7oA',
    location: 'Palermo, CABA',
    client: 'TechLabs Corp',
    featured: false,
    status: 'Completado',
  },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'obras-nuevas-y-reformas',
    title: 'Obras Nuevas y Reformas',
    shortDesc: 'Diseño, planificación y ejecución llave en mano de proyectos de arquitectura integral, garantizando excelencia en cada detalle.',
    fullDesc:
      'Acompañamiento completo desde la conceptualización arquitectónica y proyecto de ejecución hasta la entrega definitiva de llaves. Optimizamos costes, garantizamos plazos y aplicamos los más estrictos estándares técnicos constructivos.',
    icon: 'architecture',
    timeline: 'De 6 a 14 meses según tipología',
    deliverables: [
      'Memoria técnica constructiva y planos visados',
      'Modelado 3D BIM y visualizaciones fotorrealistas',
      'Cómputo métrico y presupuesto desglosado por partidas',
      'Gestión integral de gremios y subcontratistas',
      'Garantía decenal de solidez estructural',
    ],
  },
  {
    id: 'gestion-integral',
    title: 'Gestión Integral de Proyectos',
    shortDesc: 'Administración completa del ciclo de vida del proyecto, desde la concepción hasta la entrega, optimizando recursos y plazos.',
    fullDesc:
      'Servicio de Project Management enfocado en inversores y particulares que buscan control absoluto del presupuesto, minimización de riesgos y total transparencia en cada certificación de obra.',
    icon: 'space_dashboard',
    timeline: 'Durante todo el ciclo del encargo',
    deliverables: [
      'Plataforma digital de seguimiento en tiempo real',
      'Licitación transparente y comparativo de proveedores',
      'Control de desviaciones presupuestarias (<2%)',
      'Gestión de licencias municipales y acometidas',
      'Certificaciones periódicas de avance de obra',
    ],
  },
  {
    id: 'direccion-tecnica',
    title: 'Dirección Técnica',
    shortDesc: 'Supervisión técnica rigurosa de obras de alta gama. Control exhaustivo para asegurar la máxima calidad constructiva.',
    fullDesc:
      'Presencia activa en obra por parte de arquitectos directores para verificar la correcta puesta en obra de materiales, encuentros singulares, aislamientos y cumplimiento de las normativas vigentes.',
    icon: 'engineering',
    timeline: 'Supervisión semanal continuada',
    deliverables: [
      'Libro de órdenes y actas de visita técnica',
      'Control de calidad de hormigones y ensayos de laboratorio',
      'Supervisión de estanqueidad e impermeabilizaciones',
      'Resolución de detalles constructivos in situ',
      'Acta de recepción definitiva y liquidación de obra',
    ],
  },
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Lautaro Fernández',
    email: 'lfernandez@inversiones.com',
    projectType: 'Obra Nueva Unifamiliar',
    estimatedArea: '350 m²',
    message: 'Hola equipo Romero Estudio. Disponemos de una parcela en San Isidro y queremos proyectar una casa contemporánea en hormigón visto y grandes ventanales. ¿Podemos agendar una primera reunión?',
    date: '2026-09-11 15:30',
    status: 'Pendiente',
  },
  {
    id: 'msg-2',
    name: 'Carolina Mendizábal',
    email: 'caro.mendizabal@gmail.com',
    projectType: 'Reforma Integral de Vivienda',
    estimatedArea: '180 m²',
    message: 'Queremos renovar íntegramente un piso en Recoleta. Nos interesa mucho el estilo y la precisión en carpinterías que vimos en el Depto. Belgrano.',
    date: '2026-09-10 11:20',
    status: 'Pendiente',
  },
  {
    id: 'msg-3',
    name: 'Gonzalo Arismendi',
    email: 'garismendi@gruponorte.com.ar',
    projectType: 'Espacio Comercial / Corporativo',
    estimatedArea: '450 m²',
    message: 'Buscamos dirección técnica y reforma de nuestras nuevas oficinas corporativas en Vicente López.',
    date: '2026-09-09 18:45',
    status: 'Pendiente',
  },
  {
    id: 'msg-4',
    name: 'Valeria Rossi',
    email: 'valeria.rossi@outlook.com',
    projectType: 'Reforma Integral de Vivienda',
    estimatedArea: '210 m²',
    message: 'Presupuesto para reforma de cocina y suite principal en Martínez. Ya tenemos planos de relevamiento.',
    date: '2026-09-08 09:15',
    status: 'Respondido',
  },
  {
    id: 'msg-5',
    name: 'Martín Soria',
    email: 'martin.soria@techbuilders.io',
    projectType: 'Obra Nueva',
    estimatedArea: '600 m²',
    message: 'Consulta para desarrollo de complejo de 4 townhouses con diseño sobrio y eficiencia energética.',
    date: '2026-09-07 14:00',
    status: 'Respondido',
  },
];
