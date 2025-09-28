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
  const { email, password, name, accountType } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name, accountType: ['user','agent'].includes(accountType) ? accountType : 'user', role: email === env.adminEmail ? 'admin' : 'user' });
  const token = signToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role, accountType: user.accountType, avatarUrl: user.avatarUrl }, token });
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
  return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role, accountType: user.accountType, avatarUrl: user.avatarUrl }, token });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select('-passwordHash');
  return res.json({ user });
}

export async function logout(_req, res) {
  res.clearCookie('token');
  return res.json({ message: 'Logged out' });
}

export async function updateProfile(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });

  // Accept JSON or multipart
  const body = { ...req.body };
  if (typeof body.age === 'string' && body.age !== '') body.age = Number(body.age);
  if (typeof body.price === 'string' && body.price !== '') body.price = Number(body.price);

  if (body.name !== undefined) user.name = body.name;
  if (body.age !== undefined) user.age = body.age;
  if (body.price !== undefined) user.price = body.price;
  if (body.phone !== undefined) user.phone = body.phone;
  if (body.bio !== undefined) user.bio = body.bio;
  if (body.avatarUrl !== undefined) user.avatarUrl = body.avatarUrl;

  if (req.file) {
    user.avatarUrl = `${env.publicUrl.replace(/\/$/, '')}/uploads/${req.file.filename}`;
  }

  await user.save();
  return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role, accountType: user.accountType, avatarUrl: user.avatarUrl, age: user.age, price: user.price, phone: user.phone, bio: user.bio } });
}

