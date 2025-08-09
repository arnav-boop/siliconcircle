const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
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

// Get all posts
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
  res.json(posts);
});

// Create a post
router.post('/', auth, async (req, res) => {
  const { title, body } = req.body;
  const post = new Post({ title, body, author: req.user.id });
  await post.save();
  res.status(201).json(post);
});

// Upvote a post
router.post('/:id/upvote', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  post.upvotes += 1;
  await post.save();
  res.json({ upvotes: post.upvotes });
});

// Get a single post with comments
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username').populate({
    path: 'comments',
    populate: { path: 'author', select: 'username' }
  });
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

module.exports = router;
