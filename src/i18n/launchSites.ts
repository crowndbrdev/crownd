import type { Lang } from "@/config/countries";

/**
 * "Where to launch" pillar page (/{edition}/where-to-launch). Targets high-intent searches such as
 * "onde divulgar meu app", "where to launch my startup", "Product Hunt alternatives".
 * Placeholders: {n} {country} {demonym} {slots}.
 */
export type LaunchSitesMessages = {
  nav: string; title: string; description: string; intro: string;
  hCrownd: string; crownd: string; cta: string;
  hGlobal: string; global: string; hLocal: string; tip: string;
  free: string; freemium: string; paid: string;
  launch: string; community: string; directory: string; newsletter: string; social: string;
};

export const LAUNCH_SITES: Record<Lang, LaunchSitesMessages> = {
  en: {
    nav: "Where to launch", title: "{n} places to launch your product in {country}",
    description: "The launch platforms, directories and communities that actually send visitors — plus where {demonym} makers gather. Free and paid options, updated.",
    intro: "Launching once isn't enough. Products that get traction show up in several places in the same week. Here are the platforms worth your time, the local communities, and one place where you can launch today.",
    hCrownd: "Start here: your own spot on the board", crownd: "{slots} free launches a day, ranked by unique clicks — or bid for #1 and keep a public, indexable page for your product with a live rank badge.", cta: "Launch for free",
    hGlobal: "Global launch platforms and directories", global: "Most accept products from anywhere. Prepare one sentence, a few screenshots and a clean link before you start.",
    hLocal: "Where {demonym} makers gather", tip: "Post the problem you solve, not a bare link. Reply to every comment in the first hour.",
    free: "Free", freemium: "Free + paid options", paid: "Paid",
    launch: "Launch platform", community: "Community", directory: "Directory", newsletter: "Newsletter", social: "Social",
  },
  pt: {
    nav: "Onde divulgar", title: "{n} lugares para divulgar seu produto no {country}",
    description: "As plataformas de lançamento, diretórios e comunidades que realmente trazem visitas — e onde os makers {demonym} estão. Opções grátis e pagas.",
    intro: "Lançar uma vez só não basta. Os produtos que ganham tração aparecem em vários lugares na mesma semana. Aqui estão as plataformas que valem o seu tempo, as comunidades locais e um lugar onde você pode lançar hoje.",
    hCrownd: "Comece aqui: sua vaga no board", crownd: "{slots} lançamentos grátis por dia, ranqueados por cliques únicos — ou dê um lance pelo #1 e tenha uma página pública e indexável do seu produto, com selo de posição ao vivo.", cta: "Lançar de graça",
    hGlobal: "Plataformas de lançamento e diretórios globais", global: "A maioria aceita produtos de qualquer país. Tenha pronta uma frase, algumas capturas de tela e o link final antes de começar.",
    hLocal: "Onde os makers {demonym} estão", tip: "Poste o problema que você resolve, não um link solto. Responda todo comentário na primeira hora.",
    free: "Grátis", freemium: "Grátis + opções pagas", paid: "Pago",
    launch: "Plataforma de lançamento", community: "Comunidade", directory: "Diretório", newsletter: "Newsletter", social: "Rede social",
  },
  es: {
    nav: "Dónde lanzar", title: "{n} sitios para lanzar tu producto en {country}",
    description: "Las plataformas de lanzamiento, directorios y comunidades que de verdad traen visitas, y dónde se reúnen los makers {demonym}. Opciones gratis y de pago.",
    intro: "Lanzar una sola vez no alcanza. Los productos que despegan aparecen en varios sitios la misma semana. Aquí tienes las plataformas que valen tu tiempo, las comunidades locales y un lugar donde puedes lanzar hoy.",
    hCrownd: "Empieza aquí: tu lugar en el ranking", crownd: "{slots} lanzamientos gratis al día, ordenados por clics únicos, o puja por el #1 y ten una página pública e indexable de tu producto con insignia de posición en vivo.", cta: "Lanzar gratis",
    hGlobal: "Plataformas de lanzamiento y directorios globales", global: "La mayoría acepta productos de cualquier país. Ten lista una frase, algunas capturas y el link final antes de empezar.",
    hLocal: "Dónde se reúnen los makers {demonym}", tip: "Publica el problema que resuelves, no un link suelto. Responde cada comentario en la primera hora.",
    free: "Gratis", freemium: "Gratis + opciones de pago", paid: "De pago",
    launch: "Plataforma de lanzamiento", community: "Comunidad", directory: "Directorio", newsletter: "Newsletter", social: "Red social",
  },
  ja: {
    nav: "ローンチ先", title: "{country}でプロダクトをローンチできる{n}の場所",
    description: "実際に訪問者を連れてくるローンチプラットフォーム、ディレクトリ、コミュニティ、そして{demonym}の開発者が集まる場所。無料と有料の選択肢。",
    intro: "一度のローンチでは足りません。伸びるプロダクトは同じ週に複数の場所に現れます。時間をかける価値のあるプラットフォーム、地元のコミュニティ、そして今日ローンチできる場所をまとめました。",
    hCrownd: "まずはここから：ボードにあなたの枠を", crownd: "1日{slots}枠の無料ローンチ（ユニーククリック順）。または1位に入札して、ライブ順位バッジ付きの公開・インデックス可能なプロダクトページを。", cta: "無料でローンチ",
    hGlobal: "世界のローンチプラットフォームとディレクトリ", global: "多くは国を問わず掲載できます。一文の説明、数枚のスクリーンショット、最終リンクを用意しましょう。",
    hLocal: "{demonym}の開発者が集まる場所", tip: "リンクだけでなく、解決する課題を投稿しましょう。最初の1時間はすべてのコメントに返信を。",
    free: "無料", freemium: "無料＋有料オプション", paid: "有料",
    launch: "ローンチプラットフォーム", community: "コミュニティ", directory: "ディレクトリ", newsletter: "ニュースレター", social: "SNS",
  },
  ko: {
    nav: "런칭할 곳", title: "{country}에서 프로덕트를 런칭할 수 있는 {n}곳",
    description: "실제로 방문자를 데려오는 런칭 플랫폼, 디렉터리, 커뮤니티와 {demonym} 메이커가 모이는 곳. 무료와 유료 옵션.",
    intro: "한 번의 런칭으로는 부족해요. 성장하는 프로덕트는 같은 주에 여러 곳에 등장합니다. 시간을 쓸 가치가 있는 플랫폼, 로컬 커뮤니티, 그리고 오늘 바로 런칭할 수 있는 곳을 정리했어요.",
    hCrownd: "여기서 시작하세요: 보드 위 당신의 자리", crownd: "하루 {slots}개의 무료 런칭(고유 클릭 순) — 또는 1위에 입찰하고 실시간 순위 배지가 있는 공개·검색 가능한 프로덕트 페이지를 가지세요.", cta: "무료로 런칭",
    hGlobal: "글로벌 런칭 플랫폼과 디렉터리", global: "대부분 국가와 상관없이 등록할 수 있어요. 한 문장 소개, 스크린샷 몇 장, 최종 링크를 준비하세요.",
    hLocal: "{demonym} 메이커가 모이는 곳", tip: "링크만 올리지 말고 해결하는 문제를 올리세요. 첫 1시간 동안 모든 댓글에 답하세요.",
    free: "무료", freemium: "무료 + 유료 옵션", paid: "유료",
    launch: "런칭 플랫폼", community: "커뮤니티", directory: "디렉터리", newsletter: "뉴스레터", social: "소셜",
  },
  de: {
    nav: "Wo launchen", title: "{n} Orte, um dein Produkt in {country} zu launchen",
    description: "Launch-Plattformen, Verzeichnisse und Communities, die wirklich Besucher bringen – und wo sich Maker aus {country} treffen. Kostenlose und bezahlte Optionen.",
    intro: "Ein einziger Launch reicht nicht. Produkte mit Zugkraft tauchen in derselben Woche an mehreren Orten auf. Hier sind die Plattformen, die deine Zeit wert sind, die lokalen Communities und ein Ort, an dem du heute launchen kannst.",
    hCrownd: "Starte hier: dein Platz im Board", crownd: "{slots} kostenlose Launches pro Tag, sortiert nach eindeutigen Klicks – oder biete auf Platz 1 und erhalte eine öffentliche, indexierbare Produktseite mit Live-Rang-Badge.", cta: "Kostenlos launchen",
    hGlobal: "Globale Launch-Plattformen und Verzeichnisse", global: "Die meisten nehmen Produkte aus jedem Land an. Bereite einen Satz, ein paar Screenshots und den finalen Link vor.",
    hLocal: "Wo sich Maker aus {country} treffen", tip: "Poste das Problem, das du löst – nicht nur einen Link. Antworte in der ersten Stunde auf jeden Kommentar.",
    free: "Kostenlos", freemium: "Kostenlos + bezahlte Optionen", paid: "Bezahlt",
    launch: "Launch-Plattform", community: "Community", directory: "Verzeichnis", newsletter: "Newsletter", social: "Social Media",
  },
  fr: {
    nav: "Où lancer", title: "{n} endroits pour lancer ton produit en {country}",
    description: "Les plateformes de lancement, annuaires et communautés qui amènent vraiment des visiteurs, et où se retrouvent les makers {demonym}. Options gratuites et payantes.",
    intro: "Un seul lancement ne suffit pas. Les produits qui décollent apparaissent à plusieurs endroits la même semaine. Voici les plateformes qui valent ton temps, les communautés locales et un endroit où lancer dès aujourd'hui.",
    hCrownd: "Commence ici : ta place sur le board", crownd: "{slots} lancements gratuits par jour, classés par clics uniques, ou enchéris pour la 1re place et obtiens une page produit publique et indexable, avec un badge de classement en direct.", cta: "Lancer gratuitement",
    hGlobal: "Plateformes de lancement et annuaires mondiaux", global: "La plupart acceptent les produits de tous les pays. Prépare une phrase, quelques captures et le lien final avant de commencer.",
    hLocal: "Où se retrouvent les makers {demonym}", tip: "Publie le problème que tu résous, pas un lien seul. Réponds à chaque commentaire pendant la première heure.",
    free: "Gratuit", freemium: "Gratuit + options payantes", paid: "Payant",
    launch: "Plateforme de lancement", community: "Communauté", directory: "Annuaire", newsletter: "Newsletter", social: "Réseau social",
  },
  it: {
    nav: "Dove lanciare", title: "{n} posti dove lanciare il tuo prodotto in {country}",
    description: "Le piattaforme di lancio, le directory e le community che portano davvero visitatori, e dove si ritrovano i maker {demonym}. Opzioni gratuite e a pagamento.",
    intro: "Un solo lancio non basta. I prodotti che crescono compaiono in più posti nella stessa settimana. Ecco le piattaforme che valgono il tuo tempo, le community locali e un posto dove lanciare oggi.",
    hCrownd: "Parti da qui: il tuo posto nella classifica", crownd: "{slots} lanci gratuiti al giorno, ordinati per clic unici, oppure fai un'offerta per il #1 e ottieni una pagina prodotto pubblica e indicizzabile con badge di posizione in tempo reale.", cta: "Lancia gratis",
    hGlobal: "Piattaforme di lancio e directory globali", global: "La maggior parte accetta prodotti da qualsiasi paese. Prepara una frase, qualche screenshot e il link finale prima di iniziare.",
    hLocal: "Dove si ritrovano i maker {demonym}", tip: "Pubblica il problema che risolvi, non un link nudo. Rispondi a ogni commento nella prima ora.",
    free: "Gratis", freemium: "Gratis + opzioni a pagamento", paid: "A pagamento",
    launch: "Piattaforma di lancio", community: "Community", directory: "Directory", newsletter: "Newsletter", social: "Social",
  },
  nl: {
    nav: "Waar lanceren", title: "{n} plekken om je product te lanceren in {country}",
    description: "De lanceerplatforms, directories en community's die echt bezoekers brengen, en waar {demonym} makers samenkomen. Gratis en betaalde opties.",
    intro: "Eén keer lanceren is niet genoeg. Producten met tractie duiken in dezelfde week op meerdere plekken op. Dit zijn de platforms die je tijd waard zijn, de lokale community's en een plek waar je vandaag kunt lanceren.",
    hCrownd: "Begin hier: jouw plek op het board", crownd: "{slots} gratis lanceringen per dag, gerangschikt op unieke klikken, of bied op #1 en krijg een openbare, indexeerbare productpagina met live rangbadge.", cta: "Gratis lanceren",
    hGlobal: "Wereldwijde lanceerplatforms en directories", global: "De meeste accepteren producten uit elk land. Zorg voor één zin, een paar screenshots en de definitieve link.",
    hLocal: "Waar {demonym} makers samenkomen", tip: "Post het probleem dat je oplost, niet alleen een link. Reageer het eerste uur op elke reactie.",
    free: "Gratis", freemium: "Gratis + betaalde opties", paid: "Betaald",
    launch: "Lanceerplatform", community: "Community", directory: "Directory", newsletter: "Nieuwsbrief", social: "Social media",
  },
  id: {
    nav: "Tempat meluncurkan", title: "{n} tempat untuk meluncurkan produkmu di {country}",
    description: "Platform peluncuran, direktori, dan komunitas yang benar-benar mendatangkan pengunjung, plus tempat maker {demonym} berkumpul. Opsi gratis dan berbayar.",
    intro: "Meluncurkan sekali saja tidak cukup. Produk yang berkembang muncul di beberapa tempat dalam minggu yang sama. Ini platform yang layak, komunitas lokal, dan satu tempat untuk meluncurkan hari ini.",
    hCrownd: "Mulai di sini: tempatmu di papan peringkat", crownd: "{slots} peluncuran gratis per hari, diurutkan berdasarkan klik unik, atau tawar untuk #1 dan dapatkan halaman produk publik yang terindeks dengan lencana peringkat langsung.", cta: "Luncurkan gratis",
    hGlobal: "Platform peluncuran dan direktori global", global: "Sebagian besar menerima produk dari negara mana pun. Siapkan satu kalimat, beberapa tangkapan layar, dan tautan final.",
    hLocal: "Tempat maker {demonym} berkumpul", tip: "Unggah masalah yang kamu selesaikan, bukan sekadar tautan. Balas setiap komentar di jam pertama.",
    free: "Gratis", freemium: "Gratis + opsi berbayar", paid: "Berbayar",
    launch: "Platform peluncuran", community: "Komunitas", directory: "Direktori", newsletter: "Buletin", social: "Media sosial",
  },
  ar: {
    nav: "أين تطلق منتجك", title: "{n} مكانًا لإطلاق منتجك في {country}",
    description: "منصات الإطلاق والأدلة والمجتمعات التي تجلب زوارًا فعلًا، وأين يجتمع صنّاع المنتجات {demonym}. خيارات مجانية ومدفوعة.",
    intro: "إطلاق واحد لا يكفي. المنتجات التي تنمو تظهر في عدة أماكن خلال الأسبوع نفسه. إليك المنصات التي تستحق وقتك، والمجتمعات المحلية، ومكانًا يمكنك الإطلاق فيه اليوم.",
    hCrownd: "ابدأ هنا: مكانك في اللوحة", crownd: "{slots} إطلاقات مجانية يوميًا مرتبة حسب النقرات الفريدة، أو قدّم عرضًا على المركز الأول واحصل على صفحة منتج عامة قابلة للفهرسة مع شارة ترتيب مباشرة.", cta: "أطلق مجانًا",
    hGlobal: "منصات وأدلة الإطلاق العالمية", global: "معظمها يقبل منتجات من أي بلد. جهّز جملة واحدة وبعض لقطات الشاشة والرابط النهائي قبل البدء.",
    hLocal: "أين يجتمع صنّاع المنتجات {demonym}", tip: "انشر المشكلة التي تحلها، لا مجرد رابط. ردّ على كل تعليق في الساعة الأولى.",
    free: "مجاني", freemium: "مجاني + خيارات مدفوعة", paid: "مدفوع",
    launch: "منصة إطلاق", community: "مجتمع", directory: "دليل", newsletter: "نشرة بريدية", social: "تواصل اجتماعي",
  },
  tr: {
    nav: "Nerede lansman", title: "Türkiye'de ürününü tanıtabileceğin {n} yer",
    description: "Gerçekten ziyaretçi getiren lansman platformları, dizinler ve topluluklar; Türk üreticilerin buluştuğu yerler. Ücretsiz ve ücretli seçenekler.",
    intro: "Tek bir lansman yetmez. Çekiş kazanan ürünler aynı hafta birçok yerde görünür. İşte zamanına değen platformlar, yerel topluluklar ve bugün lansman yapabileceğin bir yer.",
    hCrownd: "Buradan başla: listede yerin", crownd: "Günde {slots} ücretsiz lansman, tekil tıklamaya göre sıralı; ya da 1 numara için teklif ver ve canlı sıralama rozetli, herkese açık ve dizinlenebilir bir ürün sayfası al.", cta: "Ücretsiz yayınla",
    hGlobal: "Küresel lansman platformları ve dizinler", global: "Çoğu her ülkeden ürün kabul eder. Başlamadan önce tek cümlelik açıklama, birkaç ekran görüntüsü ve nihai linki hazırla.",
    hLocal: "Türk üreticilerin buluştuğu yerler", tip: "Sadece link değil, çözdüğün sorunu paylaş. İlk saatte her yoruma cevap ver.",
    free: "Ücretsiz", freemium: "Ücretsiz + ücretli seçenekler", paid: "Ücretli",
    launch: "Lansman platformu", community: "Topluluk", directory: "Dizin", newsletter: "Bülten", social: "Sosyal medya",
  },
  pl: {
    nav: "Gdzie wypuścić", title: "{n} miejsc, gdzie wypuścisz swój produkt w Polsce",
    description: "Platformy launchowe, katalogi i społeczności, które naprawdę przyprowadzają odwiedzających, oraz miejsca, gdzie spotykają się polscy twórcy. Opcje darmowe i płatne.",
    intro: "Jeden launch to za mało. Produkty, które łapią trakcję, pojawiają się w kilku miejscach w tym samym tygodniu. Oto platformy warte twojego czasu, lokalne społeczności i miejsce, gdzie możesz wystartować już dziś.",
    hCrownd: "Zacznij tutaj: twoje miejsce w rankingu", crownd: "{slots} darmowych launchy dziennie, według unikalnych kliknięć — albo zalicytuj #1 i zyskaj publiczną, indeksowaną stronę produktu z odznaką pozycji na żywo.", cta: "Wypuść za darmo",
    hGlobal: "Globalne platformy launchowe i katalogi", global: "Większość przyjmuje produkty z każdego kraju. Przygotuj jedno zdanie, kilka zrzutów ekranu i docelowy link.",
    hLocal: "Gdzie spotykają się polscy twórcy", tip: "Opisz problem, który rozwiązujesz, a nie sam link. Odpowiadaj na każdy komentarz w pierwszej godzinie.",
    free: "Za darmo", freemium: "Darmowe + płatne opcje", paid: "Płatne",
    launch: "Platforma launchowa", community: "Społeczność", directory: "Katalog", newsletter: "Newsletter", social: "Social media",
  },
  sv: {
    nav: "Var lansera", title: "{n} ställen att lansera din produkt i {country}",
    description: "Lanseringsplattformar, kataloger och communities som faktiskt ger besökare, och var {demonym} skapare samlas. Gratis och betalda alternativ.",
    intro: "En lansering räcker inte. Produkter som tar fart syns på flera ställen samma vecka. Här är plattformarna som är värda din tid, de lokala communities och ett ställe där du kan lansera i dag.",
    hCrownd: "Börja här: din plats på listan", crownd: "{slots} gratis lanseringar per dag, rankade efter unika klick, eller bjud på #1 och få en offentlig, indexerbar produktsida med live-rankningsmärke.", cta: "Lansera gratis",
    hGlobal: "Globala lanseringsplattformar och kataloger", global: "De flesta tar emot produkter från alla länder. Förbered en mening, några skärmdumpar och den slutliga länken.",
    hLocal: "Var {demonym} skapare samlas", tip: "Posta problemet du löser, inte bara en länk. Svara på varje kommentar den första timmen.",
    free: "Gratis", freemium: "Gratis + betalda alternativ", paid: "Betald",
    launch: "Lanseringsplattform", community: "Community", directory: "Katalog", newsletter: "Nyhetsbrev", social: "Sociala medier",
  },
};

/** Grammar fixes where {country}/{demonym} don't fit the base sentence. */
const OVERRIDES: Record<string, Partial<LaunchSitesMessages>> = {
  pt: {
    title: "{n} sítios para divulgar o teu produto em Portugal",
    description: "As plataformas de lançamento, diretórios e comunidades que trazem mesmo visitas — e onde estão os makers portugueses. Opções grátis e pagas.",
    intro: "Lançar uma vez não chega. Os produtos que ganham tração aparecem em vários sítios na mesma semana. Aqui estão as plataformas que valem o teu tempo, as comunidades locais e um sítio onde podes lançar hoje.",
    hCrownd: "Começa aqui: a tua vaga no board", crownd: "{slots} lançamentos grátis por dia, ordenados por cliques únicos — ou dá um lance pelo #1 e tem uma página pública e indexável do teu produto, com selo de posição ao vivo.",
    global: "A maioria aceita produtos de qualquer país. Tem preparada uma frase, algumas capturas de ecrã e o link final antes de começar.",
    tip: "Publica o problema que resolves, não um link solto. Responde a todos os comentários na primeira hora.",
  },
  ar: {
    title: "{n} lugares para lanzar tu producto en Argentina",
    intro: "Lanzar una sola vez no alcanza. Los productos que despegan aparecen en varios lugares la misma semana. Acá tenés las plataformas que valen tu tiempo, las comunidades locales y un lugar donde podés lanzar hoy.",
    hCrownd: "Empezá acá: tu lugar en el ranking", crownd: "{slots} lanzamientos gratis por día, ordenados por clics únicos, o ofertá por el #1 y tené una página pública e indexable de tu producto con insignia de posición en vivo.",
    global: "La mayoría acepta productos de cualquier país. Tené lista una frase, algunas capturas y el link final antes de arrancar.",
    tip: "Publicá el problema que resolvés, no un link suelto. Respondé cada comentario en la primera hora.",
  },
  ch: {
    title: "{n} Orte, um dein Produkt in der Schweiz zu lancieren",
    description: "Launch-Plattformen, Verzeichnisse und Communities, die wirklich Besucher bringen – und wo sich Maker aus der Schweiz treffen. Kostenlose und bezahlte Optionen.",
    hLocal: "Wo sich Maker aus der Schweiz treffen",
  },
  ae: {
    description: "The launch platforms, directories and communities that actually send visitors — plus where makers in the UAE gather. Free and paid options, updated.",
    hLocal: "Where makers in the UAE gather",
  },
};

export function getLaunchSites(lang: Lang, slug: string): LaunchSitesMessages {
  const base = { ...LAUNCH_SITES[lang], ...OVERRIDES[slug] };
  return slug === "ch" ? (Object.fromEntries(Object.entries(base).map(([k, v]) => [k, v.replace(/ß/g, "ss")])) as LaunchSitesMessages) : base;
}

export type LaunchSite = { name: string; url: string; kind: "launch" | "community" | "directory" | "newsletter" | "social"; price: "free" | "freemium" | "paid"; tags?: string };

/** Well-known global places to launch. No traffic figures: they change and we don't make them up. */
export const GLOBAL_LAUNCH_SITES: LaunchSite[] = [
  { name: "Product Hunt", url: "https://www.producthunt.com", kind: "launch", price: "free" },
  { name: "Hacker News · Show HN", url: "https://news.ycombinator.com/show", kind: "community", price: "free", tags: "dev" },
  { name: "Indie Hackers", url: "https://www.indiehackers.com", kind: "community", price: "free" },
  { name: "BetaList", url: "https://betalist.com", kind: "directory", price: "freemium" },
  { name: "Reddit · r/SideProject", url: "https://www.reddit.com/r/SideProject/", kind: "community", price: "free" },
  { name: "Peerlist Launchpad", url: "https://peerlist.io/launchpad", kind: "launch", price: "free", tags: "dev" },
  { name: "Uneed", url: "https://www.uneed.best", kind: "launch", price: "freemium" },
  { name: "Microlaunch", url: "https://microlaunch.net", kind: "launch", price: "freemium" },
  { name: "DevHunt", url: "https://devhunt.org", kind: "launch", price: "freemium", tags: "dev" },
  { name: "Fazier", url: "https://fazier.com", kind: "launch", price: "freemium" },
  { name: "AlternativeTo", url: "https://alternativeto.net", kind: "directory", price: "free" },
  { name: "SaaSHub", url: "https://www.saashub.com", kind: "directory", price: "freemium", tags: "SaaS" },
  { name: "Launching Next", url: "https://www.launchingnext.com", kind: "directory", price: "freemium" },
  { name: "There's An AI For That", url: "https://theresanaiforthat.com", kind: "directory", price: "paid", tags: "AI" },
  { name: "Futurepedia", url: "https://www.futurepedia.io", kind: "directory", price: "paid", tags: "AI" },
  { name: "DEV Community", url: "https://dev.to", kind: "community", price: "free", tags: "dev" },
  { name: "X · #buildinpublic", url: "https://x.com/search?q=%23buildinpublic", kind: "social", price: "free" },
];
