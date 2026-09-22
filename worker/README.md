# Worker de contato (Resend)

Recebe o POST do formulário em `index.html` e envia o email via Resend,
mantendo a API key fora do navegador.

## Deploy

```bash
cd worker
npm install -g wrangler   # se ainda não tiver
wrangler login
wrangler secret put RESEND_API_KEY   # cole a key gerada no dashboard da Resend
wrangler deploy
```

Isso publica em `https://benck-contact-worker.<seu-subdomínio>.workers.dev`.

## Domínio custom (api.benck.tech)

Só funciona depois que o DNS de `benck.tech` estiver na Cloudflare
(ver checklist geral). Aí:

1. Descomente o bloco `[[routes]]` em `wrangler.toml`.
2. Rode `wrangler deploy` de novo.
3. O formulário já aponta para `https://api.benck.tech/contact`
   ([main.js](../assets/js/main.js) — variável `CONTACT_ENDPOINT`).

Se preferir testar antes disso, troque temporariamente `CONTACT_ENDPOINT`
para a URL `*.workers.dev` que o deploy imprimir.
