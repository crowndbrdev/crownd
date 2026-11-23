# 11 · Conversão, expansão e SEO (18/11/2026)

Relatório da missão de otimização comercial, mais a expansão para 30 países e a página de SEO "onde divulgar".

**Versão em produção:** `3ac85cb7`, em https://crownd.dev. Pagamentos live e webhook ativos (`/api/health` → `"payments":"stripe","webhook":true`).

## 1. O que mudou

### Expansão: de 20 para 30 edições
- **Novos países:** Portugal, Argentina, Colômbia, Chile, Singapura, Emirados Árabes, Irlanda, Filipinas, Nova Zelândia e África do Sul.
- **Idiomas:** todos reaproveitam idiomas que o site já tinha, com variações regionais:
  - português europeu ("tu", "partilhar") em Portugal;
  - voseo ("pegá", "tenés") na Argentina;
  - espanhol latino na Colômbia e no Chile;
  - inglês com expressões locais nos países de língua inglesa ("chope", "Kia ora", "lekker").
- **Dados por país:** prazo legal de arrependimento, exigência legal, meios de pagamento locais, comunidades e uma cor tirada da cultura de cada país.
- **Stripe:** o checkout funciona nas 24 moedas (testado com `stripe:doctor`).
- **Polônia e Índia** já existiam (`/pl` e `/in`) e receberam a revisão comercial.

### Página nova de SEO: `/{edição}/where-to-launch`
- Uma página para cada uma das 30 edições, em 14 idiomas, respondendo a buscas de alta intenção ("onde divulgar meu app", "where to launch my startup").
- O Crownd aparece como item 01. Depois vêm 17 plataformas globais reais e as comunidades locais de cada país.
- Tem JSON-LD (Article, ItemList, Breadcrumb), hreflang completo e entra no sitemap, que agora tem 211 URLs, todas enviadas ao IndexNow.

### Conversão (CRO)

| Ponto do funil | Antes | Agora |
|---|---|---|
| Subtítulo do topo | Explicava a mecânica | Vende o benefício: vitrine, página própria feita para ser encontrada, posição até alguém cobrir |
| Urgência | Nenhuma | **Real**: "Ninguém está com o #1 do Brasil ainda. Um lance de R$ 5 leva a coroa…" ou "O #1 custa R$ X agora". Mais a contagem regressiva até a meia-noite local, quando as vagas grátis renovam |
| Proposta de valor | Implícita | Seção "O que o seu lance compra", com 6 entregas verificáveis: lugar no board, página própria, selo ao vivo, sem prazo de validade, cliques públicos e Hall da Fama |
| Honestidade | — | Aviso explícito de que não prometemos posição no Google nem número de visitas |
| Formulário | URL, valor e e-mail | Resumo da compra antes de pagar (posição #N, página e selo, sem validade), **campo de descrição** e linha de confiança (Stripe, reembolso e regras, dados do vendedor) |
| Página do produto pago | **Ficava fora do Google** (sem descrição, `noindex`) | Com a descrição do comprador, a página fica indexável e entra no sitemap. Testado de ponta a ponta |
| Pós-pagamento | "Pagamento confirmado" | Próximos passos, botão para a página do produto e compartilhamento em X, LinkedIn e WhatsApp |
| FAQ | 6 perguntas | Mais "O que eu ganho com o lance?" e "Quanto tempo dura a minha posição?", também em JSON-LD |
| Hub global | Texto institucional | Benefício, mais os botões "Claim your country's #1" e "Where to launch your product" |
| Promessa falsa | "Avisamos por e-mail quando alguém te cobrir" (o e-mail não está ativo) | **Removida nos 14 idiomas.** Volte a prometer só depois de configurar o Resend |

### Correções técnicas
- **Cabeçalho no celular:** o botão de tema encostava na borda. Agora tem o espaçamento lateral padrão (testado em 390 px).
- **Descrição do produto:** vai nos **metadados do Stripe** e é gravada no produto pelo webhook. Não exigiu nenhuma alteração no banco de produção.
- **Cache de HTML de 30 s no Worker** (`worker.ts`), contra o limite de processamento do plano gratuito (veja as pendências). O navegador continua recebendo `no-store`, então nunca mostra um board antigo.
- **Contagem dinâmica:** o "20 países" fixo no código virou `COUNTRIES.length` (metadados, llms.txt, manifest e Organization).
- **Conteúdo social atualizado** para 30 países e 24 moedas: 9 posts, os Reels 2 e 6 e o PDF.

## 2. Arquivos principais
- **Novos:** `src/i18n/launchSites.ts`, `src/app/[country]/where-to-launch/page.tsx`, `src/components/Countdown.tsx` e este documento.
- **Configuração, textos e testes:** `src/config/countries.ts`; os 14 arquivos `src/i18n/*.ts` (namespace `sell` e e-mail removido); `src/i18n/index.ts`, `src/i18n/guide.ts` e `src/i18n/i18n.test.ts`.
- **Páginas e componentes:** `src/app/[country]/page.tsx`, `src/components/BidForm.tsx`, `src/app/[country]/checkout/[id]/page.tsx`, `src/lib/faq.ts`, `src/app/(global)/page.tsx`, `src/app/(global)/layout.tsx` e `src/components/EditionShell.tsx`.
- **Pagamentos:** `src/lib/payments.ts`, `src/lib/board.ts`, `src/app/api/checkout/route.ts`, `src/app/api/webhooks/stripe/route.ts` e `src/app/api/demo-pay/[id]/route.ts`.
- **SEO e borda:** `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/llms.txt`, `src/app/llms-full.txt`, `src/app/manifest.ts` e `worker.ts`.
- **Conteúdo social:** `video/` e `brand/social/`.

## 3. Testes executados
- **Testes, tipos e lint:** 170 testes passando, inclusive a paridade de chaves e marcadores nas 30 edições. `tsc` e `eslint` sem erros.
- **Fluxo de compra real em modo de teste do Stripe:** checkout via API → sessão criada → metadados conferidos na API do Stripe → webhook assinado → produto no board → página indexável com a descrição → sitemap → tela de sucesso com compartilhamento. Os dados de teste foram apagados do banco **local**.
- **Telas no celular** (emulação de 390 px): sem rolagem horizontal no hub, no Brasil, na Polônia e em "Onde divulgar".
- **Produção:** 200 nas páginas novas e editadas, nas edições `us`, `in`, `pl`, `br` e `pt`, e nas páginas de regras e de dados do vendedor.
- **Auditoria de SEO em produção:** 186 de 211 páginas OK. Os 25 erros são 503 do limite de processamento (próxima seção).

## 4. Pendências que dependem de você ou de serviços externos

| Prioridade | Pendência | Por quê |
|---|---|---|
| **P0** | **Assinar o Workers Paid (US$ 5/mês)**: dash.cloudflare.com → Workers & Pages → Plans | No plano gratuito, cada requisição tem cerca de 10 ms de processamento. Páginas renderizadas pela primeira vez às vezes passam disso e o visitante (ou o Google) recebe 503. O cache de 30 s ajuda nos acessos repetidos, mas não no primeiro. Com o plano pago o limite vai a 30 s |
| P1 | Configurar o **Resend** (chave `RESEND_API_KEY` e domínio de envio) | Liga o aviso "alguém te cobriu" e permite voltar a prometê-lo na página. Recupera lances |
| P1 | Ativar o **Pix** no Stripe | É o meio de pagamento padrão no Brasil, o principal mercado |
| P2 | Chave da **ElevenLabs** (`cd video; npm.cmd run voice:setup`) | Voz natural nos Reels |
| P2 | Revisão nativa das traduções das 10 edições novas | Os textos foram adaptados, mas não passaram por revisão de falantes nativos |
| — | Banco de produção | A ferramenta bloqueou uma migração no banco de produção. A solução final não precisa dela |

## 5. Como vender ainda esta semana
O Google leva semanas para confiar num domínio de cinco dias. O SEO feito aqui é um investimento para as próximas semanas, não para esta. O dinheiro desta semana vem de distribuição direta:
1. **Venda direta:** mande mensagem para 30 a 50 makers brasileiros que lançaram algo recentemente (TabNews, r/brdev, X #buildinpublic). Convide para o lançamento grátis e mostre que o #1 do Brasil ainda está vazio e custa a partir de R$ 5.
2. **Lance o próprio Crownd** no TabNews, no Indie Hackers e no r/SideProject, usando a lista da página `/br/where-to-launch`.
3. **Publique os Reels 2 e 9** ("o trono está vazio" e "o primeiro rei"): a oferta é verdadeira e urgente agora.
4. **Ancoragem de preço:** seu lance atual (R$ 5) deixa o #1 barato. O primeiro comprador de verdade pode levar o trono por R$ 10, o que cria a primeira "virada" para mostrar nas redes.
5. **Selo e compartilhamento:** cada comprador recebe na tela de sucesso botões de compartilhar e o selo. Cada compra vira divulgação e um link para o site.
