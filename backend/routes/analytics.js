const express = require('express');
const protect = require('../middleware/authMiddleware');
const AiRun = require('../models/AiRun');
const mongoose = require('mongoose');

const router = express.Router();
router.use(protect);

router.get('/summary', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    // Overall totals
    const totalsAgg = await AiRun.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalRuns: { $sum: 1 },
          totalTokens: { $sum: '$totalTokens' },
          totalCost: { $sum: '$costUsd' }
        }
      }
    ]);

    const totals = totalsAgg[0] || { totalRuns: 0, totalTokens: 0, totalCost: 0 };
    delete totals._id;

    // Cost per day, last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const costByDay = await AiRun.aggregate([
      { $match: { user: userId, createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          cost: { $sum: '$costUsd' },
          tokens: { $sum: '$totalTokens' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Tokens grouped by model
    const tokensByModel = await AiRun.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$model',
          tokens: { $sum: '$totalTokens' },
          runs: { $sum: 1 }
        }
      },
      { $sort: { tokens: -1 } }
    ]);

    res.json({
      totals: {
        totalRuns: totals.totalRuns,
        totalTokens: totals.totalTokens,
        totalCost: +totals.totalCost.toFixed(6)
      },
      costByDay: costByDay.map(d => ({ date: d._id, cost: +d.cost.toFixed(6), tokens: d.tokens })),
      tokensByModel: tokensByModel.map(m => ({ model: m._id, tokens: m.tokens, runs: m.runs }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;