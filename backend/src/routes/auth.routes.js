const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const User = require('../models/User');

const router = express.Router();

router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').isLength({ min: 2 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password, name, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, role: role || 'user' });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, env.jwtSecret, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  }
);

router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, env.jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  }
);

router.get('/me', async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const user = await User.findById(req.user.id).select('email name role createdAt');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

module.exports = router;

