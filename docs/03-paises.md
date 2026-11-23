# 03 · Os 20 países

## Como foram escolhidos

Critério combinado: **PIB nominal** (entre os maiores do mundo), **consumo de internet e e-commerce** (usuários e gasto online) e duas restrições práticas do produto:

1. **Dá para cobrar** com cartão ou método local via um gateway global.
2. **O Google é relevante** na busca, porque o pedido é ranquear no Google.

Por isso dois países grandes ficaram **de fora, de propósito**:

| País | Motivo |
|---|---|
| 🇨🇳 China | O Google é bloqueado (domina o Baidu), exige licença ICP e não dá para receber de consumidores chineses em escala |
| 🇷🇺 Rússia | Sanções: Visa, Mastercard e Stripe indisponíveis, além de risco jurídico e reputacional |

Eles foram substituídos por mercados ricos com forte cultura de pagamento digital (Polônia, Suécia e Suíça). **Próxima onda:** Taiwan, Singapura, Emirados, Bélgica, Áustria, Noruega, Dinamarca, Irlanda, Argentina e Israel.

## As 20 edições

| # | Edição | URL | Idioma | Moeda | Lance mín. | Acento cultural | Pagamento local esperado |
|---|---|---|---|---|---|---|---|
| 1 | 🇺🇸 EUA | /us | en-US | USD | $1 | Main Street Neon | Cartão, Apple Pay, Cash App |
| 2 | 🇯🇵 Japão | /jp | ja-JP | JPY | ¥150 | Shu-iro 朱色 | Cartão, **Konbini**, **PayPay** |
| 3 | 🇩🇪 Alemanha | /de | de-DE | EUR | €1 | Bauhaus Blau | PayPal, Klarna, SEPA |
| 4 | 🇬🇧 Reino Unido | /uk | en-GB | GBP | £1 | Racing Green | Cartão, Pay by Bank |
| 5 | 🇫🇷 França | /fr | fr-FR | EUR | €1 | Bleu Klein | **Cartes Bancaires** |
| 6 | 🇮🇳 Índia | /in | en-IN | INR | ₹99 | Marigold | **UPI**, netbanking |
| 7 | 🇮🇹 Itália | /it | it-IT | EUR | €1 | Rosso Corsa | PayPal, **Satispay** |
| 8 | 🇨🇦 Canadá | /ca | en-CA | CAD | C$1 | Aurora Teal | Cartão, Interac |
| 9 | 🇧🇷 Brasil | /br | pt-BR | BRL | R$5 | Verde Copa | **Pix**, boleto |
| 10 | 🇰🇷 Coreia do Sul | /kr | ko-KR | KRW | ₩1.500 | Lightstick Pink | **KakaoPay**, **Naver Pay** |
| 11 | 🇦🇺 Austrália | /au | en-AU | AUD | A$2 | Outback Ochre | Cartão, **Afterpay** |
| 12 | 🇪🇸 Espanha | /es | es-ES | EUR | €1 | Azulejo | **Bizum** |
| 13 | 🇲🇽 México | /mx | es-MX | MXN | $20 | Rosa Mexicano | **OXXO**, SPEI |
| 14 | 🇮🇩 Indonésia | /id | id-ID | IDR | Rp15.000 | Indigo Batik | **QRIS**, GoPay, OVO |
| 15 | 🇳🇱 Holanda | /nl | nl-NL | EUR | €1 | Oranje | **iDEAL** (mais de 70% do e-commerce) |
| 16 | 🇸🇦 Arábia Saudita | /sa | ar-SA (RTL) | SAR | 5 ر.س | Palm Green | **mada**, Apple Pay |
| 17 | 🇹🇷 Turquia | /tr | tr-TR | TRY | ₺40 | Turkuaz | Cartão com **taksit** (parcelado) |
| 18 | 🇨🇭 Suíça | /ch | de-CH | CHF | CHF 1 | Swiss Red | **TWINT** |
| 19 | 🇵🇱 Polônia | /pl | pl-PL | PLN | 5 zł | Bursztyn | **BLIK**, Przelewy24 |
| 20 | 🇸🇪 Suécia | /se | sv-SE | SEK | 10 kr | Falu Röd | **Swish**, Klarna |

Os preços seguem a lógica "1 dólar com cara local": ₹99 e ₹399 na Índia (preços terminados em 99 são nativos ali), ¥150 no Japão, ₩1.500 na Coreia. **Na Turquia, revise os preços todo mês** por causa da inflação.

## O que torna cada site "deles" (já implementado)

- **Idioma e registro:** tom adaptado, não traduzido. Japonês em です/ます, coreano em 해요체, alemão com "du" na interface e "Sie" no texto legal, francês com "tu" na interface e "vous" no legal, holandês direto, sueco *lagom*.
- **Variantes regionais:** inglês britânico, canadense, australiano e indiano com piadas próprias. Espanhol da Espanha ("vosotros", "enlace") e do México ("link", "correo", lucha libre). Alemão suíço **sem ß** (aplicado automaticamente).
- **Formatação:** moeda e números no padrão local (`R$ 3.000`, `CHF 1’000`, `₹1,00,000`, `3 000 zł`). Na Arábia, dígitos latinos nos valores (é o padrão do e-commerce saudita).
- **Fuso:** o board de lançamentos zera à meia-noite *local* de cada país.
- **RTL completo** na Arábia Saudita, com setas espelhadas.
- **Gramática:** em polonês e turco o nome do país é escrito já declinado ("z Polski", "Türkiye'de"), porque interpolar quebraria a frase.
- **Direito do consumidor:** a página de regras mostra o prazo correto de arrependimento: CDC com 7 dias, UE com 14, PROFECO no México com 5 dias úteis, Arábia com 7, Coreia com 7. Onde não existe prazo para serviço digital, aparece a regra de "lance definitivo".
- **Página legal exigida localmente:** Impressum (DE/CH), 特定商取引法に基づく表記 (JP), 사업자정보 (KR), Mentions légales (FR), P.IVA (IT), Regulamin (PL), Aviso de privacidad (MX)…
- **Stack local de ferramentas:** AbacatePay e Mercado Pago (BR), PAY.JP e Zenn (JP), 토스페이먼츠 e 디스콰이엇 (KR), Moyasar (SA), iyzico (TR), Xendit (ID)…

## Antes de lançar cada país (obrigatório)

1. **Revisão nativa** dos textos em [src/i18n/](../src/i18n/). Eu escrevi todos com cuidado cultural, mas o Google trata tradução automática sem revisão como *scaled content abuse*. Um freelancer nativo por idioma (Upwork ou Malt) custa cerca de US$ 30 a 80 por idioma para cerca de 90 strings.
2. **Página legal** preenchida com os dados da empresa, validada por um advogado ou contador local nos países que exigem (DE, JP, KR, FR, IT).
3. **Métodos de pagamento** ativados e testados no dashboard do Stripe (ver [04-pagamentos.md](04-pagamentos.md)).
