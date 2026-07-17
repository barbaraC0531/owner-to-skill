import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

test('smoke workflow: load UI, analyze interview, audit generated knowledge, reject malformed JSON', async () => {
  const server = createServer().listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetch(`${base}/`).then(r => r.text());
    assert.match(page, /Owner-to-Skill/);
    const sourceFile = await fetch(`${base}/src/server.js`);
    assert.equal(sourceFile.status, 404);
    const structured = await fetch(`${base}/api/analyze`, { method: 'POST', body: JSON.stringify({ text: 'We are open Friday. Cancellations require 24 hours. Use a warm tone.' }) }).then(r => r.json());
    assert.match(structured.skillMarkdown, /Cancellations/);
    const audit = await fetch(`${base}/api/audit`, { method: 'POST', body: JSON.stringify({ answer: 'We guarantee free 24/7 certified delivery.', structured }) }).then(r => r.json());
    assert.equal(audit.reliable, false);
    const malformed = await fetch(`${base}/api/analyze`, { method: 'POST', body: '{bad json' });
    assert.equal(malformed.status, 400);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
