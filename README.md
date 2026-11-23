# 👑 Crownd

**20 países. 20 coroas. Quem é o #1?**

Rede de leaderboards públicos de produtos independentes, com uma edição por país. Quem paga mais na moeda local fica com o #1. Lançamentos são grátis (10 por dia, ranqueados por cliques). Cada troca de coroa vai para o Hall da Fama.

Inspirado na mecânica do [melhorlance.dev](https://www.melhorlance.dev), com marca, design e código originais.

## Rodar localmente

```bash
npm install
cp .env.example .env.development.local   # tudo opcional em dev
npm run dev               # http://localhost:3010
```

- Sem `STRIPE_SECRET_KEY`, o site roda em **modo demo**: o checkout tem um botão "simular pagamento" e você testa o fluxo inteiro (lance, cobertura, Hall da Fama).
- O banco é um SQLite local (`local.db`), criado sozinho e populado com produtos **fictícios** (`*.example`). Em produção não há seed.

```bash
npm test                  # 113 testes: regras de lance + integridade das traduções e dos guias
npm run lint
npm run build
```

> **Windows:** rode os testes com o caminho em `C:\` maiúsculo (`cd C:\Users\...`). Com `c:\` minúsculo o Vitest carrega duas instâncias e falha com `Cannot read properties of undefined (reading 'config')`.

## Comandos

> **PowerShell no Windows:** se aparecer *"npm.ps1 não pode ser carregado porque a execução de scripts foi desabilitada"*, use `npm.cmd` no lugar de `npm` (ex.: `npm.cmd run stripe:setup`). Para liberar de vez só no seu usuário: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

| Comando | Para quê |
|---|---|
| `npm run stripe:setup` | Assistente que conecta o Stripe (chaves, CLI, webhook, métodos, impostos) |
| `npm run stripe:doctor` | Diagnóstico da conta Stripe nas 20 edições |
| `npm run stripe:listen` | Webhooks do Stripe → localhost:3010 |
| `npm run stripe:webhook -- --url https://crownd.dev` | Cria o webhook de produção pela API |
| `npm run launch` | Publica na Cloudflare em crownd.dev (assistente) |
| `npm run deploy` | Deploy seguro (bloqueia segredos embutidos) |
| `npm run seo:check` | Auditoria de SEO de todas as URLs do sitemap (hreflang, canonical, H1, JSON-LD…) |
| `npm run golive` | Assistente de go-live: Stripe LIVE + Google, Bing, Naver e Yandex |
| `npm run indexnow` | Envia todas as URLs ao IndexNow (Bing, Yandex, Naver, Seznam) |

## Deploy (Cloudflare Workers + D1, domínio crownd.dev)

```powershell
npm.cmd run launch
```

O assistente faz tudo em 9 etapas: login na Cloudflare, registro do `crownd.dev`, criação do banco D1 e do schema, chave LIVE do Stripe, dados legais, build e deploy com verificação de segurança, conexão do domínio com HTTPS, webhook de produção e auditoria de SEO em produção.

- Deploys seguintes: `npm.cmd run deploy`. Ele aborta se algum segredo for parar dentro do pacote.
- Segredos de produção ficam só na Cloudflare (`wrangler secret`). A cópia local `.secrets.production` é ignorada pelo git e nunca é lida pelo Next.
- Sem chave LIVE do Stripe, o site funciona normalmente e os lances mostram "pagamentos abrem em breve". Uma chave de teste **nunca** libera lances em produção.
- Worker: cerca de 2,2 MiB comprimido, dentro do plano gratuito (limite de 3 MiB).

## Estrutura

```
src/config/countries.ts   ← fonte única: 20 países, moeda, preços, acento, cultura, leis
src/config/tools.ts       ← diretório de ferramentas (global e local por país)
src/i18n/*.ts             ← 14 idiomas; variações regionais (UK, IN, MX, CH…) em index.ts
src/lib/bidding.ts        ← regras de lance (puras e testadas)
src/lib/board.ts          ← board, pagamentos, reinados, cliques
src/lib/payments.ts       ← Stripe ou checkout demo
src/lib/seo.ts            ← hreflang, canonical, JSON-LD
src/app/(global)/         ← hub "/" (Mapa de Coroas, x-default) e "/brand" (brand book)
src/app/[country]/        ← edições: board, lançamentos, ferramentas, hall, regras, legal, produto, checkout
src/app/api/              ← checkout, webhook Stripe, selo SVG ao vivo, board JSON, newsletter
```

## Documentação

| Doc | Conteúdo |
|---|---|
| [01 · Engenharia reversa](docs/01-engenharia-reversa.md) | Stack, mecânica e pontos fracos do original, e como o Crownd resolve cada um |
| [02 · Marca](docs/02-marca.md) | Nome, logo, paleta, tipografia e voz |
| [03 · Países](docs/03-paises.md) | Os 20 países, critérios, adaptações culturais e checklist pré-lançamento |
| [04 · Pagamentos](docs/04-pagamentos.md) | Por que Stripe via EUA, lacunas locais e configuração |
| [05 · Lançamento e growth](docs/05-lancamento-growth.md) | Ondas de lançamento, playbook por país, comunidades e métricas |
| [06 · SEO](docs/06-seo.md) | Arquitetura internacional, palavras-chave, backlinks e medição |
| [07 · Redes sociais](docs/07-redes-sociais.md) | Usernames, bios, 27 posts prontos (IG, X, LinkedIn), legendas e calendário |
| [08 · Segurança](docs/08-seguranca.md) | Camadas de proteção, segredos, privacidade e auditoria |
| [09 · Reels](docs/09-reels.md) | 3 Reels prontos (roteiro, narração, animação), legendas e como gerar novos |
| [10 · Apps](docs/10-apps.md) | App Store e Google Play: decisão e PWA instalável |
| [11 · Conversão](docs/11-conversao.md) | Expansão para 30 países, página "onde divulgar", CRO do funil de compra e pendências |
| [12 · E-mail](docs/12-email.md) | Aviso "alguém tomou seu #1" via Resend: DNS, verificação e ativação |

## Ferramentas usadas na construção

- **[REA](https://github.com/morluto/rea):** metodologia de engenharia reversa baseada em evidências. Para usar o CLI, atualize o Node para ≥ 24.22.1 e rode `npx rea-agents setup`.
- **[Superpowers](https://github.com/obra/superpowers):** fluxo de brainstorm, plano, TDD (lógica de lance escrita com testes) e verificação antes de concluir. Instalar: `/plugin install superpowers@claude-plugins-official`.
- **[claude-seo](https://github.com/AgricIDaniel/claude-seo):** checklists de hreflang, SEO programático, schema e GEO aplicados no código. Instalar: `/plugin marketplace add AgriciDaniel/claude-seo` e depois `/plugin install claude-seo@agricidaniel-claude-seo`.
- **[awesome-indie-hackers](https://github.com/lincolixavier/awesome-indie-hackers):** taxonomia do diretório de ferramentas, com crédito. As descrições são próprias, porque o repositório não tem licença.
