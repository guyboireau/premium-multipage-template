import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { business } from '../../config/site';

export const prerender = false;

/* ─── Rate limiter simple (in-memory, par IP) ──────────────────────────── */
interface RateLimitEntry {
    count: number;
    resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function getClientIP(request: Request): string {
    const xfwd = request.headers.get('x-forwarded-for');
    if (xfwd) return xfwd.split(',')[0].trim();
    return request.headers.get('x-real-ip') ?? 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return { allowed: true };
    }
    if (entry.count >= RATE_LIMIT_MAX) {
        return { allowed: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) };
    }
    entry.count += 1;
    return { allowed: true };
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

const json = (status: number, body: unknown, extraHeaders: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json', ...extraHeaders },
    });

export const POST: APIRoute = async ({ request }) => {
    try {
        const ip = getClientIP(request);
        const rate = checkRateLimit(ip);
        if (!rate.allowed) {
            return json(429, { error: 'Trop de requêtes, veuillez réessayer plus tard.' }, {
                'Retry-After': String(rate.retryAfter),
            });
        }

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return json(503, { error: 'RESEND_API_KEY non configurée' });
        }
        const resend = new Resend(apiKey);

        const body = await request.json();

        /* ─── Honeypot : champ caché que les bots remplissent ─────────────── */
        if (body.website) {
            return json(400, { error: 'Requête invalide' });
        }

        /* ─── Champs du formulaire de contact (voir src/components/Contact.astro) ─ */
        const nom = body.nom ?? body.name;
        const email = body.email;
        const message = body.message;
        const telephone = body.telephone ?? '';
        const ville = body.ville ?? '';
        const type = body.type ?? '';

        if (!nom || !email || !message) {
            return json(400, { error: 'Champs manquants' });
        }
        if (typeof nom !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
            return json(400, { error: 'Types invalides' });
        }
        if (nom.length > 100 || email.length > 254 || message.length > 5000) {
            return json(400, { error: 'Champs trop longs' });
        }

        const safe = {
            nom: escapeHtml(nom),
            email: escapeHtml(email),
            message: escapeHtml(message).replace(/\n/g, '<br>'),
            telephone: escapeHtml(String(telephone)),
            ville: escapeHtml(String(ville)),
            type: escapeHtml(String(type)),
        };

        const data = await resend.emails.send({
            // ⚠️ Remplacer par un expéditeur de votre domaine vérifié dans Resend.
            from: `Contact ${business.name} <onboarding@resend.dev>`,
            to: [business.email],
            replyTo: safe.email,
            subject: `Nouveau message de ${safe.nom}${safe.type ? ` — ${safe.type}` : ''}`,
            html: `
                <h3>Nouveau message depuis le site</h3>
                <p><strong>Nom :</strong> ${safe.nom}</p>
                <p><strong>Email :</strong> ${safe.email}</p>
                ${safe.telephone ? `<p><strong>Téléphone :</strong> ${safe.telephone}</p>` : ''}
                ${safe.ville ? `<p><strong>Ville :</strong> ${safe.ville}</p>` : ''}
                ${safe.type ? `<p><strong>Type de demande :</strong> ${safe.type}</p>` : ''}
                <p><strong>Message :</strong></p>
                <p>${safe.message}</p>
            `,
        });

        return json(200, { success: true, data });
    } catch {
        return json(500, { error: 'Erreur serveur' });
    }
};
