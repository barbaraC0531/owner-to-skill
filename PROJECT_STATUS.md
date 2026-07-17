# Owner-to-Skill Project Status

Last updated: 2026-07-16

## Current phase

**Phase:** Baseline prototype migrated; gap analysis completed in Codex task but not yet captured in the repository.

**Status:** The repository is runnable and tested, but the current product is still primarily a heuristic keyword extractor plus a simple strong-claim audit. The competition-grade vertical slice has not yet been implemented.

## Product thesis

Owner-to-Skill converts informal owner knowledge into explicit business policies, permissions, decision boundaries, escalation rules, and an auditable AI assistant.

The differentiator is not merely generating `SKILL.md`. The system should prove that customer-facing decisions are grounded in owner-provided evidence and remain within authorized boundaries.

## Current implementation

Implemented:

- Natural-language owner interview input.
- Heuristic extraction of facts, policies, boundaries, tone, and limited contradictions.
- Draft `SKILL.md` generation.
- A simple audit that flags some unsupported strong claims.
- Local Node HTTP server and browser UI.
- Unit and server smoke tests.
- Sample interview data.

Not yet implemented:

- Explicit policy and permission schema.
- Handle / ask-customer / escalate / refuse decision engine.
- Grounded response generation with cited supporting rules.
- Robust unknown-policy and contradiction handling.
- Scenario evaluation framework and measurable comparison.
- Competition-ready explainability and demo flow.
- Model/API integration beyond deterministic heuristics.

## Verification baseline

Latest known local verification during repository migration:

- `npm test`
- 3 tests passed
- 0 tests failed

This result should be re-run by Codex in its current environment before relying on it for future work.

## Decisions already made

- Formal competition repository: `barbaraC0531/owner-to-skill`.
- Original `build-week` repository remains the exploration archive.
- P0 should remain a narrow runnable vertical slice.
- No P0 authentication, payment, live inventory, custom-model training, or production deployment.
- Public expert-authored merchant Skills may be benchmarks, but not blind final acceptance data.
- Real-owner research may strengthen validation but must not block the initial technical submission.
- `PROJECT_STATUS.md` is the canonical cross-agent handoff document.

## Immediate next action

Ask Codex to summarize its completed gap analysis into this file, re-run the baseline tests, and recommend exactly one first P0 implementation task. Do not implement the whole roadmap in that task.

Suggested instruction:

> Read AGENTS.md and PROJECT_STATUS.md. Incorporate the gap analysis you just completed into PROJECT_STATUS.md, including the prioritized P0/P1/P2 roadmap, exact test results, key risks, and the single best first P0 implementation task. Do not implement product features in this task.

## Open questions

- What exact policy schema is the smallest one that supports permissions, conditions, unknowns, and escalation?
- Should the first competition version remain deterministic, use an LLM adapter, or support both?
- What minimum evaluation set best proves reduced unsupported commitments without overstating owner validation?
- Which first P0 vertical slice gives the strongest visible improvement per unit of implementation effort?

## Handoff log

### 2026-07-16 — Shared handoff initialized

- Added `AGENTS.md` to instruct Codex to maintain a shared status record.
- Added `PROJECT_STATUS.md` as the canonical project handoff.
- Current Codex gap-analysis output is not yet stored here.
- Next action: have Codex import its analysis and identify one first P0 task.
