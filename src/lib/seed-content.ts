import type { SiteContent } from "@/types/content";

export const seedContent: SiteContent = {
  brand: {
    siteName: "Centro de Eventos Antupirén",
    tagline: "Donde la magia se celebra, a los pies de la cordillera",
    defaultWhatsappMessage:
      "Hola, quiero cotizar un evento en Antupirén. ¿Me pueden compartir disponibilidad y valores?",
    heroTitle: "Tu historia empieza aquí",
    heroSubtitle:
      "Matrimonios, eventos corporativos, activaciones de marca y celebraciones sociales en Peñalolén.",
    valueProposition:
      "El centro de eventos de Peñalolén: cercano, versátil y pensado para convertir cada encuentro en un recuerdo inolvidable.",
    heroGradientFrom: "#2f5a3f",
    heroGradientVia: "#5a3515",
    heroGradientTo: "#2b1a0f",
    heroOverlayOpacity: 0.55,
    sitePrimaryColor: "#4a2a0a",
    siteSecondaryColor: "#8a4b1f",
    siteAccentColor: "#b66a2f",
    siteSurfaceColor: "#f7f5ef",
    siteTextColor: "#1f2937",
  },
  stats: [
    { label: "Años de trayectoria", value: "12+" },
    { label: "Matrimonios celebrados", value: "450+" },
    { label: "Eventos corporativos", value: "320+" },
    { label: "Sonrisas compartidas", value: "10.000+" },
  ],
  homeEventTypes: [
    {
      title: "Matrimonios",
      description: "Ceremonias y fiestas memorables en un entorno natural único.",
      href: "/matrimonios",
      backgroundImageUrl:
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
      backgroundPositionX: 50,
      backgroundPositionY: 50,
      backgroundZoom: 1,
    },
    {
      title: "Eventos corporativos",
      description: "Espacios flexibles para empresas, marcas y equipos.",
      href: "/eventos-corporativos",
      backgroundImageUrl:
        "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1200&auto=format&fit=crop",
      backgroundPositionX: 50,
      backgroundPositionY: 50,
      backgroundZoom: 1,
    },
    {
      title: "Celebraciones sociales",
      description: "Cumpleaños, graduaciones, baby showers y celebraciones familiares.",
      href: "/celebraciones-sociales",
      backgroundImageUrl:
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop",
      backgroundPositionX: 50,
      backgroundPositionY: 50,
      backgroundZoom: 1,
    },
    {
      title: "Activaciones de marca",
      description: "Montajes personalizados para experiencias e impacto de marca.",
      href: "/activaciones-de-marca",
      backgroundImageUrl:
        "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1200&auto=format&fit=crop",
      backgroundPositionX: 50,
      backgroundPositionY: 50,
      backgroundZoom: 1,
    },
  ],
  pages: {
    matrimonios: {
      heroTitle: "Matrimonios en la precordillera",
      heroSubtitle: "Un espacio íntimo, cálido y versátil para tu gran día.",
      ctaLabel: "Agenda tu visita por WhatsApp",
      ctaMessage: "Hola, quiero cotizar un matrimonio en Antupirén.",
      intro:
        "Diseñamos matrimonios a medida con acompañamiento cercano, espacios al aire libre y una experiencia que emociona.",
      enabled: true,
    },
    corporativos: {
      heroTitle: "Eventos corporativos con identidad",
      heroSubtitle:
        "Capacitaciones, lanzamientos, fiestas de empresa y activaciones en un solo lugar.",
      ctaLabel: "Cotiza tu evento corporativo",
      ctaMessage: "Hola, quiero cotizar un evento corporativo en Antupirén.",
      intro:
        "Ofrecemos flexibilidad de montaje, soporte en producción y una ubicación privilegiada en Peñalolén.",
      enabled: true,
    },
    sociales: {
      heroTitle: "Celebraciones sociales inolvidables",
      heroSubtitle:
        "Cumpleaños, graduaciones, aniversarios y eventos familiares con calidez.",
      ctaLabel: "Reserva tu fecha",
      ctaMessage:
        "Hola, quiero cotizar una celebración social en Antupirén.",
      intro:
        "Creamos ambientes cercanos para que cada celebración se viva con tranquilidad y emoción.",
      enabled: true,
    },
    activaciones: {
      heroTitle: "Activaciones de marca y experiencias",
      heroSubtitle: "Un recinto versátil para campañas, pop-ups y showcases.",
      ctaLabel: "Conversemos tu activación",
      ctaMessage: "Hola, quiero cotizar una activación de marca en Antupirén.",
      intro:
        "Adaptamos nuestros espacios a formatos creativos con foco en experiencia de marca.",
      enabled: true,
    },
    galeria: {
      heroTitle: "Galería de eventos",
      heroSubtitle:
        "Conoce experiencias reales en matrimonios, corporativos y celebraciones.",
      ctaLabel: "¿Quieres ver el espacio en persona?",
      ctaMessage: "Hola, quiero agendar una visita para conocer Antupirén.",
      intro:
        "Explora nuestras fotos por categoría y proyecta tu próximo evento.",
      enabled: true,
    },
    nosotros: {
      heroTitle: "Somos Antupirén",
      heroSubtitle:
        "Un equipo local comprometido con crear momentos que quedan para siempre.",
      ctaLabel: "Hablemos de tu evento",
      ctaMessage: "Hola, quiero más información de Eventos Antupirén.",
      intro:
        "Nacimos en Peñalolén y llevamos años acompañando historias, empresas y familias.",
      enabled: true,
    },
    contacto: {
      heroTitle: "¿Cómo llegar y reservar?",
      heroSubtitle:
        "Escríbenos por WhatsApp y agenda una visita para conocer el espacio.",
      ctaLabel: "Escribir por WhatsApp",
      ctaMessage:
        "Hola, quiero agendar una visita al Centro de Eventos Antupirén.",
      intro:
        "Estamos en Antupirén 9501, Peñalolén. Te respondemos rápido para resolver dudas y fechas.",
      enabled: true,
    },
  },
  seo: {
    home: {
      title: "Centro de Eventos Antupirén | Peñalolén",
      description:
        "Matrimonios, eventos corporativos y celebraciones en Peñalolén. Cotiza por WhatsApp y agenda tu visita.",
      keywords: [
        "centro de eventos peñalolén",
        "matrimonio precordillera santiago",
        "eventos corporativos peñalolén",
      ],
    },
    matrimonios: {
      title: "Matrimonios en Peñalolén | Eventos Antupirén",
      description:
        "Celebra tu matrimonio en la precordillera de Santiago con un espacio íntimo y versátil.",
      keywords: [
        "matrimonio peñalolén",
        "salón para matrimonio santiago oriente",
        "centro de eventos matrimonio santiago",
      ],
    },
    corporativos: {
      title: "Eventos Corporativos | Centro de Eventos Antupirén",
      description:
        "Seminarios, lanzamientos y fiestas de empresa en un espacio flexible en Peñalolén.",
      keywords: [
        "eventos corporativos peñalolén",
        "arriendo salón eventos zona oriente",
        "centro de eventos empresas santiago",
      ],
    },
    sociales: {
      title: "Celebraciones Sociales | Eventos Antupirén",
      description:
        "Cumpleaños, graduaciones y celebraciones familiares en un ambiente cálido y accesible.",
      keywords: [
        "lugar para cumpleaños peñalolén",
        "celebraciones sociales santiago",
        "centro de eventos económico santiago",
      ],
    },
    activaciones: {
      title: "Activaciones de Marca | Eventos Antupirén",
      description:
        "Espacio versátil para lanzamientos, pop-ups y activaciones de marca en Santiago.",
      keywords: [
        "activaciones de marca santiago",
        "espacio para lanzamientos santiago",
        "arriendo espacio eventos precordillera",
      ],
    },
    galeria: {
      title: "Galería de Eventos | Antupirén",
      description:
        "Revisa fotos de matrimonios, corporativos y celebraciones reales en Antupirén.",
      keywords: [
        "galería centro de eventos peñalolén",
        "fotos matrimonios santiago",
        "fotos eventos corporativos peñalolén",
      ],
    },
    nosotros: {
      title: "Nosotros | Centro de Eventos Antupirén",
      description:
        "Conoce nuestra historia, equipo y esencia local en Peñalolén.",
      keywords: [
        "centro de eventos antupirén",
        "eventos peñalolén",
        "centro de eventos precordillera",
      ],
    },
    contacto: {
      title: "Contacto y Reservas | Eventos Antupirén",
      description:
        "Agenda tu visita y cotiza tu evento por WhatsApp. Estamos en Antupirén 9501, Peñalolén.",
      keywords: [
        "contacto eventos antupirén",
        "reservar centro de eventos peñalolén",
        "whatsapp eventos antupirén",
      ],
    },
  },
  trustBadges: [
    "El centro de eventos de Peñalolén",
    "Fechas limitadas, reserva con anticipación",
    "Ubicación privilegiada en precordillera",
  ],
  testimonials: [
    {
      id: "t-1",
      author: "Fernando Fierro B.",
      role: "Cliente matrimonio",
      text: "Desde el primer momento supimos que estábamos en buenas manos. El equipo cuidó cada detalle y nuestra celebración fue inolvidable.",
      eventType: "Matrimonios",
      enabled: true,
    },
    {
      id: "t-2",
      author: "Carolina Vega",
      role: "Gerenta de Marketing",
      text: "Realizamos una activación de marca y el resultado fue impecable. Muy buena disposición y flexibilidad para el montaje.",
      eventType: "Activaciones",
      enabled: true,
    },
    {
      id: "t-3",
      author: "Felipe Rojas",
      role: "Cliente corporativo",
      text: "La logística fue excelente y el espacio funcionó perfecto para nuestra jornada de cierre anual.",
      eventType: "Corporativos",
      enabled: true,
    },
  ],
  gallery: [
    {
      id: "g-1",
      title: "Ceremonia al aire libre",
      description: "Matrimonio con vista a la precordillera.",
      category: "matrimonios",
      imageUrl:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop",
      enabled: true,
    },
    {
      id: "g-2",
      title: "Salón corporativo",
      description: "Montaje para capacitación empresarial.",
      category: "corporativos",
      imageUrl:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
      enabled: true,
    },
    {
      id: "g-3",
      title: "Celebración familiar",
      description: "Cumpleaños en ambiente cálido y cercano.",
      category: "sociales",
      imageUrl:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop",
      enabled: true,
    },
    {
      id: "g-4",
      title: "Showcase de marca",
      description: "Experiencia para lanzamiento de producto.",
      category: "activaciones",
      imageUrl:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
      enabled: true,
    },
    {
      id: "g-5",
      title: "Vista del jardín",
      description: "Entorno natural del recinto.",
      category: "espacio",
      imageUrl:
        "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop",
      enabled: true,
    },
  ],
  contact: {
    phoneLabel: "+56 9 6591 4497",
    whatsappNumber: "56965914497",
    address: "Antupirén 9501, Peñalolén, Santiago, Chile",
    email: "contacto@eventosantupiren.cl",
    instagramUrl: "https://instagram.com/eventos_antupiren",
    facebookUrl: "https://facebook.com/antupirencentrodeeventos",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Antupir%C3%A9n%209501%2C%20Pe%C3%B1alol%C3%A9n%2C%20Santiago%2C%20Chile&output=embed",
  },
  adminEditor: {
    panelStyles: {
      inicio: {
        gradientFrom: "#f7f5ef",
        gradientVia: "#efe2d2",
        gradientTo: "#f9f3e8",
        overlayOpacity: 0,
      },
      secciones: {
        gradientFrom: "#f7f5ef",
        gradientVia: "#efe2d2",
        gradientTo: "#f9f3e8",
        overlayOpacity: 0,
      },
      tarjetas: {
        gradientFrom: "#f7f5ef",
        gradientVia: "#efe2d2",
        gradientTo: "#f9f3e8",
        overlayOpacity: 0,
      },
      galeria: {
        gradientFrom: "#f7f5ef",
        gradientVia: "#efe2d2",
        gradientTo: "#f9f3e8",
        overlayOpacity: 0,
      },
      testimonios: {
        gradientFrom: "#f7f5ef",
        gradientVia: "#efe2d2",
        gradientTo: "#f9f3e8",
        overlayOpacity: 0,
      },
      contacto: {
        gradientFrom: "#f7f5ef",
        gradientVia: "#efe2d2",
        gradientTo: "#f9f3e8",
        overlayOpacity: 0,
      },
    },
  },
  updatedAt: new Date().toISOString(),
};
