const express = require('express');
const router = express.Router();

// GET /api/test
router.get('/', (req, res) => {
  res.json({ message: 'Backend is alive and connected!' });
});

module.exports = router;