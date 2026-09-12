# Busola | بوصلة

**[Open the live Busola demo](https://llshathaalharbi.github.io/Busola-PIF-Hackathon/)**

The published website runs as a static GitHub Pages demo. No local server is required for visitors. Aether (أثير) currently uses its existing built-in demo responses; the live Node.js AI backend is not deployed on GitHub Pages.

GitHub repository: **Busola-PIF-Hackathon**.

Interactive hackathon prototype for Busola, a decision-intelligence platform that turns supply-chain vulnerabilities into local-content and investment opportunities. Its evidence-aware AI adviser is Aether (أثير).

## Local development (optional)

For local development, run `node serve.mjs` and open the address printed in your terminal. Do not open `index.html` directly: the 3D viewer requires HTTP serving for JavaScript modules and the GLB asset. Three.js and model assets are bundled locally. Node.js is required for the local server; visitors to the published demo do not need it.

The capability composer now includes a searchable industrial catalogue and an animated semiconductor package authored in Blender (`assets/semiconductor.blend`, exported to GLB). It supports explosion/reassembly, rotation, zoom, part selection, and per-part demo trade and localization metrics. The other three products use conceptual procedural geometry. `assets/SOURCES.md` records provenance and data limits.

The revised decision simulator compares six responses with explicit cost calculations and editable demand, costs, horizon, disruption and qualification assumptions. Run `node tools/verify.mjs` to verify the calculation edge cases and exported model structure.

## What is included

- Arabic RTL and English LTR interfaces with five focused workspaces.
- Interactive vulnerability-to-opportunity map
- Decision simulator that compares import mitigation, local sourcing, supplier development, and local capability build-out
- Capability Composer for combining fragmented Saudi capabilities
- An evidence-aware AI adviser demo that answers questions about the current case and the supplied project brief
- Data lineage, confidence, human approval, and source-label patterns for a credible enterprise AI narrative

All opportunity amounts, supplier names, risk scores, and simulated outcomes in the prototype are illustrative demo data created for the hackathon. Official strategy statements and program framing are linked in the Sources area.

The PIF mark is stored locally at `assets/pif-logo.svg` for the requested prototype identity. Its source is the PIF-authored logo record on Wikimedia Commons, which identifies the file as CC BY-SA 4.0; retain appropriate attribution if the prototype is published externally.

## Production architecture

The suggested backend contract and implementation boundaries are documented in `backend/ARCHITECTURE.md`. `backend/mock-server.js` is a dependency-free mock API that mirrors the UI's principal endpoints for a demo environment.

`backend/ai-server.mjs` is an optional, server-side gateway for a live OpenAI-backed version of Aether. It requires an API key set in the server environment, never in the browser. It uses the Responses API with `store: false`, approved demo context, moderation, and an input/output contract that maintains the interface's evidence and human-review posture.

See `DEPLOYMENT.md` for backend deployment guidance. Its earlier hosting-status and direct-file-opening instructions predate the current GitHub Pages deployment; use the live demo link above.
