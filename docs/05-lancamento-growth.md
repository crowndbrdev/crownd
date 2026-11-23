# 05 · Como lançar e popularizar o Crownd

O produto é um **marketplace de atenção**: só vale pagar pelo #1 se tiver gente olhando. Então a ordem é **audiência grátis primeiro** e **monetização depois**.

## Princípio: o loop viral já vem no produto

```
Maker lança grátis ──► compartilha o link para subir (cliques decidem a posição)
      ▲                                   │
      │                                   ▼
Selo ao vivo no site do maker ◄── vira #1 ──► OG image "Current crown: X" circula
(backlink + tráfego)                         │
      ▲                                      ▼
      └──── e-mail "você perdeu a coroa" ◄── alguém cobre o lance (receita)
```

Cada parte desse loop já está implementada: lançamentos ranqueados por clique, selo SVG ao vivo, OG image dinâmica, alerta de lance coberto, Hall da Fama e cronômetro de reinado.

## Lançamento em 3 ondas (não lance 20 países de uma vez)

Lançar em ondas permite revisão nativa, publicar páginas em lotes (o claude-seo recomenda lotes de 50 a 100 páginas, observando a indexação por 2 a 4 semanas) e aprender com cada mercado.

| Onda | Quando | Edições | Por quê |
|---|---|---|---|
| **1** | Semanas 0–4 | 🇧🇷 BR, 🇺🇸 US, 🇬🇧 UK, 🇮🇳 IN, 🇨🇦 CA, 🇦🇺 AU | Português (seu mercado) e inglês (sem tradução nova). O Brasil vira o caso de sucesso. |
| **2** | Semanas 5–10 | 🇩🇪 DE, 🇫🇷 FR, 🇪🇸 ES, 🇲🇽 MX, 🇳🇱 NL, 🇮🇹 IT, 🇵🇱 PL, 🇸🇪 SE, 🇨🇭 CH | Uma conta Stripe cobre toda a Europa; comunidades indie fortes |
| **3** | Semanas 11–16 | 🇯🇵 JP, 🇰🇷 KR, 🇮🇩 ID, 🇸🇦 SA, 🇹🇷 TR | Exigem revisão nativa mais cuidadosa e PSPs locais |

## Playbook por edição (repetir em cada país)

**T-14 dias: semear com makers reais**
- Liste 30 makers locais (Product Hunt filtrado pelo país, comunidades da tabela abaixo, X/LinkedIn) e mande uma mensagem pessoal: "Estou abrindo o Crownd [país]; as 10 vagas grátis do dia 1 são suas."
- **Não invente produtos nem use números falsos.** Os dados demo do código só existem em desenvolvimento (`.example`).

**Dia D: lançamento**
- Publique um post de lançamento na comunidade nº 1 do país, no formato dela (Show HN nos EUA, artigo no Zenn no Japão, post no TabNews no Brasil, Disquiet e GeekNews na Coreia).
- Product Hunt: lance o **Crownd global** uma única vez, com o Mapa de Coroas como gancho.
- Faça o seu primeiro lance real e declare isso publicamente ("o primeiro #1 do Brasil foi R$ X").

**Contínuo**
- **Bot "a coroa caiu"**: uma conta no X/Threads por região que posta automaticamente quando o #1 muda, com a OG image. (Próximo passo: um webhook no `confirmPayment`.)
- **Newsletter "Crown Report"** semanal: quem reinou, por quanto tempo e quanto custou. Formato curto, dados reais.
- **Build in public**: abra a receita por país (como o melhorlance faz com analytics). Transparência é o produto.
- **Embaixador local** em cada país: um maker respeitado com 15 a 20% da receita da edição para moderar, traduzir e divulgar.

## Comunidades por país (onde postar)

| País | Onde |
|---|---|
| 🇺🇸 US | Show HN, Product Hunt, Indie Hackers, r/SideProject, r/SaaS, BetaList, X #buildinpublic |
| 🇬🇧 UK | Indie Hackers London, r/UKstartups, Hacker News |
| 🇮🇳 IN | r/developersIndia, r/StartUpIndia, LinkedIn IN |
| 🇨🇦 CA | r/canadastartups, BetaKit |
| 🇦🇺 AU | r/AusStartups, Startup Daily |
| 🇧🇷 BR | TabNews, r/brdev, comunidade indie hacker BR no X, LinkedIn |
| 🇩🇪 DE / 🇨🇭 CH | t3n, Gründerszene, LinkedIn DACH, startupticker.ch |
| 🇫🇷 FR | Indie Makers FR, LinkedIn, Journal du Net |
| 🇪🇸 ES / 🇲🇽 MX | X #buildinpublic ES, Platzi, Startups Spain |
| 🇮🇹 IT | StartupItalia, gruppi Telegram dev |
| 🇳🇱 NL | Frankwatching, Emerce, LinkedIn NL |
| 🇵🇱 PL | Wykop, 4programmers, r/Polska |
| 🇸🇪 SE | Breakit, SUP46 |
| 🇯🇵 JP | Zenn, Qiita, note, X 個人開発 |
| 🇰🇷 KR | 디스콰이엇, GeekNews (news.hada.io), OKKY, Naver Blog |
| 🇮🇩 ID | Kaskus, Telegram dev, TikTok tech |
| 🇸🇦 SA | X saudita (muito ativo), Snapchat, LinkedIn KSA |
| 🇹🇷 TR | Webrazzi, Ekşi Sözlük, Kodlama Discord |

## Datas culturais para campanhas ("coroa especial")

- 🇧🇷 Aniversário do Pix (16/11) e Black Friday: "a coroa mais barata do ano" (lance mínimo promocional)
- 🇳🇱 Koningsdag (27/04): "Wie draagt de kroon?"
- 🇸🇦 Dia Nacional (23/09) e Ramadã (copy sóbria, horário noturno)
- 🇯🇵 Golden Week e 年末 (fim de ano: retrospectivas de ranking)
- 🇰🇷 Fim de ano com "연말 결산" (balanço anual estilo charts de K-pop)
- 🇮🇳 Diwali: campanha "light up #1"
- 🇸🇪 Midsommar, 🇲🇽 Día de Muertos ("Hall da Fama" com tema de altar), 🇹🇷 temporada de derbis

## Mídia paga (pequena, depois que houver tração orgânica)

- Patrocínio de newsletters indie locais (de US$ 50 a 300 por envio) rende mais que ads.
- Reddit Ads segmentado por subreddit no lançamento de cada onda.
- **Não compre seguidores nem cliques.** Cliques falsos corrompem o ranking gratuito e destroem a confiança.

## Métricas (norte)

| Métrica | Meta no mês 3 por edição da onda 1 |
|---|---|
| Lançamentos grátis/dia | ≥ 5 de 10 vagas |
| Makers com selo embutido | ≥ 20 |
| Trocas de #1/mês | ≥ 4 (sinal de disputa) |
| Receita/edição | O equivalente a US$ 300 a 1.000 |
| Assinantes da newsletter | ≥ 500 |
