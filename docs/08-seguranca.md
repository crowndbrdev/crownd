# 08 · Segurança

Camadas implementadas, da borda até o banco. Cada uma foi testada localmente no runtime da Cloudflare (workerd) e, onde indicado, em produção.

## 1. Borda (Cloudflare)

- **HTTPS obrigatório:** o TLD `.dev` está na lista de preload HSTS dos navegadores, e enviamos `Strict-Transport-Security` com `preload`.
- **HTTP → HTTPS 301** no próprio Worker (`worker.ts`), para clientes que ignoram HSTS, como robôs e scripts. Antes, `http://crownd.dev` respondia 200 com uma cópia de cada página.
- **DDoS e WAF** da Cloudflare na frente de tudo (plano gratuito incluso).
- **Rate limiting nativo por IP**, configurado em `wrangler.jsonc`:
  - `RL_WRITE`: 12 requisições/min em checkout, lançamentos, newsletter e checkout demo.
  - `RL_TRACK`: 120 requisições/min em analytics e cliques. Cliques acima do limite são redirecionados, mas não contam no ranking (anti-fraude).

## 2. Cabeçalhos HTTP (testados em produção ✓)

| Cabeçalho | Valor e efeito |
|---|---|
| Content-Security-Policy | Scripts só do próprio site (e do Himetrica, se configurado); sem `<object>`; `frame-ancestors 'none'`; `form-action` restrito ao Stripe; `base-uri 'self'`; `upgrade-insecure-requests` |
| X-Frame-Options | `DENY` (impede clickjacking) |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | câmera, microfone e geolocalização desligados |
| Cross-Origin-Opener-Policy | `same-origin` |
| X-Robots-Tag | `noindex` em qualquer host que não seja `crownd.dev` (protege o SEO de cópias e previews) |
| X-Powered-By | removido (não revela a stack) |

## 3. Aplicação

- **CSRF:** todo POST que grava dados recusa requisições de outros sites (`Origin` diferente do host ou `Sec-Fetch-Site: cross-site` → 403).
- **Tamanho de payload:** corpo acima de 8 KB (1 KB na newsletter, 512 B no analytics) → 413, antes de qualquer parsing.
- **Validação** de toda entrada com schema (zod): URLs normalizadas e forçadas a `https://`. Ficam bloqueados links de chat ou convite, encurtadores, conteúdo adulto e parâmetros de rastreio.
- **Anti-spoofing:** nomes e taglines passam por `cleanText`, que remove caracteres de controle, de largura zero e **inversores bidirecionais** (o truque `Good‮gnp.exe`, que aparece na tela como `Goodexe.png`). Testado.
- **XSS:** React escapa tudo; JSON-LD com `<` escapado; o selo SVG e o RSS escapam texto.
- **SQL injection:** só consultas parametrizadas (drizzle e prepared statements do D1).
- **Open redirect:** `/go/[id]` só redireciona para URLs já validadas e gravadas, nunca para um parâmetro.
- **Pagamentos:**
  - Webhook com assinatura verificada (WebCrypto).
  - Confirmação idempotente.
  - Em produção, **chave de teste nunca libera lances**.
  - Checkout demo desativado em produção (404).
  - Valores sempre calculados no servidor, nunca vindos do navegador.

## 4. Segredos

- Os segredos de produção ficam **apenas** no cofre da Cloudflare (`wrangler secret`).
- O `npm run deploy` **aborta** se qualquer variável não pública for parar dentro do pacote publicado. Isso aconteceu uma vez durante o desenvolvimento e foi corrigido.
- `.env.development.local` e `.secrets.production` são ignorados pelo git, e o Next nunca lê o `.secrets.production`.

## 5. Privacidade (LGPD/GDPR)

- O analytics não usa cookies e **não grava IP**: o visitante é um hash com *salt* que muda todo dia, por isso não há necessidade de banner de cookies.
- Os cliques são deduplicados pelo mesmo tipo de hash.
- O único dado pessoal guardado é o e-mail de quem compra ou assina a newsletter.

## 6. Dependências

`npm audit` (13/11/2026): **0 críticas, 0 altas**. Há 3 moderadas, todas em `minimatch`, via `glob`, dentro de `@opennextjs/cloudflare`. Esse código só roda **no build**, sem entrada de usuário. A correção automática rebaixaria o adaptador para uma versão incompatível, então é um risco aceito: reavalie a cada atualização do adaptador.

## 7. Divulgação responsável

`/.well-known/security.txt` aponta para `security@crownd.dev`. Depois de registrar o domínio, crie esse endereço no **Cloudflare Email Routing** (grátis), encaminhando para o seu e-mail.

## Próximos passos recomendados

1. **Turnstile** (CAPTCHA invisível e gratuito da Cloudflare) no formulário de lançamentos grátis, se aparecer spam.
2. **Alertas:** ative as notificações de erro do Workers em *Observability*. O `observability` já está ligado no `wrangler.jsonc`.
3. **2FA** na Cloudflare, no Stripe e no registrador. É a conta, não o código, que costuma ser invadida.
4. **Backups do D1:** o Time Travel já guarda 30 dias. Teste uma restauração uma vez.
