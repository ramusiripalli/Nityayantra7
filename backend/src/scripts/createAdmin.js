import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    await connectDB();

    const name = process.env.ADMIN_NAME || 'Nitya Yantra Admin';
    const email = (process.env.ADMIN_EMAIL || 'admin@nityayantra.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'Admin@NityaYantra2026';

    if (!email || !password) {
      console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be defined in environment variables.');
      process.exit(1);
    }

    // Check whether admin user already exists
    const adminExists = await User.findOne({ email });

    if (adminExists) {
      console.log(`ℹ️  Admin user '${email}' already exists in database. Skipping seed.`);
      process.exit(0);
    }

    // Create Admin User with bcrypt password hashing
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isActive: true,
    });

    console.log(`✅ Admin user '${admin.email}' created successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating Admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
