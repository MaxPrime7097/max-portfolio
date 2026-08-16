/**
 * Fonction serverless Vercel — /api/contact
 *
 * S'exécute côté serveur uniquement. La clé Brevo ne transite jamais
 * vers le navigateur : elle est lue depuis les variables d'environnement
 * Vercel (ou .env.local en développement local avec `vercel dev`).
 *
 * Flux :
 *  POST { name, email, message, website }
 *    → honeypot check (champ "website" caché)
 *    → validation
 *    → email de notification → propriétaire
 *    → email de confirmation → expéditeur du message
 *    → 200 { ok: true }
 */

/** Neutralise les caractères HTML pour éviter l'injection dans le corps de l'email. */
const esc = (s) =>
  String(s ?? '').replace(
    /[<>&"]/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]),
  );

export default async function handler(req, res) {
  // Autoriser uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { name, email, message, website } = req.body || {};

  // Honeypot anti-robot : champ caché côté Angular.
  // Un robot le remplit ; un humain ne le voit pas.
  // On renvoie 200 pour ne pas signaler à un robot qu'il a été détecté.
  if (website) {
    return res.status(200).json({ ok: true });
  }

  // Validation minimale
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  const API_KEY = process.env.BREVO_API_KEY;
  const SENDER = process.env.SENDER_EMAIL;
  const OWNER = process.env.OWNER_EMAIL;

  if (!API_KEY || !SENDER || !OWNER) {
    console.error('Variables d\'environnement Brevo manquantes');
    return res.status(500).json({ error: 'Configuration serveur incomplète' });
  }

  /** Envoie un email via l'API transactionnelle Brevo. */
  async function sendEmail(payload) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Brevo error ${response.status}: ${await response.text()}`);
    }
    return response.json();
  }

  try {
    // Email 1 — Notification pour le propriétaire du portfolio
    await sendEmail({
      sender: { name: 'Portfolio', email: SENDER },
      to: [{ email: OWNER, name: 'Nlend Max' }],
      replyTo: { email: email.trim(), name: name.trim() },
      subject: `Nouveau contact : ${name.trim()}`,
      htmlContent: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="margin-top:0">Nouveau message depuis ton portfolio</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#666;width:80px">Nom</td>
              <td style="padding:8px 0;font-weight:600">${esc(name)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666">Email</td>
              <td style="padding:8px 0">
                <a href="mailto:${esc(email)}" style="color:#d4a853">${esc(email)}</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f5f5f5;border-radius:4px">
            <p style="margin:0;white-space:pre-wrap">${esc(message).replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top:16px;font-size:12px;color:#999">
            Réponds à cet email pour écrire directement à ${esc(name)}.
          </p>
        </div>
      `,
    });

    // Email 2 — Confirmation automatique pour l'expéditeur
    await sendEmail({
      sender: { name: 'Nlend Max', email: SENDER },
      to: [{ email: email.trim(), name: name.trim() }],
      subject: 'Message bien reçu — je reviens vers toi vite',
      htmlContent: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="margin-top:0">Bonjour ${esc(name)},</h2>
          <p>
            Merci pour ton message, je l'ai bien reçu et je reviens vers toi sous 48 h.
          </p>
          <p>En attendant, tu peux jeter un œil à mes projets :</p>
          <ul>
            <li><a href="https://campussphere.app" style="color:#d4a853">CampusSphere</a></li>
            <li><a href="https://agriguard.org" style="color:#d4a853">AgriGuard</a></li>
          </ul>
          <p style="margin-top:24px">À très vite,<br><strong>Nlend Max</strong></p>
          <hr style="border:none;border-top:1px solid #eee;margin-top:32px">
          <p style="font-size:11px;color:#999">
            Ce message a été envoyé automatiquement depuis le formulaire de contact
            de mon portfolio. Si tu n'es pas à l'origine de ce message, ignore-le simplement.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    // On logue l'erreur côté serveur uniquement — jamais au navigateur
    console.error('Erreur d\'envoi Brevo:', error.message);
    return res.status(500).json({ error: 'Envoi impossible' });
  }
}
