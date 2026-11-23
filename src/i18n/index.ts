import type { Country, Lang } from "@/config/countries";
import { en, type Messages } from "./en";
import { pt } from "./pt";
import { es } from "./es";
import { ja } from "./ja";
import { ko } from "./ko";
import { de } from "./de";
import { fr } from "./fr";
import { it } from "./it";
import { nl } from "./nl";
import { id } from "./id";
import { ar } from "./ar";
import { tr } from "./tr";
import { pl } from "./pl";
import { sv } from "./sv";

const BASE: Record<Lang, Messages> = { en, pt, es, ja, ko, de, fr, it, nl, id, ar, tr, pl, sv };

type DeepPartial<T> = { [K in keyof T]?: T[K] extends string | string[] ? T[K] : DeepPartial<T[K]> };

/** Regional voice. Same language, different culture. */
const OVERRIDES: Record<string, DeepPartial<Messages>> = {
  us: { launches: { sub: "{slots} free slots a day, ranked by unique clicks. Resets at midnight Eastern." } },
  uk: {
    country: "the UK", demonym: "British",
    hero: { title: "Rather fancy the crown?", taunt: "Someone's sat at #1. Terribly rude of them." },
    launches: { sub: "{slots} free slots a day, ranked by unique clicks. Resets at midnight UK time." },
    checkout: { success: "Payment confirmed. Long may you reign — quite literally." },
  },
  in: {
    country: "India", demonym: "Indian",
    hero: { title: "Grab the crown.", taunt: "Someone's batting at #1. Time to bowl them out?" },
    launches: { sub: "{slots} free slots a day, ranked by unique clicks. Resets at midnight IST." },
    checkout: { note: "Secure checkout by Stripe (cards, Apple Pay, Google Pay). Your rank is held for 30 minutes." },
  },
  ca: {
    country: "Canada", demonym: "Canadian",
    hero: { title: "Claim the crown.", taunt: "Someone's at #1. Sorry — it really should be you." },
    launches: { sub: "{slots} free slots a day, ranked by unique clicks. Resets at midnight Eastern." },
  },
  au: {
    country: "Australia", demonym: "Australian",
    hero: { title: "Have a crack at the crown.", taunt: "Someone's sitting pretty at #1. Reckon you can knock 'em off?" },
    launches: { sub: "{slots} free slots a day, ranked by unique clicks. Resets at midnight AEST." },
    checkout: { note: "Secure checkout by Stripe (cards, Apple Pay, Google Pay). Your rank is held for 30 minutes." },
  },
  mx: {
    country: "México", demonym: "mexicanos",
    hero: {
      title: "Llévate la corona.",
      taunt: "Alguien trae el cinturón de campeón. ¿Se lo vas a dejar?",
      sub: "Un ranking público de productos {demonym}. Pega tu link y pon tu precio: tu oferta decide tu lugar. Sin votos por lástima, sin algoritmo.",
      placeholder: "Pega el link de tu producto o @usuario",
      amount: "Tu oferta",
      topup: "¿Ya estás en el ranking? Pega el mismo link y sube tu oferta: solo pagas la diferencia.",
    },
    how: { s1: "Pega tu link", s3d: "Reinas hasta que alguien te supere. Cada cambio de #1 entra en el Salón de la Fama." },
    launches: { sub: "{slots} lugares gratis al día, ordenados por clics únicos. Se reinicia a medianoche (hora del centro).", ok: "¡Ya estás arriba! Comparte tu link para subir." },
    checkout: { note: "Pago seguro con Stripe (tarjeta, Apple Pay, Google Pay). Tu lugar queda apartado 30 minutos.", email: "Correo para tu recibo de Stripe" },
    errors: { invalid_url: "Eso no parece un link válido.", shortener: "Usa el link final, no un acortador.", email: "Escribe un correo válido." },
    rules: {
      refundDays: "Conforme a la Ley Federal de Protección al Consumidor, tienes {days} días hábiles desde la compra para cancelar con reembolso completo. Después, la oferta es definitiva aunque te superen.",
    },
  },
  ch: {
    country: "die Schweiz", demonym: "Schweizer",
    hero: { kicker: "Das Board für die Schweiz" },
    tools: { sub: "Ein kuratierter Stack, um ein Produkt aus der Schweiz zu lancieren. Der Eintrag ist kostenlos und nicht käuflich." },
    hall: { sub: "Jedes Produkt, das in der Schweiz jemals die Krone trug." },
    checkout: { note: "Sichere Zahlung über Stripe (Karte, Apple Pay, Google Pay). Dein Platz ist 30 Minuten reserviert." },
  },
  // ── Expansion editions ──────────────────────────────────────────────────
  pt: {
    country: "Portugal", demonym: "portugueses",
    hero: {
      kicker: "O board de {country}",
      title: "Fica com a coroa.",
      taunt: "Vais deixar o #1 para outro?",
      sub: "Um leaderboard público de produtos {demonym}. Cola o link, escolhe o valor — o teu lance decide a tua posição. Sem likes por simpatia, sem algoritmo.",
      placeholder: "Cola o link do teu produto ou @utilizador",
      amount: "O teu lance",
      cta: "Ficar com o #1",
      topup: "Já estás no board? Cola o mesmo link e aumenta o lance — pagas só a diferença.",
      wouldBe: "Com este valor ficas em #{rank}",
    },
    how: {
      s1: "Cola o link", s1d: "Site do produto, loja de apps, repositório no GitHub ou perfil no X.",
      s2: "Dá o teu lance", s2d: "Quem tem o maior total fica no trono. Empate? Fica à frente quem chegou primeiro.",
      s3: "Segura a coroa", s3d: "Reinas até alguém te ultrapassar. Cada troca de #1 fica no Hall da Fama.",
    },
    board: { empty: "Ainda não há ninguém. A coroa está à espera.", search: "Pesquisar no board" },
    launches: {
      sub: "{slots} vagas grátis por dia, ordenadas por cliques únicos. Reinicia à meia-noite de Lisboa.",
      full: "As vagas de hoje esgotaram. Volta depois da meia-noite.", ok: "Está no ar! Partilha o link para subires.",
      empty: "Ainda não há lançamentos hoje. Sê o primeiro.",
    },
    tools: { sub: "Stack escolhida a dedo para lançar um produto em {country}. Listar é grátis e não se compra." },
    hall: { sub: "Todos os produtos que já usaram a coroa em {country}." },
    faq: { what: "O que é o {edition}?", cost: "Quanto custa o #1 no {edition} hoje?", free: "Posso lançar o meu produto grátis?", raise: "Posso aumentar o meu lance depois?", pay: "Como pago?", refund: "Tenho direito a reembolso?" },
    newsletter: { sub: "Quando a coroa mudar de dono, ficas a saber primeiro.", ph: "tu@email.com", ok: "Pronto, estás dentro." },
    checkout: {
      note: "Pagamento seguro via Stripe (cartão, Apple Pay, Google Pay). A tua posição fica reservada durante 30 minutos.",
      success: "Pagamento confirmado. Longo seja o teu reinado.", cancel: "Pagamento cancelado. A coroa continua à espera.",
      raise: "Este link já está no board com {amount}. Pagas só a diferença.",
    },
    errors: { generic: "Algo correu mal. Tenta outra vez.", email: "Indica um e-mail válido.", full: "As vagas de hoje esgotaram." },
    rules: {
      items: [
        "Os lances são em {currency}, de {step} em {step}. O mínimo é {minBid}.",
        "O total pago decide a posição. Valores iguais: fica à frente quem chegou primeiro.",
        "Já estás na lista? Cola o mesmo link e aumenta. Pagas só a diferença — no mínimo {step}.",
        "Vale: site de produto, loja de apps, repositório no GitHub e perfil no X. Não vale: links de grupo ou convite, encurtadores, conteúdo adulto, burlas.",
        "Os parâmetros de rastreio são removidos, por isso links de afiliado e de referência não funcionam.",
        "A posição só é tua quando o pagamento é confirmado. O checkout reserva a vaga durante 30 minutos.",
        "Os lançamentos são grátis: {slots} por dia, ordenados por cliques únicos (um por pessoa por dia). Fixar no topo durante 24h custa {launchHighlight}.",
        "As ferramentas são escolhidas a dedo, nunca vendidas. Uma faixa de destaque durante 3 dias custa {toolHighlight}.",
        "Cada troca de #1 fica registada para sempre no Hall da Fama.",
      ],
      refundDays: "Nos termos do Decreto-Lei 24/2014, tens {days} dias para desistir da compra com reembolso integral. Depois disso, o lance é definitivo — mesmo que alguém te ultrapasse.",
      refundNone: "Os lances são definitivos depois de o anúncio entrar no ar, mesmo que alguém te ultrapasse.",
      refundRemoved: "Anúncios removidos por violarem as regras e destaques recusados na revisão são sempre reembolsados na totalidade.",
    },
    meta: {
      title: "{edition} — o leaderboard de produtos {demonym}",
      description: "O leaderboard público de produtos {demonym}. Paga para ficar em #1, lança grátis e vê quem tem a coroa agora.",
    },
    sell: {
      sub: "Põe o teu produto à frente de quem procura novidades. O teu lance decide a posição entre os produtos {demonym}, ganhas uma página pública feita para ser encontrada e guardas o lugar até alguém te ultrapassar.",
      explore: "Ver quem está no board",
      valueTitle: "O que o teu lance compra",
      v1d: "O teu produto ordenado pelo lance no {edition}, visto por todos os visitantes. O #1 ainda aparece no Mapa das Coroas global.",
      v2t: "A tua página, feita para ser encontrada", v2d: "Uma página pública no crownd.dev com o teu link, posição, cliques e descrição — estruturada para motores de busca e fácil de partilhar.",
      v3d: "Põe-no no teu site. Atualiza-se sozinho e aponta para a tua página: prova social sempre atual.",
      v4d: "A tua posição não expira. Fica até alguém te ultrapassar — e voltar ao topo custa só a diferença.",
      v5t: "Cliques que vês", v5d: "Cada visita que enviamos é contada publicamente na tua página. Sem métricas de vaidade, sem algoritmo escondido.",
      v6d: "Chega ao #1 e o teu reinado fica registado para sempre no {hall}, com data e duração.",
      honest: "Sem rodeios: não prometemos posições no Google nem um número de visitas. Damos ao teu produto um palco público e indexável diante de gente nova — o resultado depende do produto e da concorrência.",
      empty: "Ainda ninguém tem o #1 de Portugal. Um lance de {min} fica com a coroa — e escreve a primeira linha do {hall}.",
      taken: "O #1 de Portugal custa {amount} neste momento. Ultrapassa-o e a coroa muda de dono assim que pagares.",
      buyTitle: "A tua compra", buy3: "Sem validade — fica até alguém te ultrapassar",
      descPh: "Descrição numa linha (aparece na tua página e para motores de busca)",
      next1: "A tua posição fica no ar assim que o Stripe confirmar o pagamento — normalmente em segundos.", next2: "Partilha a tua página: cada visita conta.", next3: "Põe o selo ao vivo no teu site.",
      share: "Partilhar", faqGet: "O que ganho com o lance?", faqLong: "Quanto tempo dura a minha posição?",
    },
    mail: {
      title: "A tua coroa acabou de mudar de dono",
      body: "Alguém ultrapassou o lance de {name} pelo #1 no {edition}. Cola o mesmo link e aumenta o lance — pagas só a diferença.",
      cta: "Recuperar a coroa",
      footer: "Recebeste este e-mail porque deste um lance no Crownd com este endereço. Um e-mail por coroa perdida, nada mais.",
      promise: "Avisamos-te por e-mail assim que alguém ficar com o teu #1.",
    },
  },
  ar: {
    country: "Argentina", demonym: "argentinos",
    hero: {
      kicker: "El ranking de {country}",
      title: "Quedate con la corona.",
      taunt: "Alguien está en el #1. ¿Lo vas a dejar ahí?",
      sub: "Un ranking público de productos {demonym}. Pegá tu link y elegí tu oferta: tu oferta decide tu lugar. Sin votos por lástima, sin algoritmo.",
      placeholder: "Pegá el link de tu producto o @usuario",
      amount: "Tu oferta",
      topup: "¿Ya estás en el ranking? Pegá el mismo link y subí tu oferta: pagás solo la diferencia.",
    },
    how: { s1: "Pegá tu link", s2: "Elegí tu oferta", s3: "Bancá la corona" },
    launches: { sub: "{slots} lugares gratis por día, ordenados por clics únicos. Se reinicia a la medianoche (hora argentina).", ok: "¡Ya estás arriba! Compartí tu link para subir." },
    checkout: { note: "Pago seguro con Stripe (tarjeta, Apple Pay, Google Pay). Tu lugar queda reservado 30 minutos." },
    errors: { invalid_url: "Eso no parece un link válido.", shortener: "Usá el link final, no un acortador.", email: "Escribí un correo válido.", generic: "Algo salió mal. Probá de nuevo." },
    sell: {
      sub: "Poné tu producto frente a quienes buscan algo nuevo. Tu oferta define tu puesto entre los productos {demonym}, conseguís una página pública pensada para que te encuentren y mantenés el lugar hasta que alguien te supere.",
      v3d: "Ponela en tu web: se actualiza sola y enlaza a tu página. Prueba social siempre al día.",
      v4d: "Tu posición no vence: se mantiene hasta que alguien te supere, y volver arriba cuesta solo la diferencia.",
      empty: "Nadie tiene el #1 en Argentina todavía. Una oferta de {min} se queda con la corona y escribe la primera línea del {hall}.",
      taken: "El #1 en Argentina cuesta {amount} ahora. Superalo y la corona cambia de manos en cuanto pagues.",
      next2: "Compartí tu página: cada visita cuenta.", next3: "Agregá la insignia en vivo a tu web.",
      descPh: "Descripción en una línea (se ve en tu página y en los buscadores)",
    },
    mail: {
      body: "Alguien superó la oferta de {name} por el #1 en {edition}. Pegá el mismo enlace y subí tu oferta: pagás solo la diferencia.",
      footer: "Te llega este correo porque ofertaste en Crownd con esta dirección. Un correo por cada corona perdida, nada más.",
      promise: "Te avisamos por email en cuanto alguien te saque el #1.",
    },
    rules: {
      refundDays: "Por la Ley 24.240 de Defensa del Consumidor, tenés {days} días corridos desde la compra para arrepentirte y recibir el reembolso completo. Después, la oferta es definitiva aunque te superen.",
    },
  },
  co: {
    country: "Colombia", demonym: "colombianos",
    hero: {
      kicker: "El ranking de {country}",
      title: "Llévate la corona.",
      taunt: "Alguien está en el #1. ¿Lo vas a dejar así, parce?",
      sub: "Un ranking público de productos {demonym}. Pega tu link y pon tu precio: tu oferta decide tu lugar. Sin votos por lástima, sin algoritmo.",
      placeholder: "Pega el link de tu producto o @usuario",
      amount: "Tu oferta",
      topup: "¿Ya estás en el ranking? Pega el mismo link y sube tu oferta: solo pagas la diferencia.",
    },
    how: { s1: "Pega tu link" },
    launches: { sub: "{slots} cupos gratis al día, ordenados por clics únicos. Se reinicia a medianoche (hora de Colombia).", ok: "¡Ya estás arriba! Comparte tu link para subir." },
    checkout: { note: "Pago seguro con Stripe (tarjeta, Apple Pay, Google Pay). Tu lugar queda reservado 30 minutos." },
    errors: { invalid_url: "Eso no parece un link válido.", shortener: "Usa el link final, no un acortador.", email: "Escribe un correo válido." },
    rules: {
      refundDays: "Según el Estatuto del Consumidor (Ley 1480 de 2011), tienes {days} días hábiles para ejercer el derecho de retracto con reembolso completo. Después, la oferta es definitiva aunque te superen.",
    },
  },
  cl: {
    country: "Chile", demonym: "chilenos",
    hero: {
      kicker: "El ranking de {country}",
      title: "Quédate con la corona.",
      taunt: "Alguien está en el #1. ¿Lo vas a destronar al tiro?",
      sub: "Un ranking público de productos {demonym}. Pega tu link y pon tu precio: tu oferta decide tu lugar. Sin votos por lástima, sin algoritmo.",
      placeholder: "Pega el link de tu producto o @usuario",
      amount: "Tu oferta",
      topup: "¿Ya estás en el ranking? Pega el mismo link y sube tu oferta: solo pagas la diferencia.",
    },
    how: { s1: "Pega tu link" },
    launches: { sub: "{slots} cupos gratis al día, ordenados por clics únicos. Se reinicia a medianoche (hora de Chile).", ok: "¡Ya estás arriba! Comparte tu link para subir." },
    checkout: { note: "Pago seguro con Stripe (tarjeta, Apple Pay, Google Pay). Tu lugar queda reservado 30 minutos." },
    errors: { invalid_url: "Eso no parece un link válido.", shortener: "Usa el link final, no un acortador.", email: "Escribe un correo válido." },
    rules: {
      refundDays: "Según la Ley 19.496, tienes {days} días para ejercer el derecho a retracto con reembolso completo. Después, la oferta es definitiva aunque te superen.",
    },
  },
  sg: {
    country: "Singapore", demonym: "Singaporean",
    hero: { title: "Chope the crown.", taunt: "Someone's sitting at #1. Don't say bojio." },
    launches: { sub: "{slots} free slots a day, ranked by unique clicks. Resets at midnight SGT." },
  },
  ae: {
    country: "the UAE", demonym: "UAE-built",
    hero: { title: "Take the crown.", taunt: "Someone's at #1. Second place doesn't make headlines." },
    launches: { sub: "{slots} free slots a day, ranked by unique clicks. Resets at midnight UAE time." },
    checkout: { note: "Secure checkout by Stripe (cards, Apple Pay, Google Pay). Your rank is held for 30 minutes." },
  },
  ie: {
    country: "Ireland", demonym: "Irish",
    hero: { title: "Go on, take the crown.", taunt: "Someone's at #1. Fair play to them — for now." },
    launches: { sub: "{slots} free slots a day, ranked by unique clicks. Resets at midnight Irish time." },
    checkout: { note: "Secure checkout by Stripe (cards, Apple Pay, Google Pay). Your rank is held for 30 minutes." },
  },
  ph: {
    country: "the Philippines", demonym: "Filipino",
    hero: { title: "Kunin ang korona.", taunt: "Someone's at #1. Ikaw na ba ang next?" },
    launches: { sub: "{slots} free slots a day, ranked by unique clicks. Resets at midnight PHT." },
  },
  nz: {
    country: "New Zealand", demonym: "Kiwi",
    hero: { title: "Kia ora. Take the crown.", taunt: "Someone's sitting at #1. Keen for a challenge?" },
    launches: { sub: "{slots} free slots a day, ranked by unique clicks. Resets at midnight NZT." },
  },
  za: {
    country: "South Africa", demonym: "South African",
    hero: { title: "Take the crown, boet.", taunt: "Someone's at #1. Lekker for them — until you show up." },
    launches: { sub: "{slots} free slots a day, ranked by unique clicks. Resets at midnight SAST." },
  },
};

function merge<T>(base: T, over?: DeepPartial<T>): T {
  if (!over) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over)) {
    const b = (base as Record<string, unknown>)[k];
    out[k] = v && typeof v === "object" && !Array.isArray(v) ? merge(b, v as DeepPartial<typeof b>) : v;
  }
  return out as T;
}

/** Swiss Standard German never uses ß. */
function swissify<T>(value: T): T {
  if (typeof value === "string") return value.replace(/ß/g, "ss") as T;
  if (Array.isArray(value)) return value.map(swissify) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, swissify(v)])) as T;
  }
  return value;
}

const cache = new Map<string, Messages>();

export function getMessages(c: Country): Messages {
  const hit = cache.get(c.slug);
  if (hit) return hit;
  let m = merge(BASE[c.lang], OVERRIDES[c.slug]);
  if (c.slug === "ch") m = swissify(m);
  cache.set(c.slug, m);
  return m;
}

/** Replace {placeholders}. Missing values are left visible on purpose so QA catches them. */
export function t(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export type { Messages };
