# 🤖 Guide de Développement — Premium Multipage Template

> Template de site vitrine « premium » multipage (Astro), destiné à être **cloné et personnalisé par client** (artisans, BTP, services). Projet interne de Guy Boireau.
> Ce document décrit l'**état réel du code**, pas une spécification. Dernière synchro : 2026-07-01.

---

## 📋 Contexte projet

- **Nature** : template réutilisable, pas un site client final. Le contenu est du **placeholder** (`[NOM DE L'ENTREPRISE]`, `[TITRE PRINCIPAL...]`, etc.).
- **Usage prévu** : cloner le repo → remplir **`src/config/site.ts`** (fichier unique de config par client) → ajuster branding/couleurs → déployer sur Vercel.
- **Public visé** (README) : entreprises du bâtiment, rénovation, artisans, sociétés voulant une présence en ligne « haut de gamme ».
- **Particularité forte** : un **système de variantes de design A→H** basculables à chaud via un `DesignSwitcher` de démo (classes `v-a`…`v-h` sur `<body>`, persistées en `localStorage`).

---

## 🛠️ Stack technique (réelle)

```yaml
Framework:    Astro 6.3.1 (rendu SSR via adapter Vercel)
Language:     TypeScript (tsconfig extends astro/tsconfigs/strict)
UI:           Composants .astro natifs (aucun framework JS UI — pas de React/Vue)
Styling:      CSS pur, scoped par composant + <style is:global> dans Layout.astro
              Design tokens via CSS custom properties (define:vars)
              PAS de Tailwind, PAS de fichier de config CSS externe
Icons:        Phosphor Icons (web, via <script unpkg>) + emojis + SVG inline
Fonts:        Google Fonts (Outfit, Geist, Kalam, + fonts par variante) via <link>
Email:        resend 6.12.3 (dépendance présente, voir ⚠️ endpoint manquant)
Env:          dotenv 17.4.2
Adapter:      @astrojs/vercel 10.0.6
Node:         >= 22.12.0
Déploiement:  Vercel
```

> **Aucun** : Tailwind, tests (pas de Vitest/Playwright), ESLint/Prettier configurés, i18n. Le site est **monolingue FR** (`<html lang="fr">`, `locale: fr_FR`).

---

## 📁 Structure du projet (réelle)

```
premium-multipage-template/
├── public/
│   ├── assets/images/          # portrait.png, hero.png, team.png
│   ├── favicon.ico / favicon.svg
│   └── robots.txt
├── src/
│   ├── config/
│   │   └── site.ts             # ⭐ CONFIG UNIQUE : business, branding, seo, design,
│   │                           #    pages, features, content (hero/services/…/portfolio)
│   ├── layouts/
│   │   └── Layout.astro        # <head> SEO/OG/JSON-LD wrapper, tokens CSS globaux,
│   │                           #    chargement fonts, DesignSwitcher, filtres SVG "rough"
│   ├── components/             # Sections + chrome (voir ci-dessous)
│   │   ├── Header.astro  Footer.astro  Breadcrumb.astro  UrgentFloat.astro
│   │   ├── Hero.astro  Services.astro  About.astro  Certifications.astro
│   │   ├── Testimonials.astro  Pricing.astro  FAQ.astro  CTA.astro  Contact.astro
│   │   └── DesignSwitcher.astro   # outil de démo variantes A–H
│   └── pages/                  # Routing par fichier
│       ├── index.astro         # Accueil (assemble toutes les sections)
│       ├── services.astro  apropos.astro  realisations.astro
│       ├── tarifs.astro  faq.astro  contact.astro
│       └── sitemap.xml.ts      # Sitemap dynamique (endpoint GET)
├── astro.config.mjs            # defineConfig({ adapter: vercel() })
├── vercel.json                 # En-têtes de sécurité (CSP, HSTS, X-Frame-Options…)
├── tsconfig.json
└── README.md
```

---

## 🗂️ Pages / sections

**Pages (multipage, routing par fichier dans `src/pages/`)** :
`/` (accueil), `/services`, `/apropos`, `/realisations`, `/tarifs`, `/faq`, `/contact`, `/sitemap.xml`.

> ⚠️ Décalage à connaître : `siteConfig.pages` déclare aussi `blog` et `about` en `/a-propos`, mais la page réelle est **`apropos.astro` → `/apropos`**. `nav` (dans `site.ts`) pointe correctement vers `/apropos`. Le blog est **désactivé** (`features.blog: false`) et n'a pas de page.

**Sections composables** (chaque section est un composant, piloté par `siteConfig.content`) :
Hero, Services, About, Certifications, Testimonials, Pricing, FAQ, CTA, Contact — assemblées dans `index.astro`. Certaines sont conditionnées par `features` (`{features.pricing && <Pricing/>}`, `testimonials`).

---

## 🎨 Styling & design

- **CSS pur**, pas de framework. Styles scoped par composant (`<style>` local Astro) + base globale dans `Layout.astro` (`<style is:global>`).
- **Design tokens** injectés via `define:vars` depuis `siteConfig.branding` + tokens « warm-paper » invariants (codés en dur dans `Layout.astro` : `--bg`, `--ink`, `--line`…). Couleurs brand : `--primary`, `--primaryDark`, `--primarySoft`, `--accent`.
- **Système de variantes A→H** : le `<body>` porte une classe `v-a`…`v-h`. Le `DesignSwitcher` la remplace et la stocke dans `localStorage('demo-variant')` ; un script inline restaure le choix. Noms des variantes : A Classique, B Clean, C Édito, D Forge, E Le Salon, F Stade, G Verveine, H Artisan. Le CSS des variantes vit dans les blocs `<style>` des composants (sélecteurs `.v-x ...`).
- **Mode « sketchy »** : `siteConfig.design.isSketchy` ajoute `is-sketchy` sur `<body>` + filtres SVG `#rough`/`#rough-strong` (font Kalam manuscrite).
- **Palettes de départ** documentées en bas de `site.ts` (Artisan, BtoB, Restaurant, Santé, ABPM) : copier les valeurs dans `branding`.

---

## 🔐 Variables d'environnement

- Aucun fichier `.env` ni `.env.example` présent dans le repo (README mentionne pourtant `cp .env.example .env`).
- `dotenv` est installé et `resend` prévu → attend une clé **`RESEND_API_KEY`** (à ajouter dans Vercel).
- Aucun `import.meta.env` / `process.env` n'est lu dans le code actuel (voir gap contact ci-dessous).

---

## ☁️ Déploiement

- **Vercel** via `@astrojs/vercel` (SSR). `astro.config.mjs` : `adapter: vercel()`.
- `vercel.json` définit uniquement des **en-têtes de sécurité** globaux : CSP stricte (autorise `unpkg.com` pour scripts, `fonts.googleapis/gstatic`, images `unsplash`/`transparenttextures`), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.

---

## ✅ État du projet

- Frontend multipage complet et stylé (8 pages, 12 composants, ~5700 lignes .astro).
- SEO solide : metadata + OpenGraph + JSON-LD `LocalBusiness` (index & contact), sitemap dynamique, `robots.txt`, canonical, hooks opt-in GA/Plausible/Sentry.
- Config centralisée exemplaire (`site.ts`) + système de variantes de design.

**Gaps / points de vigilance :**
1. **Formulaire de contact non fonctionnel** : `Contact.astro` fait `fetch('/api/send-email', POST)` mais **il n'existe aucun `src/pages/api/`**. Endpoint Resend à créer.
2. Pas de `.env.example` (contrairement au README).
3. Décalage `pages.about` (`/a-propos`) vs page réelle `/apropos` ; `pages.blog` déclaré mais feature off.
4. Aucun test, aucun lint configuré.
5. Contenu = placeholders `[...]` — normal pour un template, à remplir par client.

---

## 🚨 Points d'attention pour l'agent IA

1. **Astro pur, pas de React/Tailwind** : composants `.astro`, CSS scoped + tokens CSS. Ne pas introduire Tailwind ni un framework UI sans raison.
2. **Toute la config passe par `src/config/site.ts`** : c'est le fichier à éditer pour personnaliser un client (branding, SEO, contenu, features, nav, pages). Ne pas coder de contenu en dur dans les composants.
3. **Ajouter une page** : créer `src/pages/<slug>.astro` (importer `Layout`, `Header`, `Footer`, `Breadcrumb`), ajouter l'entrée dans `siteConfig.nav`/`pages`, et l'ajouter à `staticRoutes` dans `sitemap.xml.ts`.
4. **Ajouter une section** : créer `src/components/<Section>.astro`, alimenter son contenu dans `siteConfig.content`, l'importer dans `index.astro` (conditionner via `features` si optionnelle).
5. **Styling** : ajuster les tokens dans `branding` (site.ts) et le bloc `<style is:global>` de `Layout.astro`. Pour les variantes, cibler `.v-x ...` dans le `<style>` du composant concerné.
6. **Formulaire contact** : pour le rendre fonctionnel, créer `src/pages/api/send-email.ts` (`APIRoute` POST) utilisant `resend` + `RESEND_API_KEY` (le front l'appelle déjà).
7. **CSP** : tout nouveau domaine externe (script/font/image/CDN) doit être ajouté à la CSP de `vercel.json`, sinon il sera bloqué en prod.
8. **SEO** : chaque page définit `title`/`description` via `Layout` ; JSON-LD `LocalBusiness` déjà en place — le maintenir cohérent avec `business` (site.ts).
9. **Monolingue FR** : pas d'i18n. `features.multilingual` existe mais n'est pas implémenté.
10. **Icônes** : Phosphor via unpkg (noms sans préfixe `ph-` dans `business.icon`) + emojis dans `certifications`.

---

## 📝 Commandes (réelles — issues de package.json)

```bash
npm run dev       # astro dev   (http://localhost:4321)
npm run build     # astro build
npm run preview   # astro preview
npm run astro     # CLI astro
```

> Pas de script `lint` ni `test` défini.

---

*Guide synchronisé avec le code — Premium Multipage Template / Guy Boireau.*
