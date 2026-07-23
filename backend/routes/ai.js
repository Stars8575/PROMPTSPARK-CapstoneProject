const express = require('express');
const crypto = require('crypto');
const protect = require('../middleware/authMiddleware');
const groqProvider = require('../providers/groqProvider');
const { calculateCost } = require('../config/pricing');
const AiRun = require('../models/AiRun');

const router = express.Router();
router.use(protect);

const providers = {
  groq: groqProvider
  // openai: openaiProvider,
  // anthropic: anthropicProvider,
  // huggingface: huggingfaceProvider
};

async function executeAndLog({ content, provider, model, userId, promptId, abTestGroup, variantLabel }) {
  const selectedProvider = providers[provider];
  if (!selectedProvider) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  const result = await selectedProvider.runPrompt({ content, model });
  const cost = calculateCost(result.model, result.usage.promptTokens, result.usage.completionTokens);

  await AiRun.create({
    user: userId,
    prompt: promptId || null,
    provider,
    model: result.model,
    promptTokens: result.usage.promptTokens,
    completionTokens: result.usage.completionTokens,
    totalTokens: result.usage.totalTokens,
    costUsd: cost,
    abTestGroup: abTestGroup || null,
    variantLabel: variantLabel || null
  });

  return { ...result, costUsd: cost };
}

// Single run (used by Playground)
router.post('/run', async (req, res) => {
  try {
    const { content, provider = 'groq', model, promptId } = req.body;
    if (!content) return res.status(400).json({ message: 'Prompt content is required' });

    const result = await executeAndLog({ content, provider, model, userId: req.userId, promptId });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'AI request failed', error: err.message });
  }
});

// A/B comparison — runs two variants against the same provider/model
router.post('/compare', async (req, res) => {
  try {
    const { contentA, contentB, provider = 'groq', model } = req.body;
    if (!contentA || !contentB) {
      return res.status(400).json({ message: 'Both variant A and variant B content are required' });
    }

    const abTestGroup = crypto.randomUUID();

    const [resultA, resultB] = await Promise.all([
      executeAndLog({ content: contentA, provider, model, userId: req.userId, abTestGroup, variantLabel: 'A' }),
      executeAndLog({ content: contentB, provider, model, userId: req.userId, abTestGroup, variantLabel: 'B' })
    ]);

    res.json({ abTestGroup, variantA: resultA, variantB: resultB });
  } catch (err) {
    res.status(500).json({ message: 'A/B test failed', error: err.message });
  }
});

module.exports = router;