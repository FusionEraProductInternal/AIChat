const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage
const models = [];

// Save model metadata
router.post('/save', (req, res) => {
  try {
    const { userId, name, industry, dataSize, config } = req.body;

    const model = {
      id: uuidv4(),
      userId,
      name,
      industry,
      dataSize,
      apiKey: 'tf_' + Math.random().toString(36).substring(2, 15),
      config,
      createdAt: new Date().toISOString(),
      usage: 0
    };

    models.push(model);

    res.json({
      success: true,
      model: {
        id: model.id,
        name: model.name,
        apiKey: model.apiKey,
        createdAt: model.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's models
router.get('/list/:userId', (req, res) => {
  const userModels = models.filter(m => m.userId === req.params.userId);
  res.json(userModels);
});

// Get model by API key (for embed script)
router.get('/config/:apiKey', (req, res) => {
  const model = models.find(m => m.apiKey === req.params.apiKey);
  if (!model) return res.status(404).json({ error: 'Model not found' });
  res.json({
    name: model.name,
    industry: model.industry,
    config: model.config
  });
});

module.exports = router;
