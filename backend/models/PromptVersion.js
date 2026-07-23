const mongoose = require('mongoose');

const promptVersionSchema = new mongoose.Schema({
  prompt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt',
    required: true
  },
  title: String,
  content: String,
  category: String,
  versionNumber: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('PromptVersion', promptVersionSchema);