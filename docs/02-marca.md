# 02 · Marca: Crownd

> **crowd + crowned.** A multidão assiste, o lance decide, e um produto usa a coroa.

## Nome

**Crownd** (pronuncia-se *"crowned"*).

- É curto, funciona foneticamente nos 14 idiomas e não depende do português (o problema de "melhor lance" fora do Brasil).
- Junta duas ideias: *crowd* (o público que clica e assiste) e *crowned* (coroado, o #1).
- **Domínio:** `crownd.dev` não respondeu no DNS, o que sugere que está livre. `crownd.co` também. `.com`, `.io` e `.app` já estão registrados. **Confirme no registrador antes de anunciar.**
- **Nomes reserva:** Toppl (*topple*, derrubar quem está no topo; `toppl.dev` parece livre) e Reignboard.
- Faça uma busca de marca (INPI, USPTO e EUIPO, classes 35 e 42) antes de investir em mídia.

Cada país tem uma **edição** com nome próprio: Crownd Brasil, Crownd 日本, Crownd 코리아, Crownd السعودية…

## Logo: o "pódio-coroa"

Três barras de leaderboard em ordem de pódio (2-1-3), com uma joia no topo de cada uma. Juntas, formam uma coroa. **Só a joia do centro é dourada.** A própria marca diz que só o #1 leva o ouro.

- Arquivos: [public/brand/crownd-mark.svg](../public/brand/crownd-mark.svg), [public/brand/crownd-logo.svg](../public/brand/crownd-logo.svg) e [src/app/icon.svg](../src/app/icon.svg) (favicon)
- Componente: [src/components/Logo.tsx](../src/components/Logo.tsx)
- Área de respiro: a altura da joia central. Tamanho mínimo: 16 px para a marca e 96 px para o logotipo completo.
- Brand book ao vivo em `/brand`.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| Crown Gold | `#FFC531` | **Só no #1.** Se tudo for dourado, nada é realeza. |
| Gold Deep | `#C98A00` | Dourado sobre fundo claro |
| Obsidian | `#0E0D12` | Tinta e superfícies escuras |
| Parchment | `#F7F3EA` | Papel quente, como uma tabela de campeonato impressa |
| Coup Red | `#FF4A2E` | Ponto "ao vivo" e alerta de lance coberto |
| Mint | `#12A26B` | Confirmações |

Cada edição ganha **um acento** tirado da cultura local, nunca da bandeira. Os 20 acentos, com a história de cada um, estão em [src/config/countries.ts](../src/config/countries.ts) e na página `/brand`. Alguns exemplos: Shu-iro 朱色 dos torii (Japão), Bleu Klein (França), Oranje do Koningsdag (Holanda), Rosa Mexicano de Barragán, Falu Röd das casinhas suecas, Turkuaz dos azulejos de İznik (Turquia), Bursztyn, o âmbar de Gdańsk (Polônia), e o Verde Copa (Brasil).

## Tipografia

| Papel | Fonte | Por quê |
|---|---|---|
| Display e UI | **Bricolage Grotesque** (800) | Grotesca com personalidade e tamanhos ópticos |
| Acento "real" | **Instrument Serif Italic** | Para os momentos de coroa ("Long may you reign") |
| Números | **JetBrains Mono** | Posições, lances e cronômetros tabulares |
| Escritas não latinas | Noto Sans JP, Noto Sans KR, IBM Plex Sans Arabic | O glifo nunca cai na fonte do sistema |

Em japonês, coreano e árabe o itálico é desligado automaticamente, porque essas escritas não têm itálico verdadeiro.

## Elementos assinatura

- **O Trono:** o card do #1 tem uma borda dourada que gira devagar. Respeita `prefers-reduced-motion`.
- **Hanko:** no Japão, o #1 aparece como um carimbo vermelho "1位".
- **Cronômetro de reinado:** mostra há quanto tempo o #1 está no trono e vira assunto nas redes.
- **OG image ao vivo:** todo link compartilhado mostra o #1 atual, então a imagem já é a provocação.
- **Textura de papel:** um ruído sutil sobre o fundo Parchment.

## Voz

1. **Competitiva, nunca cruel.** Desafiamos quem quer o #1 e não zombamos de quem perdeu.
2. **Local primeiro.** Brasil zoa ("vai deixar o #1 pro outro viralizar?"), Japão convida ao desafio (王冠に、挑戦しよう。), Suécia fica *lagom* ("Din tur att bära kronan"), Reino Unido é seco ("Someone's sat at #1. Terribly rude of them."), Índia fala de críquete ("Time to bowl them out?") e México fala de lucha libre ("¿Se lo vas a dejar?").
3. **Os números são os heróis.** Ficam em mono e sempre visíveis.
4. **Frases curtas.** Títulos com menos de 5 palavras e CTAs com menos de 3.
