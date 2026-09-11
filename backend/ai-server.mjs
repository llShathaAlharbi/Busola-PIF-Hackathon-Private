/**
 * Busola's Atheer AI gateway — server-side only.
 *
 * Run: OPENAI_API_KEY=... node backend/ai-server.mjs
 * Never expose OPENAI_API_KEY in index.html or any browser bundle.
 * This demo intentionally sends only the approved synthetic context below.
 */
import http from 'node:http';

const port = process.env.AI_PORT || 4174;
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-5.6-terra';

const approvedContext = `
You are Atheer, Busola's evidence-aware supply-chain decision adviser.
The system is a hackathon demo. All opportunity amounts, supplier names, and scores are synthetic.
Answer in the user's language. Do not make procurement, supplier qualification, or investment decisions.
Always state when a value is illustrative and show the basis of the answer.
The approved demo facts are:
- Battery storage modules: SAR 184m annual aggregated demand, 87% import dependency, 68% local coverage potential, a missing thermal interconnection and packaging capability.
- Industrial robotic arms: SAR 96m annual demand, 92% import dependency, supplier-development route.
- Specialized copper alloys: SAR 73m annual demand, 71% import dependency, local-sourcing route.
Official framing: PIF's 2026–2030 strategy emphasizes competitive ecosystems, value-chain maturity, and advanced AI with strong data foundations. MUSAHAMA supports local content, local-industry development, supplier competitiveness, and ecosystem innovation.
`;

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || '{}');
}

http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  if (req.method !== 'POST' || req.url !== '/v1/copilot/answers') return json(res, 404, { error: 'Not found' });
  if (!apiKey) return json(res, 503, { error: 'OPENAI_API_KEY is not configured on the server.' });

  try {
    const body = await readJson(req);
    const question = String(body.question || '').slice(0, 4000);
    if (!question.trim()) return json(res, 400, { error: 'question is required' });

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        store: false,
        instructions: approvedContext,
        input: question,
        text: { verbosity: 'low' },
        moderation: { model: 'omni-moderation-latest' },
        safety_identifier: `rasd-demo-${String(body.sessionId || 'anonymous').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40)}`
      })
    });
    const payload = await response.json();
    if (!response.ok) return json(res, response.status, { error: payload.error?.message || 'OpenAI request failed' });
    json(res, 200, {
      answer: payload.output_text,
      citations: ['Approved demo context', 'PIF 2026–2030 strategy', 'MUSAHAMA program'],
      requiresHumanReview: true,
      model: payload.model
    });
  } catch (error) {
    json(res, 500, { error: error.message || 'Unexpected server error' });
  }
}).listen(port, () => console.log(`Busola AI gateway listening on http://localhost:${port}`));
