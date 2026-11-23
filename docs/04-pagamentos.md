# 04 · Gateway de pagamento

## Recomendação: **Stripe, com uma empresa nos EUA (Stripe Atlas)**, mais PSPs locais só onde houver lacuna

### Por que Stripe

| Requisito | Stripe |
|---|---|
| Cobrar nas 16 moedas das edições | Mais de 135 moedas de apresentação |
| Métodos locais (Pix, iDEAL, BLIK, Swish, TWINT, Konbini, Klarna, Bancontact, OXXO…) | Sim, com *dynamic payment methods*: o Checkout mostra o método certo para cada comprador |
| Métodos assíncronos (Pix, Konbini, OXXO, boleto) | Webhook `checkout.session.async_payment_succeeded`, já tratado no código |
| Impostos sobre serviço digital (IVA da UE e do Reino Unido, GST da Austrália, Índia e Japão, KDV…) | **Stripe Tax** calcula e gera relatórios por país |
| Uma integração para 20 países | Sim: o código usa **um** endpoint e só muda `currency` |

### Por que uma empresa nos EUA, e não uma conta brasileira

- Conta Stripe no **Brasil**: Pix é *invite-only* para empresas brasileiras, e a disponibilidade de moedas e métodos internacionais é mais restrita. Confira no dashboard; a documentação pública não deixa claro.
- Conta Stripe nos **EUA** (via **Stripe Atlas**, cerca de US$ 500, empresa em Delaware): libera o catálogo completo. O próprio Stripe lista **Pix disponível para empresas dos EUA**, ou seja, dá para cobrar brasileiros em Pix e receber em dólar.
- Receba numa conta americana (Mercury ou similar) e traga para o Brasil quando quiser.

> ⚠️ **Converse com um contador antes.** Um brasileiro dono de empresa no exterior tem obrigações próprias: lucro de controlada no exterior (Lei 14.754/2023), declaração de capitais ao Banco Central (CBE) e IR. E vender serviço digital para *consumidores* na UE, no Reino Unido, na Austrália, no Japão, na Coreia, na Índia, na Arábia e na Turquia pode exigir registro de IVA/GST quando se passa do limite de cada país. O Stripe Tax mostra quando isso acontece.

### Lacunas que exigem PSP local (fase 2, só se a demanda justificar)

| País | Lacuna provável no Stripe | PSP local sugerido |
|---|---|---|
| 🇮🇩 Indonésia | QRIS, GoPay, OVO, DANA | **Xendit** ou Midtrans |
| 🇸🇦 Arábia Saudita | STC Pay, Tabby (mada e Apple Pay: confirme no dashboard) | **Moyasar** ou Tap |
| 🇮🇳 Índia | UPI é *invite-only* no Stripe | **Razorpay** (exige entidade indiana) ou pedir convite de UPI ao Stripe |
| 🇰🇷 Coreia | Confirme KakaoPay e Naver Pay no dashboard | **Toss Payments** ou PortOne |
| 🇹🇷 Turquia | Parcelamento (taksit) | **iyzico** |
| 🇧🇷 Brasil | Se o Pix via conta dos EUA não for aprovado | **AbacatePay** ou Mercado Pago |

O código já está preparado: [src/lib/payments.ts](../src/lib/payments.ts) isola o provedor. Para adicionar um PSP local, basta outra implementação de `createCheckout` e outro webhook que chame `confirmPayment(paymentId)`, que é idempotente.

### Alternativa considerada: Merchant of Record (Paddle, Lemon Squeezy, Polar)

Prós: eles recolhem os impostos globais por você.
Contras: aceitam basicamente SaaS e software. **"Posição paga num ranking" é publicidade** e pode violar a política de uso deles. Também têm menos métodos locais (sem Pix, Konbini ou BLIK, por exemplo). **Por isso não recomendo como gateway principal.**

## Como o fluxo funciona no código

1. `POST /api/checkout`: normaliza a URL, valida as regras e calcula a cobrança. Se o link é novo, cobra o total; se é aumento, cobra **só a diferença**.
2. Cria um registro em `payments` (status `pending`, válido por 30 min) e uma Checkout Session na moeda da edição.
3. O Stripe chama `POST /api/webhooks/stripe`. Só `payment_status === "paid"` altera o board.
4. `confirmPayment()` atualiza o board, registra a troca de #1 no Hall da Fama e envia o e-mail de "lance coberto" (via Resend).
5. Sem `STRIPE_SECRET_KEY`, o site roda em **modo demo**: um checkout falso permite testar o fluxo inteiro localmente.

## Conectar o Stripe (automatizado)

Tudo roda no **seu** terminal. As chaves vão direto para `.env.development.local` (ignorado pelo git e nunca incluído no build de produção) e nunca passam pelo chat.

```bash
npm run stripe:setup
```

O assistente (`scripts/stripe-wizard.sh`) tem 8 etapas e mostra o progresso:

1. **Chave de teste:** abre a página de API keys do dashboard; você cola a `sk_test_…` com entrada oculta.
2. **Diagnóstico:** roda `npm run stripe:doctor`.
3. **Métodos locais:** abre a página de métodos de pagamento e diz o que ligar.
4. **Stripe CLI:** instala via `winget` (pacote oficial `Stripe.StripeCli`).
5. **Login do CLI:** pareamento pelo navegador.
6. **Segredo do webhook local:** obtido automaticamente com `stripe listen --print-secret`.
7. **Stripe Tax (opcional):** grava `STRIPE_AUTOMATIC_TAX`.
8. **Teste ponta a ponta:** com o cartão 4242.

Pode rodar de novo quando quiser: ele lembra os valores já salvos.

### Comandos do dia a dia

| Comando | O que faz |
|---|---|
| `npm run stripe:doctor` | Valida a chave e a conta. Para cada uma das 20 edições, mostra se a **moeda** é aceita e quais **métodos locais** estão ligados (✓), disponíveis mas desligados (○) ou indisponíveis (–). Em modo teste, cria e expira na hora uma sessão de checkout por moeda, para provar que cada edição consegue cobrar. Também confere o webhook e o Stripe Tax. Sai com código 1 se houver problema. |
| `npm run stripe:listen` | Encaminha os webhooks para `localhost:3010` durante o desenvolvimento |
| `npm run stripe:webhook -- --url https://crownd.dev` | **Produção:** cria ou corrige o endpoint pela API (sem clicar no dashboard) e grava o segredo em `.secrets.production`. Com `--recreate`, gera um segredo novo. |

### Eventos tratados pelo webhook

| Evento | Efeito |
|---|---|
| `checkout.session.completed` | Cartão e carteiras: aplica o lance |
| `checkout.session.async_payment_succeeded` | Pix, Konbini, OXXO, boleto, SEPA: aplica quando o pagamento compensa |
| `checkout.session.async_payment_failed` e `checkout.session.expired` | Marca o pagamento como expirado (o board não muda) |

Todos são idempotentes. O Stripe reenvia eventos, e aplicar o mesmo pagamento duas vezes não tem efeito.

### Ao publicar (produção)

1. No dashboard, ative a conta (dados da empresa e conta bancária).
2. Gere a chave **live** e coloque `STRIPE_SECRET_KEY` nas variáveis da hospedagem (nunca no repositório).
3. Rode `STRIPE_SECRET_KEY=sk_live_… npm run stripe:webhook -- --url https://crownd.dev` e copie `STRIPE_WEBHOOK_SECRET` de `.secrets.production` para a hospedagem.
4. Rode `npm run stripe:doctor` com a chave live: tudo deve estar ✓.
