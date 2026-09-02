import type { APIRoute } from 'astro';
import { siteConfig } from '../config/site';

const { seo, pages } = siteConfig;
const baseUrl = seo.siteUrl.replace(/\/$/, '');

// Les URLs proviennent de siteConfig.pages : une seule source de vérité, donc
// pas de divergence possible entre la config, la navigation et le sitemap.
const staticRoutes = [
  { loc: pages.home.slug,         priority: '1.0', changefreq: 'weekly'  },
  { loc: pages.services.slug,     priority: '0.9', changefreq: 'monthly' },
  { loc: pages.realisations.slug, priority: '0.8', changefreq: 'weekly'  },
  { loc: pages.tarifs.slug,       priority: '0.8', changefreq: 'monthly' },
  { loc: pages.about.slug,        priority: '0.7', changefreq: 'monthly' },
  { loc: pages.faq.slug,          priority: '0.7', changefreq: 'monthly' },
  { loc: pages.contact.slug,      priority: '0.6', changefreq: 'yearly'  },
];

export const GET: APIRoute = () => {
  const now = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(r => `  <url>
    <loc>${baseUrl}${r.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
