import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user._id.toString(), role: user.role }, secret, {
    expiresIn: "30d",
  });
  return token;
}

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });
    const token = signToken(user);
    return res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: "Not found" });
    return res.json({ id: user._id, email: user.email, name: user.name, role: user.role, subscription: user.subscription });
  } catch (err) {
    return res.status(500).json({ message: "Failed" });
  }
}

