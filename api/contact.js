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
   Design tokens
───────────────────────────────────────────────────────────── */
const T = {
  bg:          '#0B0C0E',
  surface:     '#111214',
  border:      '#1E2024',
  accent:      '#D4A853',
  accentMid:   '#B88C3A',
  bone:        '#F2F1ED',
  muted:       '#8A8A8A',
  faint:       '#3A3A3C',
  /* Syne (titres, labels) — DM Sans (corps).
     @import dans <style> charge les fonts sur Gmail web, Apple Mail, Outlook.com.
     Outlook desktop ignore et utilise le fallback. */
  fontDisplay: "'Syne', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSans:    "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
};

/* ─────────────────────────────────────────────────────────────
   Blocs réutilisables
───────────────────────────────────────────────────────────── */

function htmlWrapper(content) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="dark"/>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
    img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none}
    body{margin:0;padding:0;background-color:${T.bg}}
    a{color:${T.accent};text-decoration:none}
    a:hover{text-decoration:underline}
  </style>
</head>
<body style="margin:0;padding:0;background-color:${T.bg};font-family:${T.fontSans}">
  <!--[if (gte mso 9)|(IE)]>
  <table width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>
  <![endif]-->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
    style="max-width:600px;margin:0 auto;padding:32px 16px">
    <tr><td>${content}</td></tr>
  </table>
  <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
</body>
</html>`;
}

function emailHeader() {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
    style="background:${T.surface};border:1px solid ${T.border};border-radius:6px 6px 0 0">
    <tr>
      <td style="padding:22px 32px">
        <span style="font-family:${T.fontDisplay};font-size:20px;font-weight:800;letter-spacing:-0.02em;color:${T.bone}">NLEND</span>
        <span style="font-family:${T.fontDisplay};font-size:20px;font-weight:800;letter-spacing:-0.02em;color:${T.accent}">&nbsp;MAX</span>
      </td>
      <td align="right" style="padding:22px 32px">
        <span style="font-family:${T.fontSans};font-size:10px;font-weight:700;letter-spacing:0.1em;color:${T.muted};text-transform:uppercase">Portfolio</span>
      </td>
    </tr>
  </table>`;
}

function accentRule() {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="height:2px;background:linear-gradient(90deg,${T.accent} 0%,${T.accentMid} 50%,transparent 100%)"></td>
    </tr>
  </table>`;
}

function emailBody(content) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
    style="background:${T.surface};border-left:1px solid ${T.border};border-right:1px solid ${T.border}">
    <tr>
      <td style="padding:32px;font-family:${T.fontSans};font-size:15px;line-height:1.7;color:${T.bone};font-weight:400">
        ${content}
      </td>
    </tr>
  </table>`;
}

function emailFooter(note) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
    style="background:${T.bg};border:1px solid ${T.border};border-top:none;border-radius:0 0 6px 6px">
    <tr>
      <td style="padding:18px 32px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="font-family:${T.fontSans};font-size:11px;color:${T.muted};line-height:1.5">${note}</td>
            <td align="right" style="font-family:${T.fontSans};font-size:11px;color:${T.faint};white-space:nowrap">nlend-max.vercel.app</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

/* ─────────────────────────────────────────────────────────────
   Template 1 — Notification propriétaire
───────────────────────────────────────────────────────────── */
function ownerTemplate({ name, email, message }) {
  const content = `
    <p style="margin:0 0 6px 0;font-family:${T.fontDisplay};font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${T.accent}">
      Nouveau message — Portfolio
    </p>

    <h1 style="margin:0 0 28px 0;font-family:${T.fontDisplay};font-size:28px;font-weight:800;letter-spacing:-0.02em;color:${T.bone};line-height:1.15">
      ${esc(name)} t'a écrit
    </h1>

    <!-- Fiche contact -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background:${T.bg};border:1px solid ${T.border};border-radius:4px;margin-bottom:24px">
      <tr>
        <td style="padding:14px 20px;border-bottom:1px solid ${T.border}">
          <span style="font-family:${T.fontSans};font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${T.muted};display:block;margin-bottom:5px">Nom</span>
          <span style="font-family:${T.fontSans};font-size:15px;font-weight:600;color:${T.bone}">${esc(name)}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 20px">
          <span style="font-family:${T.fontSans};font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${T.muted};display:block;margin-bottom:5px">Email</span>
          <a href="mailto:${esc(email)}" style="font-family:${T.fontSans};font-size:15px;font-weight:600;color:${T.accent}">${esc(email)}</a>
        </td>
      </tr>
    </table>

    <!-- Message -->
    <p style="margin:0 0 8px 0;font-family:${T.fontSans};font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${T.muted}">
      Message
    </p>
    <div style="background:${T.bg};border:1px solid ${T.border};border-left:3px solid ${T.accent};border-radius:4px;padding:18px 20px;margin-bottom:32px">
      <p style="margin:0;font-family:${T.fontSans};font-size:15px;line-height:1.7;color:${T.bone};white-space:pre-wrap">${esc(message).replace(/\n/g, '<br>')}</p>
    </div>

    <!-- CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="border-radius:3px;background:${T.accent}">
          <a href="mailto:${esc(email)}?subject=Re%3A%20Ton%20message%20depuis%20mon%20portfolio"
            style="display:inline-block;padding:13px 28px;font-family:${T.fontDisplay};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0B0C0E;text-decoration:none">
            Repondre a ${esc(name)}
          </a>
        </td>
      </tr>
    </table>
  `;

  return htmlWrapper(
    emailHeader() +
    accentRule() +
    emailBody(content) +
    emailFooter(`Recu via le formulaire de contact. Reply-To configure sur <strong style="color:${T.bone}">${esc(email)}</strong>.`)
  );
}

/* ─────────────────────────────────────────────────────────────
   Template 2 — Confirmation expéditeur
───────────────────────────────────────────────────────────── */
function senderTemplate({ name, message }) {
  const preview = message.length > 120 ? message.slice(0, 120).trim() + '...' : message;

  const content = `
    <p style="margin:0 0 6px 0;font-family:${T.fontDisplay};font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${T.accent}">
      Message recu
    </p>

    <h1 style="margin:0 0 16px 0;font-family:${T.fontDisplay};font-size:28px;font-weight:800;letter-spacing:-0.02em;color:${T.bone};line-height:1.15">
      Bonjour ${esc(name)},
    </h1>

    <p style="margin:0 0 28px 0;font-family:${T.fontSans};font-size:15px;line-height:1.7;color:${T.bone}">
      Ton message est bien arrive. Je lis tout personnellement et je reviens vers toi
      <strong style="font-family:${T.fontDisplay};color:${T.accent}">sous 48 h</strong>.
    </p>

    <!-- Recap message -->
    <p style="margin:0 0 8px 0;font-family:${T.fontSans};font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${T.muted}">
      Ton message
    </p>
    <div style="background:${T.bg};border:1px solid ${T.border};border-left:3px solid ${T.accent};border-radius:4px;padding:16px 20px;margin-bottom:32px">
      <p style="margin:0;font-family:${T.fontSans};font-size:14px;line-height:1.7;color:${T.muted};font-style:italic">${esc(preview)}</p>
    </div>

    <!-- Separateur -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px">
      <tr><td style="height:1px;background:${T.border}"></td></tr>
    </table>

    <!-- Projets -->
    <p style="margin:0 0 12px 0;font-family:${T.fontDisplay};font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${T.muted}">
      En attendant, mes projets
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background:${T.bg};border:1px solid ${T.border};border-radius:4px;margin-bottom:10px">
      <tr>
        <td style="padding:16px 20px">
          <a href="https://campussphere.app"
            style="font-family:${T.fontDisplay};font-size:14px;font-weight:700;color:${T.bone};text-decoration:none;display:block;margin-bottom:5px">
            CampusSphere
          </a>
          <span style="font-family:${T.fontSans};font-size:12px;color:${T.muted}">
            Le reseau social academique pour les etudiants africains
          </span>
        </td>
        <td align="right" style="padding:16px 20px;white-space:nowrap">
          <a href="https://campussphere.app"
            style="font-family:${T.fontSans};font-size:11px;font-weight:600;color:${T.accent};text-decoration:none;letter-spacing:0.06em;text-transform:uppercase">
            Voir le projet
          </a>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background:${T.bg};border:1px solid ${T.border};border-radius:4px;margin-bottom:32px">
      <tr>
        <td style="padding:16px 20px">
          <a href="https://agriguard.org"
            style="font-family:${T.fontDisplay};font-size:14px;font-weight:700;color:${T.bone};text-decoration:none;display:block;margin-bottom:5px">
            AgriGuard
          </a>
          <span style="font-family:${T.fontSans};font-size:12px;color:${T.muted}">
            Alertes climatiques SMS pour les agriculteurs camerounais
          </span>
        </td>
        <td align="right" style="padding:16px 20px;white-space:nowrap">
          <a href="https://agriguard.org"
            style="font-family:${T.fontSans};font-size:11px;font-weight:600;color:${T.accent};text-decoration:none;letter-spacing:0.06em;text-transform:uppercase">
            Voir le projet
          </a>
        </td>
      </tr>
    </table>

    <!-- Signature -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background:${T.bg};border:1px solid ${T.border};border-radius:4px">
      <tr>
        <td style="padding:20px 24px">
          <span style="font-family:${T.fontSans};font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${T.muted};display:block;margin-bottom:8px">
            Envoye par
          </span>
          <span style="font-family:${T.fontDisplay};font-size:20px;font-weight:800;letter-spacing:-0.01em;color:${T.bone}">NLEND&nbsp;</span>
          <span style="font-family:${T.fontDisplay};font-size:20px;font-weight:800;letter-spacing:-0.01em;color:${T.accent}">MAX</span>
          <span style="font-family:${T.fontSans};display:block;font-size:11px;color:${T.muted};margin-top:4px">
            Developpeur Web FullStack &middot; Product Builder
          </span>
          <span style="display:block;margin-top:14px">
            <a href="https://www.linkedin.com/in/nlend-max-6a4792330"
              style="font-family:${T.fontSans};font-size:11px;font-weight:600;color:${T.accent};letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;margin-right:20px">
              LinkedIn
            </a>
            <a href="https://github.com/MaxPrime7097"
              style="font-family:${T.fontSans};font-size:11px;font-weight:600;color:${T.accent};letter-spacing:0.06em;text-transform:uppercase;text-decoration:none">
              GitHub
            </a>
          </span>
        </td>
      </tr>
    </table>
  `;

  return htmlWrapper(
    emailHeader() +
    accentRule() +
    emailBody(content) +
    emailFooter(`Ce message confirme la reception de ton message. Si tu n'es pas a l'origine de ce contact, ignore-le simplement.`)
  );
}

/* ─────────────────────────────────────────────────────────────
   Handler principal
───────────────────────────────────────────────────────────── */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode non autorisee' });
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
    return res.status(500).json({ error: 'Configuration serveur incomplete' });
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
      subject: `Nouveau message de ${safeName} — Portfolio`,
      htmlContent: ownerTemplate({ name: safeName, email: safeEmail, message: safeMessage }),
    });

    // Email 2 — Confirmation expéditeur
    await sendEmail({
      sender:  { name: 'Nlend Max', email: SENDER },
      to:      [{ email: safeEmail, name: safeName }],
      subject: `Message bien recu, ${safeName} — je reviens vers toi sous 48h`,
      htmlContent: senderTemplate({ name: safeName, message: safeMessage }),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Erreur envoi Brevo:', error.message);
    return res.status(500).json({ error: 'Envoi impossible' });
  }
}
