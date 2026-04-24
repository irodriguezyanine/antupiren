export type EventCategory =
  | "matrimonios"
  | "corporativos"
  | "sociales"
  | "activaciones"
  | "espacio";

export type EventTypeCard = {
  title: string;
  description: string;
  href: string;
  backgroundImageUrl?: string;
  backgroundPublicId?: string;
  backgroundPositionX?: number;
  backgroundPositionY?: number;
  backgroundZoom?: number;
};

export type Stat = {
  label: string;
  value: string;
};

export type Testimonial = {
  id: string;
  author: string;
  role: string;
  text: string;
  eventType: string;
  enabled: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  imageUrl: string;
  publicId?: string;
  enabled: boolean;
};

export type SeoPageConfig = {
  title: string;
  description: string;
  keywords: string[];
};

export type PageSectionConfig = {
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel: string;
  ctaMessage: string;
  intro: string;
  enabled: boolean;
};

export type AdminEditorPanelStyle = {
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  backgroundImageUrl?: string;
  backgroundPublicId?: string;
  overlayOpacity?: number;
};

export type ContactConfig = {
  phoneLabel: string;
  whatsappNumber: string;
  address: string;
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  mapEmbedUrl: string;
};

export type SiteContent = {
  brand: {
    siteName: string;
    tagline: string;
    defaultWhatsappMessage: string;
    heroTitle: string;
    heroSubtitle: string;
    valueProposition: string;
    heroGradientFrom?: string;
    heroGradientVia?: string;
    heroGradientTo?: string;
    heroBackgroundImageUrl?: string;
    heroBackgroundPublicId?: string;
    heroOverlayOpacity?: number;
    sitePrimaryColor?: string;
    siteSecondaryColor?: string;
    siteAccentColor?: string;
    siteSurfaceColor?: string;
    siteTextColor?: string;
  };
  stats: Stat[];
  homeEventTypes: EventTypeCard[];
  pages: {
    matrimonios: PageSectionConfig;
    corporativos: PageSectionConfig;
    sociales: PageSectionConfig;
    activaciones: PageSectionConfig;
    galeria: PageSectionConfig;
    nosotros: PageSectionConfig;
    contacto: PageSectionConfig;
  };
  seo: {
    home: SeoPageConfig;
    matrimonios: SeoPageConfig;
    corporativos: SeoPageConfig;
    sociales: SeoPageConfig;
    activaciones: SeoPageConfig;
    galeria: SeoPageConfig;
    nosotros: SeoPageConfig;
    contacto: SeoPageConfig;
  };
  trustBadges: string[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  contact: ContactConfig;
  adminEditor?: {
    panelStyles?: {
      inicio?: AdminEditorPanelStyle;
      secciones?: AdminEditorPanelStyle;
      tarjetas?: AdminEditorPanelStyle;
      galeria?: AdminEditorPanelStyle;
      testimonios?: AdminEditorPanelStyle;
      contacto?: AdminEditorPanelStyle;
    };
  };
  updatedAt: string;
};
