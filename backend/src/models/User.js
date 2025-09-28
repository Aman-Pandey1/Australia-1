import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // Distinguish between a normal end-user and an agent who can manage multiple escorts
    accountType: { type: String, enum: ['user', 'agent'], default: 'user', index: true },
    avatarUrl: { type: String },
    cities: [{ type: String }],
    isPremium: { type: Boolean, default: false },
    // Extended public profile fields
    age: { type: Number },
    price: { type: Number, min: 0 },
    phone: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

userSchema.methods.comparePassword = async function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
export default User;

