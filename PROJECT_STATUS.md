# Owner-to-Skill Project Status

_Last updated: 2026-07-17_

## Handoff Log

- 2026-07-17: Imported a repository-wide gap analysis into this status file. No product features were implemented in this update. The repository was inspected, existing tests were run, and the current prototype state, risks, and recommended roadmap were documented for the next agent.
- 2026-07-17: Updated this PR branch handoff after a requested main-branch reconciliation pass. The full gap analysis remains preserved, `PROJECT_STATUS.md` remains the canonical cross-agent handoff document, and no product features were implemented. The local checkout did not contain a `main` branch, remote, `AGENTS.md`, or main-version `PROJECT_STATUS.md`, so there was no accessible main-branch handoff history to merge in this environment. Next action remains P0.1: implement the typed policy schema with stable rule IDs.

## Executive Assessment

Owner-to-Skill is currently a clean, minimal, runnable local prototype with passing tests, zero dependencies, a simple browser UI, heuristic interview extraction, draft `SKILL.md` generation, and a shallow unsupported-claim audit. However, it does not yet implement the core product loop promised by the competition goal: typed policy reconstruction, permission modeling, customer-request decisioning, grounded response generation, structured audit findings, or repeatable evaluation metrics. The strongest path is not to add infrastructure or a model dependency, but to turn the existing prototype into a narrow deterministic vertical slice where owner text compiles into policy rules, customer requests produce explicit decisions, responses cite evidence, audits produce findings, and scenario metrics demonstrate reduced unsupported commitments.

## Current-State Inventory

### Repository Shape

The repository is a small zero-dependency Node prototype:

- `src/analyzer.js` contains all extraction, draft Skill generation, contradiction detection, and answer audit logic.
- `src/server.js` exposes the local HTTP server, JSON API routes, and static file serving.
- `public/index.html` provides a single-page browser demo.
- `test/analyzer.test.js` contains two analyzer tests.
- `test/server.test.js` contains one server smoke workflow test.
- `sample-data/interview.txt` contains one short Willow Pet Grooming sample interview.
- `README.md` accurately describes the project as a minimal deterministic local prototype with no paid API or dependencies.

### Existing Functionality

#### Interview analysis

`analyzeInterview(text)` splits owner input into sentences, then classifies sentences into arrays using regular-expression keyword matching:

- `facts`
- `policies`
- `boundaries`
- `toneGuidance`

If a category has no matches, the analyzer inserts placeholder fallback text. Extraction is deterministic and does not call an external model.

#### Contradiction detection

The current contradiction detector only checks for two narrow patterns:

- refund contradiction: negative refund language plus positive refund/availability language;
- Monday-hours contradiction: open Monday plus closed/not-open Monday.

Contradictions are returned as plain strings, not typed blocking issues.

#### Draft Skill generation

The analyzer generates a markdown Skill draft with these sections:

- Business Facts
- Policies
- Boundaries
- Tone
- Reliability Rule

The reliability rule instructs the assistant not to answer when the answer is not grounded in the extracted facts, policies, or boundaries.

#### Answer audit

`auditAnswer(answer, structured)` looks for hard-coded strong-claim words such as `guarantee`, `always`, `never`, `free`, `refund`, `same day`, `24/7`, and `certified`. It then checks whether any answer word longer than four characters appears in the concatenated extracted facts, policies, and boundaries. A strong claim with no lexical overlap is marked unreliable.

#### HTTP API

The server currently exposes:

- `POST /api/analyze`: returns `analyzeInterview(String(body.text || ''))`.
- `POST /api/audit`: returns `auditAnswer(String(body.answer || ''), body.structured || {})`.

The server also serves the browser UI from `public/`, blocks obvious path traversal, returns 404 for unknown POST routes, and returns JSON errors with status 400 for exceptions such as malformed JSON.

#### Browser UI

The UI supports:

- editing/pasting an owner interview;
- running analysis;
- viewing raw structured JSON;
- entering a customer-facing answer;
- auditing that answer.

The UI does not currently support editable typed policy, customer request decisioning, grounded response generation, evidence display, structured audit findings, or evaluation reports.

## What Is Mocked, Heuristic, Incomplete, Fragile, or Unverified

### Heuristic or mocked

- Core extraction is regex keyword matching, not semantic policy extraction.
- The README explicitly frames the current system as deterministic mock mode and suggests replacing `src/analyzer.js` later with an LLM adapter while preserving the JSON shape.
- Generated Skill markdown is a template populated with extracted strings.
- The audit is a simple strong-keyword plus word-overlap check.
- The customer simulation is not actually a customer-request workflow; it audits a manually written answer.

### Incomplete

The current project lacks:

- a real owner interview workflow;
- follow-up question generation;
- a typed policy schema;
- permission and authority modeling;
- decision outcomes: handle, ask for more information, escalate, refuse;
- grounded response generation;
- evidence mapping from response claims to rules;
- structured audit findings;
- evaluation scenario files and metrics;
- baseline comparison;
- expert-authored benchmark comparison;
- persistence/export beyond visible markdown/JSON;
- a model/API adapter boundary;
- robust schema validation and failure handling.

### Fragile

- Sentence splitting is simplistic and may fail on bullet lists, fragments, abbreviations, or transcripts.
- Keyword extraction can miss policies expressed without the expected words.
- The same sentence can be duplicated across categories because there is no canonical rule model.
- Each category is truncated to six matching sentences, which can silently discard important policy details.
- The audit can pass unsafe claims if they share an arbitrary long word with extracted source text.
- The audit can fail safe claims if they contain strong words but lack lexical overlap.
- Contradiction detection only covers refunds and Monday hours.
- `readJson` has no request body size limit.
- Invalid or adversarial structured policy objects are not validated.

### Unverified

The current tests do not verify:

- semantic policy reconstruction;
- decision correctness;
- escalation correctness;
- refusal behavior;
- grounded response generation;
- evidence citation quality;
- structured audit accuracy;
- repeated evaluation metrics;
- baseline comparisons;
- UI behavior beyond loading the page;
- robustness against large, malformed, or adversarial inputs beyond malformed JSON.

## Existing Tests and Exact Results

### Commands used during gap analysis

```bash
pwd && rg --files -g 'AGENTS.md' -g '!node_modules' -g '!vendor' && find .. -name AGENTS.md -print
rg --files -g '!node_modules' -g '!vendor'
find . -maxdepth 3 -type f | sort
sed -n '1,220p' README.md
cat package.json
nl -ba src/analyzer.js | sed -n '1,260p'
nl -ba src/server.js | sed -n '1,260p'
nl -ba public/index.html | sed -n '1,260p'
nl -ba test/analyzer.test.js | sed -n '1,260p'
nl -ba test/server.test.js | sed -n '1,260p'
nl -ba sample-data/interview.txt | sed -n '1,200p'
npm test
git status --short
git log --oneline -5
```

### Exact test command

```bash
npm test
```

### Exact test result

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> owner-to-skill@0.1.0 test
> node --test

✔ extracts policies and boundaries and flags risky answers (3.095229ms)
✔ handles empty and contradictory interviews (0.682117ms)
✔ smoke workflow: load UI, analyze interview, audit generated knowledge, reject malformed JSON (78.48702ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 658.911885
```

### What the tests prove

- The analyzer can extract a policy-like sentence for a narrow refund fixture.
- The analyzer can produce fallback facts for empty input.
- The analyzer can flag one narrow contradiction fixture.
- The audit can reject one obvious unsupported strong-claim answer.
- The server can load the UI, block direct access to `src/server.js`, analyze one fixture, audit one fixture, and reject malformed JSON.

### What the tests do not prove

- They do not prove safe assistant behavior.
- They do not prove semantic extraction.
- They do not prove decisioning or escalation correctness.
- They do not prove response grounding.
- They do not prove measurable improvement over a baseline.

## Branch Reconciliation Notes

- Requested update target: latest `main` branch.
- Local result: this checkout currently has only the `work` branch and no configured remote. `git fetch origin main` failed because `origin` is not configured as a Git repository remote.
- `AGENTS.md` result: no `AGENTS.md` file is present in the accessible checkout, and no main-branch `AGENTS.md` could be read because no `main` ref or remote exists locally.
- Main `PROJECT_STATUS.md` result: no main-branch version could be read or merged for the same reason.
- Mergeability status in this environment: there is no local or remote `main` ref to merge against, so mergeability with main cannot be mechanically confirmed here. The working tree changes are documentation-only and limited to this handoff file.

## Product Gaps

The current project can look like a keyword extractor because extraction is implemented as regex filters over sentences. It can look like a generic Skill generator because the generated Skill is a markdown template populated with copied sentences. It can look like a demo without measurable proof because there is no evaluation dataset, no metrics, no baseline comparison, and no repeatable report.

To make the differentiation clear to a hackathon evaluator, the demo must visibly show:

1. owner input becoming typed policy rules, not just copied sentences;
2. a customer request producing a decision, not merely an answer;
3. a response citing supporting business rules;
4. an audit failing unsafe answers for specific reasons;
5. an evaluation report measuring unsupported commitment and escalation behavior;
6. a baseline or comparison mode that performs worse on the same scenarios.

## Architecture Gaps

### Input and interview processing

Current input is one free-text blob. There is no interview state, follow-up question generation, source-span tracking, confidence, owner review status, or normalized extraction of common business concepts such as hours, service area, cancellation window, refund conditions, appointment requirements, eligibility, or prohibited commitments.

### Policy schema

The current structured output is arrays of strings plus generated markdown. There are no rule IDs, typed rule categories, conditions, actions, authority limits, severity/risk levels, escalation rules, refusal rules, unknowns, or typed contradictions.

### Permissions and escalation modeling

There is no first-class model of what the assistant may promise, quote, schedule, discount, refund, diagnose, accept, reject, or modify. There is no distinction between asking the customer for missing information and escalating to the owner.

### Decision engine

There is no decision engine. The system audits an answer after it has already been written. It does not parse customer requests or return `handle`, `ask_more_info`, `escalate`, or `refuse`.

### Response generation

The system does not generate customer-facing responses. It only audits a manually entered answer. There are no templates for safe handling, missing information, escalation, or refusal.

### Evidence grounding

Grounding is currently lexical overlap. There are no rule IDs, claim-to-rule mappings, source spans, or visible support for each response claim.

### Audit logic

Audit output is a boolean and one reason string. It does not identify unsupported claims, missing conditions, authority violations, unresolved contradictions, or severity.

### Contradiction and unknown-policy handling

Unknowns are placeholder strings, not actionable blocking items. Contradictions do not block decisions because there is no decision engine.

### Evaluation framework

There is no scenario runner, metrics module, baseline comparison, expert benchmark, or evaluation report.

### UI and explainability

The UI shows raw JSON and a simple audit result. It does not guide the evaluator through the intended demo flow.

### Persistence and export

There is no persistence and no explicit export flow for `policy.json`, `SKILL.md`, audit reports, or eval reports.

### Model/API integration

There is no model integration and no adapter boundary. For the P0 competition scope, this is acceptable if the deterministic vertical slice is strong.

### Security and failure handling

The server has basic malformed JSON handling and simple static path traversal protection, but no request size limits, schema validation, timeout strategy, or adversarial input tests.

## Prioritized Roadmap

## P0: Required for a Complete, Convincing Competition Demo

### P0.1: Introduce a typed policy schema with rule IDs

User-visible behavior:

- After the owner interview, the UI shows an editable structured policy with clear rule IDs, categories, conditions, allowed commitments, forbidden commitments, escalation triggers, unknowns, and contradictions.

Proposed files/modules:

- Add `src/policy-schema.js`.
- Update `src/analyzer.js`.
- Update `public/index.html`.
- Add `test/policy-schema.test.js` or extend `test/analyzer.test.js`.

Required data structures:

```js
{
  business: {
    name,
    location,
    tone
  },
  rules: [
    {
      id,
      type,
      topic,
      condition,
      action,
      allowedCommitments,
      forbiddenCommitments,
      escalationTriggers,
      sourceText,
      status,
      risk
    }
  ],
  unknowns: [],
  contradictions: []
}
```

Tests needed:

- Extracts cancellation policy into a typed rule.
- Extracts pet-weight boundary into a forbidden/eligibility rule.
- Extracts tone into `business.tone`.
- Produces stable rule IDs.
- Empty or vague interview creates unknowns.
- Contradicted topic is marked `status: "contradicted"`.

Dependencies: none.

Complexity: medium.

### P0.2: Add a customer request decision engine

User-visible behavior:

- A customer request returns one of `handle`, `ask_more_info`, `escalate`, or `refuse`.
- The UI displays the decision, reason codes, missing information, and supporting/blocking rules.

Proposed files/modules:

- Add `src/decision.js`.
- Update `src/server.js` with `POST /api/decide`.
- Update `public/index.html`.
- Add `test/decision.test.js`.

Required data structures:

```js
{
  request,
  decision,
  reasonCodes,
  requiredInfo,
  supportingRuleIds,
  blockingRuleIds,
  risk
}
```

Tests needed:

- Request covered by policy returns `handle`.
- Request missing appointment/date/time returns `ask_more_info`.
- Request asking for exception/refund outside policy returns `escalate`.
- Request asking for forbidden service returns `refuse`.
- Request touching contradicted topic returns `escalate`.
- Request touching unknown policy returns `ask_more_info` or `escalate`.

Dependencies: P0.1.

Complexity: medium.

### P0.3: Generate grounded customer-facing responses

User-visible behavior:

- Given a decision, the system generates a safe customer response that uses the owner’s tone guidance, avoids commitments outside policy, asks for missing information when needed, escalates when authority is insufficient, refuses prohibited requests politely, and shows evidence rule IDs.

Proposed files/modules:

- Add `src/response.js`.
- Update `src/server.js` with `POST /api/respond` or combine with `/api/decide`.
- Update `public/index.html`.
- Add `test/response.test.js`.

Required data structures:

```js
{
  response,
  evidence: [
    {
      claim,
      ruleId,
      sourceText
    }
  ]
}
```

Tests needed:

- Generated response for cancellation cites cancellation rule.
- Generated response for unknown policy does not invent an answer.
- Generated response for forbidden service refuses without overexplaining.
- Generated response for escalation does not promise owner approval.
- Every factual/policy sentence has evidence or is generic conversational text.

Dependencies: P0.1 and P0.2.

Complexity: medium.

### P0.4: Replace the current audit with structured audit findings

User-visible behavior:

- The audit panel reports specific findings such as unsupported claim, missing condition, authority violation, should-have-escalated, contradiction unresolved, or no evidence for response sentence.

Proposed files/modules:

- Add `src/audit.js`.
- Keep a compatibility wrapper in `src/analyzer.js` if desired.
- Update `src/server.js`.
- Update `public/index.html`.
- Add `test/audit.test.js`.

Required data structures:

```js
{
  pass,
  findings: [
    {
      type,
      severity,
      message,
      claim,
      ruleId,
      suggestedFix
    }
  ]
}
```

Tests needed:

- Unsupported guarantee fails.
- Refund exception without permission fails.
- Same-day/free/24-7 claims fail unless explicitly supported.
- Response touching contradicted policy fails.
- Response generated from `response.js` passes for covered scenario.
- Audit catches an answer that says “yes” when the decision engine says `escalate`.

Dependencies: P0.1, P0.2, and P0.3.

Complexity: medium.

### P0.5: Add repeatable evaluation scenarios and metrics

User-visible behavior:

- The demo can run an evaluation and produce a measurable report showing unsupported commitment rate, correct escalation rate, failure-to-escalate high-risk cases, unnecessary escalation rate, and decision accuracy.

Proposed files/modules:

- Add `sample-data/willow-policy.json`.
- Add `sample-data/scenarios/willow.json`.
- Add `src/eval/run-eval.js`.
- Add `src/eval/metrics.js`.
- Add `test/eval.test.js`.
- Update `package.json` with an `eval` script.

Required data structures:

```js
{
  scenarios: [
    {
      id,
      request,
      expectedDecision,
      expectedRuleIds,
      highRisk,
      notes
    }
  ]
}
```

Report shape:

```js
{
  total,
  decisionAccuracy,
  unsupportedCommitmentRate,
  correctEscalationRate,
  failureToEscalateHighRiskRate,
  unnecessaryEscalationRate,
  failures
}
```

Tests needed:

- Eval runner loads scenario file.
- Metrics are correct on a small fixed fixture.
- At least one scenario for each decision type.
- Report includes failure details.

Dependencies: P0.2, P0.3, and P0.4.

Complexity: medium.

### P0.6: Rework the UI into the intended demo flow

User-visible behavior:

- The page walks through owner interview, policy and boundary extraction, editable structured policy, generated Skill, customer request, decision and grounded response, automated audit, and evaluation report.

Proposed files/modules:

- Update `public/index.html`.
- Optionally add `public/app.js` if the inline script grows too large.

Required data structures:

- Use the P0.1-P0.5 structures directly.

Tests needed:

- Server smoke test verifies the page contains key sections.
- API smoke test verifies analyze -> decide/respond -> audit chain.
- Eval endpoint or CLI test verifies report generation.

Dependencies: P0.1 through P0.5.

Complexity: medium.

### P0.7: Update README to make the product thesis and proof obvious

User-visible behavior:

- A judge can read the README and immediately understand the problem, full demo flow, sample scenario proof, metrics, deterministic/offline mode, and limitations.

Proposed files/modules:

- Update `README.md`.

Required data structures: none.

Tests needed:

- No automated test required, but README commands must be manually verified.

Dependencies: P0.1 through P0.6.

Complexity: small.

## P1: Valuable If Time Remains

### P1.1: Baseline comparison mode

Add a deterministic naive assistant baseline that answers from the raw business description without structured policy enforcement. Run the same scenarios against both systems.

### P1.2: Expert-authored benchmark import

Add one hand-authored expert Skill or policy file for the same sample business and compare the generated policy to it.

### P1.3: Owner modification burden tracking

Track how many extracted rules the owner edits, deletes, or confirms in the UI. This supports an owner intervention/modification burden metric.

### P1.4: Better extraction heuristics

Improve extraction for hours, service area, appointment windows, deposits, exceptions, age/weight/eligibility limits, and owner-only decisions while preserving deterministic tests.

### P1.5: Optional LLM adapter

Add an optional model-backed extractor or response rewriter behind an interface, while keeping deterministic fallback and tests. Do not make LLM access required for the demo.

## P2: Post-Hackathon or Unnecessary for Initial Scope

### P2.1: Persistence/database

A database is unnecessary for the P0 demo. Browser download/export and checked-in sample files are enough.

### P2.2: Authentication

Authentication is out of scope for the hackathon vertical slice.

### P2.3: Payment, inventory, booking, or POS integrations

Avoid these for P0. They add risk and do not prove the core thesis.

### P2.4: Custom model training

Not needed and not appropriate for the project constraints.

### P2.5: Multi-business SaaS platform

Too broad for this stage. The correct scope is a narrow, runnable vertical slice.

## Recommended Target Architecture

Keep the project a zero- or low-dependency local Node app, but split responsibilities into clearer modules:

```text
src/
  analyzer.js          # owner interview -> draft policy candidates
  policy-schema.js     # normalize/validate policy shape, stable IDs
  decision.js          # policy + customer request -> decision object
  response.js          # decision + policy -> grounded customer response
  audit.js             # request + decision + response + policy -> findings
  skill.js             # policy -> SKILL.md
  server.js            # static server + JSON APIs
  eval/
    run-eval.js        # CLI scenario runner
    metrics.js         # metric calculations
public/
  index.html           # single-page demo flow
sample-data/
  interview.txt
  willow-policy.json
  scenarios/
    willow.json
test/
  analyzer.test.js
  decision.test.js
  response.test.js
  audit.test.js
  eval.test.js
  server.test.js
```

Recommended runtime flow:

```text
Owner interview text
  -> analyzer.extractPolicyCandidates()
  -> policy-schema.normalizePolicy()
  -> editable policy JSON
  -> skill.generateSkillMarkdown(policy)

Customer request
  -> decision.decideRequest(policy, request)
  -> response.generateResponse(policy, decision)
  -> audit.auditResponse(policy, request, decision, response)
  -> UI shows decision, response, evidence, findings

Scenario file
  -> eval runner
  -> repeated decision/response/audit
  -> metrics report
```

This architecture proves the product thesis without adding infrastructure, database, framework, payment integrations, production deployment, or custom model training.

## Definition of Done for Competition Submission

### Functional behavior

The repository is ready when it can:

- accept a small-business owner interview;
- extract typed policy rules with IDs, source text, and status;
- identify basic contradictions and unknowns;
- let the user inspect or edit structured policy;
- generate a `SKILL.md` draft from policy;
- accept a customer request;
- return a decision: handle, ask more info, escalate, or refuse;
- generate a customer-facing response grounded in policy;
- show rule IDs and source text supporting the response;
- audit the response and produce structured findings;
- run a repeatable scenario evaluation report.

### Tests

Minimum test checklist:

- Analyzer extraction tests for facts, policies, boundaries, tone, unknowns, and contradictions.
- Policy schema tests for stable IDs and normalized rule shape.
- Decision tests covering all four decisions.
- Response tests verifying safe language and evidence mapping.
- Audit tests for unsupported claims, authority violations, missing conditions, and contradicted policy.
- Eval tests for metric calculations.
- Server smoke test for the full API workflow.
- README commands verified locally.

### Sample data

The repository should include:

- at least one owner interview longer than the current one-line sample;
- a generated policy JSON artifact;
- a generated `SKILL.md` artifact or export flow;
- at least 10-15 scenario requests covering safe handled requests, missing-info cases, escalation cases, refusal cases, unsupported commitment traps, and contradiction/unknown-policy traps.

### Evaluation evidence

The README should show an example eval output with total scenarios, decision accuracy, unsupported commitment rate, correct escalation rate, failure-to-escalate high-risk rate, unnecessary escalation rate, and failures.

### Demo readiness

A live demo should complete in under three minutes:

1. Paste or load owner interview.
2. Show extracted rules.
3. Show a risky customer request.
4. Show decision: escalate, refuse, ask more info, or handle.
5. Show grounded response and evidence.
6. Show audit passing or catching unsafe answer.
7. Run eval and show metrics.

## Major Product and Architecture Risks

### Unsupported product claims

The repository should not yet claim that it reliably produces safe assistants. It currently has heuristic extraction and shallow audit logic. Safe current claims are: prototype, deterministic offline demo, heuristic extraction, and passing tests. Claims about preventing unsupported commitments or accurately extracting business policy are not yet supported.

### Data leakage risks in benchmark design

Evaluation scenarios should not simply mirror the implementation regexes or reuse exact owner-interview phrases. If all scenarios are visible and tuned against implementation details, the metrics may overstate performance. Include paraphrases and at least a small held-out/manual review set if possible.

### LLM evaluator risks

If an LLM evaluator is later added, it may reward fluent but unsupported answers, miss authority violations, accept plausible hallucinations, penalize safe terse responses, or produce non-repeatable scores. P0 metrics should remain deterministic and rule-based.

### Impressive features that do not prove the thesis

The following may look impressive but do not prove the core product thesis:

- pretty Skill markdown without enforcement;
- polished LLM responses without evidence;
- a chat UI without measurable safety metrics;
- more business domains without decision coverage;
- payment, booking, inventory, or CRM integrations;
- authentication or deployment work.

### Live demo failure risks

Likely demo failure points today:

- extraction misses policy because the owner phrased it without expected keywords;
- audit passes unsafe responses due to arbitrary word overlap;
- audit fails safe responses due to strong words without lexical overlap;
- UI cannot demonstrate customer-request decisioning;
- no metrics are available for judges;
- no rule IDs are available to justify responses;
- contradictions outside refunds/Monday are missed.

## Five Most Important Next Actions

1. Add a typed policy schema with rule IDs, source text, unknowns, contradictions, permissions, and escalation triggers.
2. Implement a deterministic decision engine returning `handle`, `ask_more_info`, `escalate`, or `refuse` with supporting and blocking rule IDs.
3. Generate customer-facing responses from the decision object with explicit evidence mappings.
4. Replace the current boolean audit with structured audit findings for unsupported claims, authority violations, missing conditions, and contradiction handling.
5. Add a scenario evaluation runner and README demo script showing measurable unsupported-commitment and escalation metrics.

## Single Best First P0 Implementation Task

Implement P0.1: add a typed policy schema and update `analyzeInterview()` so owner interviews produce stable rule IDs, source-backed rules, unknowns, and contradictions while preserving the current `skillMarkdown` output for compatibility.
