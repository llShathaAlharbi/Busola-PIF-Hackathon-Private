# Busola backend architecture

## Purpose

Busola is a decision-support platform. It should not make procurement or investment commitments autonomously. It joins portfolio-company demand, spend, supplier, logistics, inventory, and industrial-capability data, then produces explainable opportunity candidates for human review. Atheer is its evidence-aware AI adviser.

## Logical services

| Service | Responsibility | Example outputs |
| --- | --- | --- |
| Ingestion gateway | Receives approved ERP, procurement, inventory, shipment, and supplier feeds | validated batches and data-quality exceptions |
| Canonical data layer | Maps source fields to a shared product, supplier, site, and transaction model | normalized demand and spend facts |
| Product intelligence | Extracts specifications and maps equivalent products, materials, processes, and certifications | product capability graph and match confidence |
| Risk engine | Calculates import dependency, supplier and route concentration, inventory exposure, and disruption cost | transparent risk components and alerts |
| Opportunity engine | Aggregates demand, composes local capability chains, and compares mitigation with localization | ranked opportunity passports |
| Scenario service | Runs parameterized what-if models with versioned assumptions | time, cost, risk, and local-content deltas |
| Evidence copilot | Retrieval-augmented answers constrained to approved reports, data, and calculation outputs | cited answer with confidence and review status |
| Governance service | Enforces RBAC/ABAC, consent, audit logs, approval stages, and retention rules | immutable decision trail |

## Core data model

```text
PortfolioCompany ──< DemandLine >── Product ──< ProductRequirement
Supplier ──< SupplierCapability >── Capability
Product ──< SupplyRoute >── Site
Opportunity ──< ScenarioRun
Opportunity ──< EvidenceCitation
```

Every derived record carries `source_system`, `source_record_id`, `as_of`, `calculation_version`, `confidence`, and `classification`. This makes the AI assistant able to cite the underlying source and prevents an answer from being treated as an unverified fact.

## API shape

```text
GET  /v1/opportunities?sector=&status=&minReadiness=
GET  /v1/opportunities/:id
POST /v1/scenarios
GET  /v1/capability-compositions/:productId
POST /v1/copilot/answers
GET  /v1/evidence/:citationId
POST /v1/approvals
```

`POST /v1/copilot/answers` accepts the user question, allowed case IDs, and allowed report IDs. The response must return `answer`, `citations`, `confidence`, `calculationVersion`, and `requiresHumanReview`. The model never receives data outside the caller's scope.

## Security and governance

- Segment data by portfolio company; expose aggregated cross-company demand only under approved governance rules.
- Use Saudi-hosted or policy-approved data processing, encryption in transit/at rest, private networking, KMS-managed keys, and short-lived service identities.
- Maintain audit events for data access, simulator assumptions, AI retrieval context, generated answers, and approval actions.
- Require human approval for supplier recommendations, investment cards, and data exports.
- Present confidence, evidence, data freshness, and assumption labels in every executive workflow.

## MVP delivery path

1. CSV/API adapter with synthetic, realistic-structure data for three sectors.
2. Deterministic scoring and scenario formulas, with every number traceable.
3. Capability graph and semantic matching for one representative product.
4. Read-only, cited copilot grounded in the approved hackathon brief and selected demo data.
5. Clickable UI and review queue; no live procurement or investment execution.
