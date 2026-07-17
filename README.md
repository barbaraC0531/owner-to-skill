# owner-to-skill

Minimal local prototype that turns a small-business owner interview into structured facts, policies, boundaries, tone guidance, and a draft `SKILL.md`. It also includes a customer-simulation audit for unsupported high-risk answers.

## Setup
```bash
npm install
```
This creates a local lockfile if your npm version requires one; there are no runtime or development dependencies.

## Run
```bash
npm start
```
Open http://localhost:3001.

## Test
```bash
npm test
```

## Mock mode
The prototype is fully deterministic and uses no paid API. Replace `src/analyzer.js` later with an LLM adapter while preserving the same JSON shape.

## Sample data
See `sample-data/interview.txt`.

## Architecture decisions
- Vanilla Node HTTP server and browser UI to keep dependencies at zero.
- Heuristic extraction makes the demo runnable offline.
- The generated skill text includes an explicit reliability rule.

## Windows compatibility
The scripts use plain `npm` and `node` commands and avoid shell-specific environment variable syntax. On Windows PowerShell, run the same commands from this README. To change the port, use `$env:PORT=3009; npm start`.

## External services
No paid API, secret, external service, Docker daemon, or globally installed package is required.

## Limitations
- Keyword extraction misses nuanced facts.
- The reliability audit detects only obvious unsupported strong claims.
- No persistent storage or authentication.
