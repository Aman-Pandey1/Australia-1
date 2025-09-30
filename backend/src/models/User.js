const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'provider', 'user'], default: 'user', index: true },
    isEmailVerified: { type: Boolean, default: false },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null },
    favoritesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function comparePassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);

