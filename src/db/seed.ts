import type { DrizzleD1Database } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import { COUNTRIES, toMinor } from "@/config/countries";
import { dayKey } from "@/lib/time";
import { slugify } from "@/lib/slug";

/**
 * DEV-ONLY demo data. Every product is fictional and uses the reserved
 * `.example` TLD (RFC 2606), so no demo link can ever hit a real site.
 * Disabled in production and with SEED_DEMO=0.
 */
const DEMO: Record<string, [string, string][]> = {
  us: [["Shipyard", "Ship your SaaS boilerplate in a weekend"], ["Inboxer", "Cold email that doesn't feel cold"], ["Tally Ho", "Invoices freelancers actually enjoy"], ["Pagecraft", "Landing pages from a single prompt"], ["Uptimely", "Status pages with zero config"], ["Mapleleaf CRM", "A CRM for two-person teams"]],
  jp: [["Kaizen Notes", "毎日1%ずつ良くなるメモアプリ"], ["Hanko Sign", "オンラインで印鑑付きの電子契約"], ["Bento Forms", "弁当箱みたいに整ったフォーム作成"], ["Tsumiki", "積み木感覚でつくるノーコードDB"], ["Koban Pay", "個人開発者のための請求書ツール"], ["Shiori", "読んだ記事を一瞬で整理"]],
  de: [["Ordnung", "Belege automatisch sortiert"], ["Feierabend", "Zeiterfassung, die um 17 Uhr Schluss macht"], ["Bauplan", "Projektpläne im Bauhaus-Stil"], ["Datenschutzklar", "DSGVO-Checks für deine Website"], ["Kleingeld", "Abo-Tracker für Freelancer"], ["Mahlzeit", "Kantinenplan als App"]],
  uk: [["Cuppa", "Standups over a proper brew"], ["Queue", "Waitlists done politely"], ["Brolly", "Uptime alerts before it rains"], ["Ledgerly", "Bookkeeping for sole traders"], ["Postbox", "Newsletters with British restraint"], ["Kettle", "Async team check-ins"]],
  fr: [["Croissant", "Le CRM qui se lève tôt"], ["Facturo", "Factures conformes en deux clics"], ["Atelier", "Portfolios élégants pour créatifs"], ["Boussole", "Analytics sans cookies"], ["Rendez-vous", "Prise de rendez-vous pour indépendants"], ["Bistro OS", "Caisse pour petits restaurants"]],
  in: [["Chai Desk", "Helpdesk built for Indian SMBs"], ["Jugaad AI", "Automate the boring office work"], ["Kirana Cloud", "Inventory for neighbourhood stores"], ["GSTify", "GST invoices in one tap"], ["Cricket Score API", "Live scores for your app"], ["Rangoli UI", "Colourful component kit"]],
  it: [["Espresso", "Report rapidi per il tuo SaaS"], ["Bottega", "E-commerce per artigiani"], ["Fattura Facile", "Fatturazione elettronica senza stress"], ["Piazza", "Community per la tua app"], ["Vespa Deploy", "Deploy veloce come uno scooter"], ["Nonna Recipes", "Ricettario condiviso di famiglia"]],
  ca: [["Northstar", "OKRs for small remote teams"], ["Toque", "Recipe costing for restaurants"], ["Portage", "Move your data between tools"], ["Loonie", "Expense splitting for roommates"], ["Aurora Logs", "Log search that just works"], ["Timbit", "Tiny habit tracker"]],
  br: [["Pixzinho", "Cobrança por Pix em um link"], ["Cafezinho CRM", "CRM simples para pequenos negócios"], ["Jeitinho AI", "Automação de tarefas chatas"], ["Nota Fácil", "Emissão de nota fiscal sem dor"], ["Feirinha", "Loja virtual para feirantes"], ["Golaço", "Analytics para criadores"]],
  kr: [["Hangul Note", "한글로 쓰는 AI 노트"], ["Banchan", "작은 기능들을 모은 생산성 앱"], ["Chingu", "개발자 커뮤니티 플랫폼"], ["Ppalli Deploy", "빨리빨리 배포 도구"], ["Seoul Forms", "예쁜 설문조사 만들기"], ["Daebak Shop", "1인 셀러를 위한 쇼핑몰"]],
  au: [["Barbie", "Event planning for backyard BBQs"], ["Arvo", "Afternoon digest of your metrics"], ["Swag", "Merch store for creators"], ["Ute", "Logistics for small couriers"], ["Reef Monitor", "Uptime checks from Sydney"], ["Brekkie", "Morning standups, async"]],
  es: [["Siesta", "Programa tus emails a la hora perfecta"], ["Tapas UI", "Componentes pequeños y sabrosos"], ["Factura.ya", "Facturas en segundos"], ["Plaza Mayor", "Marketplace para artesanos"], ["Flamenco", "Animaciones web con ritmo"], ["Paella Planner", "Planificador de equipos"]],
  mx: [["Taquito", "Cobros por link para tu changarro"], ["Lucha CRM", "El CRM que pelea por tus ventas"], ["Fiesta Forms", "Formularios bien coloridos"], ["Nopal Analytics", "Métricas sin complicaciones"], ["Chamba", "Bolsa de trabajo para devs"], ["Mezcal Mail", "Newsletters con sabor"]],
  id: [["Warung OS", "Kasir digital untuk warung"], ["Gotong", "Kolaborasi tim tanpa ribet"], ["Batik UI", "Komponen UI bermotif"], ["Ojek Route", "Optimasi rute kurir"], ["Kopi Analytics", "Analitik sederhana untuk UMKM"], ["Sambal Bot", "Chatbot pedas untuk tokomu"]],
  nl: [["Gezellig", "Teamchat zonder ruis"], ["Fietsplan", "Routeplanner voor koeriers"], ["Stroopwafel", "Feedbackwidget in lagen"], ["Boekhouder", "Boekhouding voor zzp'ers"], ["Tulp", "Bloeiende landingspagina's"], ["Dijk", "Back-ups die nooit lekken"]],
  sa: [["Majlis", "مساحة نقاش لفريقك"], ["Qahwa CRM", "إدارة العملاء ببساطة"], ["Nakhla", "متجر إلكتروني للمشاريع الصغيرة"], ["Sahra Analytics", "تحليلات واضحة وسريعة"], ["Fanar", "صفحات هبوط أنيقة"], ["Dalla", "نشرة بريدية عربية"]],
  tr: [["Çay Desk", "Küçük işletmeler için destek masası"], ["Simit", "Basit fatura uygulaması"], ["Kervan", "Kargo takip paneli"], ["Lokum UI", "Tatlı arayüz bileşenleri"], ["Pazar", "El yapımı ürünler pazaryeri"], ["Derbi Stats", "Canlı skor API'si"]],
  ch: [["Uhrwerk", "Zeiterfassung, präzise wie ein Uhrwerk"], ["Alpenblick", "Dashboards mit Weitsicht"], ["Fondue", "Teamumfragen, die alle mögen"], ["Raclette Rechnung", "Rechnungen mit QR-Einzahlungsschein"], ["Bergbahn", "CI/CD ohne Steigung"], ["Röstigraben", "Übersetzungen DE/FR"]],
  pl: [["Pierogi", "Szablony SaaS na weekend"], ["Faktura Szybka", "Faktury zgodne z KSeF"], ["Bursztyn UI", "Ciepłe komponenty interfejsu"], ["Wisła Deploy", "Wdrożenia płynne jak rzeka"], ["Kawa Analytics", "Analityka bez ciasteczek"], ["Żubr", "Monitoring silny jak żubr"]],
  se: [["Fika", "Pausa-påminnelser för distansteam"], ["Lagom", "Lagom enkel projektplanering"], ["Stuga", "Bokningar för stugor"], ["Allemansrätt", "Öppna data-API:er"], ["Kanelbulle", "Nyhetsbrev med värme"], ["Midsommar", "Eventsidor på minuter"]],
};

const MULTIPLIERS = [480, 300, 190, 120, 64, 25];

export async function seedDemo(db: DrizzleD1Database<typeof schema>) {
  const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(schema.listings);
  if (n > 0) return;

  const now = Date.now();
  const hour = 3600_000;
  const listingRows: (typeof schema.listings.$inferInsert)[] = [];
  const reignRows: (typeof schema.reigns.$inferInsert)[] = [];
  const launchRows: (typeof schema.launches.$inferInsert)[] = [];

  for (const c of COUNTRIES) {
    const items = DEMO[c.slug] ?? [];
    items.forEach(([name, description], i) => {
      const slug = slugify(name);
      const host = `${slug}.example`;
      const id = `${c.slug}-${slug}`;
      listingRows.push({
        id, country: c.slug, key: host, url: `https://${host}`, host, slug, name, description,
        bidTotal: toMinor(c.minBid * MULTIPLIERS[i], c),
        reachedAt: now - (i + 1) * 7 * hour, createdAt: now - (30 - i) * 24 * hour,
        clicks: Math.round(1800 / (i + 1)) + 37 * i, ownerEmail: "demo@crownd.example",
      });
      if (i < 2) {
        // Two past reigns per country to populate the Hall of Fame.
        reignRows.push({
          id: `${id}-reign`, country: c.slug, listingId: id, name, url: `https://${host}`,
          bidAtStart: toMinor(c.minBid * MULTIPLIERS[i] * 0.6, c),
          startedAt: now - (i === 0 ? 7 : 20) * hour - i * 5 * 24 * hour,
          endedAt: i === 0 ? null : now - 7 * hour,
        });
      }
    });
    items.slice(0, 4).forEach(([name, tagline], i) => {
      const slug = `launch-${slugify(name)}`;
      launchRows.push({
        id: `${c.slug}-${slug}`, country: c.slug, day: dayKey(c.timezone, now), key: `${slug}.example`,
        url: `https://${slug}.example`, host: `${slug}.example`, name: `${name} Lite`, tagline,
        clicks: 40 - i * 9, createdAt: now - i * hour,
        highlightedUntil: i === 3 ? now + 20 * hour : null,
      });
    });
  }

  // D1 allows at most 100 bound parameters per statement → insert in small chunks.
  const chunks = <T,>(rows: T[], size: number) => Array.from({ length: Math.ceil(rows.length / size) }, (_, i) => rows.slice(i * size, i * size + size));
  for (const part of chunks(listingRows, 6)) await db.insert(schema.listings).values(part);
  for (const part of chunks(reignRows, 10)) await db.insert(schema.reigns).values(part);
  for (const part of chunks(launchRows, 8)) await db.insert(schema.launches).values(part);
}
