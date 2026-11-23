# 12 · E-mail de aviso ("alguém tomou seu #1") com Resend

**Situação (22/11/2026):**
- A chave `RESEND_API_KEY` está no cofre da Cloudflare e em `.secrets.production`, que está fora do git.
- O domínio `crownd.dev` foi criado no Resend (região São Paulo), mas **ainda falta o DNS**.
- Enquanto o domínio não for verificado, nada é enviado e o site não promete aviso por e-mail.

## O que o e-mail faz
Quando alguém toma o #1 de uma edição, quem estava no topo recebe um e-mail no idioma da edição (14 idiomas). Ele traz um botão "Pegar a coroa de volta", que leva ao formulário de lance. Respostas a esse e-mail vão para o `LEGAL_EMAIL`. O código está em `src/lib/mail.ts`.

## 1. Adicionar o DNS na Cloudflare
**Forma mais rápida:** em https://resend.com/domains, abra `crownd.dev` e clique em **"Auto configure"** / **"Sign in to Cloudflare"**. O Resend cria os registros sozinho.

**Forma manual:** em dash.cloudflare.com → `crownd.dev` → **DNS → Records → Add record**, crie os registros abaixo. Deixe o "Proxy status" **desligado** (nuvem cinza) em todos.

| Tipo | Nome | Conteúdo | Prioridade |
|---|---|---|---|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdQyn9SQSVt8+PvWFw/o3dRv4AN+UQ5BXUrPpJJ/8VQydQbYOSeCSrCuLJgP/5l2xaw3heoBkTpmgCTTkU8zFKEyprvmdbrMfOy1xnKQNkscrpVVqb3zBbp9MMT5C2aQupRYRhdgCYnSuqor6JxAzD2+SqR3EMfb64nwKFJL6bQwIDAQAB` | — |
| MX | `send` | `feedback-smtp.sa-east-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | — |
| CNAME | `rsend` | `send.forge.rmta.net` | — |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@crownd.dev` | — (recomendado: melhora a entrega) |

## 2. Verificar e ligar
Alguns minutos depois de adicionar o DNS, rode:
```powershell
npm.cmd run mail:verify
```
O comando pede ao Resend para conferir o DNS. Quando o domínio estiver verificado, ele define `MAIL_ENABLED=1` no Worker, e a partir daí:
- os e-mails de aviso passam a ser enviados;
- a home e o formulário de lance voltam a prometer "avisamos por e-mail quando alguém pegar o seu #1".

Não é preciso publicar o site de novo.

## Segurança
A chave foi colada no chat, então ficou registrada no histórico da conversa. Recomendo:
1. Em resend.com/api-keys, crie uma chave nova com permissão **Sending access** restrita ao domínio `crownd.dev`.
2. Apague a chave antiga.
3. Atualize o cofre com `npx wrangler secret put RESEND_API_KEY` (cole a chave nova quando ele pedir; ela não aparece na tela) e troque também a linha correspondente em `.secrets.production`.
