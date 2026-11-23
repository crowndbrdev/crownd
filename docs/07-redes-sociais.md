# 07 · Redes sociais: perfis, bios e conteúdo de lançamento

> **Plano de 60 posts (12 por rede: Instagram, X, LinkedIn, TikTok e Threads):** [brand/social/Crownd-Plano-de-Conteudo-60-posts.pdf](../brand/social/Crownd-Plano-de-Conteudo-60-posts.pdf). As imagens estão em `brand/social/posts/<rede>/`. Para editar ou regerar, mude os textos em `video/scripts/make_posts.py` e rode, dentro de `video/`, `python scripts/make_posts.py`, `npm.cmd run posts` e `npm.cmd run posts:pdf`.

Arquivos prontos em [brand/social/png/](../brand/social/png/). Para regerar depois de editar textos ou cores: `node scripts/brand/render-social.mjs && bash scripts/brand/rasterize.sh`.

| Peça | Arquivo | Tamanho |
|---|---|---|
| Foto de perfil (todas as redes) | `avatar-dark.png` (principal), `avatar-light.png`, `avatar-gold.png` | 1080×1080 |
| Capa do X | `x-header.png` | 1500×500 |
| Capa do LinkedIn | `linkedin-cover.png` | 1584×396 |
| 9 posts do Instagram (PT-BR) | `instagram-post-01…09.png` | 1080×1350 (4:5, ocupa mais tela no feed) |
| 9 posts do X (EN) | `x-post-01…09.png` | 1600×900 (16:9) |
| 9 posts do LinkedIn (PT-BR) | `linkedin-post-01…09.png` | 1200×1200 |

**Por que esses idiomas:** a onda 1 é o Brasil, e Instagram e LinkedIn são onde o público brasileiro de makers e fundadores está. O X é a casa global do *build in public* e dos indie hackers, então fala inglês e serve a todas as edições.

## Nomes e usernames

**Perfis criados (14/11/2026)**, já ligados ao site pelo rodapé (`rel="me"`) e pelo `Organization.sameAs` (variável `NEXT_PUBLIC_SAME_AS` em `.env.production`):

| Rede | URL |
|---|---|
| YouTube | https://www.youtube.com/@CrowndBR |
| Instagram | https://www.instagram.com/crowndbr/ |
| X | https://x.com/crowndbr |
| LinkedIn | https://www.linkedin.com/in/crownd-undefined-21a64044b/ (perfil pessoal: troque por uma página de empresa, veja abaixo) |

Para adicionar ou trocar um perfil, edite a lista em `.env.production` e rode `npm.cmd run deploy`.

Proposta original de handles (referência):

Estratégia: **um handle só em todas as redes, igual ao domínio** (`crownd.dev`). Isso é fácil de lembrar, reforça o link e ninguém confunde com outra marca "Crown".

| Rede | Nome do perfil (campo pesquisável) | Username 1ª opção | Alternativas, nesta ordem |
|---|---|---|---|
| Instagram | **Crownd · Leaderboard de produtos** | `@crownd.dev` | `@crownd`, `@crownd.app`, `@crowndhq` |
| X | **Crownd 👑 Who's #1?** | `@crownddev` | `@crownd`, `@crowndhq`, `@getcrownd` |
| LinkedIn (página de empresa) | **Crownd** | `linkedin.com/company/crownd-dev` | `/company/crownd`, `/company/crowndhq` |

Não consegui verificar a disponibilidade dos usernames: as redes exigem login, e esta sessão não tem acesso ao navegador. Use a primeira opção livre de cada linha e mantenha o mesmo padrão nas três redes.

No Instagram, o **nome** do perfil entra na busca. Por isso ele leva a palavra-chave "Leaderboard de produtos" em vez de repetir só a marca.

## Bios

**Instagram** (até 150 caracteres):
```
👑 O leaderboard público de produtos indie
🇧🇷 Pague em reais e pegue o #1 do Brasil
🚀 10 lançamentos grátis por dia
👇 Quem está no trono agora?
```
Link da bio: `https://crownd.dev/br?utm_source=instagram&utm_medium=bio`

**X** (até 160 caracteres):
```
Public leaderboards for indie products in 20 countries. Highest bid wears the crown 👑 Launch free daily. Who's #1 in yours?
```
Site: `https://crownd.dev?utm_source=x&utm_medium=bio` · Localização: `20 countries 🌍`

**LinkedIn: tagline** (até 120 caracteres):
```
Leaderboards públicos de produtos indie em 20 países. O lance decide o #1. Lançamentos grátis todo dia.
```

**LinkedIn: Sobre:**
> O Crownd é uma rede de leaderboards públicos de produtos independentes, com uma edição para cada um de 20 países: Brasil, EUA, Japão, Alemanha, Reino Unido e mais. Em cada edição, makers pagam na moeda local para ocupar o #1, e quem já está no board paga só a diferença para subir. Dez vagas de lançamento grátis por dia são ranqueadas por cliques únicos. Cada troca de coroa entra para o Hall da Fama. Sem upvote por pena, sem algoritmo: transparência total, inclusive o analytics, que é público.
>
> Setor: Internet / Software · Site: crownd.dev

## Pilares de conteúdo

1. **A disputa:** quem está no trono, trocas de coroa, cronômetro de reinado. É o conteúdo que mais engaja, porque é ao vivo e tem rivalidade.
2. **O mecanismo:** como funciona, pagar só a diferença, lançamentos grátis.
3. **Os makers:** destaque para o #1 e os lançamentos do dia, sempre com marcação. Cada maker marcado compartilha.
4. **Transparência:** analytics aberto, receita (*build in public*), aprendizados.
5. **Cultura por país:** a cor de cada edição, curiosidades de cada ecossistema indie.

## Legendas dos 9 posts

As imagens têm o mesmo número nas três redes; o texto se adapta a cada uma.

| # | Instagram / LinkedIn (PT-BR) | X (EN) |
|---|---|---|
| 01 · Lançamento | 20 países. 20 coroas. Um leaderboard público de produtos indie para cada país, e quem paga mais usa a coroa. Começamos pelo Brasil 🇧🇷 Link na bio. | We just launched 20 public leaderboards for indie products, one per country. Highest bid wears the crown 👑 Which country's throne will fall first? crownd.dev |
| 02 · Como funciona | Cola o link → dá o seu lance → segura a coroa até alguém cobrir. Quando isso acontecer, a gente te avisa na hora. Simples assim. | How it works: 1) paste your link 2) name your price 3) hold the crown until someone outbids you. We email you the second it happens. |
| 03 · Provocação | Ninguém aqui vai te dar upvote por pena. Vai deixar o #1 pro outro viralizar? 😏 | No pity upvotes. No algorithm. Someone else is about to go viral at #1. Will it be you? |
| 04 · Paga só a diferença | Já está no board? Cola o mesmo link e aumenta o lance. Você paga **só a diferença**, nunca tudo de novo. | Already on the board? Paste the same link and climb. You only pay the difference. Never pay twice. |
| 05 · Lançamentos grátis | 10 vagas grátis por dia, ranqueadas por cliques únicos. Zera à meia-noite. Lança o seu e compartilha para subir 🚀 | 10 free launch slots a day in every country, ranked by unique clicks. Resets at local midnight. Ship it 🚀 |
| 06 · Hall da Fama | Todo #1 fica para a história. Cada troca de coroa vira registro permanente no Hall da Fama. Quem vai ser o primeiro? | Every #1 goes down in history. Each change of crown is recorded forever in the Hall of Fame. |
| 07 · Selo ao vivo | Mostra a sua posição: o selo do Crownd se atualiza sozinho no seu site e ainda vira backlink para o seu produto. | Show off your rank: a live badge for your site that updates itself, and links back to you. |
| 08 · Cada país, sua cor | Cada edição tem uma cor tirada da cultura local, não da bandeira: Shu-iro dos torii no Japão, Bleu Klein na França, Oranje na Holanda, Verde Copa aqui 💚 | Every edition gets a colour from local culture, not its flag: Shu-iro in Japan, Klein Blue in France, Oranje in the Netherlands, Falu red in Sweden. |
| 09 · Trono vazio | O trono do Brasil está vazio. Seja o primeiro #1, a partir de R$ 5 no cartão ou boleto. Quem chega primeiro entra para a história. | Most thrones are still empty. Be the first #1 in your country, from the equivalent of $1, in your own currency. |

**Hashtags.** No Instagram, use de 3 a 5 por post (mais do que isso não ajuda mais): `#indiehacker #buildinpublic #saas #startupbrasil #produtodigital`. No LinkedIn, até 3: `#empreendedorismo #saas #buildinpublic`. No X, no máximo 1, porque hashtags derrubam o alcance lá: `#buildinpublic`.

> ⚠️ Os posts 05 e 09 mencionam pagamento. Publique o 09 só depois que a chave **live** do Stripe estiver ativa; antes disso o site mostra "pagamentos abrem em breve".

## Calendário da semana de lançamento

| Dia | Instagram | X | LinkedIn |
|---|---|---|---|
| D0 | 01 + Story com link | Thread de lançamento: 01 → 02 → 04 → 09 | 01 + post pessoal do fundador contando o porquê |
| D1 | 02 | 03 | 02 |
| D2 | 05 (Reels: tela gravada lançando um produto) | 05 | 05 |
| D3 | 04 | 04 + print do analytics público | 04 |
| D4 | 08 (carrossel: uma cor por slide) | 08 | 08 |
| D5 | 06 | 06 | 06 |
| D6 | 07 + 09 | 07 | 09 |

**Rotina contínua.** Toda troca de #1 vira um post ou Story ("👑 a coroa caiu!"), usando a OG image automática do site (`/br/opengraph-image`). Isso pode ser automatizado lendo o RSS `/br/feed.xml` com Zapier, IFTTT ou Make, publicando no X e no Telegram.

## Regras de marca para quem for postar

- O dourado é **só** para #1 e coroa.
- Os números (posições, valores, tempo) sempre em JetBrains Mono.
- Títulos com menos de 5 palavras. Uma ideia por post.
- Tom competitivo, nunca cruel: provoque quem quer o #1, jamais zombe de quem perdeu.
- Nunca invente números, depoimentos ou produtos "no trono". Use só dados reais do board.
