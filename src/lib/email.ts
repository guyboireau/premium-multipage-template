// ═════════════════════════════════════════════════════════════════════════════
//  Helpers partagés par les routes /api/* (Resend)
//
//  ⚠️ IMPORTANT — NE PAS utiliser `import.meta.env.MA_VARIABLE` ici.
//  Vite/Astro remplacent ces expressions par leur valeur littérale AU MOMENT
//  DU BUILD. Une variable absente de l'environnement de build (cas normal sur
//  Vercel où les secrets sont injectés au runtime de la fonction) se retrouve
//  figée à `undefined` dans le bundle de production : la fonction serverless
//  ne la relira jamais. On lit donc `process.env` À L'INTÉRIEUR des handlers.
//
//  Ce module est le jumeau de celui de `site-vitrine-template` : garder les
//  deux alignés, ils sont destinés à être extraits en package partagé.
// ═════════════════════════════════════════════════════════════════════════════

import { business, email as emailConfig } from '../config/site';

/** Clé API Resend, lue à l'exécution (jamais figée au build). */
export function getResendApiKey(): string | undefined {
  const key = process.env.RESEND_API_KEY;
  return key && key.trim() ? key.trim() : undefined;
}

/**
 * Expéditeur des emails transactionnels.
 * Priorité : env RESEND_FROM → siteConfig.email.from.
 * Doit correspondre à un domaine vérifié sur Resend.
 */
export function getFromAddress(): string {
  const fromEnv = process.env.RESEND_FROM?.trim();
  return fromEnv || emailConfig.from;
}

/**
 * Destinataire des notifications internes (le client du template).
 * Priorité : env CONTACT_EMAIL_TO → siteConfig.email.to → business.email.
 */
export function getNotificationRecipient(): string {
  const toEnv = process.env.CONTACT_EMAIL_TO?.trim();
  return toEnv || emailConfig.to?.trim() || business.email;
}

/** Réponse JSON normalisée. */
export function json(
  status: number,
  body: unknown,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

/** Réponse 503 normalisée quand la clé Resend n'est pas configurée. */
export function missingApiKeyResponse(): Response {
  return json(503, { error: 'RESEND_API_KEY non configurée' });
}

/** Échappe les caractères HTML — les entrées utilisateur finissent dans un email HTML. */
export function escapeHtml(str: unknown): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ═════════════════════════════════════════════════════════════════════════════
//  Anti-abus partagé : rate limiting + honeypot
//
//  Toute route qui déclenche un envoi d'email DOIT passer par ces deux gardes.
// ═════════════════════════════════════════════════════════════════════════════

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Un seau par route : la limite d'un formulaire ne doit pas consommer celle
 * d'un autre. Stockage in-memory, donc par instance de fonction serverless —
 * c'est un ralentisseur, pas un pare-feu. Pour une protection réellement
 * distribuée, brancher un store partagé (KV/Redis) ou Turnstile.
 */
const rateLimitBuckets = new Map<string, Map<string, RateLimitEntry>>();

/** Nombre d'IP au-delà duquel on purge les entrées expirées d'un seau. */
const BUCKET_PURGE_THRESHOLD = 5000;

export interface RateLimitOptions {
  /** Nombre de requêtes autorisées par fenêtre. */
  max: number;
  /** Largeur de la fenêtre glissante, en millisecondes. */
  windowMs: number;
}

/** IP de l'appelant, telle que transmise par le proxy Vercel. */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/**
 * Consomme un jeton pour `ip` sur la route `routeKey`.
 * Renvoie `allowed: false` + `retryAfter` (secondes) quand le quota est épuisé.
 */
export function checkRateLimit(
  routeKey: string,
  ip: string,
  { max, windowMs }: RateLimitOptions,
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();

  let bucket = rateLimitBuckets.get(routeKey);
  if (!bucket) {
    bucket = new Map<string, RateLimitEntry>();
    rateLimitBuckets.set(routeKey, bucket);
  }

  // Purge opportuniste : sans elle, une instance longue-durée accumulerait une
  // entrée par IP vue depuis son démarrage.
  if (bucket.size > BUCKET_PURGE_THRESHOLD) {
    for (const [key, value] of bucket) {
      if (now > value.resetTime) bucket.delete(key);
    }
  }

  const entry = bucket.get(ip);
  if (!entry || now > entry.resetTime) {
    bucket.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

/** Réponse 429 normalisée, avec l'en-tête `Retry-After` attendu par les clients. */
export function tooManyRequestsResponse(retryAfter?: number): Response {
  const headers: Record<string, string> = {};
  if (retryAfter !== undefined) headers['Retry-After'] = String(retryAfter);
  return json(429, { error: 'Trop de requêtes, veuillez réessayer plus tard.' }, headers);
}

/**
 * Le honeypot est un champ `website` caché en CSS : un humain ne le voit pas,
 * un robot qui remplit tout le formulaire le remplit. S'il est non vide, on
 * rejette. Le champ doit exister dans le formulaire ET être envoyé dans le
 * payload, sinon ce contrôle ne sert à rien.
 */
export function isHoneypotFilled(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) return false;
  const value = (body as Record<string, unknown>).website;
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
}

/** Réponse 400 normalisée — volontairement muette sur la raison du rejet. */
export function badRequestResponse(error = 'Requête invalide'): Response {
  return json(400, { error });
}
