import { validationResult } from 'express-validator';
import slugify from 'slugify';
import Blog from '../models/Blog.js';

export const createBlog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, content } = req.body;
  const slug = `${slugify(title, { lower: true, strict: true })}-${Date.now()}`;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;
  const blog = await Blog.create({ title, slug, content, coverImage, author: req.user._id });
  res.status(201).json({ blog });
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const blog = await Blog.findByIdAndUpdate(id, updates, { new: true });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json({ blog });
};

export const publishBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndUpdate(id, { isPublished: true }, { new: true });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json({ blog });
};

export const getBlogs = async (req, res) => {
  const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
  res.json({ blogs });
};

export const getBlogBySlug = async (req, res) => {
  const { slug } = req.params;
  const blog = await Blog.findOne({ slug, isPublished: true });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json({ blog });
};

