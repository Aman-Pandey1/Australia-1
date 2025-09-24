import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { env } from '../config/env.js';

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password, name } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });
  const token = signToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role }, token });
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role }, token });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select('-passwordHash');
  return res.json({ user });
}

export async function logout(_req, res) {
  res.clearCookie('token');
  return res.json({ message: 'Logged out' });
}

