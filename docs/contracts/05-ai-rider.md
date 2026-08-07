# AI Solutions Rider

**Attached to SOW No.:** [SOW-YYYY-###] · **Effective:** [YYYY-MM-DD]

> Attach to AI SOWs. Not legal advice.

---

## 1. Use cases

In scope:

1. [USE CASE]
2. [USE CASE]

**Need a Change Order for:** new use cases/data sources/autonomous actions; provider/model changes beyond §3; regulated decision systems; medical/legal/financial advice systems; fully autonomous customer-facing actions.

## 2. Human-in-the-loop

| Tier   | Examples                            | Control                            |
| ------ | ----------------------------------- | ---------------------------------- |
| Low    | Drafts, internal search             | Client spot-check                  |
| Medium | Customer replies, content, triage   | Named reviewer before publish/send |
| High   | Payments, account changes, legal/HR | Human approval; no auto-execute    |

Client staffs reviewers and responds within **2 business days** during UAT (and per any managed-services terms). Medium/High acceptance requires a documented review workflow.

## 3. Models, cost, acceptance

| Item             | Value                                                           |
| ---------------- | --------------------------------------------------------------- |
| Provider / model | [OpenAI / Anthropic / other]                                    |
| Billing          | [Client-direct / Studio pass-through at cost w/ prior approval] |
| Token/API budget | $[ ] · overages need written approval                           |

Acceptance: agreed eval scenarios · success metrics (qualitative OK) · HITL demo. No guarantee of zero hallucinations, provider uptime, or ROI. Studio may propose substitutes if a model is retired; material changes need Client approval.

## 4. Data and IP

Client owns Client data, Client-specific prompts, and embeddings from Client data (subject to provider terms). Studio will not train its own general models on Client confidential data; enable provider training opt-out/zero-retention where the Client’s plan allows. Client warrants lawful rights/consents; least-privilege credentials; Client rotates access after handoff.

Per MSA on full payment: bespoke app code/config assign to Client; Studio keeps reusable adapters/frameworks/generic patterns/know-how. Fine-tunes follow provider terms.

## 5. Disclaimers and ops

Outputs may be wrong, biased, outdated, or non-unique — not warranted as legal/IP-clear/high-stakes-ready without Client review. Studio isn’t responsible for provider outages, rate limits, pricing, or policy actions beyond commercially reasonable restore/alternatives. After acceptance, Client owns ongoing review staffing, its prompt/policy changes, training, and downstream compliance.

---

## Signatures

|              | Studio | Client |
| ------------ | ------ | ------ |
| Signature    |        |        |
| Name / Title |        |        |
| Date         |        |        |
