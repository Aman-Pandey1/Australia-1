import { env } from '../config/env.js';
import { connectToDatabase } from '../config/db.js';
import User from '../models/User.js';

async function main() {
  await connectToDatabase();
  const email = env.adminEmail || 'admin@example.com';
  const password = env.adminPassword || 'Admin@123456';
  const name = env.adminName || 'Administrator';

  let user = await User.findOne({ email });
  if (!user) {
    const passwordHash = await User.hashPassword(password);
    user = await User.create({ email, passwordHash, name, role: 'admin' });
    // eslint-disable-next-line no-console
    console.log('Admin user created:', email);
  } else {
    let updated = false;
    if (user.role !== 'admin') { user.role = 'admin'; updated = true; }
    // If you need to reset password, set ADMIN_RESET=true in env and rerun
    if (String(process.env.ADMIN_RESET || '').toLowerCase() === 'true') {
      user.passwordHash = await User.hashPassword(password);
      updated = true;
    }
    if (updated) { await user.save(); }
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

