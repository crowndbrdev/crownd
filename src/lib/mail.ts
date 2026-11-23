import "server-only";
import { getCountry } from "@/config/countries";
import { getMessages, t } from "@/i18n";
import { SITE_URL } from "./seo";

/**
 * Outbid e-mails go through Resend. They are "live" only when the key is set AND the sending domain
 * has been verified in Resend (then MAIL_ENABLED=1 is set as a Worker secret/var). Until then the site
 * doesn't promise e-mails and nothing is sent — Resend would reject an unverified From domain anyway.
 */
export function outbidEmailsLive() {
  return Boolean(process.env.RESEND_API_KEY) && process.env.MAIL_ENABLED === "1";
}

const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

export async function sendOutbidEmail(to: string, productName: string, country: string) {
  const c = getCountry(country);
  if (!c) return;
  if (!outbidEmailsLive()) {
    console.info(`[outbid] e-mail not live yet; would notify ${to}: "${productName}" lost #1 on /${country}`);
    return;
  }
  const m = getMessages(c);
  const vars = { name: productName, edition: c.edition };
  const url = `${SITE_URL}/${c.slug}?utm_source=email&utm_medium=outbid#bid`;
  const dir = c.dir === "rtl" ? ' dir="rtl"' : "";
  const html = `<!doctype html><html lang="${c.locale}"${dir}><body style="margin:0;background:#F7F3EA;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0E0D12">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:520px;background:#FFFDF8;border:1px solid #E6DFCF;border-radius:20px" cellpadding="0" cellspacing="0"><tr><td style="padding:32px">
<p style="margin:0 0 20px;font-size:20px;font-weight:800">👑 crownd</p>
<h1 style="margin:0 0 12px;font-size:26px;line-height:1.15">${esc(m.mail.title)}</h1>
<p style="margin:0 0 24px;font-size:16px;line-height:1.5;color:#3a3744">${esc(t(m.mail.body, vars))}</p>
<a href="${url}" style="display:inline-block;background:#0E0D12;color:#F7F3EA;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px">${esc(m.mail.cta)} →</a>
<p style="margin:28px 0 0;font-size:12px;line-height:1.5;color:#6E6A60">${esc(m.mail.footer)}</p>
</td></tr></table></td></tr></table></body></html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? "Crownd <crown@crownd.dev>",
      to,
      ...(process.env.LEGAL_EMAIL ? { reply_to: process.env.LEGAL_EMAIL } : {}),
      subject: `👑 ${t(m.mail.subject, vars)}`,
      html,
      text: `${m.mail.title}\n\n${t(m.mail.body, vars)}\n\n${m.mail.cta}: ${url}\n\n${m.mail.footer}`,
    }),
  }).catch((e) => console.error("[outbid] resend failed", e));
}
