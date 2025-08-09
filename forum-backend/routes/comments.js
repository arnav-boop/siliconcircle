const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
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

// Add a comment to a post
router.post('/:postId', auth, async (req, res) => {
  const { body } = req.body;
  const comment = new Comment({
    post: req.params.postId,
    author: req.user.id,
    body
  });
  await comment.save();
  // Add comment to post
  await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: comment._id } });
  res.status(201).json(comment);
});

module.exports = router;
