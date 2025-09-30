const express = require('express');
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const Contact = require('../models/Contact');

const router = express.Router();

router.post('/', requireAuth, body('city').isLength({ min: 1 }), body('country').isLength({ min: 1 }), body('phone').isLength({ min: 4 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const contact = await Contact.create({ city: req.body.city, country: req.body.country, phone: req.body.phone, apps: req.body.apps || [], website: req.body.website || '' });
  res.status(201).json({ contact });
});

router.get('/', async (_req, res) => {
  const items = await Contact.find().sort({ createdAt: -1 });
  res.json({ items });
});

router.put('/:id', requireAuth, async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ message: 'Not found' });
  Object.assign(contact, req.body);
  await contact.save();
  res.json({ contact });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const deleted = await Contact.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;

