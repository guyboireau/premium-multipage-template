// ═════════════════════════════════════════════════════════════════════════════
//  SITE CONFIG — fichier unique à modifier par client
//  Template : premium-multipage (vitrine multipage haut de gamme)
// ═════════════════════════════════════════════════════════════════════════════

export const siteConfig = {

  // ── 1. INFORMATIONS BUSINESS ───────────────────────────────────────────────
  business: {
    name:     'Atelier Rénovation',
    tagline:  'Expert en rénovation & aménagement intérieur',
    industry: 'btp',
    phone:    '+33 1 23 45 67 89',
    email:    'contact@atelier-renovation.fr',
    address: {
      street:     '123 Rue de la Rénovation',
      city:       'Paris',
      postalCode: '75011',
      country:    'FR',
    },
    openingHours: {
      monday:    '08:00-18:00',
      tuesday:   '08:00-18:00',
      wednesday: '08:00-18:00',
      thursday:  '08:00-18:00',
      friday:    '08:00-17:00',
      saturday:  '09:00-12:00',
      sunday:    null,
    },
    socialLinks: {
      facebook:  'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin:  '',
      twitter:   '',
    },
    siret:        '123 456 789 00012',
    availability: 'Devis gratuit — réponse sous 48h',
  },

  // ── 2. BRANDING ────────────────────────────────────────────────────────────
  branding: {
    primaryColor:    '#1e293b',
    primaryDark:     '#0f172a',
    primarySoft:     '#f1f5f9',
    secondaryColor:  '#c29d5b',
    accentColor:     '#c29d5b',
    fontHeading:     'Playfair Display',
    fontBody:        'Outfit',
    fontMono:        'ui-monospace',
    logoPath:        '/assets/logo.svg',
    faviconPath:     '/favicon.svg',
  },

  // ── 3. SEO ─────────────────────────────────────────────────────────────────
  seo: {
    titleTemplate:       '%s | Atelier Rénovation — Paris',
    defaultTitle:        'Atelier Rénovation — Expert BTP & Aménagement · Paris',
    defaultDescription:  'Expert en rénovation et aménagement intérieur depuis plus de 15 ans. Devis gratuit sous 48h. Rénovation complète, salles de bain, cuisines.',
    keywords: [
      'rénovation intérieure paris',
      'artisan rénovation paris',
      'aménagement intérieur paris',
      'entreprise btp paris',
    ],
    googleBusinessUrl:   '',
    googleAnalyticsId:   '',
    googleSearchConsole: '',
    bingWebmasterKey:    '',
    plausibleDomain:     '',
    sentryDsn:           '',
    locale:              'fr_FR',
    siteUrl:             'https://atelier-renovation.fr',
    ogImage:             '/assets/og-image.jpg',
  },

  // ── 4. PAGES ───────────────────────────────────────────────────────────────
  pages: {
    home: {
      slug:        '/',
      title:       'Accueil',
      description: 'Expert en rénovation et aménagement intérieur à Paris.',
    },
    services: {
      slug:        '/services',
      title:       'Nos Prestations',
      description: 'Rénovation complète, salles de bain, cuisines, aménagement sur mesure.',
    },
    realisations: {
      slug:        '/realisations',
      title:       'Nos Réalisations',
      description: 'Découvrez nos derniers projets de rénovation et aménagement.',
    },
    contact: {
      slug:        '/contact',
      title:       'Contact & Devis',
      description: 'Demandez un devis gratuit pour votre projet de rénovation.',
    },
  },

  // ── 5. FEATURES ────────────────────────────────────────────────────────────
  features: {
    portfolio:    true,
    testimonials: true,
    pricing:      false,
    blog:         false,
    booking:      false,
    newsletter:   false,
    cookieBanner: true,
    analytics:    false,
    plausible:    false,
    sentry:       false,
  },

  // ── 6. CONTENT ─────────────────────────────────────────────────────────────
  content: {

    hero: {
      h1:       "L'Excellence au service de votre Habitat",
      subtitle: 'Confiez vos projets de rénovation à des experts passionnés. Qualité, rigueur et design pour des espaces qui vous ressemblent.',
      cta1:     { label: 'Demander mon devis', href: '/contact' },
      cta2:     { label: 'Voir nos réalisations', href: '/realisations' },
      trust:    ['15+ ans d\'expérience', '500+ chantiers livrés', 'Devis sous 48h'],
      imagePath: '/hero-bg.jpg',
    },

    about: {
      eyebrow: 'Notre Philosophie',
      title:   'Plus de 15 ans d\'expérience dans le bâtiment',
      text:    'Basée à Paris, notre entreprise s\'est forgée une solide réputation grâce à son souci du détail et son engagement envers la satisfaction client. Nous ne nous contentons pas de rénover, nous créons des lieux de vie.',
      features: [
        'Respect des délais et des budgets',
        'Matériaux premium et finitions soignées',
        'Accompagnement personnalisé',
      ],
      stats: [
        { value: '15+', label: 'années d\'expertise' },
        { value: '500+', label: 'chantiers livrés' },
        { value: '98%', label: 'clients satisfaits' },
      ],
      cta:   { label: 'En savoir plus sur nous', href: '/contact' },
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800',
    },

    services: {
      title:    'Nos Domaines d\'Intervention',
      subtitle: 'Prestations',
      items: [
        {
          title:       'Rénovation Complète',
          description: 'Nous prenons en charge votre projet de A à Z : démolition, gros œuvre, finitions et décoration.',
          icon:        'ph-house-line',
          href:        '/services/renovation',
        },
        {
          title:       'Salles de Bain',
          description: 'Création de salles de bain sur mesure : carrelage, plomberie, sanitaires et mobilier design.',
          icon:        'ph-drop',
          href:        '/services/salle-de-bain',
        },
        {
          title:       'Cuisines Modernes',
          description: 'Conception et installation de cuisines fonctionnelles et esthétiques adaptées à votre style de vie.',
          icon:        'ph-cooking-pot',
          href:        '/services/cuisine',
        },
      ],
    },

    portfolio: {
      title:    'Nos Dernières Réalisations',
      subtitle: 'Portfolio',
      items: [
        {
          title:    'Appartement Haussmannien',
          category: 'Rénovation Intérieure',
          image:    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        },
        {
          title:    'Villa Méditerranéenne',
          category: 'Extérieur & Façade',
          image:    'https://images.unsplash.com/photo-1600607687940-477a284e68c6?auto=format&fit=crop&q=80&w=800',
        },
        {
          title:    'Loft Industriel',
          category: 'Aménagement',
          image:    'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=800',
        },
      ],
    },

    cta: {
      title:    'Un projet en tête ? Parlons-en ensemble.',
      subtitle: 'Nos devis sont gratuits et sans engagement. Recevez une étude détaillée sous 48h.',
      cta:      { label: 'Démarrer mon projet', href: '/contact' },
    },

    contact: {
      title:          'Demandez votre devis gratuit',
      subtitle:       'Décrivez votre projet en quelques mots. Nous vous répondons sous 48h.',
      successMessage: 'Votre demande a bien été reçue — nous vous répondons sous 48h.',
    },

    footer: {
      description: 'Expert en rénovation et aménagement intérieur depuis plus de 15 ans. Respect des délais, matériaux premium, satisfaction garantie.',
      madeBy:      'Site conçu et réalisé à Paris',
    },

  },

} as const;

export type Variant = 'A' | 'B' | 'C';

export const { business, branding, seo, features, pages } = siteConfig;
export const hero         = siteConfig.content.hero;
export const services     = siteConfig.content.services;
export const about        = siteConfig.content.about;
export const portfolio    = siteConfig.content.portfolio;
export const cta          = siteConfig.content.cta;
export const contact      = siteConfig.content.contact;
export const footer       = siteConfig.content.footer;

// ─── Palettes BTP ──────────────────────────────────────────────────────────
// BTP Prestige → primary #1e293b  accent #c29d5b  (template par défaut)
// BTP Moderne  → primary #0f172a  accent #3b82f6
// BTP Artisan  → primary #292524  accent #b8763d
