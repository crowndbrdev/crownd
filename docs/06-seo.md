# 06 · SEO: como chegar ao topo do Google nos 20 países

> **Expectativa honesta:** ninguém garante a 1ª posição no Google. O que dá para fazer é montar a estrutura que o Google recompensa e mirar primeiro em termos de **baixa concorrência e alta intenção** em cada idioma. Prazo realista: **3 a 9 meses** por edição para a primeira página nesses termos.

Metodologia aplicada: checklists do [claude-seo](https://github.com/AgricIDaniel/claude-seo) (`seo-hreflang`, `seo-programmatic`, `seo-schema`, `seo-geo`).

## 1. Arquitetura (já implementada)

**Subpastas num domínio único** (`crownd.dev/jp`, `/de`…), não ccTLDs (`crownd.jp`):
- Toda a autoridade (backlinks) se soma num domínio só. Com 20 ccTLDs, você começaria do zero 20 vezes.
- Vários ccTLDs exigem presença local (`.jp`, `.ca`, `.au`, `.kr`…).
- Um único deploy e uma única base de código.
- Os sinais locais vêm do hreflang, do idioma, da moeda, do conteúdo local e dos backlinks locais.

**Hreflang** ([src/lib/seo.ts](../src/lib/seo.ts)):
- Malha completa nas páginas estruturais (home, lançamentos, ferramentas, Hall da Fama, regras): 20 idiomas mais `x-default`, com autorreferência e tags de retorno. Validado: **21 tags por página**.
- Códigos ISO corretos: `en-GB` (nunca `en-UK`), `ja-JP` (nunca `jp`), `de-CH`, `ar-SA`.
- `x-default` aponta para o hub global `/` (seletor de países).
- **Páginas de produto não têm hreflang.** Cada produto existe em uma edição só, e fingir que há equivalentes seria um erro.
- Sitemap com `xhtml:link` alternates (199 URLs; o código gera tudo automaticamente).

**Sem redirecionamento forçado por IP**: o Googlebot rastreia a partir dos EUA e nunca veria `/jp`. Quem decide é o usuário (seletor) ou o Google (hreflang).

**Qualidade programática** (regras do `seo-programmatic`):
- Página de produto com descrição fina recebe `noindex, follow` e fica fora do sitemap até ter conteúdo real.
- Cada página de produto tem dados únicos (posição, lance, cliques, data). Não é texto trocando só o nome da cidade.
- Links pagos usam `rel="sponsored"`, como o Google exige para links pagos (evita penalidade).
- Rotas de clique (`/go/`), API e checkout ficam bloqueadas no robots.

**Dados estruturados:** WebSite, Organization com as 20 edições, ItemList do board, BreadcrumbList e WebPage.

**GEO (busca por IA):** `/llms.txt` lista as 20 edições e o #1 atual de cada uma. `/api/board/{país}` é uma API JSON pública que IAs e devs podem citar.

**Velocidade (Core Web Vitals e eficiência de rastreamento):** todas as páginas das edições são **estáticas com ISR**. A CDN serve HTML pronto, que revalida a cada 1 a 5 min e **na hora** em que alguém paga ou lança (`revalidatePath`). O Googlebot nunca espera o banco de dados.

**Indexação rápida:** a cada troca de #1 ou lançamento, o site avisa Bing, Yandex, Naver e Seznam via **IndexNow** (`INDEXNOW_KEY`). O Google não usa IndexNow: para ele valem o sitemap (com `lastModified` real) e o Search Console.

**Conteúdo-pilar:** `/{país}/guide` é o guia "Como lançar um produto no [país]", com dados únicos de cada país: comunidades, métodos de pagamento, stack local, exigências legais, buscadores e o **preço atual do #1, ao vivo**. Tem JSON-LD de Article e BreadcrumbList, e recebe links de todas as páginas.

**Links internos:** o menu e o rodapé levam ao guia. Cada produto linka os vizinhos de ranking e o guia (modelo de hub e spoke).

**Outros:** RSS por edição (`/{país}/feed.xml`), útil para agregadores e para automatizar o bot "a coroa caiu" com IFTTT ou Zapier. Também web manifest, HSTS e metatags de verificação (Google, Bing, Naver, Yandex) via variáveis de ambiente.

**Auditoria automatizada:** `npm run seo:check` percorre o sitemap inteiro aplicando os checklists do claude-seo: status, `lang`, H1 único, título, description, canonical, hreflang válido com autorreferência, x-default e **reciprocidade**, JSON-LD válido, `noindex` indevido e títulos duplicados. Sai com código 1 se houver erro, então pode bloquear um deploy. Resultado atual: **219 páginas, 0 erros e 0 avisos.**

## 2. Palavras-chave por edição (ponto de partida)

Valide o volume no Google Keyword Planner, no Ahrefs ou com `/seo cluster` do claude-seo.

| Edição | Termos-alvo (baixa concorrência e intenção clara) |
|---|---|
| 🇧🇷 | produtos brasileiros, saas brasileiro, indie hacker brasil, onde divulgar meu saas, lançar produto digital |
| 🇺🇸 | indie product leaderboard, where to launch my saas, product hunt alternative, show hn alternative |
| 🇯🇵 | 個人開発 ランキング, 個人開発 宣伝 方法, サービス 告知 場所, インディーハッカー |
| 🇰🇷 | 인디 프로덕트, 사이드 프로젝트 홍보, 1인 개발 서비스 홍보, 프로덕트 헌트 한국 |
| 🇩🇪 | Indie Hacker Deutschland, SaaS bekannt machen, Startup Launch Plattform |
| 🇫🇷 | indie maker france, où lancer son saas, alternative product hunt française |
| 🇪🇸/🇲🇽 | dónde lanzar mi saas, indie hackers en español, alternativa a product hunt |
| 🇮🇹 | indie hacker italia, lanciare un saas, promuovere startup |
| 🇳🇱 | indie hacker nederland, saas lanceren |
| 🇵🇱 | indie hacker polska, jak wypromować aplikację |
| 🇸🇪 | lansera saas sverige, indie hackers sverige |
| 🇹🇷 | girişim tanıtım sitesi, saas lansmanı |
| 🇮🇩 | promosi aplikasi gratis, indie hacker indonesia |
| 🇸🇦 | منصة إطلاق المنتجات, ترويج تطبيق سعودي |
| 🇮🇳 | indian saas startups list, launch saas india |

Cada termo principal pede **uma página-pilar** escrita por um nativo. Exemplo: `/br/guia/onde-divulgar-seu-saas`, com dados reais do board. Esse é o próximo módulo a construir (rota `/[country]/guia/[slug]`, já prevista no modelo de hub e spoke).

## 3. Backlinks: o motor real do ranking

1. **Selo ao vivo** (`/api/badge/{país}/{slug}`): cada maker que embute o selo cria um backlink contextual e local. Incentive com "ganhe 7 dias de destaque nos lançamentos ao embutir o selo".
2. **Data PR**: um relatório trimestral "Quanto custa ser #1 em 20 países" (os dados são exclusivos seus). Jornalistas de tecnologia de cada país adoram ranking entre países.
3. **Hall da Fama** como notícia: "Produto X reinou 47 dias no Japão".
4. **Diretórios e listas awesome** de cada país, incluindo um PR no awesome-indie-hackers.
5. **Repositório "awesome-crownd"** público: a curadoria de ferramentas vira backlink do GitHub e aceita contribuições.

## 4. Mecanismos além do Google

| Edição | Ação |
|---|---|
| 🇰🇷 Coreia | **Naver Search Advisor**: o Naver tem cerca de 40 a 60% da busca. Publique também no Naver Blog. |
| 🇹🇷 Turquia | Yandex Webmaster |
| 🇯🇵 Japão | O Yahoo! Japan usa o índice do Google; o Bing tem participação relevante no desktop |
| Todos | **Bing Webmaster Tools** (alimenta ChatGPT Search e Copilot) e IndexNow |

## 5. AEO e GEO: ser a resposta das IAs (implementado)

*AEO* (Answer Engine Optimization) é ser citado nas respostas diretas, como AI Overviews, featured snippets e assistentes de voz. *GEO* (Generative Engine Optimization) é ser citado pelo ChatGPT, Claude, Perplexity, Copilot e Gemini. Ambos dependem de as IAs **conseguirem ler** o site e de ele ter **respostas curtas e citáveis**.

| Camada | O que existe | Onde |
|---|---|---|
| Acesso | Todos os buscadores e robôs de IA liberados: GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended e CCBot. Testado em produção: todos recebem 200. | `/robots.txt` |
| Intenção explícita | `Content-Signal: search=yes, ai-input=yes, ai-train=yes`, o padrão lido pela Cloudflare e por fornecedores de IA | `/robots.txt` |
| Mapa para IAs | `llms.txt` com fatos, o #1 ao vivo de cada edição, docs e dados | `/llms.txt` |
| Referência completa | Preço do #1, lance mínimo, reembolso e FAQ das 20 edições, em inglês e ao vivo | `/llms-full.txt` |
| Respostas citáveis | **FAQ visível em cada edição**, no idioma local, com o preço ao vivo, mais o `FAQPage` em JSON-LD | `/{edição}` |
| Entidade | Uma só `Organization` (`@id` `crownd.dev/#org`) em todas as páginas, com logo PNG, descrição e `foundingDate`. Recebe `sameAs` com as redes sociais. | `src/lib/seo.ts` |
| Dados | JSON público do board, liberado para crawlers | `/api/board/{edição}` |
| Frescor | IndexNow a cada troca de #1, mais `npm.cmd run indexnow` para enviar tudo | `src/lib/indexing.ts` |

As respostas do FAQ são montadas a partir das regras, do guia e do checkout já traduzidos, então nunca contradizem o resto do site.

**Quando criar as redes sociais:** coloque em `.env.production` a linha `NEXT_PUBLIC_SAME_AS=https://www.instagram.com/crownd.dev,https://x.com/crownddev,https://www.linkedin.com/company/crownd-dev` com as URLs reais, e rode `npm.cmd run deploy`. Isso liga o site aos perfis no Knowledge Graph.

## 6. Passo a passo ao publicar (só você pode fazer)

Rode **`npm.cmd run golive`**. O assistente abre cada console, diz onde clicar, grava os códigos e publica:

1. **Stripe LIVE:** chave, webhook e segredos na Cloudflare, depois confirma em `/api/health` que os lances abriram.
2. **Pix** (opcional).
3. **Google Search Console:** propriedade *Domínio*, verificada automaticamente pela Cloudflare; sitemap e pedido de indexação.
4. **Bing Webmaster Tools:** importar do Search Console.
5. **Naver Search Advisor** (Coreia) e 6. **Yandex** (Turquia): a meta tag vai para o `.env.production` e é publicada; sitemap e RSS `/kr/feed.xml`.
7. **IndexNow** com todas as URLs, mais a auditoria `seo:check` em produção.

Para ver os dados por país, crie também uma propriedade *prefixo de URL* por edição no Search Console (`https://crownd.dev/jp/`…).

## 7. Medição

- Google Search Console com **uma propriedade de prefixo de URL por edição** (`https://crownd.dev/jp/`…) para ver os dados por país.
- Depois do deploy, rode estes comandos do claude-seo:
  - `/seo audit https://crownd.dev` (auditoria completa)
  - `/seo hreflang https://crownd.dev/jp` (validação da malha)
  - `/seo schema https://crownd.dev/br` e `/seo geo https://crownd.dev`
  - `/seo drift` semanal (detecta regressões)

## 8. Riscos que derrubam o ranking (evite)

- Publicar as 20 edições sem revisão nativa: risco de *scaled content abuse*.
- Encher o board de produtos falsos para "parecer vivo".
- Comprar links ou trocar backlinks de forma sistemática.
- Esquecer o `rel="sponsored"` em links pagos (já tratado no código).
