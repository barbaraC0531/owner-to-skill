# Owner-to-Skill Project Decisions

Last updated: 2026-07-17

This file preserves stable project decisions that should not be lost when `PROJECT_STATUS.md` is refreshed. `PROJECT_STATUS.md` remains the canonical current-status and cross-agent handoff document.

## Product thesis

Owner-to-Skill converts informal owner knowledge into explicit business policies, permissions, decision boundaries, escalation rules, and an auditable AI assistant.

The differentiator is not merely generating `SKILL.md`. The product must demonstrate that customer-facing decisions are grounded in owner-provided evidence and remain within authorized boundaries.

## Repository and scope

- Formal competition repository: `barbaraC0531/owner-to-skill`.
- The original `build-week` repository remains the exploration archive and should not be rewritten.
- P0 is a narrow, runnable vertical slice rather than a broad platform.
- Do not add P0 authentication, payments, live inventory, booking/POS integrations, custom-model training, or production deployment.
- Preserve the current zero- or low-dependency approach unless a dependency has a clear, demonstrated benefit.

## Required competition loop

Owner interview
→ typed policy and authority model
→ customer-request decision
→ grounded response with evidence
→ structured safety audit
→ repeatable evaluation report

The four decision outcomes are:

- `handle`
- `ask_more_info`
- `escalate`
- `refuse`

## Evaluation decisions

- Public expert-authored merchant Skills may be used as benchmarks, but not as blind final acceptance data after they have influenced implementation.
- Use a controlled fictional store with complete ground-truth policy for repeatable technical evaluation.
- Real-owner research can strengthen validation, but must not block the initial technical submission.
- Anything used to tune the implementation is development data, not blind acceptance data.
- Priority metrics include unsupported commitment rate, correct escalation rate, failure to escalate high-risk cases, unnecessary escalation rate, decision accuracy, and owner modification burden when available.
- P0 evaluation should remain deterministic and rule-based; an LLM evaluator may be added later only as supplemental evidence.

## Implementation order

1. Typed policy schema with stable rule IDs, source text, unknowns, contradictions, permissions, and escalation triggers.
2. Deterministic decision engine.
3. Grounded response generation with evidence mappings.
4. Structured audit findings.
5. Scenario evaluation runner and metrics.
6. Competition demo UI and README proof.

## Agent handoff

- `AGENTS.md` defines the shared working protocol.
- `PROJECT_STATUS.md` is the canonical current handoff document and must be updated at the end of each task.
- This file records stable decisions and should change only when the human owner intentionally changes project direction.
