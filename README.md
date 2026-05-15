<p align="center">
  <!-- Ajoutez ici le logo ou un aperçu du site vitrine -->
  <!-- <img src="public/preview.png" alt="Premium Multipage Template Preview" width="800" /> -->
</p>

<h1 align="center">✨ Template Vitrine Premium (Multi-Pages)</h1>

<p align="center">
  <strong>Template haut de gamme conçu pour les entreprises du bâtiment, de la rénovation, ou toute société souhaitant une présence en ligne élégante et immersive.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-6.3-FF5D01?style=flat-square&logo=astro&logoColor=white" alt="Astro" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vercel-Ready-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Resend-Emailing-black?style=flat-square&logo=minutemailer&logoColor=white" alt="Resend" />
</p>

---

## 📖 Présentation

Inspiré des meilleurs standards du web moderne, ce template **Multi-Pages** vous permet de déployer rapidement un site complet avec un rendu "Premium". Il intègre des animations fluides, une typographie soignée (*Playfair Display* & *Outfit* par défaut), et une architecture performante (zéro JavaScript bloquant par défaut).

Il comprend des pages dédiées pour :
- **Accueil** : Présentation globale et appel à l'action (Hero, Services phares).
- **Services** : Détail de votre expertise.
- **Réalisations (Portfolio)** : Mise en avant de vos meilleurs projets avec galerie photos.
- **Contact** : Formulaire fonctionnel connecté à une API d'envoi de mails.

---

## ✨ Fonctionnalités incluses

- 🚀 **Performance Astro** : Architecture optimisée offrant la rapidité du statique tout en permettant du dynamisme.
- 💫 **View Transitions** : Navigation fluide de type "App" entre les pages (transitions sans rechargement visuel de la page entière).
- 🎨 **Design Premium** : Palette de couleurs sophistiquées ("Navy & Gold", modifiable facilement), polices élégantes.
- 📱 **100% Responsive** : Expérience parfaite sur mobile, tablette et desktop.
- ✉️ **Formulaire de contact intégré** : Opérationnel via l'API **Resend**.
- 🔍 **SEO Ready** : Structure sémantique HTML5 robuste et balises meta personnalisables pour un classement Google optimal.

---

## 🚀 Démarrage Rapide

```bash
# 1. Cloner le projet
git clone <votre-url-de-repo> mon-site-premium && cd mon-site-premium

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Remplissez votre clé API Resend dans le fichier .env (RESEND_API_KEY)

# 4. Lancer le serveur de développement
npm run dev
```

> **Site accessible sur :** [http://localhost:4321](http://localhost:4321)

---

## 🛠️ Personnalisation du Template

### 1. Structure et Design (`src/layouts/Layout.astro`)
Le squelette du site (Header, Footer, variables de couleurs globales) se trouve ici. Modifiez les variables CSS dans `:root` pour adapter le site à la charte graphique de l'entreprise.

### 2. Contenu des Pages (`src/pages/`)
Vous trouverez ici les différentes vues du site (`index.astro`, `services.astro`, `portfolio.astro`, `contact.astro`). Vous pouvez modifier les textes et intégrer vos propres images dans les composants de ces pages.

### 3. Composants Réutilisables (`src/components/`)
Les éléments d'interface comme `Hero`, `ServiceGrid`, `PortfolioGallery`, etc., sont modulables. Si vous changez le style d'un composant, la modification s'appliquera sur l'ensemble des pages l'utilisant.

### 4. Formulaire de Contact (Resend)
Le template utilise [Resend](https://resend.com) pour la gestion des emails.
1. Créez un compte et obtenez une clé API.
2. Ajoutez-la dans votre fichier `.env` : `RESEND_API_KEY=re_...`
3. Vérifiez et ajustez l'adresse de réception dans la logique API du formulaire (`src/pages/api/...`).

---

## ☁️ Déploiement (Vercel)

Déployer ce site est extrêmement simple grâce à l'intégration officielle d'Astro avec Vercel.

1. Poussez votre code sur GitHub/GitLab.
2. Rendez-vous sur [Vercel](https://vercel.com) et ajoutez un nouveau projet (Import).
3. Dans la section **Environment Variables**, n'oubliez pas d'ajouter votre `RESEND_API_KEY`.
4. Cliquez sur **Deploy** et patientez quelques secondes !

---

## 📂 Architecture du Projet

```text
premium-multipage-template/
├── src/
│   ├── components/      # Composants UI (Hero, Navbar, Footer, Cards)
│   ├── layouts/         # Layout principal (Layout.astro)
│   └── pages/           # Pages (index.astro, services.astro, etc.) et APIs
├── public/              # Assets statiques (Images, Favicon, robots.txt)
├── astro.config.mjs     # Fichier de configuration Astro
└── vercel.json          # Paramètres de sécurité / cache pour Vercel
```

---

## 📞 Support & Maintenance

Pour toute demande d'évolution complexe ou de support technique, vous pouvez vous référer à la [documentation officielle d'Astro](https://docs.astro.build/) ou contacter votre développeur.

---
*Déployez des sites vitrines exceptionnels avec le minimum d'effort.*
