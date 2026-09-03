import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import {
    badRequestResponse,
    checkRateLimit,
    escapeHtml,
    getClientIP,
    getFromAddress,
    getNotificationRecipient,
    getResendApiKey,
    isHoneypotFilled,
    json,
    missingApiKeyResponse,
    tooManyRequestsResponse,
} from '../../lib/email';

export const prerender = false;

/* ─── Anti-abus : quotas propres à ce formulaire ───────────────────────── */
const RATE_LIMIT = { max: 3, windowMs: 5 * 60 * 1000 } as const;

export const POST: APIRoute = async ({ request }) => {
    try {
        const rate = checkRateLimit('send-email', getClientIP(request), RATE_LIMIT);
        if (!rate.allowed) return tooManyRequestsResponse(rate.retryAfter);

        const apiKey = getResendApiKey();
        if (!apiKey) return missingApiKeyResponse();
        const resend = new Resend(apiKey);

        const body = await request.json();

        /* ─── Honeypot : champ caché que les bots remplissent ─────────────── */
        if (isHoneypotFilled(body)) return badRequestResponse();

        /* ─── Champs du formulaire de contact (voir src/components/Contact.astro) ─ */
        const nom = body.nom ?? body.name;
        const email = body.email;
        const message = body.message;
        const telephone = body.telephone ?? '';
        const ville = body.ville ?? '';
        const type = body.type ?? '';

        /* Le formulaire rend « Email » facultatif et « Téléphone » obligatoire :
           on exige donc nom + message + au moins un moyen de recontact. */
        if (!nom || !message || (!email && !telephone)) {
            return badRequestResponse('Champs manquants');
        }
        if (typeof nom !== 'string' || typeof message !== 'string') {
            return badRequestResponse('Types invalides');
        }
        if (email && typeof email !== 'string') {
            return badRequestResponse('Types invalides');
        }
        if (nom.length > 100 || message.length > 5000 || (email && email.length > 254)) {
            return badRequestResponse('Champs trop longs');
        }

        const safe = {
            nom: escapeHtml(nom),
            email: escapeHtml(String(email ?? '')),
            message: escapeHtml(message).replace(/\n/g, '<br>'),
            telephone: escapeHtml(String(telephone)),
            ville: escapeHtml(String(ville)),
            type: escapeHtml(String(type)),
        };

        const { data, error: sendError } = await resend.emails.send({
            // Expéditeur : siteConfig.email.from, ou l'env RESEND_FROM.
            // Doit appartenir à un domaine vérifié dans Resend.
            from: getFromAddress(),
            to: [getNotificationRecipient()],
            // replyTo seulement si le visiteur a laissé un email (champ facultatif)
            ...(safe.email ? { replyTo: safe.email } : {}),
            subject: `Nouveau message de ${safe.nom}${safe.type ? ` — ${safe.type}` : ''}`,
            html: `
                <h3>Nouveau message depuis le site</h3>
                <p><strong>Nom :</strong> ${safe.nom}</p>
                ${safe.email ? `<p><strong>Email :</strong> ${safe.email}</p>` : ''}
                ${safe.telephone ? `<p><strong>Téléphone :</strong> ${safe.telephone}</p>` : ''}
                ${safe.ville ? `<p><strong>Ville :</strong> ${safe.ville}</p>` : ''}
                ${safe.type ? `<p><strong>Type de demande :</strong> ${safe.type}</p>` : ''}
                <p><strong>Message :</strong></p>
                <p>${safe.message}</p>
            `,
        });

        // ⚠️ Le SDK Resend NE LÈVE PAS d'exception sur erreur d'API : il résout
        // avec { data: null, error: {...} }. Sans ce contrôle, la route
        // répondait 200 « success » alors qu'aucun email n'était parti.
        if (sendError) {
            console.error('[send-email] Resend:', sendError);
            return json(502, { error: "L'email n'a pas pu être envoyé." });
        }

        // On ne renvoie que l'id : le payload Resend complet fuiterait des
        // détails internes vers le navigateur.
        return json(200, { success: true, id: data?.id ?? null });
    } catch (error) {
        console.error('[send-email]', error);
        return json(500, { error: 'Erreur serveur' });
    }
};
