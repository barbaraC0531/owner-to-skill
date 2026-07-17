import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeInterview, auditAnswer } from '../src/analyzer.js';

test('extracts policies and boundaries and flags risky answers', () => {
  const structured = analyzeInterview('Open Monday. We do not ship outside Ohio. Refunds require a receipt. Use a friendly tone.');
  assert.match(structured.skillMarkdown, /Refunds/);
  assert.equal(auditAnswer('We guarantee free 24/7 delivery.', structured).reliable, false);
});

test('handles empty and contradictory interviews', () => {
  const empty = analyzeInterview('');
  assert.match(empty.facts[0], /not explicit/);
  const contradictory = analyzeInterview('We are open Monday. We are closed Monday. We offer refunds. We do not refund purchases.');
  assert.ok(contradictory.contradictions.length >= 1);
});
