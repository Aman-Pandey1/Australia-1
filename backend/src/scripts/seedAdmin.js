import '../config/env.js';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../config/db.js';
import User from '../models/User.js';

async function run() {
  await connectToDatabase();
  const email = 'admin@example.com';
  const existing = await User.findOne({ email });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log('Admin already exists');
    process.exit(0);
  }
  const admin = await User.create({
    name: 'Admin',
    email,
    role: 'admin',
    passwordHash: await bcrypt.hash('admin123', 10),
  });
  // eslint-disable-next-line no-console
  console.log('Admin created:', admin.email);
  process.exit(0);
}

run();

import dotenv from 'dotenv';
import { connectDatabase } from '../config/db.js';
import { User } from '../models/User.js';

dotenv.config();

async function main() {
	await connectDatabase();
	const email = process.env.ADMIN_EMAIL || 'admin@example.com';
	const password = process.env.ADMIN_PASSWORD || 'Admin@123456';
	const name = process.env.ADMIN_NAME || 'Administrator';
	let user = await User.findOne({ email });
	if (!user) {
		const passwordHash = await User.hashPassword(password);
		user = await User.create({ email, passwordHash, name, role: 'admin' });
		// eslint-disable-next-line no-console
		console.log('Admin user created:', email);
	} else {
		if (user.role !== 'admin') {
			user.role = 'admin';
			await user.save();
		}
		// eslint-disable-next-line no-console
		console.log('Admin user exists:', email);
	}
	// eslint-disable-next-line no-console
	console.log('Login with:', email, password);
	process.exit(0);
}

main().catch((err) => {
	// eslint-disable-next-line no-console
	console.error(err);
	process.exit(1);
});

