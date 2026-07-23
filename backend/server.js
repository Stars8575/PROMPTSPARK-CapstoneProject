require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const testRoute = require('./routes/test');
const authRoute = require('./routes/auth');
const promptRoutes = require('./routes/prompts');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/test', testRoute);
app.use('/api/auth', authRoute);
app.use('/api/prompts', promptRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});