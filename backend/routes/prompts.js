const express = require('express');
const Prompt = require('../models/Prompt');
const PromptVersion = require('../models/PromptVersion');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// GET all prompts for this user (supports ?search= and ?category=)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = { user: req.userId };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const prompts = await Prompt.find(query).sort({ createdAt: -1 });
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET a single prompt
router.get('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findOne({ _id: req.params.id, user: req.userId });
    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });
    res.json(prompt);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET version history for a prompt
router.get('/:id/versions', async (req, res) => {
  try {
    const prompt = await Prompt.findOne({ _id: req.params.id, user: req.userId });
    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });

    const versions = await PromptVersion.find({ prompt: req.params.id }).sort({ versionNumber: -1 });
    res.json(versions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CREATE a prompt
router.post('/', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const prompt = await Prompt.create({
      user: req.userId,
      title,
      content,
      category
    });
    res.status(201).json(prompt);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE a prompt (saves the previous state as a version first)
router.put('/:id', async (req, res) => {
  try {
    const existing = await Prompt.findOne({ _id: req.params.id, user: req.userId });
    if (!existing) return res.status(404).json({ message: 'Prompt not found' });

    const versionCount = await PromptVersion.countDocuments({ prompt: existing._id });

    await PromptVersion.create({
      prompt: existing._id,
      title: existing.title,
      content: existing.content,
      category: existing.category,
      versionNumber: versionCount + 1
    });

    const { title, content, category } = req.body;
    existing.title = title;
    existing.content = content;
    existing.category = category;
    await existing.save();

    res.json(existing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// RESTORE a previous version
router.post('/:id/restore/:versionId', async (req, res) => {
  try {
    const prompt = await Prompt.findOne({ _id: req.params.id, user: req.userId });
    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });

    const version = await PromptVersion.findOne({ _id: req.params.versionId, prompt: prompt._id });
    if (!version) return res.status(404).json({ message: 'Version not found' });

    // Save current state as a new version before restoring, so nothing is lost
    const versionCount = await PromptVersion.countDocuments({ prompt: prompt._id });
    await PromptVersion.create({
      prompt: prompt._id,
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      versionNumber: versionCount + 1
    });

    prompt.title = version.title;
    prompt.content = version.content;
    prompt.category = version.category;
    await prompt.save();

    res.json(prompt);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE a prompt
router.delete('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });

    await PromptVersion.deleteMany({ prompt: prompt._id });

    res.json({ message: 'Prompt deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;