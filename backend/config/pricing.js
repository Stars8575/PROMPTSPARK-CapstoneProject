// Estimated USD price per 1,000,000 tokens. 
const PRICING = {
  'llama-3.1-8b-instant': { input: 0.05, output: 0.08 },
  'llama-3.1-70b-versatile': { input: 0.59, output: 0.79 },
  'mixtral-8x7b-32768': { input: 0.24, output: 0.24 },
  default: { input: 0.10, output: 0.10 }
};

function calculateCost(model, promptTokens, completionTokens) {
  const rate = PRICING[model] || PRICING.default;
  const inputCost = (promptTokens / 1_000_000) * rate.input;
  const outputCost = (completionTokens / 1_000_000) * rate.output;
  return +(inputCost + outputCost).toFixed(6);
}

module.exports = { calculateCost };