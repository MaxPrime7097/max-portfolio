/**
 * Fonction serverless Vercel — /api/contact
 *
 * Flux :
 *  POST { name, email, message, website }
 *    → honeypot check
 *    → validation
 *    → email de notification  → propriétaire (Nlend Max)
 *    → email de confirmation  → expéditeur
 *    → 200 { ok: true }
 */

/** Neutralise les caractères HTML pour éviter l'injection dans le corps de l'email. */
const esc = (s) =>
  String(s ?? '').replace(
    /[<>&"]/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]),
  );

/* ─────────────────────────────────────────────────────────────
   Design tokens partagés
───────────────────────────────────────────────────────────── */
const T = {
  bg:        '#0B0C0E',
  surface:   '#111214',
  border:    '#1E2024',
  accent:    '#D4A853',
  accentMid: '#B88C3A',
  bone:      '#F2F1ED',
  muted:     '#8A8A8A',
  faint:     '#3A3A3C',
  font:      "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

/* ─────────────────────────────────────────────────────────────
   Blocs réutilisables
───────────────────────────────────────────────────────────── */

/** Wrapper HTML de base (reset email + dark bg) */
function htmlWrapper(content) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="dark"/>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
    img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none}
    body{margin:0;padding:0;background-color:${T.bg}}
    a{color:${T.accent};text-decoration:none}
    a:hover{text-decoration:underline}
  </style>
</head>
<body style="margin:0;padding:0;background-color:${T.bg};font-family:${T.font}">
  <!--[if (gte mso 9)|(IE)]>
  <table width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>
  <![endif]-->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;padding:32px 16px">
    <tr><td>${content}</td></tr>
  </table>
  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
</body>
</html>`;
}

/** Barre d'en-tête avec logo textuel */
function header() {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
    style="background:${T.surface};border:1px solid ${T.border};border-radius:6px 6px 0 0;padding:24px 32px">
    <tr>
      <td>
        <span style="font-family:${T.font};font-size:20px;font-weight:800;letter-spacing:-0.02em;color:${T.bone}">
          NLEND
        </span>
        <span style="font-family:${T.font};font-size:20px;font-weight:800;letter-spacing:-0.02em;color:${T.accent}">
          &nbsp;MAX
        </span>
      </td>
      <td align="right">
        <span style="font-family:${T.font};font-size:10px;font-weight:700;letter-spacing:0.1em;color:${T.muted};text-transform:uppercase">
          Portfolio
        </span>
      </td>
    </tr>
  </table>`;
}

/** Séparateur fin couleur accent */
function accentRule() {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr><td style="height:2px;background:linear-gradient(90deg,${T.accent} 0%,${T.accentMid} 50%,transparent 100%)"></td></tr>
  </table>`;
}

/** Corps principal */
function body(content) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
    style="background:${T.surface};border-left:1px solid ${T.border};border-right:1px solid ${T.border};padding:32px">
    <tr><td style="font-family:${T.font};font-size:15px;line-height:1.7;color:${T.bone};font-weight:400">
      ${content}
    </td></tr>
  </table>`;
}

/** Pied de page */
function footer(note) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
    style="background:${T.bg};border:1px solid ${T.border};border-top:none;border-radius:0 0 6px 6px;padding:20px 32px">
    <tr>
      <td style="font-family:${T.font};font-size:11px;color:${T.muted};line-height:1.5">
        ${note}
      </td>
      <td align="right" style="font-family:${T.font};font-size:11px;color:${T.faint};white-space:nowrap">
        nlend-max.vercel.app
      </td>
    </tr>
  </table>`;
}

/* ─────────────────────────────────────────────────────────────
   Template 1 — Notification propriétaire
───────────────────────────────────────────────────────────── */
function ownerTemplate({ name, email, message }) {
  const content = `
    <!-- Eyebrow -->
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${T.accent}">
      Nouveau message — Portfolio
    </p>

    <!-- Titre -->
    <h1 style="margin:0 0 24px;font-size:26px;font-weight:800;letter-spacing:-0.02em;color:${T.bone};line-height:1.2">
      ${esc(name)} t'a écrit
    </h1>

    <!-- Fiche contact -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background:${T.bg};border:1px solid ${T.border};border-radius:4px;margin-bottom:24px">
      <tr>
        <td style="padding:14px 20px;border-bottom:1px solid ${T.border}">
          <span style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${T.muted};display:block;margin-bottom:4px">Nom</span>
          <span style="font-size:15px;font-weight:600;color:${T.bone}">${esc(name)}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 20px">
          <span style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${T.muted};display:block;margin-bottom:4px">Email</span>
          <a href="mailto:${esc(email)}" style="font-size:15px;font-weight:600;color:${T.accent}">${esc(email)}</a>
        </td>
      </tr>
    </table>

    <!-- Message -->
    <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${T.muted}">
      Message
    </p>
    <div style="background:${T.bg};border:1px solid ${T.border};border-left:3px solid ${T.accent};border-radius:4px;padding:16px 20px;margin-bottom:28px">
      <p style="margin:0;font-size:15px;line-height:1.7;color:${T.bone};white-space:pre-wrap">${esc(message).replace(/\n/g, '<br>')}</p>
    </div>

    <!-- CTA répondre -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="border-radius:3px;background:${T.accent}">
          <a href="mailto:${esc(email)}?subject=Re%3A%20Ton%20message%20depuis%20mon%20portfolio"
            style="display:inline-block;padding:13px 28px;font-family:${T.font};font-size:12px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:#0B0C0E;text-decoration:none">
            Répondre à ${esc(name)}
          </a>
        </td>
      </tr>
    </table>
  `;

  return htmlWrapper(
    header() +
    accentRule() +
    body(content) +
    footer(`Reçu via le formulaire de contact de ton portfolio. Reply-To configuré sur <strong style="color:${T.bone}">${esc(email)}</strong>.`)
  );
}

/* ─────────────────────────────────────────────────────────────
   Template 2 — Confirmation expéditeur
───────────────────────────────────────────────────────────── */
function senderTemplate({ name, message }) {
  const preview = message.length > 120 ? message.slice(0, 120).trim() + '…' : message;

  const content = `
    <!-- Eyebrow -->
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${T.accent}">
      Message reçu
    </p>

    <!-- Titre -->
    <h1 style="margin:0 0 16px;font-size:26px;font-weight:800;letter-spacing:-0.02em;color:${T.bone};line-height:1.2">
      Bonjour ${esc(name)},
    </h1>

    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:${T.bone};opacity:0.85">
      Ton message est bien arrivé. Je lis tout personnellement et je reviens vers toi <strong style="color:${T.accent}">sous 48 h</strong>.
    </p>

    <!-- Récap du message -->
    <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${T.muted}">
      Ton message
    </p>
    <div style="background:${T.bg};border:1px solid ${T.border};border-left:3px solid ${T.accent};border-radius:4px;padding:16px 20px;margin-bottom:28px">
      <p style="margin:0;font-size:14px;line-height:1.7;color:${T.muted};font-style:italic">${esc(preview)}</p>
    </div>

    <!-- Séparateur -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px">
      <tr><td style="height:1px;background:${T.border}"></td></tr>
    </table>

    <!-- Mes projets -->
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${T.muted}">
      En attendant, mes projets
    </p>

    <!-- Projet 1 -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background:${T.bg};border:1px solid ${T.border};border-radius:4px;margin-bottom:10px">
      <tr>
        <td style="padding:16px 20px">
          <a href="https://campussphere.app" style="font-size:14px;font-weight:700;color:${T.bone};text-decoration:none;display:block;margin-bottom:4px">
            CampusSphere
            <span style="font-size:11px;font-weight:400;color:${T.accent};margin-left:8px">↗</span>
          </a>
          <span style="font-size:12px;color:${T.muted}">Le réseau social académique pour les étudiants africains</span>
        </td>
      </tr>
    </table>

    <!-- Projet 2 -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background:${T.bg};border:1px solid ${T.border};border-radius:4px;margin-bottom:28px">
      <tr>
        <td style="padding:16px 20px">
          <a href="https://agriguard.org" style="font-size:14px;font-weight:700;color:${T.bone};text-decoration:none;display:block;margin-bottom:4px">
            AgriGuard
            <span style="font-size:11px;font-weight:400;color:${T.accent};margin-left:8px">↗</span>
          </a>
          <span style="font-size:12px;color:${T.muted}">Alertes climatiques SMS pour les agriculteurs camerounais</span>
        </td>
      </tr>
    </table>

    <!-- Signature -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background:${T.bg};border:1px solid ${T.border};border-radius:4px;padding:20px">
      <tr>
        <td style="padding:20px">
          <span style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${T.muted};display:block;margin-bottom:8px">Envoyé par</span>
          <span style="font-size:18px;font-weight:800;letter-spacing:-0.01em;color:${T.bone}">NLEND </span>
          <span style="font-size:18px;font-weight:800;letter-spacing:-0.01em;color:${T.accent}">MAX</span>
          <span style="display:block;font-size:11px;color:${T.muted};margin-top:4px">Développeur Web FullStack · Product Builder</span>
          <span style="display:block;margin-top:12px">
            <a href="https://www.linkedin.com/in/nlend-max-6a4792330" style="font-size:11px;font-weight:600;color:${T.accent};letter-spacing:0.04em;text-transform:uppercase;margin-right:16px">LinkedIn</a>
            <a href="https://github.com/MaxPrime7097" style="font-size:11px;font-weight:600;color:${T.accent};letter-spacing:0.04em;text-transform:uppercase">GitHub</a>
          </span>
        </td>
      </tr>
    </table>
  `;

  return htmlWrapper(
    header() +
    accentRule() +
    body(content) +
    footer(`Ce message automatique confirme la réception de ton message. Si tu n'es pas à l'origine de ce contact, ignore-le simplement.`)
  );
}

/* ─────────────────────────────────────────────────────────────
   Handler principal
───────────────────────────────────────────────────────────── */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { name, email, message, website } = req.body || {};

  // Honeypot anti-bot
  if (website) return res.status(200).json({ ok: true });

  // Validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  const API_KEY = process.env.BREVO_API_KEY;
  const SENDER  = process.env.SENDER_EMAIL;
  const OWNER   = process.env.OWNER_EMAIL;

  if (!API_KEY || !SENDER || !OWNER) {
    console.error('Variables d\'environnement Brevo manquantes');
    return res.status(500).json({ error: 'Configuration serveur incomplète' });
  }

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

  const safeName    = name.trim();
  const safeEmail   = email.trim();
  const safeMessage = message.trim();

  try {
    // Email 1 — Notification propriétaire
    await sendEmail({
      sender:  { name: 'Portfolio Contact', email: SENDER },
      to:      [{ email: OWNER, name: 'Nlend Max' }],
      replyTo: { email: safeEmail, name: safeName },
      subject: `✉️ Nouveau message de ${safeName}`,
      htmlContent: ownerTemplate({ name: safeName, email: safeEmail, message: safeMessage }),
    });

    // Email 2 — Confirmation expéditeur
    await sendEmail({
      sender:  { name: 'Nlend Max', email: SENDER },
      to:      [{ email: safeEmail, name: safeName }],
      subject: `Message bien reçu, ${safeName} — je reviens vers toi sous 48h`,
      htmlContent: senderTemplate({ name: safeName, message: safeMessage }),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Erreur envoi Brevo:', error.message);
    return res.status(500).json({ error: 'Envoi impossible' });
  }
}
