const express = require('express');
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

router.post('/', requireAuth, body('title').isLength({ min: 1 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const task = await Task.create({ title: req.body.title, description: req.body.description || '', owner: req.user?.id || null });
  res.status(201).json({ task });
});

router.get('/', requireAuth, async (_req, res) => {
  const items = await Task.find().sort({ createdAt: -1 });
  res.json({ items });
});

router.put('/:id', requireAuth, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  Object.assign(task, req.body);
  await task.save();
  res.json({ task });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;

