# AGENTS.md

## Project purpose

Owner-to-Skill converts an owner's informal business knowledge into explicit facts, policies, permissions, boundaries, escalation rules, and an auditable AI assistant.

The core thesis is not merely "generate a SKILL.md." The product must demonstrate that an AI can act only within owner-authorized decision boundaries, explain the evidence for its decisions, and escalate safely when knowledge or permission is missing.

## Shared handoff protocol

`PROJECT_STATUS.md` is the canonical handoff document shared by the human owner, ChatGPT, Work, and Codex.

At the end of every task, update `PROJECT_STATUS.md` before reporting completion, unless the user explicitly forbids all file changes.

The update must be concise and factual. Include:

1. the current phase and task status;
2. what was completed;
3. files changed;
4. commands and tests run, with exact results;
5. important design decisions or assumptions;
6. unresolved risks, failures, or mocked behavior;
7. the single recommended next action;
8. a dated entry in the handoff log.

Do not mark work complete unless the stated verification actually ran. Distinguish clearly between implemented, proposed, mocked, and unverified behavior.

Do not remove earlier decisions or unresolved risks merely because a new task started. Replace stale status sections when appropriate, but preserve useful history in the handoff log.

## Development priorities

Prefer a narrow runnable vertical slice:

Owner interview
→ structured policy and authority model
→ customer-request decision
→ grounded response with evidence
→ safety audit
→ repeatable evaluation

Avoid P0 scope expansion into authentication, payments, live inventory, production deployment, custom model training, or broad multi-industry infrastructure.

## Completion behavior

Before finishing a coding task:

- inspect the diff;
- run relevant tests;
- review the result against the product thesis;
- fix major regressions;
- update `PROJECT_STATUS.md`;
- report anything that remains uncertain.
