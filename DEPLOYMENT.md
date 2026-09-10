# Busola deployment runbook

## Hackathon demo mode

The dashboard can be presented immediately by opening `index.html`. It has no build step and its multilingual, theme, animation, simulator, and local chatbot interactions run in the browser.

## Live AI mode

The live adviser is designed to run through `backend/ai-server.mjs`:

1. Set `OPENAI_API_KEY` and optional `OPENAI_MODEL` only in the server's secret manager or runtime environment.
2. Deploy the server behind HTTPS with access control.
3. Point the website's chat request to `POST /v1/copilot/answers` on that server.
4. Replace the synthetic context only with approved, permissioned reports and data; retain source, freshness, confidence, and human-review metadata.

Never place an OpenAI API key in `index.html`, a frontend bundle, or a repository.

Set `window.RASD_AI_ENDPOINT` in the page deployment configuration to the gateway URL. When it is blank or unreachable, the interface automatically stays in clearly labeled demo mode and does not transmit a user question anywhere.

## Hosting decision

This workspace has no connected deployment destination, domain, or ChatGPT Sites capability. The deliverable is intentionally static-host ready: deploy `index.html` and `assets/`, and deploy `backend/ai-server.mjs` as a separate private service for live AI. Before publishing, choose the owning account, hosting provider, custom domain, access policy, and secret-management location.

## Review gate before external sharing

- Confirm PIF brand approval and the required logo attribution.
- Replace illustrative opportunity data with approved demo data only.
- Test Arabic and English at desktop and mobile widths.
- Validate the copilot's citations, prompt-injection defenses, and employee/portfolio-company data scope.
- Keep the human approval step for all procurement, supplier, or investment outputs.
