# 01 · Engenharia reversa do melhorlance.dev

Coleta feita em 12/11/2026 seguindo a metodologia do [REA](https://github.com/morluto/rea): evidência primeiro, com as limitações declaradas.
**Limitação:** o REA exige Node ≥ 24.22.1 e a máquina tem 24.20.0. A análise foi feita manualmente, com as mesmas fontes que o REA usaria para um site: HTML, headers HTTP, bundles JS, CSS, robots e sitemap.

## Stack (evidências)

| Item | Evidência | Conclusão |
|---|---|---|
| Framework | `/_next/static/chunks/app/...`, header `Vary: rsc, next-router-state-tree` | Next.js App Router |
| Hospedagem | `Server: Vercel`, `X-Vercel-Id: gru1::iad1` | Vercel, edge em São Paulo e função em Virginia |
| Analytics | CSP libera `cdn.himetrica.com` | Himetrica, com página pública de analytics |
| Fontes | CSS: `Gabarito`, `Schibsted Grotesk`, `IBM Plex Mono` | Display, UI e números em mono |
| Cores | `--color-brand:#5b4bdb`, `--color-page:#efeeee`, `--color-quente:#c0398f` | Roxo como marca, papel cinza claro, dark mode completo |
| Pagamento | Copy "paga por Pix" e as regras | Só Pix, com expiração de 15 min (provedor não exposto) |
| Segurança | CSP rígida, HSTS preload, `frame-ancestors 'none'` | Bem configurado |
| Easter egg | `melhorlance.pegar()` no console | Brincadeira de growth para devs |

## Mecânica do produto

1. **Board pago:** a posição é decidida pelo total pago. Mínimo R$ 1, passos de R$ 1. Em caso de empate, fica na frente quem pagou primeiro.
2. **Aumento de lance:** quem cola o mesmo link paga só a diferença. Lojas de apps e GitHub são identificados pelo caminho da URL.
3. **Lançamentos grátis:** 10 vagas por dia, ranqueadas por cliques únicos (um por pessoa por dia). O contador zera à meia-noite de Brasília.
4. **Destaques com preço fixo:** R$ 20 por 1 dia nos lançamentos e R$ 50 por 3 dias nas ferramentas.
5. **Ferramentas:** lista curada via PR no repositório [awesome-indie-hackers](https://github.com/lincolixavier/awesome-indie-hackers). Aparecer na lista não se compra.
6. **Selo:** a rota `/p/{domínio}#selo` gera um badge que o maker embute no próprio site. Cada selo vira um backlink.
7. **Reembolso:** 7 dias, conforme o CDC.

## SEO observado

- `robots.txt` bloqueia `/api/`, `/l/` (redirecionador de clique), `/f/` e `/d/`.
- O sitemap tem cerca de 250 URLs, sendo 180 em `/p/{domínio}` e 69 em `/ferramentas/{slug}`. É SEO programático com dados reais.
- Tem OG image dinâmica e `og:locale pt_BR`.
- **Não tem** JSON-LD, hreflang nem `llms.txt`.

## Pontos fracos encontrados (e como o Crownd resolve)

| Problema no original | No Crownd |
|---|---|
| Só Brasil, só BRL, só Pix | 20 edições, 16 moedas e métodos de pagamento locais via Stripe |
| Desempate pelo horário do *pagamento*: quem paga Pix mais rápido "rouba" a vaga | Desempate pelo horário em que o checkout *começou* (reserva real de 30 min) |
| CTAs inconsistentes: a linha #14 dizia "pega o #13" | O preço de cada posição é calculado por uma função pura testada (`priceForRank`) |
| Sem histórico: quem foi #1 some | **Hall da Fama** permanente, que gera conteúdo e PR |
| Sem dados estruturados | JSON-LD de WebSite, ItemList, BreadcrumbList e Organization |
| Sem hreflang e sem GEO | Malha hreflang completa com x-default, e `llms.txt` |
| Contador "0 pessoas online" é um snapshot | Cronômetro de reinado ao vivo e OG image que mostra o #1 atual |
| Selo estático | Selo SVG **ao vivo**, com a posição atual e o idioma da edição |
| Links pagos sem marcação | `rel="sponsored"`, exigido pelas políticas do Google para links pagos |

## Sobre copiar

O Crownd reaproveita a **mecânica**, que não é protegida. Nome, marca, cores, tipografia, textos e código foram criados do zero. O awesome-indie-hackers **não declara licença**, e por padrão isso significa todos os direitos reservados. Por isso reaproveitamos só a taxonomia de categorias, com crédito no site, e escrevemos as descrições do zero.
