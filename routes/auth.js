const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage (use DB in production)
const users = [];

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      plan: 'free',
      modelsCount: 0,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'tf-secret', { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'tf-secret', { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
