# 10 · App Store e Google Play: decisão

**Decisão (14/11/2026): não publicar nas lojas agora.** O Crownd virou um **app instalável pelo navegador (PWA)**, sem loja, sem revisão e sem comissão.

## Por que não vale a pena agora

| Ponto | App Store (Apple) | Google Play |
|---|---|---|
| App que só abre o site | Rejeitado com frequência (diretriz 4.2, "funcionalidade mínima") | Aceito via TWA (Trusted Web Activity) |
| Vender o lance dentro do app | Lance é bem digital, então exige compra in-app com **15 a 30% de comissão** e preços fixos por tabela, incompatíveis com lances livres. Fora dos EUA, nem pode apontar para pagar no site. | Exige o Google Play Billing para bens digitais, com 15% de comissão |
| Custo e burocracia | US$ 99/ano, D-U-N-S para empresa, build num Mac | US$ 25 uma vez; conta pessoal nova precisa de 20 dias de teste fechado com 12 testadores |
| Ganho de tráfego | Baixo: busca dentro da loja para um produto novo | Baixo |

O Crownd ganha usuários por **busca (SEO), redes sociais e links**, e o centro da experiência é um pagamento. Nas lojas, esse pagamento ou paga comissão ou fica proibido.

## O que foi feito no lugar (PWA)

- O manifesto tem ícones PNG de 192 e 512 px, ícone *maskable* (o Android recorta no formato do aparelho) e atalhos para Brasil, EUA e Lançamentos.
- Há ícone de tela inicial para iPhone (`apple-icon.png`), e no iOS o app abre em tela cheia com o nome da edição.
- **Como instalar:**
  - Android/Chrome: menu ⋮ → "Instalar app";
  - iPhone/Safari: Compartilhar → "Adicionar à Tela de Início";
  - computador: ícone de instalar na barra de endereço.

## Quando reavaliar

- **Google Play:** quando houver tração, por exemplo milhares de visitas por dia. Gere o pacote TWA com o [PWABuilder](https://www.pwabuilder.com) a partir de `https://crownd.dev`. O app abre o site; os lances continuam no navegador.
- **App Store:** só com função nativa de verdade, como notificação push de "a coroa caiu" e widget com o #1 ao vivo. Mesmo assim, o lance deve continuar no site.
- **Microsoft Store:** gratuita para PWA via PWABuilder, um atalho barato para Windows.
