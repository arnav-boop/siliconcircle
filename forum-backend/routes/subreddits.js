const express = require('express');
const Subreddit = require('../models/Subreddit');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT
function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Create a subreddit
router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;
  const subreddit = new Subreddit({
    name,
    description,
    creator: req.user.id,
    moderators: [req.user.id],
    members: [req.user.id]
  });
  await subreddit.save();
  res.status(201).json(subreddit);
});

// Get all subreddits
router.get('/', async (req, res) => {
  const subs = await Subreddit.find().sort({ createdAt: -1 });
  res.json(subs);
});

// Get a single subreddit
router.get('/:name', async (req, res) => {
  const sub = await Subreddit.findOne({ name: req.params.name });
  if (!sub) return res.status(404).json({ error: 'Not found' });
  res.json(sub);
});

module.exports = router;
