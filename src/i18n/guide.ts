import type { Lang } from "@/config/countries";

/**
 * Launch-guide copy (pillar page per edition). The page body is mostly country DATA
 * (communities, payment methods, local stack, law, live prices) — these strings are the
 * connective tissue. Placeholders: {country} {demonym} {amount} {n} {min} {days} {legal} {date}.
 */
export type GuideMessages = {
  nav: string; title: string; description: string; intro: string;
  hCommunities: string; communities: string;
  hPayments: string; payments: string; cards: string;
  hTools: string;
  hLegal: string; legal: string; withdrawal: string; withdrawalNone: string;
  hSearch: string; search: string;
  hPrice: string; price: string; priceEmpty: string;
  updated: string;
};

export const GUIDE: Record<Lang, GuideMessages> = {
  en: {
    nav: "Launch guide",
    title: "How to launch a product in {country}",
    description: "Where makers in {country} gather, how people pay, what the law requires and what #1 costs today — the practical launch guide.",
    intro: "Everything you need to launch in {country}: where the community gathers, how people actually pay, what the law requires, and what it costs to reach #1 right now.",
    hCommunities: "Where makers gather", communities: "Post where {demonym} builders already spend time. Lead with the problem you solve, not with a link.",
    hPayments: "How people pay", payments: "Offering the methods locals trust moves conversion more than lowering the price.", cards: "Cards",
    hTools: "Local stack",
    hLegal: "What the law requires", legal: "Selling online here means publishing: {legal}.", withdrawal: "Consumers can cancel online purchases within {days} days.", withdrawalNone: "There is no statutory cooling-off for digital services delivered immediately — but state your refund policy clearly.",
    hSearch: "Search engines that matter", search: "Besides Google, these engines send real traffic here:",
    hPrice: "What #1 costs today", price: "Right now #1 costs {amount}. The board lists {n} products and a spot starts at {min}.", priceEmpty: "The throne is empty — the first bid of {min} takes #1.",
    updated: "Updated {date}",
  },
  pt: {
    nav: "Guia de lançamento",
    title: "Como lançar um produto no {country}",
    description: "Onde os makers do {country} se reúnem, como as pessoas pagam, o que a lei exige e quanto custa o #1 hoje: o guia prático de lançamento.",
    intro: "Tudo o que você precisa para lançar no {country}: onde a comunidade está, como as pessoas pagam de verdade, o que a lei exige e quanto custa chegar ao #1 agora.",
    hCommunities: "Onde os makers estão", communities: "Poste onde os makers {demonym} já passam o tempo. Comece pelo problema que você resolve, não pelo link.",
    hPayments: "Como as pessoas pagam", payments: "Oferecer os métodos em que o público confia converte mais do que baixar o preço.", cards: "Cartões",
    hTools: "Stack local",
    hLegal: "O que a lei exige", legal: "Vender online aqui exige publicar: {legal}.", withdrawal: "O consumidor pode desistir de compras online em até {days} dias.", withdrawalNone: "Não há prazo legal de arrependimento para serviço digital entregue na hora, mas deixe sua política de reembolso clara.",
    hSearch: "Buscadores que importam", search: "Além do Google, estes buscadores trazem tráfego real aqui:",
    hPrice: "Quanto custa o #1 hoje", price: "Agora o #1 custa {amount}. O board tem {n} produtos e uma vaga começa em {min}.", priceEmpty: "O trono está vazio: o primeiro lance de {min} já leva o #1.",
    updated: "Atualizado em {date}",
  },
  es: {
    nav: "Guía de lanzamiento",
    title: "Cómo lanzar un producto en {country}",
    description: "Dónde se reúnen los makers en {country}, cómo paga la gente, qué exige la ley y cuánto cuesta el #1 hoy: la guía práctica de lanzamiento.",
    intro: "Todo lo que necesitas para lanzar en {country}: dónde está la comunidad, cómo paga realmente la gente, qué exige la ley y cuánto cuesta llegar al #1 ahora mismo.",
    hCommunities: "Dónde están los makers", communities: "Publica donde los makers {demonym} ya pasan su tiempo. Empieza por el problema que resuelves, no por el enlace.",
    hPayments: "Cómo paga la gente", payments: "Ofrecer los métodos en los que confía la gente convierte más que bajar el precio.", cards: "Tarjetas",
    hTools: "Stack local",
    hLegal: "Qué exige la ley", legal: "Vender online aquí implica publicar: {legal}.", withdrawal: "Los consumidores pueden cancelar compras online en un plazo de {days} días.", withdrawalNone: "No hay plazo legal de desistimiento para servicios digitales entregados al momento, pero explica tu política de reembolso.",
    hSearch: "Buscadores que importan", search: "Además de Google, estos buscadores traen tráfico real aquí:",
    hPrice: "Cuánto cuesta el #1 hoy", price: "Ahora mismo el #1 cuesta {amount}. Hay {n} productos en el ranking y un puesto empieza en {min}.", priceEmpty: "El trono está vacío: la primera puja de {min} se lleva el #1.",
    updated: "Actualizado el {date}",
  },
  ja: {
    nav: "ローンチガイド",
    title: "{country}でプロダクトをローンチする方法",
    description: "{country}の開発者が集まる場所、支払い方法、法律上の表記、いまの1位の価格まで。実践的なローンチガイドです。",
    intro: "{country}でローンチするために必要なことをまとめました。コミュニティの場所、実際に使われている支払い方法、法律で求められる表記、そしていま1位になるための金額です。",
    hCommunities: "開発者が集まる場所", communities: "{demonym}の開発者がすでに集まっている場所で発信しましょう。リンクよりも、解決する課題から書き始めるのがおすすめです。",
    hPayments: "よく使われる支払い方法", payments: "値下げよりも、信頼されている支払い方法を用意するほうがコンバージョンにつながります。", cards: "クレジットカード",
    hTools: "国内スタック",
    hLegal: "法律で求められること", legal: "オンライン販売では次の掲載が必要です：{legal}。", withdrawal: "オンライン購入は{days}日以内であれば取り消しが可能です。", withdrawalNone: "即時提供のデジタルサービスにはクーリングオフはありませんが、返金ポリシーを明記しましょう。",
    hSearch: "重要な検索エンジン", search: "Google以外にも、次の検索エンジンから実際の流入があります：",
    hPrice: "いまの1位の価格", price: "現在、1位は{amount}です。掲載中のプロダクトは{n}件、最低{min}から掲載できます。", priceEmpty: "王座は空いています。最初の{min}の入札で1位になれます。",
    updated: "{date} 更新",
  },
  ko: {
    nav: "런칭 가이드",
    title: "{country}에서 프로덕트를 런칭하는 방법",
    description: "{country} 메이커들이 모이는 곳, 결제 방식, 법적 필수 사항, 오늘의 1위 가격까지. 실전 런칭 가이드예요.",
    intro: "{country}에서 런칭하는 데 필요한 모든 것: 커뮤니티가 모이는 곳, 실제로 쓰는 결제 수단, 법적 요구 사항, 그리고 지금 1위가 되는 데 드는 비용이에요.",
    hCommunities: "메이커들이 모이는 곳", communities: "{demonym} 메이커들이 이미 머무는 곳에 올리세요. 링크보다 해결하는 문제부터 이야기하는 게 좋아요.",
    hPayments: "자주 쓰는 결제 수단", payments: "가격을 낮추는 것보다 신뢰받는 결제 수단을 제공하는 게 전환에 더 효과적이에요.", cards: "신용카드",
    hTools: "국내 스택",
    hLegal: "법적 필수 사항", legal: "온라인 판매 시 다음을 게시해야 해요: {legal}.", withdrawal: "소비자는 온라인 구매를 {days}일 이내에 철회할 수 있어요.", withdrawalNone: "즉시 제공되는 디지털 서비스는 법정 철회 기간이 없지만, 환불 정책은 분명히 적어 두세요.",
    hSearch: "중요한 검색 엔진", search: "구글 외에도 이 검색 엔진들이 실제 트래픽을 보내요:",
    hPrice: "오늘의 1위 가격", price: "지금 1위는 {amount}예요. 보드에 {n}개 프로덕트가 있고, {min}부터 등록할 수 있어요.", priceEmpty: "왕좌가 비어 있어요. 첫 {min} 입찰이 1위가 돼요.",
    updated: "{date} 업데이트",
  },
  de: {
    nav: "Launch-Guide",
    title: "Ein Produkt in {country} launchen",
    description: "Wo sich Maker in {country} treffen, wie Menschen bezahlen, was das Gesetz verlangt und was Platz 1 heute kostet – der praktische Launch-Guide.",
    intro: "Alles, was du für einen Launch in {country} brauchst: wo die Community ist, wie Menschen wirklich bezahlen, was das Gesetz verlangt und was Platz 1 gerade kostet.",
    hCommunities: "Wo sich Maker treffen", communities: "Poste dort, wo Maker aus {country} ohnehin unterwegs sind. Beginne mit dem Problem, das du löst – nicht mit dem Link.",
    hPayments: "Wie Menschen bezahlen", payments: "Vertraute Zahlungsarten anzubieten bringt mehr Conversion als ein niedrigerer Preis.", cards: "Kreditkarten",
    hTools: "Lokaler Stack",
    hLegal: "Was das Gesetz verlangt", legal: "Wer hier online verkauft, muss veröffentlichen: {legal}.", withdrawal: "Verbraucher können Online-Käufe innerhalb von {days} Tagen widerrufen.", withdrawalNone: "Für sofort erbrachte digitale Leistungen gibt es kein gesetzliches Widerrufsrecht – nenne deine Erstattungsregeln trotzdem klar.",
    hSearch: "Relevante Suchmaschinen", search: "Neben Google bringen diese Suchmaschinen hier echten Traffic:",
    hPrice: "Was Platz 1 heute kostet", price: "Platz 1 kostet gerade {amount}. Auf dem Board stehen {n} Produkte, ein Platz beginnt bei {min}.", priceEmpty: "Der Thron ist frei – das erste Gebot von {min} holt Platz 1.",
    updated: "Aktualisiert am {date}",
  },
  fr: {
    nav: "Guide de lancement",
    title: "Lancer un produit en {country}",
    description: "Où se retrouvent les makers en {country}, comment les gens paient, ce qu'exige la loi et ce que coûte la 1re place aujourd'hui : le guide pratique.",
    intro: "Tout ce qu'il faut pour lancer en {country} : où se trouve la communauté, comment les gens paient vraiment, ce qu'exige la loi et ce que coûte la 1re place en ce moment.",
    hCommunities: "Où se retrouvent les makers", communities: "Publie là où les makers {demonym} passent déjà du temps. Commence par le problème que tu résous, pas par le lien.",
    hPayments: "Comment les gens paient", payments: "Proposer les moyens de paiement de confiance convertit mieux qu'une baisse de prix.", cards: "Cartes bancaires",
    hTools: "Stack locale",
    hLegal: "Ce qu'exige la loi", legal: "Vendre en ligne ici impose de publier : {legal}.", withdrawal: "Les consommateurs peuvent se rétracter dans un délai de {days} jours.", withdrawalNone: "Pas de délai légal de rétractation pour un service numérique fourni immédiatement — mais affiche clairement ta politique de remboursement.",
    hSearch: "Les moteurs qui comptent", search: "En plus de Google, ces moteurs apportent un vrai trafic ici :",
    hPrice: "Le prix de la 1re place aujourd'hui", price: "En ce moment, la 1re place coûte {amount}. Le classement compte {n} produits et une place commence à {min}.", priceEmpty: "Le trône est vacant : la première enchère de {min} prend la 1re place.",
    updated: "Mis à jour le {date}",
  },
  it: {
    nav: "Guida al lancio",
    title: "Come lanciare un prodotto in {country}",
    description: "Dove si ritrovano i maker in {country}, come paga la gente, cosa chiede la legge e quanto costa il #1 oggi: la guida pratica al lancio.",
    intro: "Tutto quello che serve per lanciare in {country}: dove si trova la community, come paga davvero la gente, cosa chiede la legge e quanto costa arrivare al #1 adesso.",
    hCommunities: "Dove si ritrovano i maker", communities: "Pubblica dove i maker {demonym} passano già il loro tempo. Parti dal problema che risolvi, non dal link.",
    hPayments: "Come paga la gente", payments: "Offrire i metodi di cui la gente si fida converte più di un prezzo più basso.", cards: "Carte",
    hTools: "Stack locale",
    hLegal: "Cosa chiede la legge", legal: "Vendere online qui richiede di pubblicare: {legal}.", withdrawal: "I consumatori possono recedere dagli acquisti online entro {days} giorni.", withdrawalNone: "Non c'è un diritto di recesso per i servizi digitali forniti subito, ma indica chiaramente la tua politica di rimborso.",
    hSearch: "Motori di ricerca che contano", search: "Oltre a Google, questi motori portano traffico reale qui:",
    hPrice: "Quanto costa il #1 oggi", price: "In questo momento il #1 costa {amount}. In classifica ci sono {n} prodotti e un posto parte da {min}.", priceEmpty: "Il trono è libero: la prima offerta da {min} prende il #1.",
    updated: "Aggiornato il {date}",
  },
  nl: {
    nav: "Lanceergids",
    title: "Een product lanceren in {country}",
    description: "Waar makers in {country} samenkomen, hoe mensen betalen, wat de wet vraagt en wat #1 vandaag kost — de praktische lanceergids.",
    intro: "Alles wat je nodig hebt om te lanceren in {country}: waar de community zit, hoe mensen echt betalen, wat de wet vraagt en wat #1 op dit moment kost.",
    hCommunities: "Waar makers samenkomen", communities: "Post waar {demonym} makers al hun tijd doorbrengen. Begin met het probleem dat je oplost, niet met de link.",
    hPayments: "Hoe mensen betalen", payments: "Vertrouwde betaalmethoden aanbieden levert meer conversie op dan een lagere prijs.", cards: "Creditcards",
    hTools: "Lokale stack",
    hLegal: "Wat de wet vraagt", legal: "Online verkopen betekent hier dat je publiceert: {legal}.", withdrawal: "Consumenten mogen online aankopen binnen {days} dagen annuleren.", withdrawalNone: "Voor direct geleverde digitale diensten geldt geen wettelijke bedenktijd, maar vermeld je terugbetaalbeleid duidelijk.",
    hSearch: "Zoekmachines die ertoe doen", search: "Naast Google sturen deze zoekmachines hier echt verkeer:",
    hPrice: "Wat #1 vandaag kost", price: "Op dit moment kost #1 {amount}. Er staan {n} producten op de lijst en een plek begint bij {min}.", priceEmpty: "De troon is leeg: het eerste bod van {min} pakt #1.",
    updated: "Bijgewerkt op {date}",
  },
  id: {
    nav: "Panduan peluncuran",
    title: "Cara meluncurkan produk di {country}",
    description: "Tempat para maker di {country} berkumpul, cara orang membayar, aturan hukumnya, dan harga #1 hari ini — panduan peluncuran praktis.",
    intro: "Semua yang kamu perlukan untuk meluncur di {country}: di mana komunitasnya, bagaimana orang benar-benar membayar, apa yang diwajibkan hukum, dan berapa biaya untuk jadi #1 sekarang.",
    hCommunities: "Tempat para maker berkumpul", communities: "Posting di tempat para maker {demonym} sudah biasa nongkrong. Mulailah dari masalah yang kamu selesaikan, bukan dari link.",
    hPayments: "Cara orang membayar", payments: "Menyediakan metode pembayaran yang dipercaya lebih menaikkan konversi daripada menurunkan harga.", cards: "Kartu kredit/debit",
    hTools: "Stack lokal",
    hLegal: "Yang diwajibkan hukum", legal: "Berjualan online di sini berarti wajib mencantumkan: {legal}.", withdrawal: "Konsumen dapat membatalkan pembelian online dalam {days} hari.", withdrawalNone: "Tidak ada masa pembatalan wajib untuk layanan digital yang langsung diberikan, tapi jelaskan kebijakan refund-mu.",
    hSearch: "Mesin pencari yang penting", search: "Selain Google, mesin pencari ini membawa trafik nyata di sini:",
    hPrice: "Harga #1 hari ini", price: "Saat ini #1 seharga {amount}. Ada {n} produk di papan dan satu posisi mulai dari {min}.", priceEmpty: "Singgasana masih kosong — bid pertama {min} langsung jadi #1.",
    updated: "Diperbarui {date}",
  },
  ar: {
    nav: "دليل الإطلاق",
    title: "كيف تطلق منتجًا في {country}",
    description: "أين يجتمع صنّاع المنتجات في {country}، وكيف يدفع الناس، وما يشترطه النظام، وكم يكلف المركز الأول اليوم — دليل إطلاق عملي.",
    intro: "كل ما تحتاجه للإطلاق في {country}: أين يجتمع المجتمع، وكيف يدفع الناس فعلًا، وما يشترطه النظام، وكم يكلف الوصول إلى المركز الأول الآن.",
    hCommunities: "أين يجتمع صنّاع المنتجات", communities: "انشر حيث يقضي صنّاع المنتجات في {demonym} وقتهم بالفعل. ابدأ بالمشكلة التي تحلها، لا بالرابط.",
    hPayments: "كيف يدفع الناس", payments: "توفير وسائل الدفع الموثوقة يرفع التحويل أكثر من خفض السعر.", cards: "البطاقات",
    hTools: "أدوات محلية",
    hLegal: "ما يشترطه النظام", legal: "البيع عبر الإنترنت هنا يتطلب نشر: {legal}.", withdrawal: "يحق للمستهلك إلغاء المشتريات الإلكترونية خلال {days} أيام.", withdrawalNone: "لا توجد مهلة إلغاء نظامية للخدمات الرقمية المقدمة فورًا، لكن وضّح سياسة الاسترداد.",
    hSearch: "محركات البحث المهمة", search: "إلى جانب Google، تجلب هذه المحركات زيارات حقيقية هنا:",
    hPrice: "تكلفة المركز الأول اليوم", price: "يكلف المركز الأول الآن {amount}. في اللوحة {n} منتجًا، ويبدأ المكان من {min}.", priceEmpty: "العرش شاغر — أول مزايدة بمبلغ {min} تحجز المركز الأول.",
    updated: "تم التحديث {date}",
  },
  tr: {
    nav: "Lansman rehberi",
    title: "Türkiye'de ürün lansmanı nasıl yapılır",
    description: "Türkiye'de üreticilerin buluştuğu yerler, insanların nasıl ödediği, yasanın ne istediği ve bugün 1 numaranın fiyatı — pratik lansman rehberi.",
    intro: "Türkiye'de lansman için ihtiyacın olan her şey: topluluğun nerede olduğu, insanların gerçekte nasıl ödediği, yasanın ne istediği ve şu an 1 numaraya çıkmanın maliyeti.",
    hCommunities: "Üreticilerin buluştuğu yerler", communities: "Türk üreticilerin zaten vakit geçirdiği yerlerde paylaş. Linkle değil, çözdüğün problemle başla.",
    hPayments: "İnsanlar nasıl ödüyor", payments: "Güvenilen ödeme yöntemlerini sunmak, fiyat düşürmekten daha çok dönüşüm getirir.", cards: "Kartlar",
    hTools: "Yerel araçlar",
    hLegal: "Yasanın istedikleri", legal: "Burada online satış yapmak şunları yayımlamayı gerektirir: {legal}.", withdrawal: "Tüketiciler online alışverişlerden {days} gün içinde cayabilir.", withdrawalNone: "Anında sunulan dijital hizmetlerde yasal cayma süresi yoktur, ama iade politikanı açıkça yaz.",
    hSearch: "Önemli arama motorları", search: "Google'ın yanında bu arama motorları da burada gerçek trafik getirir:",
    hPrice: "Bugün 1 numaranın fiyatı", price: "Şu an 1 numara {amount}. Listede {n} ürün var ve bir yer {min} tutarından başlıyor.", priceEmpty: "Taht boş — {min} tutarındaki ilk teklif 1 numarayı alır.",
    updated: "{date} tarihinde güncellendi",
  },
  pl: {
    nav: "Poradnik premiery",
    title: "Jak wypuścić produkt w Polsce",
    description: "Gdzie spotykają się twórcy w Polsce, jak ludzie płacą, czego wymaga prawo i ile dziś kosztuje #1 — praktyczny poradnik premiery.",
    intro: "Wszystko, czego potrzebujesz do premiery w Polsce: gdzie jest społeczność, jak ludzie naprawdę płacą, czego wymaga prawo i ile teraz kosztuje miejsce #1.",
    hCommunities: "Gdzie spotykają się twórcy", communities: "Publikuj tam, gdzie polscy twórcy już spędzają czas. Zacznij od problemu, który rozwiązujesz, a nie od linku.",
    hPayments: "Jak ludzie płacą", payments: "Zaufane metody płatności podnoszą konwersję bardziej niż niższa cena.", cards: "Karty",
    hTools: "Lokalny stack",
    hLegal: "Czego wymaga prawo", legal: "Sprzedaż online wymaga tu opublikowania: {legal}.", withdrawal: "Konsument może odstąpić od zakupu online w ciągu {days} dni.", withdrawalNone: "Usługi cyfrowe świadczone od razu nie mają ustawowego prawa odstąpienia, ale jasno opisz zasady zwrotów.",
    hSearch: "Wyszukiwarki, które się liczą", search: "Oprócz Google te wyszukiwarki dają tu realny ruch:",
    hPrice: "Ile dziś kosztuje #1", price: "Teraz miejsce #1 kosztuje {amount}. W rankingu jest {n} produktów, a miejsce zaczyna się od {min}.", priceEmpty: "Tron jest pusty — pierwsza oferta za {min} zdobywa #1.",
    updated: "Zaktualizowano {date}",
  },
  sv: {
    nav: "Lanseringsguide",
    title: "Så lanserar du en produkt i {country}",
    description: "Var skapare i {country} samlas, hur folk betalar, vad lagen kräver och vad #1 kostar idag — den praktiska lanseringsguiden.",
    intro: "Allt du behöver för att lansera i {country}: var communityn finns, hur folk faktiskt betalar, vad lagen kräver och vad det kostar att nå #1 just nu.",
    hCommunities: "Var skaparna samlas", communities: "Posta där {demonym} skapare redan håller till. Börja med problemet du löser, inte med länken.",
    hPayments: "Hur folk betalar", payments: "Att erbjuda betalsätt folk litar på höjer konverteringen mer än ett lägre pris.", cards: "Kort",
    hTools: "Lokal stack",
    hLegal: "Vad lagen kräver", legal: "Att sälja online här innebär att du publicerar: {legal}.", withdrawal: "Konsumenter kan ångra onlineköp inom {days} dagar.", withdrawalNone: "Digitala tjänster som levereras direkt har ingen lagstadgad ångerrätt, men beskriv tydligt din återbetalningspolicy.",
    hSearch: "Sökmotorer som spelar roll", search: "Förutom Google ger dessa sökmotorer riktig trafik här:",
    hPrice: "Vad #1 kostar idag", price: "Just nu kostar #1 {amount}. Listan har {n} produkter och en plats börjar på {min}.", priceEmpty: "Tronen är ledig — första budet på {min} tar #1.",
    updated: "Uppdaterad {date}",
  },
};

/** Regional fixes where the base language's grammar breaks with the country name. */
const GUIDE_OVERRIDES: Record<string, Partial<GuideMessages>> = {
  ch: {
    title: "Ein Produkt in der Schweiz lancieren",
    description: "Wo sich Maker in der Schweiz treffen, wie Menschen bezahlen, was das Gesetz verlangt und was Platz 1 heute kostet – der praktische Launch-Guide.",
    intro: "Alles, was du für einen Launch in der Schweiz brauchst: wo die Community ist, wie Menschen wirklich bezahlen, was das Gesetz verlangt und was Platz 1 gerade kostet.",
    communities: "Poste dort, wo Maker aus der Schweiz ohnehin unterwegs sind. Beginne mit dem Problem, das du löst – nicht mit dem Link.",
  },
  pt: {
    title: "Como lançar um produto em Portugal",
    description: "Onde estão os makers em Portugal, como as pessoas pagam, o que a lei exige e quanto custa o #1 hoje: o guia prático de lançamento.",
    intro: "Tudo o que precisas para lançar em Portugal: onde está a comunidade, como as pessoas pagam de facto, o que a lei exige e quanto custa chegar ao #1 agora.",
    communities: "Publica onde os makers portugueses já passam o tempo. Começa pelo problema que resolves, não pelo link.",
    withdrawal: "O consumidor pode desistir de compras online até {days} dias.",
    price: "Neste momento o #1 custa {amount}. O board tem {n} produtos e uma vaga começa em {min}.",
    priceEmpty: "O trono está vazio: o primeiro lance de {min} fica com o #1.",
  },
  ar: { communities: "Publicá donde los makers {demonym} ya pasan su tiempo. Empezá por el problema que resolvés, no por el link." },
  uk: { title: "How to launch a product in the UK" },
  us: { title: "How to launch a product in the USA" },
};

export function getGuide(lang: Lang, slug: string): GuideMessages {
  const base = { ...GUIDE[lang], ...GUIDE_OVERRIDES[slug] };
  return slug === "ch" ? (Object.fromEntries(Object.entries(base).map(([k, v]) => [k, v.replace(/ß/g, "ss")])) as GuideMessages) : base;
}

/** Brand names of payment methods (proper nouns — not translated). */
export const PAYMENT_NAMES: Record<string, string> = {
  apple_pay: "Apple Pay", google_pay: "Google Pay", link: "Link", cashapp: "Cash App Pay", amazon_pay: "Amazon Pay",
  konbini: "Konbini", paypay: "PayPay", paypal: "PayPal", klarna: "Klarna", sepa_debit: "SEPA", pay_by_bank: "Pay by Bank",
  cartes_bancaires: "Cartes Bancaires", upi: "UPI", netbanking: "Netbanking", satispay: "Satispay", acss_debit: "PAD (ACSS)",
  pix: "Pix", boleto: "Boleto", kakao_pay: "KakaoPay", naver_pay: "Naver Pay", samsung_pay: "Samsung Pay", payco: "PAYCO",
  afterpay_clearpay: "Afterpay", au_becs_debit: "BECS", bizum: "Bizum", oxxo: "OXXO", spei: "SPEI", mercadopago: "Mercado Pago",
  qris: "QRIS", gopay: "GoPay", ovo: "OVO", dana: "DANA", bank_transfer: "Bank transfer", ideal: "iDEAL", mada: "mada",
  stc_pay: "STC Pay", tabby: "Tabby", twint: "TWINT", postfinance: "PostFinance", blik: "BLIK", p24: "Przelewy24", swish: "Swish",
  mbway: "MB WAY", multibanco: "Multibanco", pse: "PSE", nequi: "Nequi", webpay: "Webpay", paynow: "PayNow", grabpay: "GrabPay",
  gcash: "GCash", maya: "Maya", revolut_pay: "Revolut Pay", snapscan: "SnapScan",
};
