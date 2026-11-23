"""Generates src/posts.json: the 60-post content plan (source for `npm run posts` and `npm run posts:pdf`).

Edit the texts here, then (inside video/): python scripts/make_posts.py; npm.cmd run posts; npm.cmd run posts:pdf
"""
import json, pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "src" / "posts.json"
URL = "crownd.dev/br"
posts = []


def post(net, n, fmt, palette, title, objective, alt, caption, tags, slides, after_payments=False):
    posts.append({
        "id": f"{net}-{n:02d}", "net": net, "format": fmt, "palette": palette, "title": title,
        "objective": objective, "alt": alt, "caption": caption.strip(), "hashtags": tags,
        "slides": slides, "afterPayments": after_payments,
    })


def cover(kicker, title, sub="", hi=""):
    return {"t": "cover", "kicker": kicker, "title": title, "sub": sub, "hi": hi}

def text(head, body):
    return {"t": "text", "head": head, "body": body}

def lst(head, items):
    return {"t": "list", "head": head, "items": items}

def stat(value, label, sub=""):
    return {"t": "stat", "value": value, "label": label, "sub": sub}

def compare(lt, l, rt, r, head=""):
    return {"t": "compare", "head": head, "lt": lt, "l": l, "rt": rt, "r": r}

def swatch(slug):
    return {"t": "swatch", "slug": slug}

def quote(q, by=""):
    return {"t": "quote", "q": q, "by": by}

def cta(line1, line2, hint=URL):
    return {"t": "cta", "line1": line1, "line2": line2, "hint": hint}

def board(head):
    return {"t": "board", "head": head}

def step(n, title, body):
    return {"t": "step", "n": n, "title": title, "body": body}


IGH = ["#indiehacker", "#buildinpublic", "#startupbrasil", "#saas", "#empreendedorismo"]
TTH = ["#indiehacker", "#empreendedorismo", "#programacao", "#startup", "#tech"]
LIH = ["#empreendedorismo", "#saas", "#buildinpublic"]

# ════════════════════════════════ INSTAGRAM (1080×1350) ════════════════════════════════
post("ig", 1, "carousel", "obsidian", "Como funciona o Crownd",
     "Educar: explicar o mecanismo inteiro em 5 passos (salvamentos).",
     "Carrossel escuro com a marca Crownd explicando: colar o link, dar o lance, segurar a coroa, pagar só a diferença e lançamentos grátis.",
     """Como funciona o Crownd, em 5 passos 👑

1. Cola o link do seu produto
2. Escolhe quanto quer dar de lance
3. Quem soma mais fica com o #1
4. Já está no board? Paga só a diferença pra subir
5. Não quer pagar? 10 vagas de lançamento grátis por dia

Sem like por pena. Sem algoritmo. Salva pra lembrar e manda pra quem está lançando 🚀
Link na bio.""", IGH,
     [cover("como funciona", "O ranking onde o lance decide.", "5 passos. Sem enrolação.", "o lance"),
      step("1", "Cola o link", "Site, página na loja de apps, repositório no GitHub ou perfil no X."),
      step("2", "Dá o lance", "Quem soma o maior valor fica em primeiro. Empate: quem chegou antes."),
      step("3", "Segura a coroa", "Você reina até alguém passar. Cada troca vai pro Hall da Fama."),
      step("4", "Paga só a diferença", "Já está no board? Cola o mesmo link e sobe pagando só o que falta."),
      cta("Não quer pagar?", "10 lançamentos grátis por dia.")])

post("ig", 2, "single", "verde", "O trono do Brasil está vazio",
     "Gerar urgência e cliques no link da bio.",
     "Fundo verde-copa com o texto 'O trono do Brasil está vazio' e um espaço tracejado do #1 sem dono.",
     """O trono do Brasil está vazio 👑

O Crownd Brasil acabou de abrir e o #1 ainda não tem dono. O primeiro lance começa em R$ 5, e quem chegar primeiro entra pro Hall da Fama. Pra sempre.

Vai deixar pro outro? Link na bio.""", IGH[:3] + ["#produtodigital"],
     [cover("crownd brasil", "O trono do Brasil está vazio.", "Primeiro lance: R$ 5. Quem chegar primeiro entra para a história.", "vazio")],
     after_payments=True)

post("ig", 3, "carousel", "parchment", "6 lugares para lançar no Brasil",
     "Valor prático (salvamentos e compartilhamentos) + autoridade.",
     "Carrossel claro listando comunidades brasileiras de makers: comunidade indie hacker no X, TabNews, r/brdev, LinkedIn, Discords e grupos de WhatsApp/Telegram.",
     """Lançou e ninguém viu? Talvez você só postou no lugar errado.

6 lugares onde os makers brasileiros realmente estão:
→ Comunidade indie hacker BR no X
→ TabNews
→ r/brdev
→ LinkedIn
→ Discords de dev
→ Grupos de WhatsApp e Telegram

Regra de ouro: comece pelo problema que você resolve, não pelo link. Salva esse post pro seu próximo lançamento 💾""", IGH,
     [cover("guia de lançamento", "6 lugares para lançar no Brasil.", "Onde os makers brasileiros realmente estão.", "lançar"),
      lst("Comunidades", ["Comunidade indie hacker BR (X)", "TabNews", "r/brdev"]),
      lst("E também", ["LinkedIn BR", "Discords de dev", "Grupos de WhatsApp e Telegram"]),
      text("A regra de ouro", "Comece pelo problema que você resolve, não pelo link. Ninguém clica em link solto."),
      cta("E depois?", "Lança no Crownd. É grátis.")])

post("ig", 4, "single", "coup", "Like por pena não é validação",
     "Alcance via identificação e humor (comentários).",
     "Fundo vermelho com a frase 'Like por pena não é validação' em letras grandes.",
     """Like da sua mãe, do seu primo e do seu ex-colega de trabalho não é validação 🥲

Validação é alguém clicar porque quis. É isso que o Crownd mede: lance pra quem quer o topo, cliques únicos pra quem lança de graça.

Comenta aqui o pior "parabéns!!" que você já recebeu num lançamento 👇""", IGH[:4],
     [quote("Like por pena não é validação.", "— todo maker, às 3 da manhã")])

post("ig", 5, "carousel", "gold", "Pague só a diferença",
     "Educar sobre o mecanismo de subir no ranking (reduz objeção de preço).",
     "Carrossel amarelo com um exemplo numérico: você pagou R$ 120, o rival tem R$ 150, para voltar ao #1 basta chegar a R$ 155 pagando só R$ 35.",
     """Alguém passou você no ranking. E agora? 😤

No Crownd você NÃO paga tudo de novo. Paga só a diferença:
• você já pagou R$ 120
• o rival tem R$ 150
• pra voltar ao #1: R$ 155
• você paga só R$ 35

Os degraus são de R$ 5, e empate fica com quem chegou primeiro. Marca aquele amigo competitivo 👇""", IGH[:4],
     [cover("mecânica", "Roubaram seu #1? Paga só a diferença.", "", "a diferença"),
      stat("R$ 120", "você já pagou"),
      stat("R$ 150", "o rival tem", "e chegou primeiro, então empate é dele"),
      stat("+ R$ 35", "para voltar ao #1", "total de R$ 155, em degraus de R$ 5"),
      cta("Já está no board?", "Cola o mesmo link e sobe.")], after_payments=True)

post("ig", 6, "carousel", "obsidian", "30 países, 30 cores",
     "Branding e curiosidade (compartilhamentos internacionais).",
     "Carrossel com cartões de cor de cada edição: Shu-iro do Japão, Bleu Klein da França, Oranje da Holanda, Falu Röd da Suécia e Verde Copa do Brasil.",
     """Cada edição do Crownd tem uma cor tirada da cultura local, não da bandeira 🎨

🇯🇵 Shu-iro, o vermelho dos portões torii
🇫🇷 Bleu Klein, o azul do pintor Yves Klein
🇳🇱 Oranje, a cor da torcida holandesa
🇸🇪 Falu Röd, o vermelho das casinhas suecas
🇧🇷 Verde Copa, o verde da torcida em dia de jogo

Qual país você quer dominar? Comenta 👇""", IGH[:3] + ["#design", "#branding"],
     [cover("identidade", "30 países. 30 cores.", "Uma cor da cultura local, não da bandeira.", "30 cores"),
      swatch("jp"), swatch("fr"), swatch("nl"), swatch("se"), swatch("br")])

post("ig", 7, "single", "parchment", "10 vagas grátis por dia",
     "Converter makers sem orçamento (cliques na bio).",
     "Fundo claro com '10 vagas grátis por dia' e uma grade de 10 espaços de lançamento.",
     """Não tem grana pra lance? Tudo bem.

Todo dia o Crownd Brasil abre 10 vagas de lançamento GRÁTIS, ranqueadas por cliques únicos. Zera à meia-noite.

Dica: lança cedo, logo depois da meia-noite, e compartilha. Você ganha o dia inteiro pra juntar cliques 🚀 Link na bio.""", IGH[:3] + ["#lancamento", "#produtodigital"],
     [stat("10", "vagas de lançamento grátis por dia", "ranqueadas por cliques únicos · zera à meia-noite")])

post("ig", 8, "carousel", "night", "Checklist antes de postar o link",
     "Valor (salvamentos) + posicionamento como referência para makers.",
     "Carrossel escuro com um checklist de lançamento: frase de uma linha, link final sem encurtador, imagem de prévia, onde postar e como pedir feedback.",
     """Checklist antes de postar o link do seu produto ✅

☐ Uma frase que explica o que ele faz
☐ Link final, sem encurtador
☐ Prévia bonita quando o link é colado (imagem OG)
☐ Um lugar onde seu público já está
☐ Um pedido claro: testar, comentar ou comprar

Salva e usa no próximo lançamento 💾""", IGH,
     [cover("checklist", "Antes de postar o link.", "5 coisas que mudam o resultado.", "postar o link"),
      lst("O produto", ["Uma frase que explica o que ele faz", "Link final, sem encurtador", "Prévia bonita ao colar o link"]),
      lst("A divulgação", ["Poste onde seu público já está", "Faça um pedido claro", "Responda todo comentário na 1ª hora"]),
      cta("Pronto?", "Lança grátis no Crownd.")])

post("ig", 9, "single", "gold", "Hall da Fama: seu nome aqui",
     "Desejo e status (comentários e marcações).",
     "Fundo dourado com uma placa do Hall da Fama em que a primeira linha diz '??? · o primeiro rei do Brasil'.",
     """Toda coroa fica pra história 👑

O Hall da Fama do Crownd registra cada produto que já foi #1, com data e tempo de reinado. Hoje ele está vazio no Brasil.

Quem você acha que vai ser o primeiro? Marca aqui 👇""", IGH[:4],
     [{"t": "hall"}])

post("ig", 10, "carousel", "verde", "Como o Brasil paga online",
     "Valor para quem vende no Brasil (salvamentos) + autoridade.",
     "Carrossel verde explicando Pix, cartão e boleto e as regras do CDC (7 dias de arrependimento) e da LGPD.",
     """Vai vender online no Brasil? 3 coisas que você precisa saber 🇧🇷

1. Pix é O método de pagamento: QR code, chave copia-e-cola e confirmação na hora.
2. Cartão e boleto ainda importam, principalmente parcelado e B2B.
3. CDC: o consumidor pode desistir de compra online em até 7 dias. E a LGPD rege os dados pessoais.

Salva pra não esquecer 💾""", IGH[:3] + ["#vendasonline", "#lgpd"],
     [cover("guia brasil", "Como o Brasil paga online.", "Pix, cartão, boleto e o que a lei exige.", "paga online"),
      text("Pix", "É O método de pagamento: QR code, chave copia-e-cola e confirmação na hora."),
      text("Cartão e boleto", "Ainda importam, principalmente parcelado e em vendas B2B."),
      text("O que a lei exige", "CDC art. 49: 7 dias para desistir de compra online. LGPD: regras para dados pessoais."),
      cta("Guia completo", "crownd.dev/br/guide", "link na bio")])

post("ig", 11, "single", "obsidian", "Selo ao vivo",
     "Mostrar um benefício do #1 (prova social).",
     "Mockup de um site com o selo 'Crownd Brasil #1 👑' em destaque.",
     """Chegou no topo? Então mostra 👑

Todo produto no Crownd ganha um selo que se atualiza sozinho com a posição dele. Cola no seu site e pronto: prova social ao vivo.

Você colocaria o seu ranking no site? Sim ou não 👇""", IGH[:4],
     [{"t": "badge"}])

post("ig", 12, "carousel", "parchment", "Bastidores: o que construímos",
     "Build in public: confiança e humanização da marca.",
     "Carrossel claro com números reais do projeto: 30 edições, 14 idiomas, 24 moedas, analytics público sem cookies.",
     """Bastidores do Crownd 🛠️

O que existe por trás do ranking:
• 30 edições, uma por país
• 14 idiomas
• 24 moedas locais
• analytics público, sem cookies e sem guardar IP

Construído em público. Pergunta o que quiser nos comentários 👇""", IGH,
     [cover("build in public", "O que tem por trás do Crownd.", "", "por trás"),
      stat("30", "edições", "uma por país"),
      stat("14", "idiomas", "com textos adaptados à cultura de cada país"),
      stat("15", "moedas", "cada país paga na sua"),
      text("Privacidade", "Analytics público, sem cookies e sem guardar IP. Qualquer pessoa pode ver."),
      cta("Pergunta o que quiser", "nos comentários 👇", "@crowndbr")])

# ════════════════════════════════ X (1600×900) ════════════════════════════════
post("x", 1, "single", "obsidian", "Lançamento",
     "Anunciar e fixar no perfil.",
     "Card escuro: 'O ranking onde o lance decide' com o símbolo do Crownd.",
     """Lançamos o Crownd 👑

Um ranking público de produtos indie pra cada país. No Brasil, quem dá o maior lance fica com o #1. Quem não quer pagar tem 10 lançamentos grátis por dia.

Sem upvote por pena. Sem algoritmo.

crownd.dev/br""", ["#buildinpublic"],
     [cover("crownd.dev", "O ranking onde o lance decide.", "30 países · 30 coroas", "o lance")])

post("x", 2, "single", "coup", "Hot take: upvote não é validação",
     "Engajamento por opinião forte (respostas e reposts).",
     "Card vermelho com a frase 'Upvote não é validação. Clique é.'",
     """Hot take: upvote não é validação.

Upvote é favor. Validação é alguém clicar no seu link porque quis, ou pagar porque acredita.

Concorda ou discorda?""", [],
     [quote("Upvote não é validação. Clique é.")])

post("x", 3, "carousel", "obsidian", "Como funciona (4 imagens)",
     "Explicar o mecanismo em formato de thread com 4 imagens.",
     "Quatro cards: colar o link, dar o lance, segurar a coroa, pagar só a diferença.",
     """Como funciona o Crownd, em 4 imagens 🧵

1/ Cola o link do produto
2/ Dá o lance: o maior total fica com o #1
3/ Segura a coroa até alguém passar
4/ Quer subir? Paga só a diferença

E tem 10 lançamentos grátis por dia → crownd.dev/br""", [],
     [step("1", "Cola o link", "Site, loja de apps, GitHub ou perfil no X."),
      step("2", "Dá o lance", "O maior total fica com o #1."),
      step("3", "Segura a coroa", "Até alguém passar. Tudo vai pro Hall da Fama."),
      step("4", "Paga só a diferença", "Nunca paga tudo de novo.")])

post("x", 4, "single", "night", "Stack do Crownd",
     "Build in public para devs (credibilidade técnica).",
     "Card escuro listando a stack: Next.js 16, Cloudflare Workers, D1, Stripe.",
     """A stack do Crownd, pra quem curte bastidor:

• Next.js 16 (App Router)
• Cloudflare Workers + D1 na borda
• Stripe: cartão e boleto no Brasil
• 30 edições, 14 idiomas, 24 moedas
• analytics próprio sem cookies

Pergunta qualquer coisa 👇""", ["#buildinpublic"],
     [lst("A stack", ["Next.js 16 · App Router", "Cloudflare Workers + D1", "Stripe · 24 moedas", "Analytics sem cookies"])])

post("x", 5, "single", "gold", "Enquete: R$ 5 pelo #1",
     "Enquete nativa do X (respostas e dados de intenção).",
     "Card amarelo com a pergunta 'Você pagaria R$ 5 para ser o #1 do Brasil por um dia?'.",
     """Pergunta sincera pros makers:

Você pagaria R$ 5 pra colocar seu produto no #1 do Brasil?

(Crie a enquete do X com as opções: "Na hora" · "Depende do produto" · "Só de graça" · "Quero ver os resultados")""", [],
     [quote("Você pagaria R$ 5 para ser o #1 do Brasil?")], after_payments=True)

post("x", 6, "single", "parchment", "Analytics público",
     "Transparência como diferencial (cliques no link).",
     "Card claro com um gráfico e a URL crownd.dev/analytics.",
     """Nosso analytics é público.

Visitantes, países e páginas mais vistas, aberto pra qualquer pessoa. Sem cookies e sem guardar IP.

Transparência total: crownd.dev/analytics""", ["#buildinpublic"],
     [{"t": "analytics"}])

post("x", 7, "carousel", "obsidian", "Uma cor por país (4 imagens)",
     "Branding e curiosidade (reposts).",
     "Quatro cards de cor: Shu-iro (Japão), Bleu Klein (França), Oranje (Holanda) e Verde Copa (Brasil).",
     """Cada edição do Crownd tem uma cor da cultura local, não da bandeira:

🇯🇵 Shu-iro, o vermelho dos torii
🇫🇷 Bleu Klein
🇳🇱 Oranje
🇧🇷 Verde Copa

Qual é a mais bonita?""", [],
     [swatch("jp"), swatch("fr"), swatch("nl"), swatch("br")])

post("x", 8, "single", "night", "Dica: lance à meia-noite",
     "Dica prática (salvamentos e reposts).",
     "Card escuro com o relógio 00:01 e a dica de lançar logo após a meia-noite.",
     """Dica de lançamento no Crownd:

As 10 vagas grátis zeram à meia-noite. Quem lança às 00:01 tem o dia inteiro pra juntar cliques únicos.

Lança cedo. Compartilha de manhã. Sobe o dia todo.""", [],
     [stat("00:01", "o melhor horário para lançar grátis", "as vagas zeram à meia-noite")])

post("x", 9, "single", "verde", "O trono está vazio",
     "Urgência (cliques no link).",
     "Card verde com 'O #1 do Brasil ainda não tem dono'.",
     """O #1 do Crownd Brasil ainda não tem dono.

O primeiro a chegar entra pro Hall da Fama. Pra sempre.

crownd.dev/br""", [],
     [cover("crownd brasil", "O #1 do Brasil ainda não tem dono.", "", "não tem dono")], after_payments=True)

post("x", 10, "single", "parchment", "SEO em 30 países",
     "Build in public com valor técnico (autoridade com devs).",
     "Card claro com 5 lições de SEO internacional.",
     """5 coisas que aprendi fazendo SEO pra 30 países ao mesmo tempo:

1. hreflang em malha completa, com x-default
2. Uma pasta por país, não subdomínio
3. Canonical em toda página
4. Sitemap com data real de mudança, nunca "agora"
5. llms.txt pras IAs também acharem você""", ["#buildinpublic"],
     [lst("SEO em 30 países", ["hreflang em malha + x-default", "Uma pasta por país", "Canonical em toda página", "lastmod real no sitemap", "llms.txt para IAs"])])

post("x", 11, "single", "gold", "Selo ao vivo",
     "Benefício do #1.",
     "Mockup de site com o selo Crownd Brasil #1.",
     """Chegou no #1? Mostra.

O selo do Crownd se atualiza sozinho com a sua posição. Cola no site e vira prova social ao vivo.""", [],
     [{"t": "badge"}])

post("x", 12, "single", "coup", "Marca um maker",
     "Gerar marcações e alcance orgânico.",
     "Card vermelho com 'Marca um maker que merece o #1'.",
     """Marca um maker brasileiro que merece o #1 👇

A gente dá uma olhada em todo produto que aparecer aqui.""", [],
     [cta("Marca um maker", "que merece o #1.", "@crowndbr")])

# ════════════════════════════════ LINKEDIN (1080×1350) ════════════════════════════════
post("li", 1, "single", "obsidian", "Lançamento institucional",
     "Anúncio oficial da página da empresa.",
     "Card escuro com o logo Crownd e o texto '30 países. 30 coroas.'",
     """Hoje apresentamos o Crownd.

O Crownd é uma rede de rankings públicos de produtos digitais independentes, com uma edição para cada um de 30 países. Em cada edição, quem dá o maior lance ocupa o #1, e dez vagas diárias de lançamento gratuito são ranqueadas por cliques únicos.

Por que fizemos isso? Porque lançar um produto hoje depende de algoritmo, de rede de contatos e de pedir voto. Quisemos uma regra simples e transparente, inclusive com o analytics aberto ao público.

Começamos pelo Brasil: crownd.dev/br

Se você constrói produtos digitais, adoraríamos ver o seu por lá.""", LIH,
     [cover("crownd.dev", "30 países. 30 coroas.", "Rankings públicos de produtos independentes.", "30 coroas")])

post("li", 2, "carousel", "parchment", "Upvote x lance: qual é mais justo?",
     "Liderança de pensamento (comentários qualificados).",
     "Carrossel claro comparando rankings por voto e rankings por lance, com prós e contras de cada um.",
     """Rankings por voto parecem democráticos. Mas são mesmo?

Em plataformas de voto, quem tem mais rede vence, e a qualidade do produto pesa menos. Num ranking por lance, a regra é explícita: o topo custa um valor público, e qualquer pessoa sabe quanto.

Não é o modelo perfeito. Por isso o Crownd combina os dois: lance para o topo e lançamentos gratuitos ranqueados por cliques únicos.

Qual modelo você acha mais justo? Quero ler sua opinião.""", LIH,
     [cover("reflexão", "Upvote ou lance: qual é mais justo?", "", "mais justo"),
      compare("Voto", ["Quem tem mais rede vence", "Regras opacas", "Grátis, mas custa tempo"], "Lance", ["Preço público e visível", "Regra explícita", "Custa dinheiro"], "Os dois modelos"),
      text("O meio-termo", "Lance para o topo. Vagas gratuitas diárias ranqueadas por cliques únicos, um por pessoa por dia."),
      cta("E você?", "Qual modelo é mais justo?", "comente")])

post("li", 3, "carousel", "verde", "Como lançar um produto digital no Brasil",
     "Conteúdo de referência (salvamentos e compartilhamentos).",
     "Carrossel verde com comunidades, meios de pagamento e exigências legais para lançar no Brasil.",
     """Guia rápido: como lançar um produto digital no Brasil.

1. Comunidades: TabNews, r/brdev, comunidade indie hacker no X, Discords e grupos de WhatsApp/Telegram.
2. Pagamentos: Pix é o padrão; cartão e boleto ainda contam, principalmente em B2B.
3. Lei: CDC (7 dias para desistência em compras online) e LGPD (dados pessoais), além de identificar quem vende (Decreto 7.962/2013).

O guia completo, com o preço do #1 ao vivo, está em crownd.dev/br/guide""", LIH,
     [cover("guia", "Como lançar um produto digital no Brasil.", "", "no Brasil"),
      lst("Onde estão os makers", ["TabNews e r/brdev", "Comunidade indie hacker (X)", "Discords, WhatsApp, Telegram"]),
      lst("Como o Brasil paga", ["Pix: instantâneo", "Cartão: parcelamento", "Boleto: ainda forte no B2B"]),
      lst("O que a lei exige", ["CDC: 7 dias de desistência", "LGPD: dados pessoais", "Decreto 7.962: identificar o vendedor"]),
      cta("Guia completo", "crownd.dev/br/guide", "link nos comentários")])

post("li", 4, "single", "parchment", "Analytics aberto",
     "Transparência como valor da marca.",
     "Card claro com gráfico e o endereço crownd.dev/analytics.",
     """Decidimos deixar o analytics do Crownd público.

Visitantes, países e páginas mais vistas ficam abertos para qualquer pessoa em crownd.dev/analytics. Sem cookies e sem armazenar IP: o visitante vira um código anônimo que muda todos os dias.

Transparência não é discurso quando os números estão à vista.""", LIH,
     [{"t": "analytics"}])

post("li", 5, "carousel", "night", "Arquitetura: 30 países na borda",
     "Autoridade técnica (recrutamento e parcerias).",
     "Carrossel escuro sobre a arquitetura: Next.js, Cloudflare Workers, D1, Stripe e segurança.",
     """Como servir 30 países com uma equipe enxuta?

• Uma aplicação Next.js rodando na borda da Cloudflare, perto de cada usuário
• Banco D1 (SQLite distribuído)
• Stripe com 24 moedas, cartão e carteiras digitais
• Limite de requisições, CSRF e CSP rígida
• Nenhum segredo dentro do código publicado

Arquitetura simples, custo baixo, latência baixa.""", LIH,
     [cover("engenharia", "30 países numa única borda.", "", "única borda"),
      lst("A base", ["Next.js 16 · App Router", "Cloudflare Workers", "D1 · SQLite distribuído"]),
      lst("Pagamentos", ["Stripe · 24 moedas", "Cartão, Apple Pay e Google Pay", "Webhooks idempotentes"]),
      lst("Segurança", ["Rate limiting na borda", "CSRF e CSP rígida", "Segredos fora do código"]),
      cta("Construído em público.", "Pergunte nos comentários.", "comente")])

post("li", 6, "single", "obsidian", "Privacidade por design",
     "Reforçar confiança (LGPD/GDPR).",
     "Card escuro com 'Sem cookies. Sem IP.'",
     """Privacidade por design, não por banner.

O analytics do Crownd não usa cookies e não armazena IP. Cada visitante vira um código que muda todo dia, então ninguém é rastreado entre dias. Por isso não há banner de consentimento.

Dá para medir bem sem vigiar ninguém.""", LIH,
     [stat("0", "cookies", "e nenhum IP armazenado")])

post("li", 7, "carousel", "parchment", "SEO internacional: 5 lições",
     "Valor técnico (salvamentos de profissionais de marketing e devs).",
     "Carrossel claro com cinco lições de SEO internacional.",
     """5 lições de SEO internacional ao lançar em 30 países de uma vez:

1. Malha completa de hreflang, com x-default
2. Uma pasta por país (crownd.dev/br), não subdomínios
3. Canonical em toda página
4. Sitemap com a data real da última mudança
5. llms.txt e dados estruturados para as IAs citarem você

Qual delas você já aplica?""", LIH,
     [cover("seo", "SEO internacional: 5 lições.", "", "5 lições"),
      step("1", "hreflang em malha", "Todas as versões apontam para todas, mais um x-default."),
      step("2", "Uma pasta por país", "crownd.dev/br concentra a autoridade num só domínio."),
      step("3", "Canonical sempre", "Cada página diz qual é a sua versão oficial."),
      step("4", "lastmod real", "O sitemap informa quando a página mudou de verdade."),
      step("5", "Pense nas IAs", "llms.txt e FAQ estruturado para respostas de IA.")])

post("li", 8, "single", "verde", "Cada cor, uma cultura",
     "Branding e storytelling.",
     "Cartão com a cor Verde Copa da edição brasileira.",
     """Cada edição do Crownd tem uma cor tirada da cultura local, não da bandeira.

No Brasil, é o Verde Copa: o verde da torcida em dia de jogo. No Japão, o Shu-iro dos portões torii. Na França, o Bleu Klein.

Detalhes assim fazem um produto global parecer local.""", LIH,
     [swatch("br")])

post("li", 9, "carousel", "gold", "Checklist de lançamento",
     "Valor prático.",
     "Carrossel amarelo com um checklist de lançamento em duas partes: produto e divulgação.",
     """Checklist antes de anunciar o seu produto:

Produto
✔ Uma frase que explica o que ele faz
✔ Link final, sem encurtador
✔ Prévia (imagem OG) bonita

Divulgação
✔ Publique onde o seu público já está
✔ Faça um pedido claro
✔ Responda a todos na primeira hora

Salve para o próximo lançamento.""", LIH,
     [cover("checklist", "Antes de anunciar o seu produto.", "", "anunciar"),
      lst("Produto", ["Frase de uma linha", "Link final, sem encurtador", "Prévia (imagem OG)"]),
      lst("Divulgação", ["Onde o público já está", "Pedido claro", "Respostas na 1ª hora"]),
      cta("Pronto?", "Lance grátis no Crownd.", "crownd.dev/br")])

post("li", 10, "single", "gold", "O Hall da Fama",
     "Storytelling e status.",
     "Placa do Hall da Fama com a primeira posição em aberto.",
     """Daqui a alguns anos, alguém vai perguntar: qual foi o primeiro produto a ocupar o #1 do Brasil no Crownd?

A resposta vai estar no Hall da Fama, que registra cada troca de coroa com data e tempo de reinado.

Hoje, a primeira linha ainda está em branco.""", LIH,
     [{"t": "hall"}])

post("li", 11, "carousel", "obsidian", "Mecânica de preço",
     "Explicar o modelo de negócio (transparência para investidores e makers).",
     "Carrossel escuro explicando lance mínimo, degraus, empate e pagamento da diferença.",
     """Como funciona o preço do #1 no Crownd:

• Lance mínimo e degraus de R$ 5 no Brasil (cada país na sua moeda)
• O total pago define a posição
• Empate: fica à frente quem chegou primeiro
• Para subir, você paga só a diferença

Um modelo simples, público e previsível.""", LIH,
     [cover("modelo", "Como funciona o preço do #1.", "", "preço"),
      text("Lance mínimo", "R$ 5 no Brasil, em degraus de R$ 5. Cada país na sua moeda."),
      text("Posição", "O total pago define a posição. Empate: fica à frente quem chegou primeiro."),
      text("Subir", "Você paga só a diferença, nunca o valor inteiro de novo."),
      cta("Simples e público.", "crownd.dev/br/rules", "link nos comentários")], after_payments=True)

post("li", 12, "single", "parchment", "Convite: lance grátis",
     "Converter a audiência profissional.",
     "Card claro com '10 vagas de lançamento gratuitas por dia'.",
     """Você está construindo um produto digital?

O Crownd Brasil tem 10 vagas de lançamento gratuitas por dia, ranqueadas por cliques únicos. Basta o nome, o link e uma frase.

Comente com o link do seu produto: vamos olhar um por um.""", LIH,
     [stat("10", "vagas de lançamento gratuitas por dia", "crownd.dev/br/launches")])

# ════════════════════════════════ TIKTOK (1080×1920, modo foto) ════════════════════════════════
post("tt", 1, "carousel", "obsidian", "POV: 3 likes",
     "Humor e identificação (alcance).",
     "Carrossel vertical em formato meme: 6 meses de trabalho, 3 likes, um deles da mãe.",
     """POV: você passou 6 meses criando seu produto 🥲 #indiehacker""", TTH,
     [cover("POV", "6 meses criando o seu produto.", "", "6 meses"),
      stat("3", "likes"),
      quote("Um deles foi da sua mãe.", "🥲"),
      cta("No Crownd não existe", "like por pena.", "@crownd.dev")])

post("tt", 2, "carousel", "night", "Coisas que todo indie hacker já fez",
     "Humor e identificação (compartilhamentos).",
     "Carrossel vertical listando situações típicas de quem lança produtos.",
     """Se você fez 3 dessas, você é indie hacker 😂""", TTH,
     [cover("todo indie hacker já", "Coisas que todo indie hacker já fez.", "", "já fez"),
      quote("Comprou o domínio antes de ter a ideia."),
      quote("Lançou às 3 da manhã."),
      quote("Pediu voto no grupo da família."),
      quote("Refez a landing page 7 vezes."),
      cta("Quantas você fez?", "Comenta 👇", "@crownd.dev")])

post("tt", 3, "carousel", "parchment", "Lançar grátis em 4 passos",
     "Tutorial (salvamentos).",
     "Carrossel vertical claro com os 4 passos para lançar grátis no Crownd.",
     """Como lançar seu produto de graça em 4 passos 🚀 salva pra não esquecer""", TTH,
     [cover("tutorial", "Lança grátis em 4 passos.", "", "grátis"),
      step("1", "Abre o Crownd", "crownd.dev/br"),
      step("2", "Lançamentos", "Toca em 'Lançar de graça'."),
      step("3", "Preenche", "Nome, link e uma frase que vende."),
      step("4", "Compartilha", "Cliques únicos decidem quem sobe."),
      cta("10 vagas por dia.", "Zera à meia-noite.", "@crownd.dev")])

post("tt", 4, "carousel", "obsidian", "Qual país tem a cor mais bonita?",
     "Engajamento por votação nos comentários.",
     "Carrossel vertical com cinco cores de edições: Japão, França, Holanda, Suécia e Brasil.",
     """Qual país tem a cor mais bonita? Comenta o número 👇""", TTH[:3] + ["#design"],
     [cover("vota", "Qual país tem a cor mais bonita?", "", "mais bonita"),
      swatch("jp"), swatch("fr"), swatch("nl"), swatch("se"), swatch("br")])

post("tt", 5, "single", "verde", "O trono do Brasil está vazio",
     "Urgência.",
     "Imagem vertical verde: 'O trono do Brasil está vazio'.",
     """O #1 do Brasil ainda não tem dono 👑 link na bio""", TTH[:3],
     [cover("crownd brasil", "O trono do Brasil está vazio.", "Quem chegar primeiro entra para a história.", "vazio")], after_payments=True)

post("tt", 6, "carousel", "coup", "Red flags de lançamento",
     "Humor + dica (compartilhamentos).",
     "Carrossel vertical vermelho com 'red flags' de lançamento.",
     """Red flags no lançamento do seu produto 🚩""", TTH,
     [cover("🚩 red flags", "Red flags de lançamento.", "", "Red flags"),
      quote("Link com encurtador."),
      quote("'Em breve' na landing page."),
      quote("Nenhuma frase dizendo o que faz."),
      quote("Lançar e sumir dos comentários."),
      cta("Evitou todas?", "Lança no Crownd.", "@crownd.dev")])

post("tt", 7, "carousel", "night", "Upvote vs Lance",
     "Comparação (comentários com opinião).",
     "Carrossel vertical comparando upvote e lance.",
     """Upvote ou lance: qual é mais justo? 🤔""", TTH,
     [cover("time", "Upvote ou lance?", "", "lance"),
      compare("Upvote", ["Quem tem mais amigo vence", "Regra escondida"], "Lance", ["Preço público", "Regra clara"]),
      cta("Qual time você é?", "Comenta 👇", "@crownd.dev")])

post("tt", 8, "single", "night", "3 da manhã",
     "Meme rápido (alcance).",
     "Imagem vertical com o relógio 03:00 e 'lançamento no ar'.",
     """3 da manhã e o produto finalmente no ar 😵‍💫""", TTH[:3],
     [stat("03:00", "lançamento no ar", "0 horas de sono")])

post("tt", 9, "carousel", "parchment", "Tour pelo Crownd",
     "Mostrar o produto (consideração).",
     "Carrossel vertical mostrando o board, os lançamentos grátis e o Hall da Fama.",
     """Tour rápido pelo Crownd 👑""", TTH,
     [cover("tour", "Um tour pelo Crownd.", "", "tour"),
      board("O board"),
      stat("10", "lançamentos grátis por dia"),
      {"t": "hall"},
      cta("Bora?", "crownd.dev/br", "@crownd.dev")])

post("tt", 10, "carousel", "coup", "Tipos de maker no grupo",
     "Humor (marcações).",
     "Carrossel vertical com arquétipos engraçados de makers.",
     """Marca o amigo que é o número 3 😂""", TTH,
     [cover("os tipos", "Tipos de maker no grupo.", "", "maker"),
      quote("1. O que tem 14 projetos e 0 lançados."),
      quote("2. O que refaz o logo toda semana."),
      quote("3. O que pede voto às 3 da manhã."),
      quote("4. O que já está faturando e não fala."),
      cta("Qual é você?", "Comenta o número 👇", "@crownd.dev")])

post("tt", 11, "carousel", "gold", "Seu produto está pronto para o #1?",
     "Quiz (interação e salvamentos).",
     "Carrossel vertical amarelo com um teste de 4 perguntas.",
     """Faz o teste: seu produto está pronto pro #1? ✅""", TTH,
     [cover("teste", "Seu produto está pronto para o #1?", "", "pronto"),
      quote("Alguém além de você usa?"),
      quote("Dá pra explicar em uma frase?"),
      quote("O link abre rápido no celular?"),
      quote("Você responderia comentários hoje?"),
      cta("4 sins?", "Então lança.", "@crownd.dev")])

post("tt", 12, "single", "gold", "Quem vai ser o primeiro rei?",
     "Desejo e marcações.",
     "Imagem vertical com a placa do Hall da Fama em aberto.",
     """Quem vai ser o primeiro #1 do Brasil? Marca aqui 👇""", TTH[:3],
     [{"t": "hall"}])

# ════════════════════════════════ THREADS (1080×1350) ════════════════════════════════
post("th", 1, "single", "coup", "Like por pena conta?",
     "Conversa (respostas).",
     "Card vermelho com a pergunta 'Like por pena conta como validação?'.",
     """Pergunta sincera: like por pena conta como validação?

Porque se contar, eu sou um sucesso desde 2019 🥲""", ["Indie Hackers"],
     [quote("Like por pena conta como validação?")])

post("th", 2, "single", "obsidian", "Lançamos",
     "Anúncio.",
     "Card escuro com o símbolo e 'O ranking onde o lance decide'.",
     """Lançamos o Crownd: um ranking público de produtos indie pra cada país.

No Brasil, o maior lance fica com o #1. E tem 10 lançamentos grátis por dia.

crownd.dev/br""", ["Build in Public"],
     [cover("crownd.dev", "O ranking onde o lance decide.", "", "o lance")])

post("th", 3, "carousel", "parchment", "Como funciona em 3 imagens",
     "Explicar o produto.",
     "Três cards claros: cola o link, dá o lance, segura a coroa.",
     """Como funciona o Crownd em 3 imagens 👇""", ["Indie Hackers"],
     [step("1", "Cola o link", "Do seu produto, app ou perfil."),
      step("2", "Dá o lance", "O maior total fica com o #1."),
      step("3", "Segura a coroa", "Até alguém passar.")])

post("th", 4, "single", "night", "Opinião impopular",
     "Debate (respostas).",
     "Card escuro com a opinião impopular.",
     """Opinião impopular: pagar pra aparecer é mais honesto do que pedir voto.

Pelo menos a regra é clara e o preço é público. Discorda? Me convence.""", ["Empreendedorismo"],
     [quote("Pagar para aparecer é mais honesto do que pedir voto.", "— opinião impopular")])

post("th", 5, "single", "verde", "Qual produto merece o #1?",
     "Comunidade e descoberta de makers.",
     "Card verde com 'Qual produto brasileiro merece o #1?'.",
     """Qual produto brasileiro merece o #1?

Pode ser seu ou de alguém. Manda o link aqui embaixo 👇""", ["Startups"],
     [cta("Qual produto", "merece o #1?", "manda o link 👇")])

post("th", 6, "single", "parchment", "Bastidores em números",
     "Build in public.",
     "Card claro com '30 edições · 14 idiomas · 24 moedas'.",
     """Bastidores do Crownd:

30 edições, 14 idiomas, 24 moedas, analytics público sem cookies.

Feito em público. Pergunta o que quiser.""", ["Build in Public"],
     [lst("Bastidores", ["30 edições", "14 idiomas", "24 moedas", "Analytics sem cookies"])])

post("th", 7, "single", "night", "Dica: 00:01",
     "Dica útil.",
     "Card escuro com o horário 00:01.",
     """Dica: as vagas grátis do Crownd zeram à meia-noite.

Quem lança às 00:01 tem o dia todo pra juntar cliques. Anota aí.""", ["Indie Hackers"],
     [stat("00:01", "o melhor horário para lançar grátis")])

post("th", 8, "single", "verde", "Trono vazio",
     "Urgência.",
     "Card verde com 'O trono do Brasil está vazio'.",
     """O trono do Brasil ainda está vazio 👑

Quem vai ser o primeiro?""", ["Startups"],
     [cover("crownd brasil", "O trono do Brasil está vazio.", "", "vazio")], after_payments=True)

post("th", 9, "single", "parchment", "Analytics aberto",
     "Transparência.",
     "Card claro com o gráfico do analytics público.",
     """Nosso analytics é aberto pra qualquer pessoa ver: crownd.dev/analytics

Sem cookies, sem IP. Transparência de verdade.""", ["Build in Public"],
     [{"t": "analytics"}])

post("th", 10, "single", "verde", "A cor do Brasil",
     "Branding.",
     "Cartão Verde Copa.",
     """A cor do Crownd Brasil é o Verde Copa: o verde da torcida em dia de jogo 💚

Cada país tem a sua. Qual você escolheria pro seu?""", ["Design"],
     [swatch("br")])

post("th", 11, "single", "gold", "Selo ao vivo",
     "Benefício.",
     "Mockup de site com o selo #1.",
     """Chegou no #1? O selo do Crownd mostra no seu site, ao vivo, e se atualiza sozinho.

Você colocaria?""", ["Indie Hackers"],
     [{"t": "badge"}])

post("th", 12, "single", "coup", "Seu pior lançamento",
     "Conversa e histórias (respostas longas).",
     "Card vermelho com 'Qual foi o seu pior lançamento?'.",
     """Me conta: qual foi o seu pior lançamento?

O meu teve 3 likes. Um era da minha mãe.""", ["Empreendedorismo"],
     [quote("Qual foi o seu pior lançamento?")])

OUT.write_text(json.dumps(posts, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(posts), "posts ·", sum(len(p["slides"]) for p in posts), "imagens")
