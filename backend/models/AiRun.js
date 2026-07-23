const mongoose = require('mongoose');

const aiRunSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt',
    default: null
  },
  provider: { type: String, required: true },
  model: { type: String, required: true },
  promptTokens: Number,
  completionTokens: Number,
  totalTokens: Number,
  costUsd: Number,
  abTestGroup: { type: String, default: null },
  variantLabel: { type: String, default: null } // 'A' or 'B', only set for A/B runs
}, { timestamps: true });

module.exports = mongoose.model('AiRun', aiRunSchema);