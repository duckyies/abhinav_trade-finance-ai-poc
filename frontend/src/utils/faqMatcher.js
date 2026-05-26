function normalise(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'what', 'whats',
  'how', 'why', 'when', 'where', 'who', 'which', 'do', 'does',
  'can', 'could', 'would', 'should', 'tell', 'me', 'about',
  'explain', 'define', 'definition', 'of', 'in', 'for', 'to',
  'and', 'or', 'it', 'its', 'i', 'you', 'please', 'give', 'get',
]);

function tokenise(str) {
  return normalise(str)
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function scoreFAQ(faq, inputTokens, rawInput) {
  let score = 0;
  const normInput = normalise(rawInput);
  const normKeyword = normalise(faq.keyword);
  const normQuestion = normalise(faq.question);
  const normAnswer = normalise(faq.answer);
  const faqTokens = tokenise(faq.question + ' ' + faq.answer + ' ' + faq.keyword);

  if (normInput.includes(normKeyword)) score += 50;

  const kwRegex = new RegExp(`\\b${normKeyword}\\b`);
  if (kwRegex.test(normInput)) score += 20;

  if (normInput === normQuestion) score += 100;

  if (normQuestion.includes(normInput) || normInput.includes(normQuestion)) score += 30;

  for (const token of inputTokens) {
    if (faqTokens.includes(token)) score += 10;
    if (normKeyword.includes(token)) score += 15;
  }

  return score;
}

export function findBestMatch(input, faqs) {
  if (!input || !faqs || faqs.length === 0) {
    return { match: null, score: 0, suggestions: [] };
  }

  const inputTokens = tokenise(input);
  if (inputTokens.length === 0) {
    return { match: null, score: 0, suggestions: [] };
  }

  const scored = faqs.map((faq) => ({
    faq,
    score: scoreFAQ(faq, inputTokens, input),
  }));

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  const MATCH_THRESHOLD = 20;
  const SUGGESTION_THRESHOLD = 10;

  const match = best.score >= MATCH_THRESHOLD ? best.faq : null;

  const suggestions = scored
    .slice(1)
    .filter((s) => s.score >= SUGGESTION_THRESHOLD)
    .slice(0, 2)
    .map((s) => s.faq);

  return { match, score: best.score, suggestions };
}