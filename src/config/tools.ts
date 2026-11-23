/**
 * Tools directory.
 *
 * Category taxonomy follows lincolixavier/awesome-indie-hackers (credited on the page).
 * That repo has no license, so descriptions here are written from scratch — never copied.
 * Contributions: PR to data/tools (see docs/05-lancamento-growth.md, "awesome-crownd").
 */
export const CATEGORIES = [
  "Infra", "Frontend & Design", "i18n & Content", "Payments", "Security", "Auth", "Email",
  "APIs & Services", "Observability", "CI/CD", "Analytics", "Product Metrics", "Idea Research",
  "Marketing", "Community & Support", "Project Management",
] as const;

export type Tool = { name: string; url: string; category: (typeof CATEGORIES)[number]; desc: string };

/** Global stack (English descriptions; rendered with lang="en" on other editions). */
export const GLOBAL_TOOLS: Tool[] = [
  { name: "Vercel", url: "https://vercel.com", category: "Infra", desc: "Git-push deploys with preview URLs for every branch." },
  { name: "Cloudflare", url: "https://cloudflare.com", category: "Infra", desc: "CDN, DNS, Workers and R2 storage with a generous free tier." },
  { name: "Hetzner", url: "https://hetzner.com", category: "Infra", desc: "Very cheap EU servers when you outgrow serverless." },
  { name: "Neon", url: "https://neon.tech", category: "Infra", desc: "Serverless Postgres that branches like Git." },
  { name: "Turso", url: "https://turso.tech", category: "Infra", desc: "Edge SQLite — what this site runs on." },
  { name: "Next.js", url: "https://nextjs.org", category: "Frontend & Design", desc: "React framework for full-stack web apps." },
  { name: "shadcn/ui", url: "https://ui.shadcn.com", category: "Frontend & Design", desc: "Copy-paste accessible components you own." },
  { name: "Tolgee", url: "https://tolgee.io", category: "i18n & Content", desc: "In-context translation with human review workflows." },
  { name: "Stripe", url: "https://stripe.com", category: "Payments", desc: "135+ currencies and local methods from one integration." },
  { name: "Paddle", url: "https://paddle.com", category: "Payments", desc: "Merchant of record: they handle global sales tax for SaaS." },
  { name: "Infisical", url: "https://infisical.com", category: "Security", desc: "Open-source secrets manager for teams and CI." },
  { name: "Better Auth", url: "https://better-auth.com", category: "Auth", desc: "Framework-agnostic TypeScript auth you self-host." },
  { name: "Clerk", url: "https://clerk.com", category: "Auth", desc: "Drop-in auth UI with organisations and MFA." },
  { name: "Resend", url: "https://resend.com", category: "Email", desc: "Developer-first transactional email with React templates." },
  { name: "Sentry", url: "https://sentry.io", category: "Observability", desc: "Errors and performance traces with source maps." },
  { name: "GitHub Actions", url: "https://github.com/features/actions", category: "CI/CD", desc: "CI/CD next to your code, free for public repos." },
  { name: "Plausible", url: "https://plausible.io", category: "Analytics", desc: "Cookie-less, GDPR-friendly analytics." },
  { name: "PostHog", url: "https://posthog.com", category: "Product Metrics", desc: "Product analytics, session replay and feature flags." },
  { name: "Exploding Topics", url: "https://explodingtopics.com", category: "Idea Research", desc: "Spot rising trends before they peak." },
  { name: "Google Search Console", url: "https://search.google.com/search-console", category: "Marketing", desc: "See how Google indexes and ranks every edition." },
  { name: "Crisp", url: "https://crisp.chat", category: "Community & Support", desc: "Shared inbox and live chat for small teams." },
  { name: "Linear", url: "https://linear.app", category: "Project Management", desc: "Fast issue tracking with cycles and roadmaps." },
];

/** Local stack per edition, described in the local language. */
export const LOCAL_TOOLS: Record<string, Tool[]> = {
  us: [
    { name: "Stripe Atlas", url: "https://stripe.com/atlas", category: "Payments", desc: "Incorporate a Delaware company and open Stripe in days." },
    { name: "Mercury", url: "https://mercury.com", category: "Payments", desc: "Startup banking that pairs well with Stripe payouts." },
    { name: "Hacker News", url: "https://news.ycombinator.com/show", category: "Community & Support", desc: "Show HN: the toughest, most valuable launch crowd." },
  ],
  uk: [
    { name: "GoCardless", url: "https://gocardless.com", category: "Payments", desc: "Direct Debit and open-banking payments, born in London." },
    { name: "Companies House", url: "https://www.gov.uk/limited-company-formation", category: "Payments", desc: "Form a UK limited company online in about a day." },
    { name: "Tide", url: "https://tide.co", category: "Payments", desc: "Business current account for sole traders and Ltds." },
  ],
  ca: [
    { name: "Wealthsimple Business", url: "https://wealthsimple.com", category: "Payments", desc: "Simple business banking for Canadian founders." },
    { name: "BetaKit", url: "https://betakit.com", category: "Marketing", desc: "Canada's startup news — pitch your launch here." },
    { name: "Interac", url: "https://interac.ca", category: "Payments", desc: "The bank-transfer habit every Canadian knows." },
  ],
  au: [
    { name: "Airwallex", url: "https://airwallex.com", category: "Payments", desc: "Aussie-born multi-currency accounts and cards." },
    { name: "Afterpay", url: "https://afterpay.com", category: "Payments", desc: "Buy-now-pay-later that Australians expect at checkout." },
    { name: "Startup Daily", url: "https://startupdaily.net", category: "Marketing", desc: "Australian startup news and launch coverage." },
  ],
  in: [
    { name: "Razorpay", url: "https://razorpay.com", category: "Payments", desc: "UPI, cards and netbanking — the Indian default for SaaS." },
    { name: "Cashfree", url: "https://cashfree.com", category: "Payments", desc: "Payouts and payment links with fast settlement." },
    { name: "r/developersIndia", url: "https://reddit.com/r/developersIndia", category: "Community & Support", desc: "India's biggest developer community on Reddit." },
  ],
  br: [
    { name: "AbacatePay", url: "https://abacatepay.com", category: "Payments", desc: "Pix com taxa fixa e API simples, feito para dev indie." },
    { name: "Mercado Pago", url: "https://mercadopago.com.br", category: "Payments", desc: "Pix, boleto e cartão com o checkout que o brasileiro já conhece." },
    { name: "TabNews", url: "https://tabnews.com.br", category: "Community & Support", desc: "Comunidade brasileira de tecnologia com conteúdo de valor." },
  ],
  mx: [
    { name: "Conekta", url: "https://conekta.com", category: "Payments", desc: "Tarjetas, OXXO y SPEI en una sola integración mexicana." },
    { name: "Clip", url: "https://clip.mx", category: "Payments", desc: "Cobros con tarjeta y links de pago para negocios en México." },
    { name: "Platzi", url: "https://platzi.com", category: "Community & Support", desc: "La comunidad de aprendizaje tech más grande de Latinoamérica." },
  ],
  es: [
    { name: "Bizum", url: "https://bizum.es", category: "Payments", desc: "El pago móvil que todo el mundo usa en España." },
    { name: "Holded", url: "https://holded.com", category: "Product Metrics", desc: "Facturación y contabilidad para pymes y autónomos." },
    { name: "Malt", url: "https://malt.es", category: "Community & Support", desc: "Encuentra freelancers tech para tu proyecto." },
  ],
  fr: [
    { name: "Qonto", url: "https://qonto.com", category: "Payments", desc: "La banque en ligne des indépendants et des startups." },
    { name: "Pennylane", url: "https://pennylane.com", category: "Product Metrics", desc: "Compta et facturation pensées pour les entrepreneurs." },
    { name: "Indie Makers", url: "https://indiemakers.fr", category: "Community & Support", desc: "La communauté francophone des makers indépendants." },
  ],
  de: [
    { name: "Mollie", url: "https://mollie.com", category: "Payments", desc: "Klarna, PayPal, SEPA und Karten mit einer API." },
    { name: "Lexoffice", url: "https://lexoffice.de", category: "Product Metrics", desc: "Buchhaltung und Rechnungen, GoBD-konform." },
    { name: "eRecht24", url: "https://e-recht24.de", category: "Security", desc: "Impressum- und Datenschutz-Generator für deutsche Websites." },
  ],
  ch: [
    { name: "TWINT", url: "https://twint.ch", category: "Payments", desc: "Die Bezahl-App, die in der Schweiz alle nutzen." },
    { name: "Bexio", url: "https://bexio.com", category: "Product Metrics", desc: "Buchhaltung mit QR-Rechnung für Schweizer KMU." },
    { name: "startupticker.ch", url: "https://startupticker.ch", category: "Marketing", desc: "News aus der Schweizer Startup-Szene." },
  ],
  it: [
    { name: "Satispay", url: "https://satispay.com", category: "Payments", desc: "Pagamenti da smartphone amati in tutta Italia." },
    { name: "Fatture in Cloud", url: "https://fattureincloud.it", category: "Product Metrics", desc: "Fatturazione elettronica SDI senza pensieri." },
    { name: "StartupItalia", url: "https://startupitalia.eu", category: "Marketing", desc: "La testata di riferimento per l'innovazione italiana." },
  ],
  nl: [
    { name: "Mollie", url: "https://mollie.com", category: "Payments", desc: "iDEAL, kaarten en Klarna — gebouwd in Amsterdam." },
    { name: "Moneybird", url: "https://moneybird.nl", category: "Product Metrics", desc: "Boekhouding en facturen voor zzp'ers." },
    { name: "Frankwatching", url: "https://frankwatching.com", category: "Marketing", desc: "Hét platform voor online marketing in Nederland." },
  ],
  pl: [
    { name: "Przelewy24", url: "https://przelewy24.pl", category: "Payments", desc: "BLIK i przelewy online — standard w polskim e-commerce." },
    { name: "inFakt", url: "https://infakt.pl", category: "Product Metrics", desc: "Faktury i księgowość online zgodne z KSeF." },
    { name: "4programmers", url: "https://4programmers.net", category: "Community & Support", desc: "Polskie forum programistów od ponad 20 lat." },
  ],
  se: [
    { name: "Klarna", url: "https://klarna.com", category: "Payments", desc: "Svensk betalning som alla redan litar på." },
    { name: "Swish Handel", url: "https://swish.nu", category: "Payments", desc: "Ta betalt med Swish direkt i din webbshop." },
    { name: "Breakit", url: "https://breakit.se", category: "Marketing", desc: "Sveriges startup- och tekniknyheter." },
  ],
  jp: [
    { name: "PAY.JP", url: "https://pay.jp", category: "Payments", desc: "日本発のシンプルな決済API。個人開発にも。" },
    { name: "Zenn", url: "https://zenn.dev", category: "Community & Support", desc: "エンジニアのための技術記事コミュニティ。" },
    { name: "freee", url: "https://freee.co.jp", category: "Product Metrics", desc: "会計・請求書・インボイス制度にも対応。" },
  ],
  kr: [
    { name: "토스페이먼츠", url: "https://tosspayments.com", category: "Payments", desc: "카드·간편결제·계좌이체를 한 번에 연동해요." },
    { name: "포트원", url: "https://portone.io", category: "Payments", desc: "여러 PG사를 하나의 API로 연결해요." },
    { name: "디스콰이엇", url: "https://disquiet.io", category: "Community & Support", desc: "메이커들이 프로덕트를 공유하는 커뮤니티예요." },
  ],
  id: [
    { name: "Xendit", url: "https://xendit.co", category: "Payments", desc: "QRIS, e-wallet, dan VA dalam satu API." },
    { name: "Midtrans", url: "https://midtrans.com", category: "Payments", desc: "Gateway pembayaran andalan e-commerce Indonesia." },
    { name: "Kaskus", url: "https://kaskus.co.id", category: "Community & Support", desc: "Forum komunitas terbesar di Indonesia." },
  ],
  sa: [
    { name: "Moyasar", url: "https://moyasar.com", category: "Payments", desc: "بوابة دفع سعودية تدعم مدى وApple Pay وSTC Pay." },
    { name: "Tap Payments", url: "https://tap.company", category: "Payments", desc: "مدفوعات خليجية بواجهة برمجية سهلة." },
    { name: "منشآت", url: "https://monshaat.gov.sa", category: "Community & Support", desc: "الهيئة العامة للمنشآت الصغيرة والمتوسطة ودعم رواد الأعمال." },
  ],
  tr: [
    { name: "iyzico", url: "https://iyzico.com", category: "Payments", desc: "Taksitli ödeme dahil Türkiye'nin popüler ödeme altyapısı." },
    { name: "PayTR", url: "https://paytr.com", category: "Payments", desc: "Kolay entegrasyonlu sanal POS çözümü." },
    { name: "Webrazzi", url: "https://webrazzi.com", category: "Marketing", desc: "Türkiye'nin teknoloji ve girişim haberleri." },
  ],
};
