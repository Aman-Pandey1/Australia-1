import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true, index: true },
		passwordHash: { type: String, required: true },
		name: { type: String, default: '' },
		role: { type: String, enum: ['user', 'subscriber', 'agency', 'admin'], default: 'user', index: true },
		phone: { type: String, default: '' },
		whatsapp: { type: String, default: '' },
		telegram: { type: String, default: '' },
		isEmailVerified: { type: Boolean, default: false },
		avatarUrl: { type: String, default: '' },
	},
	{ timestamps: true }
);

UserSchema.methods.comparePassword = async function comparePassword(password) {
	return bcrypt.compare(password, this.passwordHash);
};

UserSchema.statics.hashPassword = async function hashPassword(password) {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

export const User = mongoose.model('User', UserSchema);

