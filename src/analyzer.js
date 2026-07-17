export function analyzeInterview(text) {
  const sentences = String(text).split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(Boolean);
  const facts = pick(sentences, [/open|located|serve|sell|founded|hours|employees|specialize|we are/i]);
  const policies = pick(sentences, [/refund|return|appointment|booking|cancel|deposit|delivery|warranty/i]);
  const boundaries = pick(sentences, [/do not|don't|cannot|can't|only|never|outside|limit|under|over/i]);
  const tone = pick(sentences, [/friendly|formal|casual|warm|professional|voice|tone|sound|reassuring/i]);
  return {
    facts: facts.length ? facts : ['Business facts were not explicit; ask follow-up questions.'],
    policies: policies.length ? policies : ['No policies found; mark policy answers as uncertain.'],
    boundaries: boundaries.length ? boundaries : ['No boundaries found; avoid making commitments.'],
    toneGuidance: tone.length ? tone : ['Use a clear, friendly, concise tone.'],
    contradictions: findContradictions(sentences),
    skillMarkdown: buildSkill({ facts, policies, boundaries, tone })
  };
}

function pick(sentences, patterns) {
  return sentences.filter(s => patterns.some(p => p.test(s))).slice(0, 6);
}

function findContradictions(sentences) {
  const lower = sentences.map(s => s.toLowerCase());
  const contradictions = [];
  if (lower.some(s => /refund/.test(s) && /no|never|do not|don't/.test(s)) && lower.some(s => /refund/.test(s) && /offer|provide|available|within/.test(s))) {
    contradictions.push('Refund policy appears contradictory; confirm before using it.');
  }
  if (lower.some(s => /open/.test(s) && /monday/.test(s)) && lower.some(s => /closed|not open/.test(s) && /monday/.test(s))) {
    contradictions.push('Monday hours appear contradictory; confirm before using them.');
  }
  return contradictions;
}

function buildSkill({ facts, policies, boundaries, tone }) {
  const list = xs => (xs.length ? xs : ['Unknown; ask before answering']).map(x => `- ${x}`).join('\n');
  return `# Small Business Assistant Skill\n\n## Business Facts\n${list(facts)}\n\n## Policies\n${list(policies)}\n\n## Boundaries\n${list(boundaries)}\n\n## Tone\n${list(tone)}\n\n## Reliability Rule\nIf the answer is not grounded in the facts, policies, or boundaries above, say you are not sure and suggest contacting the business.`;
}

export function auditAnswer(answer, structured = {}) {
  const sourceParts = ['facts', 'policies', 'boundaries'].flatMap(key => Array.isArray(structured[key]) ? structured[key] : []);
  const source = sourceParts.join(' ').toLowerCase();
  const strongClaim = /guarantee|always|never|free|refund|same day|24\/7|certified/i.test(answer);
  const grounded = String(answer).toLowerCase().split(/\W+/).some(w => w.length > 4 && source.includes(w));
  const risky = strongClaim && !grounded;
  return {
    reliable: !risky,
    reason: risky ? 'Contains a strong claim not grounded in extracted business knowledge.' : 'No obvious unsupported high-risk claim detected.'
  };
}
