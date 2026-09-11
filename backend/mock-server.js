/*
 * Dependency-free demo API for Busola. Run with: node backend/mock-server.js
 * It intentionally returns illustrative data only. Replace demoData with approved
 * adapters and a governed retrieval service before a production deployment.
 */
const http = require('http');
const port = process.env.PORT || 4173;

const opportunities = [
  { id: 'battery-modules', title: 'وحدات تخزين الطاقة', sector: 'الطاقة النظيفة', annualDemand: 184000000, importDependence: 87, readiness: 68, recommendation: 'تطوير قدرة محلية' },
  { id: 'robotic-arms', title: 'أذرع روبوتية صناعية', sector: 'التصنيع المتقدم', annualDemand: 96000000, importDependence: 92, readiness: 54, recommendation: 'تطوير مورد' },
  { id: 'copper-alloys', title: 'سبائك نحاس متخصصة', sector: 'المعادن المتقدمة', annualDemand: 73000000, importDependence: 71, readiness: 78, recommendation: 'توريد محلي' }
];

function respond(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && url.pathname === '/v1/opportunities') return respond(res, 200, { data: opportunities, demo: true });
  if (req.method === 'GET' && url.pathname.startsWith('/v1/opportunities/')) {
    const item = opportunities.find(x => x.id === url.pathname.split('/').pop());
    return item ? respond(res, 200, { data: item, evidence: ['DEMO-2026-001'] }) : respond(res, 404, { error: 'Not found' });
  }
  if (req.method === 'POST' && url.pathname === '/v1/scenarios') {
    let raw = '';
    req.on('data', chunk => raw += chunk);
    req.on('end', () => {
      const input = JSON.parse(raw || '{}');
      respond(res, 200, { data: { runId: `demo-${Date.now()}`, assumptions: input, requiresHumanReview: true } });
    });
    return;
  }
  respond(res, 404, { error: 'Route not found' });
}).listen(port, () => console.log(`Busola mock API on http://localhost:${port}`));
