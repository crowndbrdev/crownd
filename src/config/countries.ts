/**
 * Single source of truth for every country edition of Crownd.
 *
 * Money is always stored in MINOR units (cents, or whole units for zero-decimal
 * currencies such as JPY/KRW). `minorExp` is the exponent Stripe expects.
 * Prices below are in MAJOR units and converted with `toMinor()`.
 */

export type Lang =
  | "en" | "ja" | "de" | "fr" | "it" | "pt" | "ko" | "es"
  | "id" | "nl" | "ar" | "tr" | "pl" | "sv";

export type Country = {
  /** URL segment: crownd.dev/{slug} */
  slug: string;
  /** ISO 3166-1 alpha-2 */
  iso: string;
  /** BCP 47 locale used for hreflang, <html lang> and Intl */
  locale: string;
  /** Optional Intl override (e.g. Latin digits for Arabic) */
  intlLocale?: string;
  lang: Lang;
  dir: "ltr" | "rtl";
  flag: string;
  nameEn: string;
  nameLocal: string;
  /** Local name of the edition, shown next to the logo */
  edition: string;
  currency: string;
  /** Stripe minor-unit exponent: 0 for zero-decimal currencies */
  minorExp: 0 | 2;
  /** Fraction digits shown in the UI */
  displayDigits: 0 | 2;
  /** Minimum bid and minimum raise step (major units) */
  minBid: number;
  /** Fixed price for a 24h highlight in Launches (major units) */
  launchHighlight: number;
  /** Fixed price for a 3-day highlight in Tools (major units) */
  toolHighlight: number;
  /** Rough value of 1 unit of currency in USD; only used for the global Crown Map */
  usdRate: number;
  timezone: string;
  /** Country accent, used on top of the global brand system */
  accent: { name: string; hex: string; ink: string; story: string };
  /** Typeface family stack key (see src/app/fonts.ts) */
  script: "latin" | "jp" | "kr" | "ar";
  /**
   * Methods local buyers expect, in order of preference. Stripe "dynamic payment
   * methods" decides what actually renders at checkout; methods Stripe cannot offer
   * for our merchant entity are covered by a local PSP (see docs/04-pagamentos.md).
   */
  paymentMethods: string[];
  /** Cooling-off period text basis for the rules page */
  withdrawalDays: number;
  /** Legal page mandated or customary locally */
  legalPage: { title: string; why: string };
  /** Search engines worth optimising for besides Google */
  searchEngines: string[];
  /** Where indie makers gather — used by the launch playbook */
  communities: string[];
  /** Culture notes that drove copy and design decisions */
  culture: string[];
};

export const COUNTRIES: Country[] = [
  {
    slug: "us", iso: "US", locale: "en-US", lang: "en", dir: "ltr", flag: "🇺🇸",
    nameEn: "United States", nameLocal: "United States", edition: "Crownd USA",
    currency: "USD", minorExp: 2, displayDigits: 0,
    minBid: 1, launchHighlight: 5, toolHighlight: 15, usdRate: 1,
    timezone: "America/New_York",
    accent: { name: "Main Street Neon", hex: "#FF3D57", ink: "#FFFFFF", story: "The neon of diner signs and Times Square: loud, competitive, unapologetic." },
    script: "latin",
    paymentMethods: ["card", "apple_pay", "google_pay", "link", "cashapp", "amazon_pay"],
    withdrawalDays: 0,
    legalPage: { title: "Terms & Refund Policy", why: "No federal cooling-off for digital goods; a clear refund policy reduces chargebacks." },
    searchEngines: ["Google", "Bing", "ChatGPT Search", "Perplexity"],
    communities: ["Hacker News (Show HN)", "Product Hunt", "Indie Hackers", "r/SideProject", "r/SaaS", "X/Twitter #buildinpublic", "BetaList"],
    culture: [
      "Competition is a feature, not a flaw: 'king of the hill' framing lands well.",
      "Direct CTAs ('Take #1 now') convert; brevity beats politeness.",
      "Social proof via numbers (MRR, users) is expected and celebrated.",
    ],
  },
  {
    slug: "jp", iso: "JP", locale: "ja-JP", lang: "ja", dir: "ltr", flag: "🇯🇵",
    nameEn: "Japan", nameLocal: "日本", edition: "Crownd 日本",
    currency: "JPY", minorExp: 0, displayDigits: 0,
    minBid: 150, launchHighlight: 750, toolHighlight: 2200, usdRate: 0.0066,
    timezone: "Asia/Tokyo",
    accent: { name: "Shu-iro 朱色", hex: "#E8452C", ink: "#FFFFFF", story: "The vermilion of torii gates and the hanko seal. The #1 badge is rendered as a red seal stamp." },
    script: "jp",
    paymentMethods: ["card", "konbini", "paypay", "apple_pay", "google_pay"],
    withdrawalDays: 0,
    legalPage: { title: "特定商取引法に基づく表記", why: "Required by the Act on Specified Commercial Transactions for any online seller to Japanese consumers." },
    searchEngines: ["Google", "Yahoo! JAPAN (Google-powered)", "Bing"],
    communities: ["Zenn", "Qiita", "note", "X (日本語圏 は非常に活発)", "個人開発 Discord", "Product Hunt JP"],
    culture: [
      "Polite, understated copy (です/ます). Avoid aggressive taunts; frame competition as 挑戦 (challenge).",
      "Rankings culture is strong (ランキング): show precise numbers and timestamps.",
      "Trust comes from complete information: show seller details and fees before payment.",
      "Konbini payment and PayPay matter: many users avoid cards online.",
    ],
  },
  {
    slug: "de", iso: "DE", locale: "de-DE", lang: "de", dir: "ltr", flag: "🇩🇪",
    nameEn: "Germany", nameLocal: "Deutschland", edition: "Crownd Deutschland",
    currency: "EUR", minorExp: 2, displayDigits: 0,
    minBid: 1, launchHighlight: 5, toolHighlight: 15, usdRate: 1.08,
    timezone: "Europe/Berlin",
    accent: { name: "Bauhaus Blau", hex: "#1D4ED8", ink: "#FFFFFF", story: "Bauhaus primaries and DIN signage: sachlich, structured, honest." },
    script: "latin",
    paymentMethods: ["card", "paypal", "klarna", "sepa_debit", "apple_pay", "google_pay"],
    withdrawalDays: 14,
    legalPage: { title: "Impressum & Datenschutz", why: "§5 DDG requires an Impressum; GDPR privacy notice is mandatory." },
    searchEngines: ["Google", "Bing", "Ecosia"],
    communities: ["t3n", "Gründerszene", "r/de_EDV", "German Indie Hackers (Discord)", "LinkedIn DACH", "XING"],
    culture: [
      "Precision and transparency over hype: explain the rules, fees and refunds plainly.",
      "Privacy is a trust signal: cookie-less analytics, EU hosting, no dark patterns.",
      "Formal 'Sie' for legal pages; 'du' is accepted in startup-scene UI copy.",
      "PayPal and Klarna are often preferred over cards.",
    ],
  },
  {
    slug: "uk", iso: "GB", locale: "en-GB", lang: "en", dir: "ltr", flag: "🇬🇧",
    nameEn: "United Kingdom", nameLocal: "United Kingdom", edition: "Crownd UK",
    currency: "GBP", minorExp: 2, displayDigits: 0,
    minBid: 1, launchHighlight: 4, toolHighlight: 12, usdRate: 1.27,
    timezone: "Europe/London",
    accent: { name: "Racing Green", hex: "#0F5C3A", ink: "#FFFFFF", story: "British racing green: pole position, heritage, quietly confident." },
    script: "latin",
    paymentMethods: ["card", "apple_pay", "google_pay", "paypal", "klarna", "pay_by_bank"],
    withdrawalDays: 14,
    legalPage: { title: "Terms, Refunds & Privacy (UK GDPR)", why: "Consumer Contracts Regulations 2013 give 14 days unless waived for immediate digital service." },
    searchEngines: ["Google", "Bing"],
    communities: ["Indie Hackers London", "r/UKstartups", "Product Hunt", "Hacker News", "X #buildinpublic"],
    culture: [
      "Dry, self-aware humour beats American hype ('Rather fancy the top spot?').",
      "British spelling (colour, favourite) is non-negotiable.",
      "Understatement: avoid superlatives and exclamation marks.",
    ],
  },
  {
    slug: "fr", iso: "FR", locale: "fr-FR", lang: "fr", dir: "ltr", flag: "🇫🇷",
    nameEn: "France", nameLocal: "France", edition: "Crownd France",
    currency: "EUR", minorExp: 2, displayDigits: 0,
    minBid: 1, launchHighlight: 5, toolHighlight: 15, usdRate: 1.08,
    timezone: "Europe/Paris",
    accent: { name: "Bleu Klein", hex: "#002FA7", ink: "#FFFFFF", story: "International Klein Blue: art, audacity and a touch of provocation." },
    script: "latin",
    paymentMethods: ["card", "cartes_bancaires", "paypal", "apple_pay", "google_pay", "sepa_debit"],
    withdrawalDays: 14,
    legalPage: { title: "Mentions légales & CGV", why: "LCEN requires mentions légales; CGV (conditions générales de vente) expected for any sale." },
    searchEngines: ["Google", "Bing", "Qwant"],
    communities: ["Indie Makers (FR)", "Station F community", "Maker's Club", "LinkedIn FR", "r/france", "Journal du Net"],
    culture: [
      "Elegant, witty copy; a little irony is welcome, but avoid anglicisms where a French word exists.",
      "Cartes Bancaires (CB) is the dominant card network; show the CB logo.",
      "'Tu' is fine for the startup scene; legal pages in 'vous'.",
    ],
  },
  {
    slug: "in", iso: "IN", locale: "en-IN", lang: "en", dir: "ltr", flag: "🇮🇳",
    nameEn: "India", nameLocal: "भारत · India", edition: "Crownd India",
    currency: "INR", minorExp: 2, displayDigits: 0,
    minBid: 99, launchHighlight: 399, toolHighlight: 999, usdRate: 0.012,
    timezone: "Asia/Kolkata",
    accent: { name: "Marigold", hex: "#FF8F1F", ink: "#1A1200", story: "Marigold garlands of festivals and launches: celebration as a ritual." },
    script: "latin",
    paymentMethods: ["card", "upi", "netbanking", "google_pay"],
    withdrawalDays: 0,
    legalPage: { title: "Terms, Refunds & Grievance Officer", why: "IT Rules 2021 / Consumer Protection (E-Commerce) Rules expect a grievance officer contact." },
    searchEngines: ["Google", "Bing"],
    communities: ["Indie Hackers India", "r/developersIndia", "r/StartUpIndia", "LinkedIn India", "X #buildinpublic", "Product Hunt"],
    culture: [
      "Price sensitivity is high: round '99' prices feel native (₹99, ₹399).",
      "Lakh/crore digit grouping (₹1,00,000) — handled by Intl en-IN.",
      "UPI is the default mental model of paying online.",
      "Cricket and jugaad references land well in copy.",
    ],
  },
  {
    slug: "it", iso: "IT", locale: "it-IT", lang: "it", dir: "ltr", flag: "🇮🇹",
    nameEn: "Italy", nameLocal: "Italia", edition: "Crownd Italia",
    currency: "EUR", minorExp: 2, displayDigits: 0,
    minBid: 1, launchHighlight: 5, toolHighlight: 15, usdRate: 1.08,
    timezone: "Europe/Rome",
    accent: { name: "Rosso Corsa", hex: "#D40000", ink: "#FFFFFF", story: "Racing red of the pole position: design, speed and passion." },
    script: "latin",
    paymentMethods: ["card", "paypal", "satispay", "apple_pay", "google_pay", "klarna"],
    withdrawalDays: 14,
    legalPage: { title: "Note legali, P.IVA & Privacy", why: "Italian law requires showing VAT number (P.IVA) and seller details on commercial sites." },
    searchEngines: ["Google", "Bing"],
    communities: ["Indie Hackers Italia", "Startup Italia", "r/ItalyInformatica", "LinkedIn IT", "Telegram dev groups"],
    culture: [
      "Design and aesthetics carry weight: the Italian edition uses more generous type.",
      "Warm, expressive copy; football metaphors (scudetto, pole position).",
      "PayPal and Satispay are widely trusted.",
    ],
  },
  {
    slug: "ca", iso: "CA", locale: "en-CA", lang: "en", dir: "ltr", flag: "🇨🇦",
    nameEn: "Canada", nameLocal: "Canada", edition: "Crownd Canada",
    currency: "CAD", minorExp: 2, displayDigits: 0,
    minBid: 1, launchHighlight: 7, toolHighlight: 20, usdRate: 0.73,
    timezone: "America/Toronto",
    accent: { name: "Aurora Teal", hex: "#0FA39A", ink: "#FFFFFF", story: "The northern lights over the Yukon: calm, wide, wonder." },
    script: "latin",
    paymentMethods: ["card", "apple_pay", "google_pay", "acss_debit", "paypal"],
    withdrawalDays: 0,
    legalPage: { title: "Terms, Privacy (PIPEDA) & Refunds", why: "PIPEDA governs personal data; Quebec Law 25 adds consent requirements." },
    searchEngines: ["Google", "Bing"],
    communities: ["r/canadastartups", "Toronto Tech", "Montreal NewTech", "Product Hunt", "BetaKit"],
    culture: [
      "Friendly and polite, less boastful than the US edition.",
      "Canadian spelling (colour, centre) with US vocabulary.",
      "Bilingual country: French copy ships in v2 as /ca-fr.",
    ],
  },
  {
    slug: "br", iso: "BR", locale: "pt-BR", lang: "pt", dir: "ltr", flag: "🇧🇷",
    nameEn: "Brazil", nameLocal: "Brasil", edition: "Crownd Brasil",
    currency: "BRL", minorExp: 2, displayDigits: 0,
    minBid: 5, launchHighlight: 20, toolHighlight: 50, usdRate: 0.18,
    timezone: "America/Sao_Paulo",
    accent: { name: "Verde Copa", hex: "#00A651", ink: "#FFFFFF", story: "The green of the Seleção jersey: torcida, festa and the hunger for the cup." },
    script: "latin",
    paymentMethods: ["pix", "card", "boleto"],
    withdrawalDays: 7,
    legalPage: { title: "Termos, Reembolso (CDC) & LGPD", why: "CDC art. 49 gives 7 days to cancel online purchases; LGPD governs personal data." },
    searchEngines: ["Google", "Bing"],
    communities: ["Comunidade indie hacker BR (X)", "TabNews", "r/brdev", "LinkedIn BR", "Discords de dev", "Grupos de WhatsApp/Telegram"],
    culture: [
      "Informal, zoeira-friendly copy; provocation works ('vai deixar o #1 pro outro?').",
      "Pix is THE payment method: QR code + copy-paste key, instant confirmation.",
      "Football rivalry framing (virada, gol, taça) fits the outbid mechanic.",
    ],
  },
  {
    slug: "kr", iso: "KR", locale: "ko-KR", lang: "ko", dir: "ltr", flag: "🇰🇷",
    nameEn: "South Korea", nameLocal: "대한민국", edition: "Crownd 코리아",
    currency: "KRW", minorExp: 0, displayDigits: 0,
    minBid: 1500, launchHighlight: 7000, toolHighlight: 20000, usdRate: 0.00072,
    timezone: "Asia/Seoul",
    accent: { name: "Lightstick Pink", hex: "#FF2E88", ink: "#FFFFFF", story: "Concert lightsticks and music-show 1위 trophies: fandom energy, real-time charts." },
    script: "kr",
    paymentMethods: ["card", "kakao_pay", "naver_pay", "samsung_pay", "payco"],
    withdrawalDays: 7,
    legalPage: { title: "이용약관 · 사업자정보 · 환불정책", why: "E-Commerce Act requires business registration info (사업자정보) on the site." },
    searchEngines: ["Naver", "Google", "Daum"],
    communities: ["디스콰이엇 (Disquiet)", "GeekNews (news.hada.io)", "OKKY", "Naver blogs/cafes", "X/Threads"],
    culture: [
      "Real-time chart culture (실시간 순위, 1위): live updates and rank-change arrows are expected.",
      "Naver is co-dominant with Google: publish on Naver Blog and register in Naver Search Advisor.",
      "Polite 해요체 copy, with playful fandom-style energy.",
      "KakaoPay / Naver Pay are default wallets.",
    ],
  },
  {
    slug: "au", iso: "AU", locale: "en-AU", lang: "en", dir: "ltr", flag: "🇦🇺",
    nameEn: "Australia", nameLocal: "Australia", edition: "Crownd Australia",
    currency: "AUD", minorExp: 2, displayDigits: 0,
    minBid: 2, launchHighlight: 8, toolHighlight: 22, usdRate: 0.66,
    timezone: "Australia/Sydney",
    accent: { name: "Outback Ochre", hex: "#D9622B", ink: "#FFFFFF", story: "Red earth of the outback at sunset: rugged, sunny, laid-back." },
    script: "latin",
    paymentMethods: ["card", "afterpay_clearpay", "apple_pay", "google_pay", "au_becs_debit"],
    withdrawalDays: 0,
    legalPage: { title: "Terms, Refunds (ACL) & Privacy", why: "Australian Consumer Law guarantees cannot be excluded by terms." },
    searchEngines: ["Google", "Bing"],
    communities: ["r/AusStartups", "Startup Daily", "Indie Hackers AU meetups", "LinkedIn AU", "Product Hunt"],
    culture: [
      "Laid-back, cheeky copy ('Fancy a crack at #1, mate?') without trying too hard.",
      "Tall-poppy syndrome: celebrate the underdog taking the crown.",
      "Afterpay is culturally mainstream.",
    ],
  },
  {
    slug: "es", iso: "ES", locale: "es-ES", lang: "es", dir: "ltr", flag: "🇪🇸",
    nameEn: "Spain", nameLocal: "España", edition: "Crownd España",
    currency: "EUR", minorExp: 2, displayDigits: 0,
    minBid: 1, launchHighlight: 5, toolHighlight: 15, usdRate: 1.08,
    timezone: "Europe/Madrid",
    accent: { name: "Azulejo", hex: "#1F5FAE", ink: "#FFFFFF", story: "Glazed azulejo tiles of Sevilla and Valencia: craft, colour, sunlight." },
    script: "latin",
    paymentMethods: ["card", "bizum", "paypal", "apple_pay", "google_pay", "klarna"],
    withdrawalDays: 14,
    legalPage: { title: "Aviso legal, Condiciones & Privacidad", why: "LSSI-CE requires an aviso legal with company details." },
    searchEngines: ["Google", "Bing"],
    communities: ["Indie Hackers España", "r/programacion", "Malt / LinkedIn ES", "Startups Spain (Slack)", "X #buildinpublic"],
    culture: [
      "Peninsular Spanish: 'vosotros', 'ordenador', 'móvil'.",
      "Close and humorous copy; football (LaLiga) rivalry metaphors.",
      "Bizum is the everyday P2P payment habit.",
    ],
  },
  {
    slug: "mx", iso: "MX", locale: "es-MX", lang: "es", dir: "ltr", flag: "🇲🇽",
    nameEn: "Mexico", nameLocal: "México", edition: "Crownd México",
    currency: "MXN", minorExp: 2, displayDigits: 0,
    minBid: 20, launchHighlight: 99, toolHighlight: 290, usdRate: 0.055,
    timezone: "America/Mexico_City",
    accent: { name: "Rosa Mexicano", hex: "#E4007C", ink: "#FFFFFF", story: "The rosa mexicano of Barragán walls and papel picado: bold and festive." },
    script: "latin",
    paymentMethods: ["card", "oxxo", "spei", "mercadopago", "apple_pay"],
    withdrawalDays: 5,
    legalPage: { title: "Aviso de privacidad & Términos", why: "LFPDPPP requires an aviso de privacidad; PROFECO oversees consumer rights." },
    searchEngines: ["Google", "Bing"],
    communities: ["Indie Hackers México", "r/mexico dev threads", "Startup México", "LinkedIn MX", "Platzi community"],
    culture: [
      "Latin American Spanish: 'ustedes', 'computadora', 'celular'; '¿Qué onda?' tone.",
      "OXXO cash vouchers matter for the unbanked; SPEI for transfers.",
      "Lucha libre / champion's belt metaphors for taking the crown.",
    ],
  },
  {
    slug: "id", iso: "ID", locale: "id-ID", lang: "id", dir: "ltr", flag: "🇮🇩",
    nameEn: "Indonesia", nameLocal: "Indonesia", edition: "Crownd Indonesia",
    currency: "IDR", minorExp: 2, displayDigits: 0,
    minBid: 15000, launchHighlight: 79000, toolHighlight: 229000, usdRate: 0.000063,
    timezone: "Asia/Jakarta",
    accent: { name: "Indigo Batik", hex: "#3B3BB3", ink: "#FFFFFF", story: "Indigo-dyed batik of Java: patience, pattern, craft." },
    script: "latin",
    paymentMethods: ["card", "qris", "gopay", "ovo", "dana", "bank_transfer"],
    withdrawalDays: 0,
    legalPage: { title: "Syarat & Ketentuan, Kebijakan Privasi (UU PDP)", why: "Personal Data Protection Law (UU PDP) in force since 2024." },
    searchEngines: ["Google", "Bing"],
    communities: ["Indie Hackers Indonesia", "Kaskus", "r/indonesia", "Telegram dev groups", "LinkedIn ID", "TikTok tech creators"],
    culture: [
      "Friendly, casual Bahasa ('kamu'), with English tech loanwords that locals actually use.",
      "Mobile-first: most traffic is Android, often on slow networks.",
      "QRIS and e-wallets (GoPay, OVO, DANA) beat cards.",
    ],
  },
  {
    slug: "nl", iso: "NL", locale: "nl-NL", lang: "nl", dir: "ltr", flag: "🇳🇱",
    nameEn: "Netherlands", nameLocal: "Nederland", edition: "Crownd Nederland",
    currency: "EUR", minorExp: 2, displayDigits: 0,
    minBid: 1, launchHighlight: 5, toolHighlight: 15, usdRate: 1.08,
    timezone: "Europe/Amsterdam",
    accent: { name: "Oranje", hex: "#FF6B00", ink: "#1A0A00", story: "Koningsdag orange: the whole country in one colour, wearing the crown." },
    script: "latin",
    paymentMethods: ["ideal", "card", "paypal", "klarna", "apple_pay"],
    withdrawalDays: 14,
    legalPage: { title: "Algemene voorwaarden & Privacy (AVG)", why: "Dutch consumers expect algemene voorwaarden; AVG = GDPR." },
    searchEngines: ["Google", "Bing"],
    communities: ["Dutch Indie Hackers", "Frankwatching", "r/thenetherlands", "LinkedIn NL", "Emerce"],
    culture: [
      "Direct, no-nonsense tone ('Doe normaal'); clarity over flattery.",
      "iDEAL is the default way to pay online (>70% of e-commerce).",
      "Orange + 'Koning(in)' wordplay fits the crown concept perfectly.",
    ],
  },
  {
    slug: "sa", iso: "SA", locale: "ar-SA", intlLocale: "ar-SA-u-nu-latn", lang: "ar", dir: "rtl", flag: "🇸🇦",
    nameEn: "Saudi Arabia", nameLocal: "السعودية", edition: "Crownd السعودية",
    currency: "SAR", minorExp: 2, displayDigits: 0,
    minBid: 5, launchHighlight: 19, toolHighlight: 55, usdRate: 0.27,
    timezone: "Asia/Riyadh",
    accent: { name: "Palm Green & Sand", hex: "#0B7A4B", ink: "#FFFFFF", story: "Palm green over desert sand: heritage meeting Vision 2030 ambition." },
    script: "ar",
    paymentMethods: ["card", "mada", "apple_pay", "stc_pay", "tabby"],
    withdrawalDays: 7,
    legalPage: { title: "الشروط والأحكام وسياسة الاسترجاع", why: "Saudi E-Commerce Law (2019) requires seller identity and 7-day return info." },
    searchEngines: ["Google", "Bing"],
    communities: ["Monsha'at community", "Saudi tech X (very active)", "Snapchat (high reach)", "LinkedIn KSA", "Tuwaiq Academy alumni"],
    culture: [
      "Full RTL layout; Arabic-Indic digits are optional — Western digits are common online.",
      "Respectful, aspirational copy tied to ambition and excellence; avoid crude taunts.",
      "Apple Pay and mada debit cards dominate; Ramadan and Saudi National Day (23 Sep) are key moments.",
    ],
  },
  {
    slug: "tr", iso: "TR", locale: "tr-TR", lang: "tr", dir: "ltr", flag: "🇹🇷",
    nameEn: "Türkiye", nameLocal: "Türkiye", edition: "Crownd Türkiye",
    currency: "TRY", minorExp: 2, displayDigits: 0,
    minBid: 40, launchHighlight: 199, toolHighlight: 549, usdRate: 0.025,
    timezone: "Europe/Istanbul",
    accent: { name: "Turkuaz", hex: "#0FA3B1", ink: "#00191B", story: "Turquoise of İznik tiles — a colour literally named after Türkiye." },
    script: "latin",
    paymentMethods: ["card", "apple_pay", "google_pay"],
    withdrawalDays: 14,
    legalPage: { title: "Mesafeli Satış Sözleşmesi & KVKK", why: "Distance-sales contract and KVKK data-protection notice are expected." },
    searchEngines: ["Google", "Yandex", "Bing"],
    communities: ["Webrazzi", "r/Turkey tech", "Kodlama Discord", "LinkedIn TR", "Ekşi Sözlük"],
    culture: [
      "High inflation: show prices clearly and refresh minimums often.",
      "Warm, energetic copy; football rivalry (derbi) references resonate.",
      "Instalments (taksit) are a cultural expectation for larger amounts.",
    ],
  },
  {
    slug: "ch", iso: "CH", locale: "de-CH", lang: "de", dir: "ltr", flag: "🇨🇭",
    nameEn: "Switzerland", nameLocal: "Schweiz · Suisse · Svizzera", edition: "Crownd Schweiz",
    currency: "CHF", minorExp: 2, displayDigits: 0,
    minBid: 1, launchHighlight: 5, toolHighlight: 15, usdRate: 1.13,
    timezone: "Europe/Zurich",
    accent: { name: "Swiss Red", hex: "#DA291C", ink: "#FFFFFF", story: "The red of Swiss Style posters: strict grid, Helvetica, precision." },
    script: "latin",
    paymentMethods: ["twint", "card", "postfinance", "paypal", "apple_pay"],
    withdrawalDays: 0,
    legalPage: { title: "Impressum & Datenschutz (revDSG)", why: "UWG requires clear seller identity; revised FADP (revDSG) since 2023." },
    searchEngines: ["Google", "Bing"],
    communities: ["Swiss Startup Association", "startupticker.ch", "r/Switzerland", "LinkedIn CH", "Impact Hub Zürich"],
    culture: [
      "Swiss German spelling: never 'ß', always 'ss'; 'Franken', not 'Euro'.",
      "Prices formatted CHF 1’000 with apostrophe grouping (Intl de-CH).",
      "TWINT is the everyday payment app.",
      "Multilingual: DE first, FR/IT editions as /ch-fr and /ch-it in v2.",
    ],
  },
  {
    slug: "pl", iso: "PL", locale: "pl-PL", lang: "pl", dir: "ltr", flag: "🇵🇱",
    nameEn: "Poland", nameLocal: "Polska", edition: "Crownd Polska",
    currency: "PLN", minorExp: 2, displayDigits: 0,
    minBid: 5, launchHighlight: 20, toolHighlight: 59, usdRate: 0.25,
    timezone: "Europe/Warsaw",
    accent: { name: "Bursztyn", hex: "#E07B00", ink: "#1A0E00", story: "Baltic amber from Gdańsk, the world's amber capital: warm, precious, old." },
    script: "latin",
    paymentMethods: ["blik", "p24", "card", "apple_pay", "google_pay"],
    withdrawalDays: 14,
    legalPage: { title: "Regulamin & Polityka prywatności (RODO)", why: "Polish law requires a 'regulamin' for electronic services (UŚUDE)." },
    searchEngines: ["Google", "Bing"],
    communities: ["Wykop", "r/Polska", "4programmers.net", "LinkedIn PL", "Polish Indie Hackers (FB)", "Product Hunt"],
    culture: [
      "BLIK is the national habit: 6-digit code from the banking app.",
      "Strong developer culture: technical depth earns respect.",
      "Copy can be ironic and self-deprecating; avoid sounding salesy.",
    ],
  },
  {
    slug: "se", iso: "SE", locale: "sv-SE", lang: "sv", dir: "ltr", flag: "🇸🇪",
    nameEn: "Sweden", nameLocal: "Sverige", edition: "Crownd Sverige",
    currency: "SEK", minorExp: 2, displayDigits: 0,
    minBid: 10, launchHighlight: 55, toolHighlight: 159, usdRate: 0.095,
    timezone: "Europe/Stockholm",
    accent: { name: "Falu Röd", hex: "#9E2A20", ink: "#FFFFFF", story: "Falu red of countryside stugor: humble, warm, lagom." },
    script: "latin",
    paymentMethods: ["swish", "klarna", "card", "apple_pay", "google_pay"],
    withdrawalDays: 14,
    legalPage: { title: "Villkor, Ångerrätt & Integritet (GDPR)", why: "Distansavtalslagen gives 14-day ångerrätt; GDPR applies." },
    searchEngines: ["Google", "Bing"],
    communities: ["Breakit", "r/sweden tech", "Stockholm Tech Meetup", "LinkedIn SE", "SUP46"],
    culture: [
      "Lagom and Jantelagen: humble framing — 'take your turn at the top' rather than 'crush them'.",
      "Swish and Klarna are national habits (Klarna is Swedish).",
      "Minimalist design and sustainability signals build trust.",
    ],
  },
  // ── Expansion (Nov 2026): markets that reuse an existing language, so copy stays native ──
  {
    slug: "pt", iso: "PT", locale: "pt-PT", lang: "pt", dir: "ltr", flag: "🇵🇹",
    nameEn: "Portugal", nameLocal: "Portugal", edition: "Crownd Portugal",
    currency: "EUR", minorExp: 2, displayDigits: 0,
    minBid: 1, launchHighlight: 5, toolHighlight: 15, usdRate: 1.08,
    timezone: "Europe/Lisbon",
    accent: { name: "Cortiça", hex: "#A0714F", ink: "#FFFFFF", story: "Portugal produces half of the world's cork: warm, natural, made to last." },
    script: "latin",
    paymentMethods: ["mbway", "multibanco", "card", "apple_pay"],
    withdrawalDays: 14,
    legalPage: { title: "Termos, Livro de Reclamações & RGPD", why: "Online sellers must link the Livro de Reclamações Eletrónico (DL 74/2017); the 14-day withdrawal right comes from DL 24/2014; GDPR applies." },
    searchEngines: ["Google", "Bing"],
    communities: ["Startup Portugal", "r/devpt", "LinkedIn Portugal", "Comunidade Web Summit (Lisboa)", "Porto Tech Hub", "X #buildinpublic"],
    culture: [
      "European Portuguese, not Brazilian: 'tu', 'ecrã', 'telemóvel', 'registo'; a calmer, more understated tone.",
      "MB WAY and Multibanco are the default ways to pay online.",
      "Lisbon became a startup hub (Web Summit): ambition with a sense of humour.",
    ],
  },
  {
    slug: "ar", iso: "AR", locale: "es-AR", lang: "es", dir: "ltr", flag: "🇦🇷",
    nameEn: "Argentina", nameLocal: "Argentina", edition: "Crownd Argentina",
    currency: "ARS", minorExp: 2, displayDigits: 0,
    minBid: 1500, launchHighlight: 7500, toolHighlight: 20000, usdRate: 0.0007,
    timezone: "America/Argentina/Buenos_Aires",
    accent: { name: "Malbec", hex: "#6D1A36", ink: "#FFFFFF", story: "The Malbec of Mendoza: deep, intense, a national pride." },
    script: "latin",
    paymentMethods: ["mercadopago", "card", "bank_transfer"],
    withdrawalDays: 10,
    legalPage: { title: "Términos, Botón de Arrepentimiento & Datos Personales", why: "Ley 24.240 gives 10 days to revoke online purchases and Res. 424/2020 requires a visible 'botón de arrepentimiento'; Ley 25.326 governs personal data." },
    searchEngines: ["Google", "Bing"],
    communities: ["r/devsarg", "Indie Hackers Argentina", "LinkedIn Argentina", "Comunidades de Discord y Telegram", "X #buildinpublic"],
    culture: [
      "Voseo is mandatory: 'pegá', 'elegí', 'vos'. Tú-forms sound foreign.",
      "Mercado Pago is the default wallet; inflation makes prices feel volatile, so keep them round.",
      "Football rivalry and 'la gambeta' fit the outbid mechanic.",
    ],
  },
  {
    slug: "co", iso: "CO", locale: "es-CO", lang: "es", dir: "ltr", flag: "🇨🇴",
    nameEn: "Colombia", nameLocal: "Colombia", edition: "Crownd Colombia",
    currency: "COP", minorExp: 2, displayDigits: 0,
    minBid: 5000, launchHighlight: 20000, toolHighlight: 60000, usdRate: 0.00025,
    timezone: "America/Bogota",
    accent: { name: "Esmeralda", hex: "#00876A", ink: "#FFFFFF", story: "Colombian emeralds, the most prized in the world: rare green brilliance." },
    script: "latin",
    paymentMethods: ["pse", "nequi", "card", "bank_transfer"],
    withdrawalDays: 5,
    legalPage: { title: "Términos, Derecho de Retracto & Habeas Data", why: "Ley 1480 de 2011 (5 business days of retracto for distance sales) and Ley 1581 de 2012 (habeas data) apply." },
    searchEngines: ["Google", "Bing"],
    communities: ["Platzi community", "r/Colombia (tech threads)", "LinkedIn Colombia", "Comunidades de Discord dev", "X #buildinpublic"],
    culture: [
      "Warm, polite Spanish; 'tú' works for tech audiences, 'parce' for a friendly wink.",
      "PSE and Nequi are how people pay online.",
      "Coffee and emerald metaphors: quality that is earned.",
    ],
  },
  {
    slug: "cl", iso: "CL", locale: "es-CL", lang: "es", dir: "ltr", flag: "🇨🇱",
    nameEn: "Chile", nameLocal: "Chile", edition: "Crownd Chile",
    currency: "CLP", minorExp: 0, displayDigits: 0,
    minBid: 1000, launchHighlight: 5000, toolHighlight: 15000, usdRate: 0.00105,
    timezone: "America/Santiago",
    accent: { name: "Lapislázuli", hex: "#2C5AA0", ink: "#FFFFFF", story: "Chile is one of the world's only sources of lapis lazuli: deep Andean blue." },
    script: "latin",
    paymentMethods: ["webpay", "card", "bank_transfer"],
    withdrawalDays: 10,
    legalPage: { title: "Términos, Derecho a Retracto & Datos Personales", why: "Ley 19.496 grants 10 days of retracto for online purchases unless excluded upfront; Ley 19.628 governs personal data." },
    searchEngines: ["Google", "Bing"],
    communities: ["Start-Up Chile community", "r/chile (tech threads)", "LinkedIn Chile", "Comunidades de Discord dev", "X #buildinpublic"],
    culture: [
      "Chilean Spanish ('al tiro', 'bacán') used sparingly; tú-forms.",
      "Webpay is the default checkout; CLP has no decimals.",
      "Start-Up Chile made founders proud of building from Santiago.",
    ],
  },
  {
    slug: "sg", iso: "SG", locale: "en-SG", lang: "en", dir: "ltr", flag: "🇸🇬",
    nameEn: "Singapore", nameLocal: "Singapore", edition: "Crownd Singapore",
    currency: "SGD", minorExp: 2, displayDigits: 0,
    minBid: 2, launchHighlight: 7, toolHighlight: 20, usdRate: 0.75,
    timezone: "Asia/Singapore",
    accent: { name: "Peranakan Jade", hex: "#2E8B7A", ink: "#FFFFFF", story: "The jade of Peranakan tiles and shophouses: heritage meets precision." },
    script: "latin",
    paymentMethods: ["card", "paynow", "grabpay", "apple_pay"],
    withdrawalDays: 0,
    legalPage: { title: "Terms & PDPA Privacy Notice", why: "The PDPA 2012 governs personal data; consumer rights fall under the CPFTA." },
    searchEngines: ["Google", "Bing"],
    communities: ["Indie Hackers Singapore", "r/singapore (tech threads)", "Tech in Asia community", "LinkedIn Singapore", "X #buildinpublic"],
    culture: [
      "Kiasu (fear of missing out) is a cultural meme: competition framing lands.",
      "A light touch of Singlish ('chope', 'bojio') reads as local, not forced.",
      "PayNow QR is how people pay each other.",
    ],
  },
  {
    slug: "ae", iso: "AE", locale: "en-AE", lang: "en", dir: "ltr", flag: "🇦🇪",
    nameEn: "United Arab Emirates", nameLocal: "UAE", edition: "Crownd UAE",
    currency: "AED", minorExp: 2, displayDigits: 0,
    minBid: 5, launchHighlight: 19, toolHighlight: 55, usdRate: 0.272,
    timezone: "Asia/Dubai",
    accent: { name: "Desert Rose", hex: "#C46A5A", ink: "#FFFFFF", story: "The desert rose crystals of the Arabian sands: beauty formed under pressure." },
    script: "latin",
    paymentMethods: ["card", "apple_pay", "tabby", "google_pay"],
    withdrawalDays: 0,
    legalPage: { title: "Terms & Privacy (PDPL)", why: "Federal Decree-Law 45/2021 (PDPL) governs personal data; consumer rights under Federal Law 15/2020." },
    searchEngines: ["Google", "Bing"],
    communities: ["Dubai startup community (LinkedIn)", "Hub71 (Abu Dhabi)", "Dubai Internet City", "r/dubai (tech threads)", "X #buildinpublic"],
    culture: [
      "English is the business language; ambition and 'first/biggest' framing are welcome.",
      "Cards and Apple Pay dominate; Tabby for instalments.",
      "Mind Ramadan timing for launches and campaigns.",
    ],
  },
  {
    slug: "ie", iso: "IE", locale: "en-IE", lang: "en", dir: "ltr", flag: "🇮🇪",
    nameEn: "Ireland", nameLocal: "Ireland · Éire", edition: "Crownd Ireland",
    currency: "EUR", minorExp: 2, displayDigits: 0,
    minBid: 1, launchHighlight: 5, toolHighlight: 15, usdRate: 1.08,
    timezone: "Europe/Dublin",
    accent: { name: "Atlantic Slate", hex: "#3C5A6B", ink: "#FFFFFF", story: "Irish slate under Atlantic skies: weathered, honest, built to last." },
    script: "latin",
    paymentMethods: ["card", "apple_pay", "google_pay", "revolut_pay"],
    withdrawalDays: 14,
    legalPage: { title: "Terms & Privacy Notice (GDPR)", why: "GDPR and the Consumer Rights Act 2022 (14-day withdrawal for distance contracts) apply." },
    searchEngines: ["Google", "Bing"],
    communities: ["Dogpatch Labs community", "r/ireland (tech threads)", "Indie Hackers Dublin", "LinkedIn Ireland", "X #buildinpublic"],
    culture: [
      "Understated humour beats hype: 'grand', 'fair play'.",
      "Dublin is Europe's tech HQ city: international audience, local pride.",
      "Revolut and Apple Pay are everyday payment habits.",
    ],
  },
  {
    slug: "ph", iso: "PH", locale: "en-PH", lang: "en", dir: "ltr", flag: "🇵🇭",
    nameEn: "Philippines", nameLocal: "Pilipinas · Philippines", edition: "Crownd Philippines",
    currency: "PHP", minorExp: 2, displayDigits: 0,
    minBid: 50, launchHighlight: 250, toolHighlight: 750, usdRate: 0.0172,
    timezone: "Asia/Manila",
    accent: { name: "Ube", hex: "#6B3FA0", ink: "#FFFFFF", story: "Ube, the purple yam behind the country's favourite desserts: sweet, bold, unmistakably Filipino." },
    script: "latin",
    paymentMethods: ["gcash", "maya", "card", "bank_transfer"],
    withdrawalDays: 0,
    legalPage: { title: "Terms & Privacy Notice (Data Privacy Act)", why: "RA 10173 (Data Privacy Act) and the Internet Transactions Act of 2023 apply to online sellers." },
    searchEngines: ["Google", "Bing"],
    communities: ["r/PinoyProgrammer", "Indie Hackers PH", "Developers Connect PH", "LinkedIn Philippines", "Facebook dev groups"],
    culture: [
      "Taglish copy ('Ikaw na!') feels natural; Facebook-first social habits.",
      "GCash and Maya are how people pay online.",
      "A huge freelancer and remote-maker community, globally minded.",
    ],
  },
  {
    slug: "nz", iso: "NZ", locale: "en-NZ", lang: "en", dir: "ltr", flag: "🇳🇿",
    nameEn: "New Zealand", nameLocal: "Aotearoa · New Zealand", edition: "Crownd New Zealand",
    currency: "NZD", minorExp: 2, displayDigits: 0,
    minBid: 2, launchHighlight: 8, toolHighlight: 25, usdRate: 0.59,
    timezone: "Pacific/Auckland",
    accent: { name: "Pōhutukawa", hex: "#B8223A", ink: "#FFFFFF", story: "The pōhutukawa, New Zealand's Christmas tree: crimson blooms on the coast." },
    script: "latin",
    paymentMethods: ["card", "apple_pay", "google_pay", "afterpay_clearpay"],
    withdrawalDays: 0,
    legalPage: { title: "Terms & Privacy (Privacy Act 2020)", why: "The Privacy Act 2020 and the Consumer Guarantees Act apply to online sellers." },
    searchEngines: ["Google", "Bing"],
    communities: ["Indie Hackers NZ", "r/newzealand (tech threads)", "Creative HQ community", "LinkedIn NZ", "X #buildinpublic"],
    culture: [
      "Understated, friendly ('Kia ora', 'sweet as'); tall-poppy wariness means no bragging.",
      "Cards and Afterpay are everyday checkout habits.",
      "Small market, global ambition: 'built in NZ, sold to the world'.",
    ],
  },
  {
    slug: "za", iso: "ZA", locale: "en-ZA", lang: "en", dir: "ltr", flag: "🇿🇦",
    nameEn: "South Africa", nameLocal: "South Africa", edition: "Crownd South Africa",
    currency: "ZAR", minorExp: 2, displayDigits: 0,
    minBid: 20, launchHighlight: 90, toolHighlight: 270, usdRate: 0.055,
    timezone: "Africa/Johannesburg",
    accent: { name: "King Protea", hex: "#D46A86", ink: "#FFFFFF", story: "The king protea, the national flower: resilient beauty from the fynbos." },
    script: "latin",
    paymentMethods: ["card", "snapscan", "bank_transfer", "apple_pay"],
    withdrawalDays: 7,
    legalPage: { title: "Terms, POPIA Notice & ECTA Disclosures", why: "ECTA s43 requires supplier disclosures online and s44 a 7-day cooling-off; POPIA governs personal data." },
    searchEngines: ["Google", "Bing"],
    communities: ["Silicon Cape community", "r/southafrica (tech threads)", "Indie Hackers South Africa", "LinkedIn South Africa", "X #buildinpublic"],
    culture: [
      "Warm, playful English with local flavour ('lekker', 'boet').",
      "Cards and SnapScan QR for payments; EFT for B2B.",
      "Resilient founder culture: building through constraints.",
    ],
  },
];

export const COUNTRY_BY_SLUG = Object.fromEntries(COUNTRIES.map((c) => [c.slug, c])) as Record<string, Country>;

export function getCountry(slug: string): Country | undefined {
  return COUNTRY_BY_SLUG[slug.toLowerCase()];
}

export function toMinor(major: number, c: Pick<Country, "minorExp">): number {
  return Math.round(major * 10 ** c.minorExp);
}

export function fromMinor(minor: number, c: Pick<Country, "minorExp">): number {
  return minor / 10 ** c.minorExp;
}

export function formatMoney(minor: number, c: Country, opts: { compact?: boolean } = {}): string {
  return new Intl.NumberFormat(c.intlLocale ?? c.locale, {
    style: "currency",
    currency: c.currency,
    minimumFractionDigits: c.displayDigits,
    maximumFractionDigits: c.displayDigits,
    notation: opts.compact ? "compact" : "standard",
  }).format(fromMinor(minor, c));
}

export function formatNumber(n: number, c: Country): string {
  return new Intl.NumberFormat(c.intlLocale ?? c.locale).format(n);
}

/** Excluded on purpose — documented in docs/03-paises.md */
export const EXCLUDED = [
  { name: "China", reason: "Google is blocked (Baidu dominates); ICP licence required; Stripe cannot onboard merchants for CN consumers at scale." },
  { name: "Russia", reason: "International sanctions: Visa/Mastercard/Stripe unavailable; legal and reputational risk." },
];

/** Next wave once the first 20 are live */
export const WAVE_2 = ["Taiwan", "Belgium", "Austria", "Norway", "Denmark", "Israel", "Peru", "Vietnam", "Nigeria", "Egypt"];
