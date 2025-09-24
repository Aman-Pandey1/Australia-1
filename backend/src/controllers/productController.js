import { validationResult } from 'express-validator';
import slugify from 'slugify';
import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, description, price, stock } = req.body;
  const slug = `${slugify(name, { lower: true, strict: true })}-${Date.now()}`;
  const images = (req.files || []).map((f) => `/uploads/${f.filename}`);
  const product = await Product.create({ user: req.user._id, name, slug, description, price, stock, images });
  res.status(201).json({ product });
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate({ _id: id, user: req.user._id }, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

export const getProducts = async (req, res) => {
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ products });
};

export const getProductBySlug = async (req, res) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug, isActive: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete({ _id: id, user: req.user._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ ok: true });
};

